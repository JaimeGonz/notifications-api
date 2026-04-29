import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(email: string, hashedPassword: string) {
    return await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }
}
