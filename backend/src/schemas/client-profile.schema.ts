import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import { CompanyName } from 'src/enums/client-profile.enum';

export type ClientProfileDocument = ClientProfile & Document;

@Schema({ timestamps: true })
export class ClientProfile {
  @Prop({
    type: String,
    required: true,
    ref: User.name,
  })
  clientId: string;

  @Prop({
    type: String,
    enum: Object.values(CompanyName),
    default: CompanyName.INDIVIDUAL,
  })
  companyName: CompanyName;

  @Prop({
    type: String,
    default: 'No bio yet.',
  })
  bio: string;

  @Prop({
    type: Number,
    default: 0,
  })
  totalSpent: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  })
  rating: number;
}

export const ClientProfileSchema = SchemaFactory.createForClass(ClientProfile);
