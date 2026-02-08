import { UserRole } from '../../modules/users/enums/user-role.enum';

export interface JwtPayload {
  userId: string;
  username: string;
  role: UserRole;
}
