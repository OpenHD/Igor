// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ImageManagementComponent } from './image-management/image-management.component';
import { OsCategoryManagementComponent } from './os-category-management/os-category-management.component';
import { ListManagementComponent } from './list-management/list-management.component';
import { LoginComponent } from './login/login.component';
import { GraphqlGuard } from './guards/graphql.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [GraphqlGuard],
    children: [
      { path: '', redirectTo: '/images', pathMatch: 'full' },
      { path: 'images', component: ImageManagementComponent },
      { path: 'categories', component: OsCategoryManagementComponent },
      { path: 'lists', component: ListManagementComponent },
      // Weitere geschützte Routen hier …
    ]
  }
];
