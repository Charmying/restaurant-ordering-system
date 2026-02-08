import { IsString, IsEnum, MinLength, MaxLength, IsOptional } from 'class-validator';
import { UserRole } from '../constants/user-role.enum';

export class CreateUserDto {
  @IsString() @MinLength(2) @MaxLength(50)
  username: string;

  @IsString() @MinLength(6)
  password: string;

  @IsOptional() @IsEnum(UserRole)
  role?: UserRole = UserRole.Employee;
}
