import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { Role, User } from '../graphql/generated';

interface DialogData {
  isEdit: boolean;
  user?: User;
  canEditRoles?: boolean;
}

@Component({
  selector: 'app-user-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule
  ],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>
        <mat-icon>{{ data.isEdit ? 'edit' : 'person_add' }}</mat-icon>
        {{ data.isEdit ? 'Edit User' : 'Create New User' }}
      </h2>
    </div>

    <mat-dialog-content class="modal-content">
      <form [formGroup]="userForm" class="user-form">
        
        <!-- Username Field -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" placeholder="Enter username">
          <mat-error *ngIf="userForm.get('username')?.hasError('required')">
            Username is required
          </mat-error>
          <mat-error *ngIf="userForm.get('username')?.hasError('minlength')">
            Username must be at least 3 characters
          </mat-error>
        </mat-form-field>

        <!-- Password Field (only for new users) -->
        <mat-form-field appearance="outline" class="full-width" *ngIf="!data.isEdit">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" placeholder="Enter password" autocomplete="new-password">
          <mat-error *ngIf="userForm.get('password')?.hasError('required')">
            Password is required
          </mat-error>
          <mat-error *ngIf="userForm.get('password')?.hasError('minlength')">
            Password must be at least 6 characters
          </mat-error>
        </mat-form-field>

        <!-- Roles Selection -->
        <div class="roles-section" *ngIf="data.canEditRoles">
          <h3>User Roles</h3>
          <div class="roles-grid">
            <mat-checkbox 
              *ngFor="let role of availableRoles" 
              [checked]="isRoleSelected(role)"
              (change)="toggleRole(role, $event.checked)"
              [disabled]="!canToggleRole(role)"
              class="role-checkbox">
              <div class="role-item">
                <span class="role-name">{{ getRoleDisplayName(role) }}</span>
                <span class="role-description">{{ getRoleDescription(role) }}</span>
              </div>
            </mat-checkbox>
          </div>
        </div>

        <!-- Role Display (read-only) -->
        <div class="roles-display" *ngIf="!data.canEditRoles && data.isEdit">
          <h3>Current Roles</h3>
          <div class="current-roles">
            <span *ngFor="let role of selectedRoles" class="role-badge">
              {{ getRoleDisplayName(role) }}
            </span>
          </div>
          <p class="permission-note">
            <mat-icon>info</mat-icon>
            You don't have permission to modify user roles
          </p>
        </div>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions class="modal-actions">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="onSave()"
        [disabled]="!userForm.valid || selectedRoles.length === 0">
        {{ data.isEdit ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .modal-header {
      h2 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        color: #333;
      }
    }

    .modal-content {
      padding: 20px 0;
      min-width: 400px;
    }

    .user-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .roles-section {
      h3 {
        margin: 0 0 12px 0;
        color: #333;
        font-size: 1.1rem;
        font-weight: 500;
      }

      .roles-grid {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .role-checkbox {
        .role-item {
          display: flex;
          flex-direction: column;
          margin-left: 8px;

          .role-name {
            font-weight: 500;
            color: #333;
          }

          .role-description {
            font-size: 0.8rem;
            color: #666;
            margin-top: 2px;
          }
        }
      }
    }

    .roles-display {
      h3 {
        margin: 0 0 12px 0;
        color: #333;
        font-size: 1.1rem;
        font-weight: 500;
      }

      .current-roles {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;

        .role-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }
      }

      .permission-note {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #666;
        font-size: 0.9rem;
        margin: 0;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }

    .modal-actions {
      padding: 16px 0 0 0;
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class UserEditModalComponent implements OnInit {
  userForm: FormGroup;
  availableRoles: Role[] = ['USER', 'ADMIN', 'OWNER'];
  selectedRoles: Role[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', this.data.isEdit ? [] : [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.data.isEdit && this.data.user) {
      this.userForm.patchValue({
        username: this.data.user.username
      });
      this.selectedRoles = [...this.data.user.roles];
    } else {
      // Default role for new users
      this.selectedRoles = ['USER'];
    }
  }

  isRoleSelected(role: Role): boolean {
    return this.selectedRoles.includes(role);
  }

  toggleRole(role: Role, checked: boolean): void {
    if (checked) {
      if (!this.selectedRoles.includes(role)) {
        this.selectedRoles.push(role);
      }
    } else {
      this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    }
  }

  canToggleRole(role: Role): boolean {
    // Don't allow removing OWNER role from existing OWNER users
    if (this.data.isEdit && role === 'OWNER' && this.data.user?.roles.includes('OWNER')) {
      return false;
    }
    return true;
  }

  getRoleDisplayName(role: Role): string {
    switch (role) {
      case 'OWNER': return 'Owner';
      case 'ADMIN': return 'Administrator';
      case 'USER': return 'User';
      default: return role;
    }
  }

  getRoleDescription(role: Role): string {
    switch (role) {
      case 'OWNER': return 'Full system access, cannot be deleted';
      case 'ADMIN': return 'Can manage users and content';
      case 'USER': return 'Basic access permissions';
      default: return '';
    }
  }

  onSave(): void {
    if (this.userForm.valid && this.selectedRoles.length > 0) {
      const formValue = this.userForm.value;
      const result: any = {
        username: formValue.username,
        roles: this.selectedRoles
      };

      if (!this.data.isEdit) {
        result.password = formValue.password;
      }

      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}