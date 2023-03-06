import { Injectable } from '@nestjs/common';
import { UsersService } from './../../users/shared/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, userPassword: string) {
    const user = await this.usersService.findOne(email);
    if (user && user.password === userPassword) {
      const { _id, name, email } = user;
      return { id: _id, name, email };
    }

    return null;
  }
}
