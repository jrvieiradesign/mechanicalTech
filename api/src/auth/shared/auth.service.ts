import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from './../../users/shared/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, Tokens } from '../types';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) throw new ForbiddenException('Access Denied');

    if (!(user && user.password === dto.password))
      throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user._id, user.email);

    this.updateUserRefreshToken(user._id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      return false;
    }
    user.refreshToken = null;
    await this.usersService.saveUser(user);
    return true;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied 1');

    if (!(user.refreshToken === rt))
      throw new ForbiddenException('Access Denied 2');

    const tokens = await this.getTokens(user._id, user.email);
    this.updateUserRefreshToken(user._id, tokens.refresh_token);

    return tokens;
  }

  async updateUserRefreshToken(userId: number, rt: string): Promise<void> {
    const user = await this.usersService.findOneById(userId);
    user.refreshToken = rt;
    await this.usersService.saveUser(user);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '1m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
