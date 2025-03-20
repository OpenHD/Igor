import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ConfigService } from './services/config.service';
import { setContext } from '@apollo/client/link/context';

export function createApollo(httpLink: HttpLink, platformId: Object, config: ConfigService) {
  const authLink = setContext((operation, context) => {
    const token = isPlatformBrowser(platformId)
      ? localStorage.getItem('auth_token')
      : '';
    return {
      headers: {
        ...context['headers'],
        Authorization: token ? `Bearer ${token}` : ''
      }
    };
  });

  return {
    cache: new InMemoryCache(),
    link: authLink.concat(
      httpLink.create({
        uri: config.graphqlEndpoint
      })
    ),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network'
      }
    }
  };
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ConfigService,
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, PLATFORM_ID, ConfigService]
    },
    Apollo
  ]
};
