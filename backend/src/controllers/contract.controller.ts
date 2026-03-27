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
import { AuthGuard } from 'src/guards/auth.guard';
import { ClientGuard } from 'src/guards/client.guard';
import { Contract } from 'src/schemas/contract.schema';
import { ContractService } from 'src/services/contract.service';
import type { RequestWithUser } from 'src/types/express';

@Controller('/api/contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post('create/:proposalId')
  @UseGuards(AuthGuard, ClientGuard)
  createContract(
    @Req() req: RequestWithUser,
    @Param('proposalId') proposalId: string,
    @Body() data: Contract,
  ) {
    return this.contractService.createContract(req.user._id, proposalId, data);
  }

  @Put('update/:contractId')
  @UseGuards(AuthGuard)
  updateContract(
    @Req() req: RequestWithUser,
    @Param('contractId') contractId: string,
    @Body() data: Contract,
  ) {
    return this.contractService.updateContract(req.user, contractId, data);
  }

  @Get('contracts')
  @UseGuards(AuthGuard)
  getAllContracts() {
    return this.contractService.getAllContracts();
  }

  @Get(':contractId')
  @UseGuards(AuthGuard)
  getContractById(@Param('contractId') contractId: string) {
    return this.contractService.getContractById(contractId);
  }

  @Put('complete/:contractId')
  @UseGuards(AuthGuard)
  completeContract(
    @Req() req: RequestWithUser,
    @Param('contractId') contractId: string,
  ) {
    return this.contractService.completeContract(req.user, contractId);
  }

  @Put('cancel/:contractId')
  @UseGuards(AuthGuard)
  cancelContract(
    @Req() req: RequestWithUser,
    @Param('contractId') contractId: string,
  ) {
    return this.contractService.cancelContract(req.user, contractId);
  }

  @Delete('delete/:contractId')
  @UseGuards(AuthGuard)
  deleteContract(
    @Req() req: RequestWithUser,
    @Param('contractId') contractId: string,
  ) {
    return this.contractService.deleteContract(req.user, contractId);
  }
}
