import { Injectable, signal, computed } from '@angular/core';
import { ChangePasswordForm, UserForm, UserItem, UserManagementState, UserRole } from './user-management.types';
import { MockUserItems } from './user-management.mock';
import { UserManagementPresenter } from './user-management.presenter';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private readonly state = signal<UserManagementState>({
    users: []
  });

  readonly users = computed(() => this.state().users);

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.state.update(current => ({
      ...current,
      users: MockUserItems
    }));
  }

  createUser(form: UserForm): UserItem {
    const user: UserItem = {
      _id: this.generateId(),
      username: form.username,
      role: form.role,
      createdAt: new Date().toISOString(),
      __v: 0
    };

    this.state.update(current => ({
      ...current,
      users: [user, ...current.users]
    }));

    return user;
  }

  deleteUser(id: string): void {
    this.state.update(current => ({
      ...current,
      users: current.users.filter(user => user._id !== id)
    }));
  }

  updateUsername(id: string, username: string): void {
    this.state.update(current => ({
      ...current,
      users: current.users.map(user =>
        user._id === id ? { ...user, username } : user
      )
    }));
  }

  changePassword(_form: ChangePasswordForm): void {
    // mock: password update is a no-op in frontend
  }

  getRoleName(role: UserRole): string {
    return UserManagementPresenter.getRoleName(role);
  }

  sortUsers(users: UserItem[], currentUserId?: string): UserItem[] {
    return UserManagementPresenter.sortUsers(users, currentUserId);
  }
}
