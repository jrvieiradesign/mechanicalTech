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
  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }
  async findOneById(_id: number) {
    return await this.usersRepository.findOneBy({ _id });
  }
  async saveUser(user: User) {
    return await this.usersRepository.save(user);
  }
  async store(UserEmail: CreateUserDto) {
    const user = this.usersRepository.create(UserEmail);
    return await this.usersRepository.save(user);
  }
}
