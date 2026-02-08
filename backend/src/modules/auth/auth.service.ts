import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ username: dto.username }).select('+password');
    if (!user) throw new UnauthorizedException('Invalid username or password');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid username or password');

    const payload: JwtPayload = { userId: user._id.toString(), username: user.username, role: user.role };
    const tokens = this.generateTokenPair(payload);
    await this.userModel.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });
    return { user: payload, ...tokens };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.userModel.findById(payload.userId).select('+refreshToken');
      if (!user || user.refreshToken !== refreshToken) throw new UnauthorizedException('Invalid refresh token');

      const newPayload: JwtPayload = { userId: user._id.toString(), username: user.username, role: user.role };
      const tokens = this.generateTokenPair(newPayload);
      await this.userModel.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });
      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
    return { message: 'Logged out successfully' };
  }

  private generateTokenPair(payload: JwtPayload) {
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      }),
    };
  }
}
