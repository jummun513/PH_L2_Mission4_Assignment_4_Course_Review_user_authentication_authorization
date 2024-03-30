import { Schema, model } from 'mongoose';
import { TCourse, TDetail, TTag } from './course.interface';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const tagSchema = new Schema<TTag>(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required.'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const detailSchema = new Schema<TDetail>(
  {
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: [true, 'Level is required.'],
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
    },
  },
  { _id: false },
);

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      unique: true,
    },
    instructor: {
      type: String,
      required: [true, 'Instructor is required.'],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: [true, 'categoryId is required.'],
      ref: 'categories',
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
    },
    tags: [tagSchema],
    startDate: {
      type: String,
      required: [true, 'Start Date is required.'],
    },
    endDate: {
      type: String,
      required: [true, 'End Date is required.'],
    },
    language: {
      type: String,
      required: [true, 'Language is required.'],
    },
    provider: {
      type: String,
      required: [true, 'Provider is required.'],
    },
    durationInWeeks: {
      type: Number,
      required: false,
    },
    details: detailSchema,
  },
  {
    timestamps: true,
  },
);

// check title is exist or not before save data. Also save durationInWeeks
courseSchema.pre('save', async function (next) {
  if (
    !(new Date(this.endDate).getTime() > new Date(this.startDate).getTime())
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'End date must be greater than start date',
    );
  } else {
    const durationInWeeks = Math.ceil(
      (new Date(this.endDate).getTime() - new Date(this.startDate).getTime()) /
        (24 * 3600 * 1000 * 7),
    );
    this.durationInWeeks = durationInWeeks;
  }

  const isTitleExist = await CourseModel.findOne({ title: this.title });
  if (isTitleExist) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `${this.title} is already existed.`,
    );
  }
  next();
});

export const CourseModel = model<TCourse>('course', courseSchema);
