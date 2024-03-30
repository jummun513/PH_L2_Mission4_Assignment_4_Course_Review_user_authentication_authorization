import { TReview } from './reviews.interface';
import { ReviewModel } from './reviews.model';

const createReviewIntoDB = async (review: TReview) => {
  const result = await ReviewModel.create(review);

  // send selective data to frontend
  const sendData = result.toObject({
    virtuals: false,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.__v;
    },
  });
  return sendData;
};

export const reviewServices = {
  createReviewIntoDB,
};
