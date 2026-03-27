import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ContractStatus } from 'src/enums/contract.enum';
import { ProjectStatus } from 'src/enums/project.enum';
import { UserRole } from 'src/enums/user.enum';
import { Contract, ContractDocument } from 'src/schemas/contract.schema';
import { Project, ProjectDocument } from 'src/schemas/project.schema';
import { Proposal, ProposalDocument } from 'src/schemas/proposal.schema';
import { AuthUser } from 'src/types/auth-user.interface';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name)
    private readonly contractModel: Model<ContractDocument>,
    @InjectModel(Proposal.name)
    private readonly proposalModel: Model<ProposalDocument>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  async createContract(clientId: string, proposalId: string, data: Contract) {
    const { agreedPrice, durationDays } = data;

    if (!agreedPrice || !durationDays) {
      throw new BadRequestException(
        'agreedPrice and durationDays are required',
      );
    }

    const existContract = await this.contractModel.findOne({ proposalId });

    if (existContract) {
      throw new BadRequestException('Contract is already created');
    }

    const proposal = await this.proposalModel.findById(proposalId);

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    const project = await this.projectModel.findById(proposal.projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.clientId !== clientId) {
      throw new ForbiddenException('Not allowed');
    }

    const newContract = await this.contractModel.create({
      projectId: project._id.toString(),
      proposalId: proposal._id.toString(),
      clientId: project.clientId,
      freelancerId: proposal.freelancerId,
      agreedPrice,
      durationDays,
      status: ContractStatus.ACTIVE,
      startedAt: new Date(),
      completedAt: null as any,
    });

    await this.projectModel.findByIdAndUpdate(project._id, {
      status: ProjectStatus.IN_PROGRESS,
    });

    return {
      success: 'Contract created successfully',
      contract: newContract,
    };
  }

  async updateContract(authUser: AuthUser, contractId: string, data: Contract) {
    const contract = await this.contractModel.findById(contractId);

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    const isOwner = contract.clientId === authUser._id;
    const isAdmin = authUser.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Not allowed');
    }

    if (contract.status === ContractStatus.COMPLETED) {
      throw new BadRequestException('Cannot update completed contract');
    }

    if (data.agreedPrice !== undefined) {
      if (data.agreedPrice < 0 || data.agreedPrice < 25) {
        throw new BadRequestException('Invalid price');
      }
      contract.agreedPrice = data.agreedPrice;
    }

    if (data.durationDays !== undefined) {
      if (data.durationDays < 1) {
        throw new BadRequestException('Invalid duration');
      }
      contract.durationDays = data.durationDays;
    }
    const updatedContract = await contract.save();

    return {
      success: 'Contract updated successfully',
      contract: updatedContract,
    };
  }

  async getAllContracts() {
    return this.contractModel.find().sort({ createdAt: -1 }).lean();
  }

  async getContractById(id: string) {
    const contract = await this.contractModel.findById(id).lean();

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    return contract;
  }

  async completeContract(authUser: AuthUser, contractId: string) {
    const contract = await this.contractModel.findById(contractId);

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    const isOwner = contract.clientId === authUser._id;
    const isAdmin = authUser.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Not allowed');
    }

    if (contract.status === ContractStatus.COMPLETED) {
      throw new BadRequestException('Contract already completed');
    }

    contract.status = ContractStatus.COMPLETED;
    contract.completedAt = new Date();

    return contract.save();
  }

  async cancelContract(authUser: AuthUser, contractId: string) {
    const contract = await this.contractModel.findById(contractId);

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    const isOwner = contract.clientId === authUser._id;
    const isAdmin = authUser.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Not allowed');
    }

    if (contract.status !== ContractStatus.ACTIVE) {
      throw new BadRequestException('Contract cannot be cancelled');
    }

    contract.status = ContractStatus.CANCELLED;

    return contract.save();
  }

  async deleteContract(authUser: AuthUser, contractId: string) {
    const contract = await this.contractModel.findById(contractId);

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    const isOwner = contract.clientId === authUser._id;
    const isAdmin = authUser.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Not allowed');
    }

    if (contract.status === ContractStatus.ACTIVE) {
      throw new BadRequestException(
        'Cannot delete active contract. Cancel it first.',
      );
    }

    await this.contractModel.findByIdAndDelete(contractId);

    return {
      success: 'Contract deleted successfully',
    };
  }
}
