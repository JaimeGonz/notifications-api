export interface NotificationPayload {
  title: string;
  content: string;
  userId: number;
}

export interface NotificationChannel {
  send(notification: NotificationPayload): Promise<void>;
}
