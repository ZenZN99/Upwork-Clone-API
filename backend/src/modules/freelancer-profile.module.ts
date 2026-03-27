import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FreelancerProfileController } from 'src/controllers/freelancer-profile.controller';
import {
  FreelancerProfile,
  FreelancerProfileSchema,
} from 'src/schemas/freelancer-profile.schema';
import { FreelancerProfileService } from 'src/services/freelancer-profile.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FreelancerProfile.name, schema: FreelancerProfileSchema },
    ]),
    TokenModule,
  ],
  controllers: [FreelancerProfileController],
  providers: [FreelancerProfileService],
})
export class FreelancerModule {}
