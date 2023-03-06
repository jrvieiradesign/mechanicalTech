import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async findAll() {
    return await this.usersRepository.find();
  }
  async store(UserEmail: CreateUserDto) {
    const user = this.usersRepository.create(UserEmail);
    return await this.usersRepository.save(user);
  }
}
