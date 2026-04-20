import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationChannelFactory } from './notification-channel.factory';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly channelFactory: NotificationChannelFactory,
  ) {}

  async create(dto: CreateNotificationDto, userId: number) {
    // Guardar notification en base de datos
    const notification = await this.prisma.notification.create({
      data: {
        title: dto.title,
        content: dto.content,
        channel: dto.channel,
        userId,
      },
    });

    // Obtener canal correcto via Factory
    const channel = this.channelFactory.getChannel(dto.channel);

    // Ejecutar el envio
    await channel.send({
      title: notification.title,
      content: notification.content,
      userId: notification.userId,
    });

    return notification;
  }

  async findAll(userId: number) {
    return await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification) {
      throw new NotFoundException(`Notificación ${id} no encontrada`);
    }

    return notification;
  }

  async update(
    id: number,
    userId: number,
    dto: Partial<CreateNotificationDto>,
  ) {
    await this.findOne(id, userId);

    return await this.prisma.notification.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    return await this.prisma.notification.delete({
      where: { id },
    });
  }
}
