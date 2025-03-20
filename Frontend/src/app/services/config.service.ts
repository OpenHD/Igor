import { Injectable, isDevMode } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private _baseUrl: string;
  private _apiBaseUrl: string;

  constructor() {
    if (isDevMode()) {
      this._baseUrl = 'http://127.0.0.1:8080';
      this._apiBaseUrl = 'http://127.0.0.1:8080/api';
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
    return 'http://127.0.0.1:8080/graphql';
  }
}
