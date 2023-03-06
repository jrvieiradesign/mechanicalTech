import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from './../users/users.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './shared/local.strategy';
import { AuthService } from './shared/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './shared/constants';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
