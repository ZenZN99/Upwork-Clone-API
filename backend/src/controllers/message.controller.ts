import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';
import { Message } from 'src/schemas/message.schema';
import { MessageService } from 'src/services/message.service';
import type { RequestWithUser } from 'src/types/express';

@Controller('/api/message')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send/:contractId')
  @UseInterceptors(FileInterceptor('image'))
  sendMessage(
    @Req() req: RequestWithUser,
    @Param('contractId') contractId: string,
    @Body() data: Message,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.messageService.sendMessage(
      req.user._id,
      contractId,
      data,
      file,
    );
  }

  @Get('chat/:contractId/:otherUserId')
  getChatMessages(
    @Req() req: RequestWithUser,
    @Param('contractId') contractId: string,
    @Param('otherUserId') otherUserId: string,
  ) {
    return this.messageService.getChatMessages(
      req.user._id,
      contractId,
      otherUserId,
    );
  }

  @Delete('delete/:messageId')
  deleteMessage(
    @Req() req: RequestWithUser,
    @Param('messageId') messageId: string,
  ) {
    return this.messageService.deleteMessage(req.user._id, messageId);
  }

  @Put('read/:senderId/:contractId')
  markMessageAsRead(
    @Req() req: RequestWithUser,
    @Param('senderId') senderId: string,
    @Param('contractId') contractId: string,
  ) {
    return this.messageService.markMessageAsRead(
      req.user._id,
      senderId,
      contractId,
    );
  }
}
