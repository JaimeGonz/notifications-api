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

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() dto: CreateNotificationDto, @GetUser('id') userId: number) {
    return this.notificationsService.create(dto, userId);
  }

  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.notificationsService.findAll(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser('id') userId: number,
    @Body() dto: Partial<CreateNotificationDto>,
  ) {
    return this.notificationsService.update(Number(id), userId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.notificationsService.remove(Number(id), userId);
  }
}
