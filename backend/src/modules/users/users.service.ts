import { Injectable, ConflictException, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { UserRole } from './enums/user-role.enum';
import { hasSufficientRole } from '../../common/policies/role.policy';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(requestorRole: UserRole) {
    if (requestorRole === UserRole.Superadmin) return this.userModel.find().sort({ createdAt: -1 });
    if (requestorRole === UserRole.Manager) return this.userModel.find({ role: UserRole.Employee }).sort({ createdAt: -1 });

    throw new ForbiddenException('Insufficient permissions');
  }

  async create(dto: CreateUserDto, requestor: JwtPayload) {
    const targetRole = dto.role ?? UserRole.Employee;

    if (!hasSufficientRole(requestor.role, UserRole.Manager)) throw new ForbiddenException('Only managers can create users');
    if (hasSufficientRole(targetRole, requestor.role)) throw new ForbiddenException('Cannot create a user with equal or higher role',);

    const existing = await this.userModel.findOne({ username: dto.username });
    if (existing) throw new ConflictException(`Username '${dto.username}' already exists`,);

    return this.userModel.create(dto);
  }

  async changePassword(targetUserId: string, dto: ChangePasswordDto, requestor: JwtPayload) {
    if (requestor.userId !== targetUserId && !hasSufficientRole(requestor.role, UserRole.Manager)) throw new ForbiddenException('Cannot change another user’s password');

    const user = await this.userModel.findById(targetUserId).select('+password');
    if (!user) throw new NotFoundException('User not found');

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new UnauthorizedException('Current password is incorrect');

    user.password = dto.newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  async remove(userId: string, requestor: JwtPayload) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (!hasSufficientRole(requestor.role, UserRole.Manager)) throw new ForbiddenException();
    if (hasSufficientRole(user.role, requestor.role)) throw new ForbiddenException('Cannot delete user with equal or higher role');

    await this.userModel.findByIdAndDelete(userId);
  }

  async createSystemUser(data: { username: string; password: string; role: UserRole; }) {
    return this.userModel.create(data);
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

}
