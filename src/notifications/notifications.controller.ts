import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear notificación y ejecutar envío por canal' })
  @ApiResponse({ status: 201, description: 'Notificación creada y enviada' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o canal no soportado',
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  create(@Body() dto: CreateNotificationDto, @GetUser('id') userId: number) {
    return this.notificationsService.create(dto, userId);
  }

  @ApiOperation({ summary: 'Listar notificaciones del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de notificaciones' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.notificationsService.findAll(userId);
  }

  @ApiOperation({ summary: 'Actualizar una notificación' })
  @ApiResponse({ status: 200, description: 'Notificación actualizada' })
  @ApiResponse({ status: 401, description: 'Notificación no encontrada' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser('id') userId: number,
    @Body() dto: Partial<CreateNotificationDto>,
  ) {
    return this.notificationsService.update(Number(id), userId, dto);
  }

  @ApiOperation({ summary: 'Eliminar una notificación' })
  @ApiResponse({ status: 200, description: 'Notificación eliminada' })
  @ApiResponse({ status: 401, description: 'Notificación no encontrada' })
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.notificationsService.remove(Number(id), userId);
  }
}
