import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewController } from 'src/controllers/review.controller';
import { Contract, ContractSchema } from 'src/schemas/contract.schema';
import { Review, ReviewSchema } from 'src/schemas/review.schema';
import { ReviewService } from 'src/services/review.service';
import { TokenModule } from 'src/token/token.module';
import { NotificationModule } from './notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
    ]),
    TokenModule,
    NotificationModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
