import { Injectable } from '@nestjs/common';
import { NotificationChannelFactory } from './notification-channel.factory';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly repository: NotificationsRepository,
    private readonly channelFactory: NotificationChannelFactory,
  ) {}

  async create(dto: CreateNotificationDto, userId: number) {
    // Guardar notification en base de datos
    const notification = await this.repository.create(dto, userId);

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
    return await this.repository.findAllByUser(userId);
  }

  async findOne(id: number, userId: number) {
    return await this.repository.findOneByUser(id, userId);
  }

  async update(
    id: number,
    userId: number,
    dto: Partial<CreateNotificationDto>,
  ) {
    await this.repository.findOneByUser(id, userId);
    return await this.repository.update(id, dto);
  }

  async remove(id: number, userId: number) {
    await this.repository.findOneByUser(id, userId);
    return await this.repository.remove(id);
  }
}
