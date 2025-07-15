import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ConfigService } from './config.service';

export interface User {
  username: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.config.authEndpoint, { username, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('auth_token', response.token);
        this.fetchCurrentUser();
      })
    );
  }

  fetchCurrentUser(): void {
    this.http.get<User>(this.config.userEndpoint).subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: (error) => {
        console.warn('Failed to fetch current user, logging out:', error);
        this.logout();
      }
    });
  }

  hasRole(requiredRoles: string[]): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles.some(role => requiredRoles.includes(role)) || false;
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    if (!token) {
      return false;
    }

    // Prüfe ob Token abgelaufen ist (optional - falls JWT verwendet wird)
    try {
      const payload = this.parseJwtPayload(token);
      if (payload && payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
          console.warn('Token is expired, logging out');
          this.logout();
          return false;
        }
      }
    } catch (error) {
      // Falls Token-Parsing fehlschlägt, ignorieren wir es
      console.debug('Could not parse JWT token:', error);
    }

    return true;
  }

  private parseJwtPayload(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAuthToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('auth_token')
      : null;
  }
}
