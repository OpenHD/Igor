// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ImageManagementComponent } from './image-management/image-management.component';
import {OsCategoryManagementComponent} from './os-category-management/os-category-management.component';

export const routes: Routes = [
  { path: '', component: ImageManagementComponent },
  { path: 'images', component: ImageManagementComponent },
  { path: 'categories', component: OsCategoryManagementComponent },
];
