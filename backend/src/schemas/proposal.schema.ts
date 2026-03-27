import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Project } from './project.schema';
import { User } from './user.schema';
import { ProposalStatus } from 'src/enums/proposal.enum';

export type ProposalDocument = Proposal & Document;

@Schema({ timestamps: true })
export class Proposal {
  @Prop({
    type: String,
    ref: Project.name,
    required: true,
  })
  projectId: string;

  @Prop({
    type: String,
    ref: User.name,
    required: true,
  })
  freelancerId: string;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  durationDays: number;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  coverLetter: string;

  @Prop({
    type: String,
    enum: Object.values(ProposalStatus),
    default: ProposalStatus.PENDING,
  })
  status: ProposalStatus;
}

export const ProposalSchema = SchemaFactory.createForClass(Proposal);
