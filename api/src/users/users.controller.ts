import { UsersService } from './shared/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.usersService.store(body);
  }
  @Get()
  async getAll() {
    return this.usersService.findAll();
  }
}
