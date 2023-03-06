import { UsersService } from './shared/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/shared/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.usersService.store(body);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.usersService.findAll();
  }
}
