import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLinkActive,
    NgClass,
    NgForOf,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true
})
export class NavbarComponent {
  isCollapsed = true;

  navLinks = [
    { path: '/images', label: 'Image Management' },
    { path: '/categories', label: 'OS Categories' }
    // Weitere Links hier hinzufügen
  ];
}
