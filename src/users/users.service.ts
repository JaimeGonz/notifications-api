import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findByEmail(email);
  }

  async create(email: string, hashedPassword: string): Promise<User> {
    return await this.repository.create(email, hashedPassword);
  }
}
