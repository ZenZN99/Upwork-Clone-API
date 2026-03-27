import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ClientGuard } from 'src/guards/client.guard';
import { ClientProfile } from 'src/schemas/client-profile.schema';
import { ClientProfileService } from 'src/services/client-profile.service';
import type { RequestWithUser } from 'src/types/express';

@Controller('/api/client')
export class ClientProfileController {
  constructor(private readonly clientProfileService: ClientProfileService) {}

  @Get('profile')
  @UseGuards(AuthGuard)
  getMyProfile(@Req() req: RequestWithUser) {
    return this.clientProfileService.getMyProfile(req.user._id);
  }

  @Put('update/profile')
  @UseGuards(ClientGuard)
  updateProfile(@Req() req: RequestWithUser, @Body() data: ClientProfile) {
    return this.clientProfileService.updateProfile(req.user._id, data);
  }
}
