import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(email: string, hashedPassword: string): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }
}
