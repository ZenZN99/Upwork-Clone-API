import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import { JobTitle, Skills } from 'src/enums/freelancer-profile.enum';

export type FreelancerProfileDocument = FreelancerProfile & Document;

@Schema({ timestamps: true })
export class FreelancerProfile {
  @Prop({
    type: String,
    required: true,
    ref: User.name,
  })
  freelancerId: string;

  @Prop({
    type: String,
    enum: Object.values(JobTitle),
    default: JobTitle.NONE,
  })
  jobTitle: JobTitle;

  @Prop({
    type: String,
    default: 'No bio yet',
  })
  bio: string;

  @Prop({
    type: [String],
    enum: Object.values(Skills),
    default: [Skills.NO_SKILLS],
  })
  skills: Skills[];

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  hourlyRate: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  totalEarnings: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  })
  rating: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  completedJobs: number;
}

export const FreelancerProfileSchema =
  SchemaFactory.createForClass(FreelancerProfile);