export type UserRole = 'employee' | 'manager' | 'superadmin';

export interface UserItem {
  _id: string;
  username: string;
  role: UserRole;
  createdAt: string;
  __v?: number;
}

export interface UserForm {
  username: string;
  password: string;
  role: UserRole;
}

export interface ChangePasswordForm {
  userId: string;
  password: string;
}

export interface UserManagementState {
  users: UserItem[];
}
