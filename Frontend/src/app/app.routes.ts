// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ImageManagementComponent } from './image-management/image-management.component';

export const routes: Routes = [
  { path: 'front', component: ImageManagementComponent },
  { path: 'front/images', component: ImageManagementComponent },
];
