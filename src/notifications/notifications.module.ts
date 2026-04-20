import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationChannelFactory } from './notification-channel.factory';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationChannelFactory],
})
export class NotificationsModule {}
