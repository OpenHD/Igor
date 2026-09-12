import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { authInterceptor } from './interceptors/auth.interceptor.fn';
import { ConfigService } from './services/config.service';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { ServerError, CombinedGraphQLErrors } from '@apollo/client/errors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    ConfigService,
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const platformId = inject(PLATFORM_ID);
      const config = inject(ConfigService);

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
      const errorLink = onError(({ error }) => {
        if (error && CombinedGraphQLErrors.is(error)) {
          error.errors.forEach(({ message, extensions }) => {
            console.error(`GraphQL error: ${message}`);

            // Bei 401/403 oder expliziten Authentifizierungsfehlern automatisch ausloggen
            if (extensions?.['code'] === 'UNAUTHENTICATED' ||
                extensions?.['code'] === 'FORBIDDEN' ||
                message.includes('Unauthorized') ||
                message.includes('Authentication') ||
                message.includes('Access Denied')) {
              console.warn('GraphQL authentication failed, logging out user');

              if (isPlatformBrowser(platformId)) {
                localStorage.removeItem('auth_token');
                window.location.href = '/login';
              }
            }
          });
        }

        if (error && ServerError.is(error)) {
          console.error(`Network error (ServerError): ${error.statusCode} - ${error.message}`);

          if (error.statusCode === 401 || error.statusCode === 403) {
            console.warn('Network authentication failed, logging out user');
            if (isPlatformBrowser(platformId)) {
              localStorage.removeItem('auth_token');
              window.location.href = '/login';
            }
          }
        } else if (error && !CombinedGraphQLErrors.is(error)) {
           console.error(`Other error: ${error.message}`);
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
    })
  ]
};
