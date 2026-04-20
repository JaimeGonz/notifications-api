import { NotificationChannel, NotificationPayload } from './channel.interface';

export class SmsChannel implements NotificationChannel {
  private readonly MAX_LENGTH = 160;

  async send(notification: NotificationPayload): Promise<void> {
    // Limitar contenido a 160
    const truncatedContent = notification.content.slice(0, this.MAX_LENGTH);
    console.log(
      `[SMS] Contenido limitado a ${this.MAX_LENGTH} caracteres: ${truncatedContent}`,
    );

    // Registrar numero y fecha de envio
    console.log(
      `[SMS] Registrando envio para usuario ${notification.userId} a las ${new Date().toISOString()}`,
    );
  }
}
