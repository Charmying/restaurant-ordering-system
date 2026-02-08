import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  findAll() {
    return this.userModel.find().sort({ createdAt: -1 });
  }

  async create(dto: CreateUserDto) {
    const existing = await this.userModel.findOne({ username: dto.username });
    if (existing) throw new ConflictException(`Username '${dto.username}' already exists`);
    return this.userModel.create(dto);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId).select('+password');
    if (!user) throw new NotFoundException('User not found');

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new UnauthorizedException('Current password is incorrect');

    user.password = dto.newPassword;
    await user.save();
    return { message: 'Password changed successfully' };
  }

  async remove(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    await this.userModel.findByIdAndDelete(userId);
  }

  async findByUsername(username: string, options?: { withPassword?: boolean }) {
    const query = this.userModel.findOne({ username });

    if (options?.withPassword) {
      query.select('+password');
    }

    return query.exec();
  }
}
