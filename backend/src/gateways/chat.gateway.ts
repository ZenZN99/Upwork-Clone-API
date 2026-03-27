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

const addUser = (userId: string, socketId: string) => {
  if (
    !onlineUsers.some((u) => u.userId === userId && u.socketId === socketId)
  ) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((u) => u.socketId !== socketId);
};

const getUser = (userId: string) =>
  onlineUsers.find((u) => u.userId === userId);

@WebSocketGateway({
  cors: { origin: FRONTEND_URL, credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const user = client.data.user;
    if (!user) {
      client.disconnect();
      return;
    }

    addUser(user._id, client.id);

    this.server.emit(
      'online-users',
      onlineUsers.map((u) => u.userId),
    );

    console.log('🟢 User connected:', user._id);
  }

  handleDisconnect(client: Socket) {
    removeUser(client.id);

    this.server.emit(
      'online-users',
      onlineUsers.map((u) => u.userId),
    );

    console.log('🔴 User disconnected:', client.id);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      receiverId: string;
      isTyping: boolean;
    },
  ) {
    const senderId = client.data.user._id;
    const receiver = getUser(data.receiverId);

    if (receiver) {
      this.server.to(receiver.socketId).emit('typing', {
        senderId,
        isTyping: data.isTyping,
      });
    }
  }

  @SubscribeMessage('send-message')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      receiverId: string;
      message: any;
    },
  ) {
    const receiver = getUser(data.receiverId);

    if (receiver) {
      this.server.to(receiver.socketId).emit('receive-message', data.message);
    }
  }

  @SubscribeMessage('message-seen')
  handleSeen(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      receiverId: string;
    },
  ) {
    const senderId = client.data.user._id;
    const sender = getUser(senderId);

    if (sender) {
      this.server.to(sender.socketId).emit('message-seen', {
        receiverId: data.receiverId,
      });
    }
  }
}