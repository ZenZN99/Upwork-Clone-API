import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractController } from 'src/controllers/contract.controller';
import { Contract, ContractSchema } from 'src/schemas/contract.schema';
import { Project, ProjectSchema } from 'src/schemas/project.schema';
import { Proposal, ProposalSchema } from 'src/schemas/proposal.schema';
import { ContractService } from 'src/services/contract.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
    ]),
    MongooseModule.forFeature([
      { name: Proposal.name, schema: ProposalSchema },
    ]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    TokenModule,
  ],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
