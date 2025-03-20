import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
      error: () => this.logout()
    });
  }

  hasRole(requiredRoles: string[]): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles.some(role => requiredRoles.includes(role)) || false;
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  private getAuthToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('auth_token')
      : null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
    }
    this.currentUserSubject.next(null);
  }
}
