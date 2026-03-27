import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProposalStatus } from 'src/enums/proposal.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { FreelancerGuard } from 'src/guards/freelancer.guard';
import { Proposal } from 'src/schemas/proposal.schema';
import { ProposalService } from 'src/services/proposal.service';
import type { RequestWithUser } from 'src/types/express';

@Controller('/api/proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post('create/:projectId')
  @UseGuards(AuthGuard, FreelancerGuard)
  createProposal(
    @Req() req: RequestWithUser,
    @Param('projectId') projectId: string,
    @Body() data: Proposal,
  ) {
    return this.proposalService.createProposal(req.user, projectId, data);
  }

  @Get('proposals/:projectId')
  @UseGuards(AuthGuard)
  getProjectProposals(@Param('projectId') projectId: string) {
    return this.proposalService.getProjectProposals(projectId);
  }

  @Get('freelancer')
  @UseGuards(AuthGuard, FreelancerGuard)
  getProposalsByFreelancer(@Req() req: RequestWithUser) {
    return this.proposalService.getProposalsByFreelancer(req.user._id);
  }

  @Put('update/status/:proposalId')
  @UseGuards(AuthGuard)
  updateProposalStatus(
    @Req() req: RequestWithUser,
    @Param('proposalId') proposalId: string,
    @Body() status: ProposalStatus,
  ) {
    return this.proposalService.updateProposalStatus(
      req.user,
      proposalId,
      status,
    );
  }

  @Delete('delete/:proposalId')
  @UseGuards(AuthGuard)
  deleteProposal(
    @Req() req: RequestWithUser,
    @Param('proposalId') proposalId: string,
  ) {
    return this.proposalService.deleteProposal(req.user, proposalId);
  }
}
