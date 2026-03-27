import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { ClientGuard } from 'src/guards/client.guard';
import { Review } from 'src/schemas/review.schema';
import { ReviewService } from 'src/services/review.service';
import type { RequestWithUser } from 'src/types/express';

@Controller('/api/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create')
  @UseGuards(AuthGuard, ClientGuard)
  createReview(@Req() req: RequestWithUser, @Body() data: Review) {
    return this.reviewService.createReview(req.user, data);
  }

  @Get('freelancer')
  @UseGuards(AuthGuard)
  getFreelancerReviews(@Req() req: RequestWithUser) {
    return this.reviewService.getFreelancerReviews(req.user._id);
  }

  @Get('client')
  @UseGuards(AuthGuard)
  getClientReviews(@Req() req: RequestWithUser) {
    return this.reviewService.getClientReviews(req.user._id);
  }

  @Get('review/:reviewId')
  @UseGuards(AuthGuard)
  getReviewById(@Param('reviewId') reviewId: string) {
    return this.reviewService.getReviewById(reviewId);
  }

  @Delete('delete/:reviewId')
  @UseGuards(AuthGuard, AdminGuard)
  deleteReview(@Param('reviewId') reviewId: string) {
    return this.reviewService.deleteReview(reviewId);
  }
}
