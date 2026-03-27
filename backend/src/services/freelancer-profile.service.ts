import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobTitle, Skills } from 'src/enums/freelancer-profile.enum';
import {
  FreelancerProfile,
  FreelancerProfileDocument,
} from 'src/schemas/freelancer-profile.schema';
import { AuthUser } from 'src/types/auth-user.interface';

@Injectable()
export class FreelancerProfileService {
  constructor(
    @InjectModel(FreelancerProfile.name)
    private readonly freelancerProfileModel: Model<FreelancerProfileDocument>,
  ) {}

  async getMyProfile(freelancerId: string) {
    const profile = await this.freelancerProfileModel.findOne({ freelancerId });
    if (!profile) {
      throw new NotFoundException('Profile not found!');
    }
    return profile;
  }

  async updateProfile(authUser: AuthUser, data: Partial<FreelancerProfile>) {
    const { jobTitle, bio, skills, hourlyRate } = data;

    const profile = await this.freelancerProfileModel.findOne({
      freelancerId: authUser._id,
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (jobTitle !== undefined) {
      const isValidJobTitle = Object.values(JobTitle).includes(jobTitle);
      if (!isValidJobTitle) {
        throw new BadRequestException('Invalid job title');
      }
    }

    let validatedSkills = skills;

    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        throw new BadRequestException('Skills must be an array');
      }

      if (skills.length === 0) {
        validatedSkills = [Skills.NO_SKILLS];
      } else {
        const invalidSkill = skills.find(
          (skill) => !Object.values(Skills).includes(skill),
        );

        if (invalidSkill) {
          throw new BadRequestException(`Invalid skill: ${invalidSkill}`);
        }

        if (skills.length > 10) {
          throw new BadRequestException('Maximum skills allowed is 10');
        }

        if (skills.includes(Skills.NO_SKILLS) && skills.length > 1) {
          throw new BadRequestException(
            '"No Skills" must be the only value when selected',
          );
        }
      }
    }

    if (hourlyRate !== undefined) {
      if (typeof hourlyRate !== 'number' || hourlyRate < 0) {
        throw new BadRequestException('Invalid hourly rate');
      }
    }

    const updateData: Partial<FreelancerProfile> = {};

    if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
    if (bio !== undefined) updateData.bio = bio;
    if (skills !== undefined) updateData.skills = validatedSkills;
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No data provided to update');
    }

    const updatedProfile = await this.freelancerProfileModel.findByIdAndUpdate(
      profile._id,
      updateData,
      { new: true },
    );

    return {
      success: 'Profile updated successfully',
      profile: updatedProfile,
    };
  }
}
