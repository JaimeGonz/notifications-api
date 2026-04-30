import { BadRequestException } from '@nestjs/common';
import { EmailChannel } from './channels/email.channel';
import { PushChannel } from './channels/push.channel';
import { SmsChannel } from './channels/sms.channel';
import { NotificationChannelFactory } from './notification-channel.factory';

describe('NotificationChannelFactory', () => {
  let factory: NotificationChannelFactory;

  beforeEach(() => {
    factory = new NotificationChannelFactory();
  });

  it('should return EmailChannel for email', () => {
    const channel = factory.getChannel('email');
    expect(channel).toBeInstanceOf(EmailChannel);
  });

  it('should return SmsChannel for sms', () => {
    const channel = factory.getChannel('sms');
    expect(channel).toBeInstanceOf(SmsChannel);
  });

  it('should return PushChannel for push', () => {
    const channel = factory.getChannel('push');
    expect(channel).toBeInstanceOf(PushChannel);
  });

  it('should throw BadRequestException for invalid channel', () => {
    expect(() => factory.getChannel('whatsapp')).toThrow(BadRequestException);
  });
});
