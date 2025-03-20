import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {NgIf, NgForOf, NgClass} from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgForOf, NgClass],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isCollapsed = true;

  navLinks = [
    { path: '/images', label: 'Image Management' },
    { path: '/categories', label: 'OS Categories' },
    { path: '/lists', label: 'List Management' }
  ];

  constructor(public authService: AuthService) {}

  toggleNavbar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}
