import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyName } from 'src/enums/client-profile.enum';
import {
  ClientProfile,
  ClientProfileDocument,
} from 'src/schemas/client-profile.schema';

@Injectable()
export class ClientProfileService {
  constructor(
    @InjectModel(ClientProfile.name)
    private readonly clientProfileModel: Model<ClientProfileDocument>,
  ) {}

  async getMyProfile(clientId: string) {
    const profile = await this.clientProfileModel.findOne({ clientId });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }
  async updateProfile(clientId: string, data: Partial<ClientProfile>) {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException('No data provided to update');
    }

    const ALLOWED_CLIENT_PROFILE_UPDATE = {
      companyName: true,
      bio: true,
    } as const;

    const safeData: Partial<ClientProfile> = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) =>
          key in ALLOWED_CLIENT_PROFILE_UPDATE && value !== undefined,
      ),
    );

    if (Object.keys(safeData).length === 0) {
      throw new BadRequestException('No valid fields to update');
    }

    if (
      safeData.companyName !== undefined &&
      !Object.values(CompanyName).includes(safeData.companyName)
    ) {
      throw new BadRequestException('Invalid company name');
    }

    if (safeData.bio !== undefined && typeof safeData.bio !== 'string') {
      throw new BadRequestException('Bio must be a string');
    }

    const updatedProfile = await this.clientProfileModel.findOneAndUpdate(
      { clientId },
      { $set: safeData },
      { new: true },
    );

    if (!updatedProfile) {
      throw new NotFoundException('Profile not found');
    }

    return {
      success: 'Profile updated successfully',
      profile: updatedProfile,
    };
  }
}
