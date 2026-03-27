import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import { BudgetType, ProjectStatus } from 'src/enums/project.enum';
import { Proposal } from './proposal.schema';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({
    type: String,
    ref: User.name,
    required: true,
  })
  clientId: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: String,
    enum: Object.values(BudgetType),
    required: true,
  })
  budgetType: BudgetType;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  budget: number;

  @Prop({
    type: String,
    enum: Object.values(ProjectStatus),
    default: ProjectStatus.OPEN,
  })
  status: ProjectStatus;


}

export const ProjectSchema = SchemaFactory.createForClass(Project);
