import { UserRole } from "src/modules/users/constants/user-role.enum";

export interface JwtPayload {
  userId: string;
  username: string;
  role: UserRole;
}
