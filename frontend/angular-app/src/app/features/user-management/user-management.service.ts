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
  readonly loadError = signal<string | null>(null);
  readonly actionError = signal<string | null>(null);

  constructor() {
    void this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.loadError.set(null);
    try {
      const users = await firstValueFrom(this.api.get<UserItem[]>('/users'));
      this.state.update(current => ({
        ...current,
        users
      }));
    } catch {
      this.loadError.set('common.loadError');
    }
  }

  async createUser(form: UserForm): Promise<UserItem | null> {
    this.actionError.set(null);
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
    } catch {
      this.actionError.set('common.actionError');
      return null;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    this.actionError.set(null);
    try {
      await firstValueFrom(this.api.delete(`/users/${id}`));
      this.state.update(current => ({
        ...current,
        users: current.users.filter(user => user._id !== id)
      }));
      return true;
    } catch {
      this.actionError.set('common.actionError');
      return false;
    }
  }

  async updateUsername(_id: string, _username: string): Promise<boolean> {
    this.actionError.set('features.userManagement.errors.usernameNotSupported');
    return false;
  }

  async changePassword(form: ChangePasswordForm): Promise<boolean> {
    this.actionError.set(null);
    try {
      await firstValueFrom(this.api.put(`/users/${form.userId}/password`, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      }));
      return true;
    } catch {
      this.actionError.set('common.actionError');
      return false;
    }
  }

  clearActionError(): void {
    this.actionError.set(null);
  }

  getRoleName(role: UserRole): string {
    return UserManagementPresenter.getRoleName(role);
  }

  sortUsers(users: UserItem[], currentUserId?: string): UserItem[] {
    return UserManagementPresenter.sortUsers(users, currentUserId);
  }
}
