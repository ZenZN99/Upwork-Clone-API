import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Project } from './project.schema';
import { Contract } from './contract.schema';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({
    type: String,
    ref: User.name,
    required: true,
  })
  reviewerId: string;

  @Prop({
    type: String,
    ref: User.name,
    required: true,
  })
  revieweeId: string;

  @Prop({
    type: String,
    ref: Contract.name,
    required: true,
  })
  contractId: string;

  @Prop({
    type: String,
    ref: Project.name,
    required: true,
  })
  projectId: string;

  @Prop({ type: Number, min: 1, max: 5, required: true })
  professionalism: number;

  @Prop({ type: Number, min: 1, max: 5, required: true })
  communication: number;

  @Prop({ type: Number, min: 1, max: 5, required: true })
  quality: number;

  @Prop({ type: Number, min: 1, max: 5, required: true })
  expertise: number;

  @Prop({ type: Number, min: 1, max: 5, required: true })
  delivery: number;

  @Prop({ type: Number, min: 1, max: 5, required: true })
  rehire: number;

  @Prop({ type: Number })
  averageRating: number;

  @Prop({
    type: String,
    trim: true,
    maxlength: 500,
  })
  comment: string;

  @Prop({
    type: String,
    default: '',
  })
  note: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
