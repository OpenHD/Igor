import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UserManagementService } from '../services/user-management.service';
import { User, Role } from '../graphql/generated';
import { AuthService } from '../services/auth.service';
import { UserEditModalComponent } from './user-edit-modal.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatCardModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserManagementService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private platformId = inject(PLATFORM_ID);

  users: User[] = [];
  displayedColumns: string[] = ['username', 'roles', 'actions'];
  loading = false;
  currentUser: any = null;
  
  // For template access to Role values
  ROLES = {
    USER: 'USER' as Role,
    ADMIN: 'ADMIN' as Role,
    OWNER: 'OWNER' as Role
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadCurrentUser();
    this.loadUsers();
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  private loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.showSnackBar('Error loading users');
        this.loading = false;
      }
    });
  }

  openCreateUserModal(): void {
    const dialogRef = this.dialog.open(UserEditModalComponent, {
      width: '500px',
      data: { 
        isEdit: false,
        canEditRoles: this.canCurrentUserManageUsers()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createUser(result);
      }
    });
  }

  openEditUserModal(user: User): void {
    const dialogRef = this.dialog.open(UserEditModalComponent, {
      width: '500px',
      data: { 
        isEdit: true, 
        user: { ...user },
        canEditRoles: this.canCurrentUserManageUsers()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUser(user.id, result);
      }
    });
  }

  private createUser(userData: any): void {
    this.userService.createUser(userData).subscribe({
      next: (user: User) => {
        this.showSnackBar('User created successfully');
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.showSnackBar('Error creating user');
      }
    });
  }

  private updateUser(id: string, userData: any): void {
    this.userService.updateUser(id, userData).subscribe({
      next: (user: User) => {
        this.showSnackBar('User updated successfully');
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.showSnackBar('Error updating user');
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: (success: boolean) => {
          this.showSnackBar('User deleted successfully');
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.showSnackBar('Error deleting user. OWNER users cannot be deleted.');
        }
      });
    }
  }

  resetUserPassword(user: User): void {
    const newPassword = prompt(`Enter new password for ${user.username}:`);
    if (newPassword && newPassword.trim()) {
      this.userService.updateUserPassword(user.id, newPassword.trim()).subscribe({
        next: () => {
          this.showSnackBar('Password updated successfully');
        },
        error: (error) => {
          console.error('Error updating password:', error);
          this.showSnackBar('Error updating password');
        }
      });
    }
  }

  canCurrentUserManageUsers(): boolean {
    return this.currentUser?.roles?.some((role: string) => 
      role === 'ADMIN' || role === 'OWNER'
    ) || false;
  }

  canCurrentUserDeleteUsers(): boolean {
    return this.currentUser?.roles?.includes('OWNER') || false;
  }

  canDeleteUser(user: User): boolean {
    // Can't delete OWNER users or yourself
    const isOwner = user.roles.includes('OWNER');
    const isSelf = user.username === this.currentUser?.username;
    return this.canCurrentUserDeleteUsers() && !isOwner && !isSelf;
  }

  canEditUser(user: User): boolean {
    return this.canCurrentUserManageUsers();
  }

  getRoleDisplayName(role: Role): string {
    return this.userService.getRoleDisplayName(role);
  }

  getRoleChipColor(role: Role): string {
    switch (role) {
      case 'OWNER': return 'warn';
      case 'ADMIN': return 'accent';
      case 'USER': return 'primary';
      default: return 'basic';
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}