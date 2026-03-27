import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proposal, ProposalDocument } from 'src/schemas/proposal.schema';
import { Project, ProjectDocument } from 'src/schemas/project.schema';
import { ProposalStatus } from 'src/enums/proposal.enum';
import { AuthUser } from 'src/types/auth-user.interface';
import { UserRole } from 'src/enums/user.enum';
import { ProjectStatus } from 'src/enums/project.enum';
import { NotificationService } from './notification.service';
import { NotificationType } from 'src/enums/notification.enum';

@Injectable()
export class ProposalService {
  constructor(
    @InjectModel(Proposal.name)
    private readonly proposalModel: Model<ProposalDocument>,

    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    private readonly notificationService: NotificationService,
  ) {}

  async createProposal(authUser: AuthUser, projectId: string, data: Proposal) {
    const { price, durationDays, coverLetter } = data;

    if (!projectId || !price || !durationDays || !coverLetter) {
      throw new BadRequestException('All fields are required');
    }

    if (price < 0) {
      throw new BadRequestException('Invalid price');
    }

    if (durationDays < 1) {
      throw new BadRequestException('Invalid duration days');
    }

    const project = await this.projectModel.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.clientId === authUser._id) {
      throw new BadRequestException('You cannot bid on your own project');
    }

    const proposal = await this.proposalModel.create({
      projectId: projectId,
      freelancerId: authUser._id,
      price,
      durationDays,
      coverLetter,
      status: ProposalStatus.PENDING,
    });

    await this.notificationService.createNotification({
      receiverId: project.clientId,
      senderId: authUser._id,
      type: NotificationType.PROPOSAL,
      targetId: proposal._id.toString(),
      isRead: false,
    });

    return {
      success: 'Proposal created successfully',
      proposal,
    };
  }

  async getProjectProposals(projectId: string) {
    const proposals = await this.proposalModel
      .find({ projectId })
      .sort({ createdAt: -1 })
      .populate('freelancerId', 'fullname avatar email')
      .lean();

    return proposals;
  }

  async getProposalsByFreelancer(freelancerId: string) {
    const proposals = await this.proposalModel
      .find({ freelancerId })
      .sort({ createdAt: -1 })
      .lean();

    return {
      count: proposals.length,
      proposals,
    };
  }

  async updateProposalStatus(
    authUser: AuthUser,
    proposalId: string,
    status: ProposalStatus,
  ) {
    if (authUser.role !== UserRole.CLIENT && authUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Not allowed');
    }
    const proposal = await this.proposalModel.findById(proposalId);

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    const project = await this.projectModel.findById(proposal.projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isOwner = project.clientId.toString() === authUser._id.toString();

    const isAdmin = authUser.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Not allowed');
    }

    if (!Object.values(ProposalStatus).includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    if (proposal.status === ProposalStatus.ACCEPTED) {
      throw new BadRequestException('Proposal already accepted');
    }

    const updatedProposal = await this.proposalModel.findByIdAndUpdate(
      proposalId,
      { status },
      { new: true },
    );

    if (status === ProposalStatus.ACCEPTED) {
      await this.projectModel.findByIdAndUpdate(project._id, {
        status: ProjectStatus.IN_PROGRESS,
      });

      await this.proposalModel.updateMany(
        {
          projectId: proposal.projectId,
          _id: { $ne: proposal._id },
        },
        {
          status: ProposalStatus.REJECTED,
        },
      );
    }

    return {
      success: 'Proposal updated successfully',
      proposal: updatedProposal,
    };
  }

  async deleteProposal(authUser: AuthUser, proposalId: string) {
    if (
      authUser.role !== UserRole.FREELANCER &&
      authUser.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException('Not allowed');
    }
    const proposal = await this.proposalModel.findById(proposalId);

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    const isOwner = proposal.freelancerId === authUser._id;

    const isAdmin = authUser.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Not allowed');
    }

    await this.proposalModel.findByIdAndDelete(proposalId);

    return {
      success: 'Proposal deleted successfully',
    };
  }
}
