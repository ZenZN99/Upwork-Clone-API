import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from 'src/enums/user.enum';
import { User, UserDocument } from 'src/schemas/user.schema';
import validator from 'validator';
import { TokenService } from 'src/token/token.service';
import cloudinary, { uploadToCloudinary } from 'src/cloudinary/cloudinary';
import { AuthUser } from 'src/types/auth-user.interface';
import { Response } from 'express';
import {
  ClientProfile,
  ClientProfileDocument,
} from 'src/schemas/client-profile.schema';
import {
  FreelancerProfile,
  FreelancerProfileDocument,
} from 'src/schemas/freelancer-profile.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ClientProfile.name)
    private readonly clientProfileModel: Model<ClientProfileDocument>,
    @InjectModel(FreelancerProfile.name)
    private readonly freelancerProfileModel: Model<FreelancerProfileDocument>,
    private readonly tokenService: TokenService,
  ) {}

  async signup(data: User, res: Response) {
    const { fullname, email, password, role } = data;

    const isAdmin =
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD;

    switch (true) {
      case !fullname || !email || !password || !role:
        throw new BadRequestException('All fields are required');
      case !validator.isEmail(email):
        throw new BadRequestException('Invalid Email address');
      case password.length < 8:
        throw new BadRequestException(
          'The password must be at least 8 characters long',
        );
      case password.length > 40:
        throw new BadRequestException(
          'The maximum password length is 40 characters',
        );

      case !isAdmin && !role:
        throw new BadRequestException('Role is required');

      case !isAdmin &&
        ![UserRole.CLIENT, UserRole.FREELANCER].includes(role as UserRole):
        throw new BadRequestException('Invalid role');
    }

    const existEmail = await this.userModel.findOne({ email });
    if (existEmail) {
      throw new BadRequestException(
        'Please check your information and try again',
      );
    }

    const hahed = await bcrypt.hash(password, 12);

    const newUser = await this.userModel.create({
      fullname,
      email,
      password: hahed,
      avatar:
        'https://res.cloudinary.com/dgagbheuj/image/upload/v1763194734/avatar-default-image_yc4xy4.jpg',
      role: isAdmin ? UserRole.ADMIN : role,
      balance: 0,
      frozenBalance: 0,
    });

    if (newUser.role === UserRole.FREELANCER) {
      await this.freelancerProfileModel.create({
        freelancerId: newUser._id.toString(),
      });
    }

    if (newUser.role === UserRole.CLIENT) {
      await this.clientProfileModel.create({
        clientId: newUser._id.toString(),
      });
    }

    const token = this.tokenService.generateToken({
      _id: newUser._id.toString(),
      role: newUser.role,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    return {
      success: 'Account created successfully',
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
        balance: newUser.balance,
        frozenBalance: newUser.frozenBalance,
      },
    };
  }

  async login(data: User, res: Response) {
    const { email, password } = data;
    if (!email || !password) {
      throw new BadRequestException('All fields are required!');
    }
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Incorrect password or email address');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect password or email address');
    }

    const token = this.tokenService.generateToken({
      _id: user._id.toString(),
      role: user.role,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    return {
      success: 'Logged in successfully',
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        balance: user.balance,
        frozenBalance: user.frozenBalance,
      },
    };
  }

  async logout(res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return {
      success: 'Logged out successfully',
    };
  }

  async me(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      balance: user.balance,
      frozenBalance: user.frozenBalance,
    };
  }
  async updateAvatar(authUser: AuthUser, file?: Express.Multer.File) {
    const user = await this.userModel.findById(authUser._id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!file) {
      throw new BadRequestException('Avatar file is required');
    }

    const extractPublicId = (url: string): string => {
      const parts = url.split('/');
      const file = parts.pop()!;
      return file.split('.')[0];
    };

    if (user.avatar?.includes('res.cloudinary.com')) {
      const oldId = extractPublicId(user.avatar);
      await cloudinary.v2.uploader.destroy(`users/avatars/${oldId}`);
    }

    const avatarUpload = await uploadToCloudinary(file, 'users/avatars');

    await user.updateOne({
      avatar: avatarUpload.secure_url,
    });

    return {
      success: 'Profile updated successfully',
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }
  async getAllUsers(userId: string) {
    const users = await this.userModel
      .find({ _id: { $ne: userId } })
      .sort({ createdAt: -1 })
      .lean();

    return users;
  }
  async getUserById(id: string) {
    const user = await this.userModel.findById(id).lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deleteUserById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const extractPublicId = (url: string): string => {
      const parts = url.split('/');
      const file = parts.pop()!;
      return file.split('.')[0];
    };

    try {
      if (
        user.avatar?.includes('res.cloudinary.com') &&
        user.avatar.includes('avatar-default-image')
      ) {
        const oldAvatarId = extractPublicId(user.avatar);
        await cloudinary.v2.uploader.destroy(`users/avatars/${oldAvatarId}`);
      }
    } catch (err) {
      console.warn('Failed to delete user images:', err.message);
    }

    await user.deleteOne();

    return { success: 'User deleted successfully' };
  }
}
