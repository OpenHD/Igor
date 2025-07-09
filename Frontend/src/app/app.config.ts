import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, ApplicationConfig, inject } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ConfigService } from './services/config.service';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { AuthService } from './services/auth.service';

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

  // Error link für automatisches Ausloggen bei GraphQL-Fehlern
  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        console.error(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`);
        
        // Bei 401/403 oder expliziten Authentifizierungsfehlern automatisch ausloggen
        if (extensions?.['code'] === 'UNAUTHENTICATED' || 
            extensions?.['code'] === 'FORBIDDEN' ||
            message.includes('Unauthorized') ||
            message.includes('Authentication') ||
            message.includes('Access Denied')) {
          console.warn('GraphQL authentication failed, logging out user');
          
          // Token löschen und Seite neu laden (einfachste Lösung)
          if (isPlatformBrowser(platformId)) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
          }
        }
      });
    }

    if (networkError) {
      console.error(`Network error: ${networkError}`);
      
      // Bei HTTP 401/403 ebenfalls ausloggen
      if ('status' in networkError && (networkError.status === 401 || networkError.status === 403)) {
        console.warn('Network authentication failed, logging out user');
        
        if (isPlatformBrowser(platformId)) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
      }
    }
  });

  return {
    cache: new InMemoryCache(),
    link: errorLink.concat(authLink).concat(
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
