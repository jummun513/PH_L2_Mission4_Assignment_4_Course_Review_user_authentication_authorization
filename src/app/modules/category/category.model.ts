import { Schema, model } from 'mongoose';
import { TCategory } from './category.interface';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const categorySchema = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      unique: true,
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

// check name is exist or not before save data
categorySchema.pre('save', async function (next) {
  const isNameExist = await CategoryModel.findOne({ name: this.name });
  if (isNameExist) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `${this.name} is already existed.`,
    );
  }
  next();
});

export const CategoryModel = model<TCategory>('Categories', categorySchema);
