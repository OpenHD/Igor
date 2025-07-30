import { Injectable, isDevMode, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private _baseUrl: string;
  private _apiBaseUrl: string;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isDevMode()) {
      let backendPort = '8080';
      // Zuerst prüfen auf Browser-Environment Variable
      if (isPlatformBrowser(this.platformId)) {
        backendPort = (window as any)?.['env']?.['BACKEND_PORT'] || '8080';
      }
      // Fallback auf localStorage für persistierte Einstellung
      if (isPlatformBrowser(this.platformId) && localStorage.getItem('BACKEND_PORT')) {
        backendPort = localStorage.getItem('BACKEND_PORT') || '8080';
      }
      // URL Parameter Support
      if (isPlatformBrowser(this.platformId)) {
        const urlParams = new URLSearchParams(window.location.search);
        const portParam = urlParams.get('backend_port');
        if (portParam) {
          backendPort = portParam;
          localStorage.setItem('BACKEND_PORT', portParam);
        }
      }
      this._baseUrl = `http://127.0.0.1:${backendPort}`;
      this._apiBaseUrl = `http://127.0.0.1:${backendPort}/api`;
    } else {
      this._baseUrl = 'https://download.openhdfpv.org';
      this._apiBaseUrl = 'https://download.openhdfpv.org/api';
    }
  }

  get apiBaseUrl(): string {
    return this._apiBaseUrl;
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

  get graphqlEndpoint(): string {
    return `${this.baseUrl}/graphql`;
  }

  get authEndpoint(): string {
    return `${this.apiBaseUrl}/auth/login`;
  }

  get userEndpoint(): string {
    return `${this.apiBaseUrl}/user`;
  }

  // SSR-spezifischer Endpoint (kann an die Umgebung angepasst werden)
  get graphqlServerEndpoint(): string {
    const backendPort = process.env?.['BACKEND_PORT'] || '8080';
    return `http://127.0.0.1:${backendPort}/graphql`;
  }
}
