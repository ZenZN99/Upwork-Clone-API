export interface IReview {
  _id: string;

  reviewerId: string;
  revieweeId: string;
  contractId: string;
  projectId: string;

  professionalism: number;
  communication: number;
  quality: number;
  expertise: number;
  delivery: number;
  rehire: number;

  averageRating?: number;

  comment?: string;
  note?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
