import { UserRole } from '../../modules/users/enums/user-role.enum';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.Employee]: 1,
  [UserRole.Manager]: 2,
  [UserRole.Superadmin]: 3,
};

export function hasSufficientRole(
  userRole: UserRole,
  requiredRole: UserRole,
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
