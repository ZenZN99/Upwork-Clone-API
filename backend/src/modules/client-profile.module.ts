import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientProfileController } from 'src/controllers/client-profile.controller';
import {
  ClientProfile,
  ClientProfileSchema,
} from 'src/schemas/client-profile.schema';
import { ClientProfileService } from 'src/services/client-profile.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClientProfile.name, schema: ClientProfileSchema },
    ]),
    TokenModule,
  ],
  controllers: [ClientProfileController],
  providers: [ClientProfileService],
})
export class ClientProfileModule {}
