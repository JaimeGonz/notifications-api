import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto, userId: number) {
    return await this.prisma.notification.create({
      data: {
        title: dto.title,
        content: dto.content,
        channel: dto.channel,
        userId,
      },
    });
  }

  async findAllByUser(userId: number) {
    return await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneByUser(id: number, userId: number) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException(`Notificación ${id} no encontrada`);
    }

    return notification;
  }

  async update(id: number, dto: Partial<CreateNotificationDto>) {
    return await this.prisma.notification.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return await this.prisma.notification.delete({
      where: { id },
    });
  }
}
