import { TReview } from './reviews.interface';
import { ReviewModel } from './reviews.model';

const createReviewIntoDB = async (review: TReview) => {
  const result = await ReviewModel.create(review);

  const sendData = await ReviewModel.findOne(result._id, { __v: 0 }).populate(
    'createdBy',
    '-passwordChangeTrack -password -isDeleted -createdAt -updatedAt -__v',
  );
  return sendData;
};

export const reviewServices = {
  createReviewIntoDB,
};
