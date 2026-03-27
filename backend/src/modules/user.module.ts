import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from 'src/controllers/user.controller';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserService } from 'src/services/user.service';
import { TokenModule } from 'src/token/token.module';
import { ClientProfile, ClientProfileSchema } from 'src/schemas/client-profile.schema';
import { FreelancerProfile, FreelancerProfileSchema } from 'src/schemas/freelancer-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: ClientProfile.name, schema: ClientProfileSchema }]),
    MongooseModule.forFeature([{ name: FreelancerProfile.name, schema: FreelancerProfileSchema }]),
    TokenModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
