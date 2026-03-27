import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageController } from 'src/controllers/message.controller';
import { Contract, ContractSchema } from 'src/schemas/contract.schema';
import { Message, MessageSchema } from 'src/schemas/message.schema';
import { MessageService } from 'src/services/message.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
    ]),
    TokenModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
