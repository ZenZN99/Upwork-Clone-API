import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { TransactionService } from 'src/services/transaction.service';
import type { RequestWithUser } from 'src/types/express';

@Controller('/api/transaction')
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('freeze/:proposalId')
  freezeBalanceByProposal(@Param('proposalId') proposalId: string) {
    return this.transactionService.freezeBalanceByProposal(proposalId);
  }

  @Post('releas/:proposalId')
  releaseFrozenBalanceByProposal(@Param('proposalId') proposalId: string) {
    return this.transactionService.releaseFrozenBalanceByProposal(proposalId);
  }

  @Post('recharge')
  rechargeBalance(@Req() req: RequestWithUser, @Body() amount: number) {
    return this.transactionService.rechargeBalance(req.user._id, amount);
  }
}
