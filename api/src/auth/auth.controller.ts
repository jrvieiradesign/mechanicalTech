import {
  Controller,
  Request,
  UseGuards,
  Post,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { AuthDto } from './dto';
import { AuthService } from './shared/auth.service';
import { AccessTokenGuard, refreshTokenGuard } from '../common/guards';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @Post('logout/:id')
  logout(@Param('id') id: number): Promise<boolean> {
    return this.authService.logout(id);
  }

  @UseGuards(refreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Request() req): Promise<Tokens> {
    return this.authService.refreshTokens(req.user.sub, req.user.refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('user-info')
  getUserInfo(@Request() req) {
    return req.user;
  }
}
