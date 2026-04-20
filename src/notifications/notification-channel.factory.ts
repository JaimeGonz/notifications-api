import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationChannel } from './channels/channel.interface';
import { EmailChannel } from './channels/email.channel';
import { SmsChannel } from './channels/sms.channel';
import { PushChannel } from './channels/push.channel';

@Injectable()
export class NotificationChannelFactory {
  getChannel(channel: string): NotificationChannel {
    switch (channel) {
      case 'email':
        return new EmailChannel();
      case 'sms':
        return new SmsChannel();
      case 'push':
        return new PushChannel();
      default:
        throw new BadRequestException(`Canal "${channel}" no soportado`);
    }
  }
}
