import {
  Controller,
  Get,
  Patch,
  Param,
  Req,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { NotificationService } from 'src/services/notification.service';
import { AuthGuard } from 'src/guards/auth.guard';
import type { RequestWithUser } from 'src/types/express';

@Controller('api/notification')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getMyNotifications(@Req() req: RequestWithUser) {
    return this.notificationService.getUserNotifications(req.user._id);
  }

  @Get('unread-count')
  getUnreadCount(@Req() req: RequestWithUser) {
    return this.notificationService.getUnreadCount(req.user._id);
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Patch('read-all')
  markAllAsRead(@Req() req: RequestWithUser) {
    return this.notificationService.markAllAsRead(req.user._id);
  }
  @Delete(':notificationId')
  deleteNotification(@Param('notificationId') id: string) {
    return this.notificationService.deleteNotification(id);
  }
}
