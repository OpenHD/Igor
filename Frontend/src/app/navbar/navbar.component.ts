import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  showMobileMenu = false;
  showUserMenu = false;

  navLinks = [
    { path: '/images', label: 'OS Images', icon: 'bi bi-hdd-stack' },
    { path: '/categories', label: 'Categories', icon: 'bi bi-tags' },
    { path: '/lists', label: 'Lists', icon: 'bi bi-list-ul' },
    { path: '/users', label: 'Users', icon: 'bi bi-people' }
  ];

  constructor(public authService: AuthService) {}

  shouldShowLink(link: any): boolean {
    // Users link requires ADMIN or OWNER role
    if (link.path === '/users') {
      return this.authService.hasRole(['ADMIN', 'OWNER']);
    }
    
    // All other links are visible to authenticated users
    return true;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    this.showUserMenu = false;
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showMobileMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.showUserMenu = false;
    }
    if (!target.closest('.mobile-toggle') && !target.closest('.mobile-nav')) {
      this.showMobileMenu = false;
    }
  }
}
