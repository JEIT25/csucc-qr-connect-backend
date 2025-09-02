import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async save(validData: any) {
    return await this.userRepository.save(validData);
  }

  async findOneBy(validData: any) {
    return await this.userRepository.findOneBy(validData);
  }

  async update(id: number, validData: any) {
    return await this.userRepository.update(id, validData);
  }
}
