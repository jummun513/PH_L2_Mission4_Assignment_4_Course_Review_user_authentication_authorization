import { Schema, model } from 'mongoose';
import { TReview } from './reviews.interface';

const reviewSchema = new Schema<TReview>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Course Id is required.'],
      ref: 'course',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required.'],
    },
    review: {
      type: String,
      required: [true, 'Review is required.'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: [true, 'CreatedBy Id is required!'],
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export const ReviewModel = model<TReview>('Review', reviewSchema);
