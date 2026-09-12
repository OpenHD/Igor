import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError, map } from 'rxjs';
import {
  GetUsersGQL, GetUsersQuery,
  CreateUserGQL, CreateUserMutation,
  UpdateUserGQL, UpdateUserMutation,
  UpdateUserPasswordGQL, UpdateUserPasswordMutation,
  DeleteUserGQL, DeleteUserMutation,
  UserFragment, Role, UserInput, UserUpdateInput
} from '../graphql/generated';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private getUsersGQL = inject(GetUsersGQL);
  private createUserGQL = inject(CreateUserGQL);
  private updateUserGQL = inject(UpdateUserGQL);
  private updateUserPasswordGQL = inject(UpdateUserPasswordGQL);
  private deleteUserGQL = inject(DeleteUserGQL);

  getUsers(): Observable<UserFragment[]> {
    return this.getUsersGQL.watch({ fetchPolicy: 'network-only' }).valueChanges.pipe(
      map(result => (result.data?.users as UserFragment[]) || []),
      catchError(this.handleError)
    );
  }

  createUser(input: UserInput): Observable<UserFragment> {
    return this.createUserGQL.mutate({ variables: { input },
      refetchQueries: ['GetUsers']
    }).pipe(
      map(result => result.data!.createUser),
      catchError(this.handleError)
    );
  }

  updateUser(id: string, input: UserUpdateInput): Observable<UserFragment> {
    return this.updateUserGQL.mutate({ variables: { id, input },
      refetchQueries: ['GetUsers']
    }).pipe(
      map(result => result.data!.updateUser),
      catchError(this.handleError)
    );
  }

  updateUserPassword(id: string, newPassword: string): Observable<UserFragment> {
    return this.updateUserPasswordGQL.mutate({ variables: { id, newPassword } }).pipe(
      map(result => result.data!.updateUserPassword),
      catchError(this.handleError)
    );
  }

  deleteUser(id: string): Observable<boolean> {
    return this.deleteUserGQL.mutate({ variables: { id },
      refetchQueries: ['GetUsers']
    }).pipe(
      map(result => result.data!.deleteUser || false),
      catchError(this.handleError)
    );
  }

  private handleError = (error: any) => {
    console.error('User Management Service Error:', error);
    return throwError(() => error);
  };

  // Helper methods
  getRoleDisplayName(role: Role): string {
    switch (role) {
      case 'OWNER': return 'Owner';
      case 'ADMIN': return 'Administrator';
      case 'USER': return 'User';
      default: return role;
    }
  }

  getRolePriority(role: Role): number {
    switch (role) {
      case 'OWNER': return 3;
      case 'ADMIN': return 2;
      case 'USER': return 1;
      default: return 0;
    }
  }

  canUserManageUsers(userRoles: Role[]): boolean {
    return userRoles.includes('ADMIN') || userRoles.includes('OWNER');
  }

  canUserDeleteUsers(userRoles: Role[]): boolean {
    return userRoles.includes('OWNER');
  }

  isOwnerUser(userRoles: Role[]): boolean {
    return userRoles.includes('OWNER');
  }
}
