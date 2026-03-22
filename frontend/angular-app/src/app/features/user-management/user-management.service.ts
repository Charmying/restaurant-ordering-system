import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ChangePasswordForm, UserForm, UserItem, UserManagementState, UserRole } from './user-management.types';
import { UserManagementPresenter } from './user-management.presenter';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private readonly api = inject(ApiService);
  private readonly state = signal<UserManagementState>({
    users: []
  });

  readonly users = computed(() => this.state().users);

  constructor() {
    void this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    try {
      const users = await firstValueFrom(this.api.get<UserItem[]>('/users'));
      this.state.update(current => ({
        ...current,
        users
      }));
    } catch (error) {
      console.error('Failed to load users', error);
    }
  }

  async createUser(form: UserForm): Promise<UserItem | null> {
    try {
      const user = await firstValueFrom(this.api.post<UserItem>('/users', {
        username: form.username,
        password: form.password,
        role: form.role
      }));
      this.state.update(current => ({
        ...current,
        users: [user, ...current.users]
      }));
      return user;
    } catch (error) {
      console.error('Failed to create user', error);
      return null;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await firstValueFrom(this.api.delete(`/users/${id}`));
      this.state.update(current => ({
        ...current,
        users: current.users.filter(user => user._id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  }

  async updateUsername(_id: string, _username: string): Promise<boolean> {
    console.warn('Backend does not support username updates yet.');
    return false;
  }

  async changePassword(form: ChangePasswordForm): Promise<boolean> {
    try {
      await firstValueFrom(this.api.put(`/users/${form.userId}/password`, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      }));
      return true;
    } catch (error) {
      console.error('Failed to change password', error);
      return false;
    }
  }

  getRoleName(role: UserRole): string {
    return UserManagementPresenter.getRoleName(role);
  }

  sortUsers(users: UserItem[], currentUserId?: string): UserItem[] {
    return UserManagementPresenter.sortUsers(users, currentUserId);
  }
}
