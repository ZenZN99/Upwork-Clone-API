import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from 'src/enums/user.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
  })
  fullname: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    minlength: 8,
  })
  password: string;

  @Prop({
    type: String,
    default:
      'https://res.cloudinary.com/dgagbheuj/image/upload/v1763194734/avatar-default-image_yc4xy4.jpg',
  })
  avatar: string;

  @Prop({
    type: String,
    enum: [UserRole.ADMIN, UserRole.FREELANCER, UserRole.CLIENT],
    required: true,
  })
  role: string;

  @Prop()
  balance: number;

  @Prop()
  frozenBalance: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
