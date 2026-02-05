import { UserItem, UserRole } from './user-management.types';

export class UserManagementPresenter {
  static getRoleName(role: UserRole): string {
    const roles: Record<UserRole, string> = {
      employee: '員工',
      manager: '管理者',
      superadmin: '超級管理者'
    };
    return roles[role] || role;
  }

  static sortUsers(users: UserItem[], currentUserId?: string): UserItem[] {
    const roleOrder: Record<UserRole, number> = { superadmin: 1, manager: 2, employee: 3 };
    return [...users].sort((a, b) => {
      if (currentUserId) {
        if (a._id === currentUserId) return -1;
        if (b._id === currentUserId) return 1;
      }
      return roleOrder[a.role] - roleOrder[b.role];
    });
  }
}
