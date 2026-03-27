import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: String, ref: User.name, required: true })
  senderId: string;

  @Prop({ type: String, ref: User.name, required: true })
  receiverId: string;

  @Prop({ type: Number, required: true })
  amount: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
