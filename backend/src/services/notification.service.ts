import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from 'src/redis/redis.service';
import {
  Notification,
  NotificationDocument,
} from 'src/schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly redisService: RedisService,
  ) {}

  async createNotification(data: Notification) {
    if (data.receiverId === data.senderId) return;

    const notification = await this.notificationModel.create({
      receiverId: data.receiverId,
      senderId: data.senderId,
      type: data.type,
      targetId: data.targetId,
      isRead: false,
    });

    const redis = this.redisService.getClient();

    await redis.incr(`unread_count:${data.receiverId}`);

    await redis.lpush(
      `notifications:${data.receiverId}`,
      JSON.stringify(notification),
    );
    await redis.ltrim(`notifications:${data.receiverId}`, 0, 19);
  }

  async getUserNotifications(userId: string) {
    return await this.notificationModel
      .find({ receiverId: userId })
      .populate('senderId', 'fullname avatar email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getUnreadCount(userId: string) {
    const redis = this.redisService.getClient();
    const cached = await redis.get(`unread_count:${userId}`);

    if (cached !== null) {
      return Number(cached);
    }

    const count = await this.notificationModel.countDocuments({
      receiverId: userId,
      isRead: false,
    });

    await redis.set(`unread_count:${userId}`, count);
    return count;
  }

  async markAsRead(notificationId: string) {
    const notification = await this.notificationModel
      .findOneAndUpdate(
        { _id: notificationId },
        { isRead: true },
        { new: true },
      )
      .exec();

    if (notification) {
      const redis = this.redisService.getClient();
      await redis.decr(`unread_count:${notification.receiverId}`);
    }

    return notification;
  }

  async markAllAsRead(userId: string) {
    await this.notificationModel
      .updateMany({ receiverId: userId, isRead: false }, { isRead: true })
      .exec();

    const redis = this.redisService.getClient();
    await redis.set(`unread_count:${userId}`, 0);

    return { success: 'All notifications marked as read successfully' };
  }

  async deleteNotification(notificationId: string) {
    const notification = await this.notificationModel
      .findById(notificationId)
      .exec();
    if (!notification) {
      throw new NotFoundException('Notfication not found!');
    }

    await this.notificationModel.deleteOne({ _id: notificationId }).exec();

    const redis = this.redisService.getClient();

    await redis.lrem(
      `notifications:${notification.receiverId}`,
      0,
      JSON.stringify(notification),
    );
    if (!notification.isRead) {
      await redis.decr(`unread_count:${notification.receiverId}`);
    }

    return { success: 'Notification deleted successfully' };
  }
}