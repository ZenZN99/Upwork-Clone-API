import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionController } from 'src/controllers/transaction.controller';
import { Project, ProjectSchema } from 'src/schemas/project.schema';
import { Proposal, ProposalSchema } from 'src/schemas/proposal.schema';
import { Transaction, TransactionSchema } from 'src/schemas/transaction.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { TransactionService } from 'src/services/transaction.service';
import { TokenModule } from 'src/token/token.module';
import { NotificationModule } from './notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    MongooseModule.forFeature([
      { name: Proposal.name, schema: ProposalSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    NotificationModule,
    TokenModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
