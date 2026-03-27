import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FRONTEND_URL } from 'src/url';

interface OnlineUser {
  userId: string;
  socketId: string;
}

let onlineUsers: OnlineUser[] = [];

//  Add user (multi sockets support)
const addUser = (userId: string, socketId: string) => {
  const exists = onlineUsers.some(
    (u) => u.userId === userId && u.socketId === socketId,
  );

  onlineUsers = onlineUsers.filter((u) => u.userId !== userId);

  if (!exists) {
    onlineUsers.push({ userId, socketId });
  }
};

//  Remove socket
const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((u) => u.socketId !== socketId);
};

//  NEW: get all sockets for user
const getUsers = (userId: string) => {
  return onlineUsers.filter((u) => u.userId === userId);
};

@WebSocketGateway({
  cors: { origin: FRONTEND_URL, credentials: true },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  //  On connect
  handleConnection(client: Socket) {
    const user = client.data.user;

    if (!user) {
      client.disconnect();
      return;
    }

    addUser(user._id, client.id);

    console.log('🟢 User connected:', user._id);
    console.log('📊 Online users:', onlineUsers);
  }

  //  On disconnect
  handleDisconnect(client: Socket) {
    removeUser(client.id);

    console.log('🔴 Socket disconnected:', client.id);
    console.log('📊 Online users:', onlineUsers);
  }

  //  SEND NOTIFICATION (FIXED)
  sendNotification(notification: {
    receiverId: string;
    type: string;
    message?: string;
    data?: any;
  }) {
    const receivers = getUsers(notification.receiverId);

    console.log('📤 Sending notification to:', notification.receiverId);
    console.log('📡 Active sockets:', receivers);

    if (!receivers.length) {
      console.log('⚠️ User not online');
      return;
    }

    receivers.forEach((user) => {
      this.server.to(user.socketId).emit('receive-notification', notification);
    });
  }

  //  Mark as read (optional real-time sync)
  @SubscribeMessage('mark-as-read')
  handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { notificationId: string },
  ) {
    const user = client.data.user;
    if (!user) return;

    client.emit('notification-read', {
      notificationId: data.notificationId,
    });
  }
}