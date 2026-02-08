import { UserRole } from '../../modules/users/enums/user-role.enum';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.Employee]: 1,
  [UserRole.Manager]: 2,
  [UserRole.Superadmin]: 3,
};
