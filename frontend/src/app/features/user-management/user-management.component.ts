import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { UserManagementService } from './user-management.service';
import { ChangePasswordForm, UserForm, UserItem, UserRole } from './user-management.types';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ModalComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent {
  private readonly userService = inject(UserManagementService);
  private readonly translateService = inject(TranslateService);

  /* ========================= State ========================= */

  readonly currentUser = {
    _id: '6936d769a45d37726f77647d',
    username: 'Charmy',
    role: 'superadmin' as UserRole
  };

  showAddUserModal = false;
  showChangePasswordModal = false;
  showEditUsernameModal = false;
  showDeleteModal = false;
  showAlertModal = false;

  userForm: UserForm = { username: '', password: '', role: 'employee' };
  changePasswordForm: ChangePasswordForm = { userId: '', password: '' };
  editUsernameForm = { userId: '', username: '' };
  userToDelete: UserItem | null = null;
  alertMessage = '';

  /* ========================= Computed ========================= */

  readonly users = computed(() =>
    this.userService.sortUsers(this.userService.users(), this.currentUser._id)
  );

  readonly stats = computed(() => ({
    total: this.users().length,
    managers: this.users().filter(user => user.role === 'manager').length,
    employees: this.users().filter(user => user.role === 'employee').length
  }));

  /* ========================= Permissions ========================= */

  canManageUsers(): boolean {
    return this.currentUser.role === 'manager' || this.currentUser.role === 'superadmin';
  }

  canDeleteUser(user: UserItem): boolean {
    if (user.role === 'superadmin') return false;
    if (this.currentUser.role === 'superadmin') return true;
    if (this.currentUser.role === 'manager') return user.role === 'employee';
    return false;
  }

  canChangePassword(user: UserItem): boolean {
    return user._id === this.currentUser._id && user.role !== 'superadmin';
  }

  canEditUsername(user: UserItem): boolean {
    return user._id === this.currentUser._id;
  }

  /* ========================= UI Presenters ========================= */

  getRoleName(role: UserRole): string {
    return this.userService.getRoleName(role);
  }

  getRoleClasses(role: UserRole): string {
    const roleStyles: Record<UserRole, string> = {
      employee: 'bg-blue-100 text-blue-800',
      manager: 'bg-green-100 text-green-800',
      superadmin: 'bg-purple-100 text-purple-800'
    };
    return roleStyles[role];
  }

  get availableRoles(): UserRole[] {
    if (this.currentUser.role === 'superadmin') return ['employee', 'manager', 'superadmin'];
    if (this.currentUser.role === 'manager') return ['employee'];
    return [];
  }

  /* ========================= Modal Actions ========================= */

  openAddUserModal(): void {
    this.userForm = { username: '', password: '', role: 'employee' };
    this.showAddUserModal = true;
  }

  closeAddUserModal(): void {
    this.showAddUserModal = false;
  }

  saveUser(): void {
    if (!this.userForm.username || !this.userForm.password) {
      this.showAlert('features.userManagement.validation.required');
      return;
    }

    this.userService.createUser(this.userForm);
    this.userForm = { username: '', password: '', role: 'employee' };
    this.showAddUserModal = false;
  }

  openEditUsernameModal(user: UserItem): void {
    this.editUsernameForm = { userId: user._id, username: user.username };
    this.showEditUsernameModal = true;
  }

  closeEditUsernameModal(): void {
    this.showEditUsernameModal = false;
  }

  saveUsername(): void {
    const username = this.editUsernameForm.username.trim();
    if (!username) {
      this.showAlert('features.userManagement.validation.usernameRequired');
      return;
    }
    this.userService.updateUsername(this.editUsernameForm.userId, username);
    if (this.editUsernameForm.userId === this.currentUser._id) {
      this.currentUser.username = username;
    }
    this.showEditUsernameModal = false;
  }

  openChangePasswordModal(user: UserItem): void {
    this.changePasswordForm = { userId: user._id, password: '' };
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal = false;
  }

  changePassword(): void {
    if (!this.changePasswordForm.password) {
      this.showAlert('features.userManagement.validation.passwordRequired');
      return;
    }

    this.userService.changePassword(this.changePasswordForm);
    this.showAlert('features.userManagement.actions.passwordChanged');
    this.changePasswordForm = { userId: '', password: '' };
    this.showChangePasswordModal = false;
  }

  /* ========================= User Actions ========================= */

  deleteUser(user: UserItem): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete._id);
      this.userToDelete = null;
    }
    this.showDeleteModal = false;
  }

  closeDeleteModal(): void {
    this.userToDelete = null;
    this.showDeleteModal = false;
  }

  showAlert(messageKey: string): void {
    this.alertMessage = this.translateService.instant(messageKey);
    this.showAlertModal = true;
  }

  closeAlertModal(): void {
    this.showAlertModal = false;
  }
}
