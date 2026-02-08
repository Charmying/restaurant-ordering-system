import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/users/enums/user-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const ManagerOnly = () => Roles(UserRole.Manager);
export const AdminOnly = () => Roles(UserRole.Superadmin);
export const EmployeeOnly = () => Roles(UserRole.Employee);
