import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { UserManagementService } from './user-management.service';
import { ChangePasswordForm, UserForm, UserItem, UserRole } from './user-management.types';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [FormsModule, TranslateModule, ModalComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent {
  private readonly userService = inject(UserManagementService);
  private readonly translateService = inject(TranslateService);
  private readonly authService = inject(AuthService);

  /* ========================= State ========================= */

  readonly currentUser = computed(() => {
    const user = this.authService.user();
    if (!user) {
      return { _id: '', username: 'Guest', role: 'employee' as UserRole };
    }
    return { _id: user.userId, username: user.username, role: user.role as UserRole };
  });

  readonly showAddUserModal = signal(false);
  readonly showChangePasswordModal = signal(false);
  readonly showEditUsernameModal = signal(false);
  readonly showDeleteModal = signal(false);
  readonly showAlertModal = signal(false);

  userForm: UserForm = { username: '', password: '', role: 'employee' };
  changePasswordForm: ChangePasswordForm = { userId: '', currentPassword: '', newPassword: '' };
  editUsernameForm = { userId: '', username: '' };
  userToDelete: UserItem | null = null;
  readonly alertMessage = signal('');

  /* ========================= Computed ========================= */

  readonly users = computed(() =>
    this.userService.sortUsers(this.userService.users(), this.currentUser()._id)
  );

  readonly stats = computed(() => ({
    total: this.users().length,
    managers: this.users().filter(user => user.role === 'manager').length,
    employees: this.users().filter(user => user.role === 'employee').length
  }));

  /* ========================= Permissions ========================= */

  canManageUsers(): boolean {
    return this.currentUser().role === 'manager' || this.currentUser().role === 'superadmin';
  }

  canDeleteUser(user: UserItem): boolean {
    if (user.role === 'superadmin') return false;
    if (this.currentUser().role === 'superadmin') return true;
    if (this.currentUser().role === 'manager') return user.role === 'employee';
    return false;
  }

  canChangePassword(user: UserItem): boolean {
    return user._id === this.currentUser()._id && user.role !== 'superadmin';
  }

  canEditUsername(user: UserItem): boolean {
    return user._id === this.currentUser()._id;
  }

  /* ========================= UI Presenters ========================= */

  getRoleName(role: UserRole): string {
    return this.userService.getRoleName(role);
  }

  getRoleClasses(role: UserRole): string {
    const roleStyles: Record<UserRole, string> = {
      employee: 'bg-[rgb(var(--info-bg))] text-[rgb(var(--info-text))]',
      manager: 'bg-[rgb(var(--success-bg))] text-[rgb(var(--success-text))]',
      superadmin: 'bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))]'
    };
    return roleStyles[role];
  }

  get availableRoles(): UserRole[] {
    if (this.currentUser().role === 'superadmin') return ['employee', 'manager', 'superadmin'];
    if (this.currentUser().role === 'manager') return ['employee'];
    return [];
  }

  /* ========================= Modal Actions ========================= */

  openAddUserModal(): void {
    this.userForm = { username: '', password: '', role: 'employee' };
    this.showAddUserModal.set(true);
  }

  closeAddUserModal(): void {
    this.showAddUserModal.set(false);
  }

  async saveUser(): Promise<void> {
    if (!this.userForm.username || !this.userForm.password) {
      this.showAlert('features.userManagement.validation.required');
      return;
    }

    const created = await this.userService.createUser(this.userForm);
    if (!created) {
      this.showAlert('features.userManagement.errors.actionFailed');
      return;
    }
    this.userForm = { username: '', password: '', role: 'employee' };
    this.showAddUserModal.set(false);
  }

  openEditUsernameModal(user: UserItem): void {
    this.editUsernameForm = { userId: user._id, username: user.username };
    this.showEditUsernameModal.set(true);
  }

  closeEditUsernameModal(): void {
    this.showEditUsernameModal.set(false);
  }

  async saveUsername(): Promise<void> {
    const username = this.editUsernameForm.username.trim();
    if (!username) {
      this.showAlert('features.userManagement.validation.usernameRequired');
      return;
    }
    const updated = await this.userService.updateUsername(this.editUsernameForm.userId, username);
    if (!updated) {
      this.showAlert('features.userManagement.errors.usernameNotSupported');
      return;
    }
    this.showEditUsernameModal.set(false);
  }

  openChangePasswordModal(user: UserItem): void {
    this.changePasswordForm = { userId: user._id, currentPassword: '', newPassword: '' };
    this.showChangePasswordModal.set(true);
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal.set(false);
  }

  async changePassword(): Promise<void> {
    if (!this.changePasswordForm.currentPassword) {
      this.showAlert('features.userManagement.validation.currentPasswordRequired');
      return;
    }
    if (!this.changePasswordForm.newPassword) {
      this.showAlert('features.userManagement.validation.passwordRequired');
      return;
    }

    const changed = await this.userService.changePassword(this.changePasswordForm);
    if (!changed) {
      this.showAlert('features.userManagement.errors.actionFailed');
      return;
    }
    this.showAlert('features.userManagement.actions.passwordChanged');
    this.changePasswordForm = { userId: '', currentPassword: '', newPassword: '' };
    this.showChangePasswordModal.set(false);
  }

  /* ========================= User Actions ========================= */

  deleteUser(user: UserItem): void {
    this.userToDelete = user;
    this.showDeleteModal.set(true);
  }

  async confirmDelete(): Promise<void> {
    if (this.userToDelete) {
      await this.userService.deleteUser(this.userToDelete._id);
      this.userToDelete = null;
    }
    this.showDeleteModal.set(false);
  }

  closeDeleteModal(): void {
    this.userToDelete = null;
    this.showDeleteModal.set(false);
  }

  showAlert(messageKey: string): void {
    this.alertMessage.set(this.translateService.instant(messageKey));
    this.showAlertModal.set(true);
  }

  closeAlertModal(): void {
    this.showAlertModal.set(false);
  }
}
