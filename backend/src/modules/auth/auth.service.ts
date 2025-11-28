import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /* 🔹 Register a new user */
  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user);
    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      ...tokens,
    };
  }

  /* 🔹 Validate user credentials */
  async validateUser(email: string, password: string): Promise<Partial<User> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    // Safely convert to plain object if Mongoose document
    const userData =
      typeof (user as any).toObject === 'function'
        ? (user as any).toObject()
        : user;

    const { password: _pw, ...result } = userData;
    return result;
  }

  /* 🔹 Login and return tokens */
  async login(user: any) {
    const tokens = await this.generateTokens(user);
    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      ...tokens,
    };
  }

  /* 🔹 Generate JWT access + refresh tokens */
  async generateTokens(user: any) {
    const payload = { email: user.email, sub: user._id.toString() };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    // Save refresh token in DB
    await this.usersService.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: '7d',
    };
  }

  /* 🔹 Refresh token validation & rotation */
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.sub);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /* 🔹 Forgot password - Generate reset token */
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const resetToken = this.jwtService.sign(
      { email: user.email, sub: user._id.toString() },
      { expiresIn: '1h' },
    );

    // TODO: Integrate with email service
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return { message: 'Password reset email sent' };
  }

  /* 🔹 Reset password with token */
  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new BadRequestException('Invalid or expired token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.usersService.updatePassword(user._id.toString(), hashedPassword);

      return { message: 'Password successfully reset' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  /* 🔹 Logout and clear refresh token */
  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }
}
