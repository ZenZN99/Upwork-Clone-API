export interface IMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  contractId: string;
  content: string;
  image: string | null;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
