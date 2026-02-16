import { UserRole } from '../../modules/users/enums/user-role.enum';
import { ROLE_HIERARCHY } from '../constants/role-hierarchy';

export function hasSufficientRole(
  userRole: UserRole,
  requiredRole: UserRole,
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
