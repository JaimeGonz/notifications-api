import { NotificationChannel, NotificationPayload } from './channel.interface';

export class EmailChannel implements NotificationChannel {
  async send(notification: NotificationPayload): Promise<void> {
    // Validar formato del destinatario
    console.log(
      `[EMAIL] Validando destinatario para usarlo ${notification.userId}`,
    );

    // Generar template
    console.log(`[EMAIL] Generando template para: ${notification.title}`);
    console.log(`[EMAIL] Contenido: ${notification.content}`);

    // Registrar envio
    console.log(
      `[EMAIL] Envio registrado exitosamente para usuario ${notification.userId}`,
    );
  }
}
