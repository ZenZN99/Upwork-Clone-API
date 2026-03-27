import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/schemas/user.schema';
import { UserService } from 'src/services/user.service';
import type { RequestWithUser } from 'src/types/express';
import type { Response } from 'express';
@Controller('/api/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  register(@Body() data: User, @Res({ passthrough: true }) res: Response) {
    return this.userService.signup(data, res);
  }

  @Post('login')
  login(@Body() data: User, @Res({ passthrough: true }) res: Response) {
    return this.userService.login(data, res);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.userService.logout(res);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: RequestWithUser) {
    return this.userService.me(req.user._id);
  }

  @Put('update/avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  updateAvatar(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(req.user, file);
  }

  @Get('users')
  @UseGuards(AuthGuard)
  getAllUsers(@Req() req: RequestWithUser) {
    return this.userService.getAllUsers(req.user._id);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Delete('user/:id')
  @UseGuards(AuthGuard, AdminGuard)
  deleteUserById(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }
}
