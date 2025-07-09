import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Erst prüfen ob Benutzer überhaupt authentifiziert ist
    if (!this.authService.isAuthenticated()) {
      console.warn('User not authenticated, redirecting to login');
      return this.router.parseUrl('/login');
    }
    
    const requiredRoles = route.data['roles'] as string[];
    if (this.authService.hasRole(requiredRoles)) {
      return true;
    }
    
    console.warn('User does not have required roles:', requiredRoles);
    return this.router.parseUrl('/login');
  }
}
