import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user.module';
import { ReviewModule } from './modules/review.module';
import { ProposalModule } from './modules/proposal.module';
import { ProjectModule } from './modules/project.module';
import { NotificationModule } from './modules/notification.module';
import { MessageModule } from './modules/message.module';
import { FreelancerModule } from './modules/freelancer-profile.module';
import { ContractModule } from './modules/contract.module';
import { ClientProfileModule } from './modules/client-profile.module';
import { ChatGateway } from './gateways/chat.gateway';
import { NotificationGateway } from './gateways/notification.gateway';
import { TokenModule } from './token/token.module';
import { RedisModule } from './redis/redis.module';
import { TransactionModule } from './modules/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL as string),
    UserModule,
    ReviewModule,
    ProposalModule,
    ProjectModule,
    NotificationModule,
    MessageModule,
    FreelancerModule,
    ContractModule,
    ClientProfileModule,
    TokenModule,
    RedisModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, NotificationGateway],
})
export class AppModule {}
