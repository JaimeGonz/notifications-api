import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty({ message: 'El titulo es requerido' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'El contenido es requerido' })
  content!: string;

  @IsIn(['email', 'sms', 'push'], {
    message: 'Canal debe ser email, sms o push',
  })
  channel!: string;
}
