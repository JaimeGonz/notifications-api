import { NotificationChannel, NotificationPayload } from './channel.interface';

export class PushChannel implements NotificationChannel {
  async send(notification: NotificationPayload): Promise<void> {
    // Validar token de dispositivo
    console.log(
      `[PUSH] Validando token de dispositivo para usuario ${notification.userId}`,
    );

    // Formatear payload
    const payload = {
      title: notification.title,
      body: notification.content,
      userId: notification.userId,
    };

    console.log(`[PUSH] Payload formateado: `, payload);

    // Registrar estado del envio
    console.log(`[PUSH] Estado del envio: enviado`);
  }
}
