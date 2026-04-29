import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'Bienvenido a la plataforma',
    description: 'Título de la notificación',
  })
  @IsString()
  @IsNotEmpty({ message: 'El titulo es requerido' })
  title!: string;

  @ApiProperty({
    example: 'Tu cuenta ha sido creada exitosamente',
    description: 'Contenido de la notificación',
  })
  @IsString()
  @IsNotEmpty({ message: 'El contenido es requerido' })
  content!: string;

  @ApiProperty({
    example: 'email',
    enum: ['email', 'sms', 'push'],
    description: 'Canal de envío',
  })
  @IsIn(['email', 'sms', 'push'], {
    message: 'Canal debe ser email, sms o push',
  })
  channel!: string;
}
