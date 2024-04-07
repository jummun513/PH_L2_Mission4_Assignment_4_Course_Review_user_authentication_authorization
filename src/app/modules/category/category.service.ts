import { TCategory } from './category.interface';
import { CategoryModel } from './category.model';

const createCategoryIntoDB = async (category: TCategory) => {
  const result = await CategoryModel.create(category);

  // send selective data to frontend
  const sendData = result.toObject({
    virtuals: false,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret.__v;
    },
  });
  return sendData;
};

const getAllCategoriesFromDB = async () => {
  const result = await CategoryModel.find()
    .populate('createdBy', '-password -isDeleted -createdAt -updatedAt -__v')
    .select('-__v');
  return result;
};

export const categoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
};
