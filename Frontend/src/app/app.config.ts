import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

export function createApollo(httpLink: HttpLink, platformId: Object) {
  let graphqlUri: string;
  if (isPlatformBrowser(platformId)) {
    // Browser: Zugriff auf window ist sicher
    graphqlUri = window.location.hostname === 'localhost'
      ? 'http://127.0.0.1:8080/graphql'
      : 'https://download.openhdfpv.org/graphql';
  } else {
    // SSR: Fallback-URI setzen
    graphqlUri = 'http://127.0.0.1:8080/graphql';
  }

  return {
    cache: new InMemoryCache(),
    link: httpLink.create({ uri: graphqlUri }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, PLATFORM_ID]
    },
    Apollo
  ]
};
