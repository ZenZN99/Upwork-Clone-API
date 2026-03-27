import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from 'src/enums/user.enum';
import { ContractStatus } from 'src/enums/contract.enum';
import { Review, ReviewDocument } from 'src/schemas/review.schema';
import { Contract, ContractDocument } from 'src/schemas/contract.schema';
import { AuthUser } from 'src/types/auth-user.interface';
import { NotificationService } from './notification.service';
import { NotificationType } from 'src/enums/notification.enum';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,

    @InjectModel(Contract.name)
    private readonly contractModel: Model<ContractDocument>,
    private readonly notificationService: NotificationService,
  ) {}

  async createReview(authUser: AuthUser, data: Review) {
    const {
      contractId,
      professionalism,
      communication,
      quality,
      expertise,
      delivery,
      rehire,
      comment,
      note,
    } = data;

    if (authUser.role !== UserRole.CLIENT) {
      throw new ForbiddenException('Only client can review');
    }

    if (
      !contractId ||
      !professionalism ||
      !communication ||
      !quality ||
      !expertise ||
      !delivery ||
      !rehire
    ) {
      throw new BadRequestException('All rating fields are required');
    }

    const contract = await this.contractModel.findById(contractId);

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.clientId !== authUser._id) {
      throw new ForbiddenException('Not allowed');
    }

    if (contract.status !== ContractStatus.COMPLETED) {
      throw new BadRequestException(
        'You can only review after project completion',
      );
    }

    const existingReview = await this.reviewModel.findOne({ contractId });

    if (existingReview) {
      throw new BadRequestException('Review already exists');
    }

    const averageRating =
      (professionalism +
        communication +
        quality +
        expertise +
        delivery +
        rehire) /
      6;

    const review = await this.reviewModel.create({
      reviewerId: authUser._id,
      revieweeId: contract.freelancerId,
      contractId: contract._id.toString(),
      projectId: contract.projectId,
      professionalism,
      communication,
      quality,
      expertise,
      delivery,
      rehire,
      averageRating,
      comment,
      note,
    });

    await this.notificationService.createNotification({
      receiverId: contract.freelancerId,
      senderId: authUser._id,
      type: NotificationType.REVIEW,
      targetId: review._id.toString(),
      isRead: false,
    });

    return {
      success: 'Thank you for your rating',
      review,
    };
  }

  async getFreelancerReviews(freelancerId: string) {
    const reviews = await this.reviewModel
      .find({ revieweeId: freelancerId })
      .sort({ createdAt: -1 })
      .populate('reviewerId', 'fullname avatar email')
      .lean();

    return {
      count: reviews.length,
      reviews,
    };
  }

  async getClientReviews(clientId: string) {
    const reviews = await this.reviewModel
      .find({ reviewerId: clientId })
      .sort({ createdAt: -1 })
      .lean();

    return reviews;
  }

  async getReviewById(reviewId: string) {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async deleteReview(reviewId: string) {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewModel.findByIdAndDelete(reviewId);

    return {
      success: 'Review deleted successfully',
    };
  }
}
