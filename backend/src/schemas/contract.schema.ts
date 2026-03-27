import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Project } from './project.schema';
import { Proposal } from './proposal.schema';
import { User } from './user.schema';
import { ContractStatus } from 'src/enums/contract.enum';

export type ContractDocument = Contract & Document;

@Schema({ timestamps: true })
export class Contract {
  @Prop({
    type: String,
    ref: Project.name,
    required: true,
  })
  projectId: string;

  @Prop({
    type: String,
    ref: Proposal.name,
    required: true,
  })
  proposalId: string;

  @Prop({
    type: String,
    ref: User.name,
    required: true,
  })
  clientId: string;

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
  agreedPrice: number;

  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  durationDays: number;

  @Prop({
    type: String,
    default: ContractStatus.ACTIVE,
    enum: Object.values(ContractStatus),
  })
  status: ContractStatus;

  @Prop({
    type: Date,
    default: null,
  })
  startedAt: Date;

  @Prop({
    type: Date,
    default: null,
  })
  completedAt: Date;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);