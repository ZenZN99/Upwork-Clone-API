import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { uploadToCloudinary } from 'src/cloudinary/cloudinary';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { Contract, ContractDocument } from 'src/schemas/contract.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(Contract.name)
    private readonly contractModel: Model<ContractDocument>,
  ) {}

  async sendMessage(
    senderId: string,
    contractId: string,
    data: Partial<Message>,
    file?: Express.Multer.File,
  ) {
    const { receiverId, content } = data;

    if (!receiverId) throw new BadRequestException('Receiver ID is required');
    if (!contractId) throw new BadRequestException('Contract ID is required');

    const contract = await this.contractModel.findById(contractId);
    if (!contract) throw new NotFoundException('Contract not found');

    if (senderId !== contract.clientId && senderId !== contract.freelancerId) {
      throw new ForbiddenException('You are not part of this contract');
    }

    if ((!content || content.trim() === '') && !file) {
      throw new BadRequestException(
        'Message must contain text or at least one image',
      );
    }

    let imageUrl = '';
    if (file) {
      const uploadResult = await uploadToCloudinary(file, 'messages');
      imageUrl = uploadResult.secure_url;
    }

    return await this.messageModel.create({
      senderId,
      receiverId,
      contractId,
      content: content || '',
      image: imageUrl,
      isRead: false,
    });
  }

  async getChatMessages(
    userId: string,
    contractId: string,
    otherUserId: string,
  ) {
    const contract = await this.contractModel.findById(contractId);
    if (!contract) throw new NotFoundException('Contract not found');

    if (userId !== contract.clientId && userId !== contract.freelancerId) {
      throw new ForbiddenException('You are not part of this contract');
    }

    return await this.messageModel
      .find({
        contractId,
        $or: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      })
      .sort({ createdAt: 1 });
  }

  async deleteMessage(userId: string, messageId: string) {
    const message = await this.messageModel.findOneAndDelete({
      _id: messageId,
      senderId: userId,
    });

    if (!message)
      throw new BadRequestException(
        'Message not found or you are not the sender',
      );

    return { success: 'Message deleted successfully', message };
  }

  async markMessageAsRead(
    userId: string,
    senderId: string,
    contractId: string,
  ) {
    const contract = await this.contractModel.findById(contractId);
    if (!contract) throw new NotFoundException('Contract not found');

    if (userId !== contract.clientId && userId !== contract.freelancerId) {
      throw new ForbiddenException('You are not part of this contract');
    }

    const result = await this.messageModel.updateMany(
      { senderId, receiverId: userId, contractId, isRead: false },
      { $set: { isRead: true } },
    );

    return {
      success: 'Messages marked as read successfully',
      modifiedCount: result.modifiedCount,
    };
  }
}
