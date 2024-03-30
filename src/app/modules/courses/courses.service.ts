import mongoose from 'mongoose';
import { TCourse } from '../course/course.interface';
import { CourseModel } from '../course/course.model';
import { ReviewModel } from '../reviews/reviews.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const getExpectedCoursesFromDB = async (query: Record<string, unknown>) => {
  const filterQueryObj = { ...query };

  // const courseSearchableFields = ['title', 'instructor', 'provider'];
  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }
  // const searchQuery = CourseModel.find({
  //   $or: courseSearchableFields.map(field => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });

  //   for filtering
  const excludeFields = [
    'searchTerm',
    'minPrice',
    'maxPrice',
    'tags',
    'startDate',
    'endDate',
    'level',
    'sortBy',
    'sortOrder',
    'page',
    'limit',
  ];
  excludeFields.forEach(el => delete filterQueryObj[el]);

  // filtering between a price range
  let priceRangeQueryObj = { ...filterQueryObj };
  if (query?.maxPrice && query?.minPrice) {
    priceRangeQueryObj = {
      price: {
        $gte: parseFloat(query.minPrice as string),
        $lte: parseFloat(query.maxPrice as string),
      },
      ...filterQueryObj,
    };
  } else if (query?.maxPrice) {
    priceRangeQueryObj = {
      price: { $lte: parseFloat(query.maxPrice as string) },
      ...filterQueryObj,
    };
  } else if (query?.minPrice) {
    priceRangeQueryObj = {
      price: { $gte: parseFloat(query.minPrice as string) },
      ...filterQueryObj,
    };
  }

  //   filtering basis on tags name
  let tagQueryObj = { ...priceRangeQueryObj };
  if (query?.tags) {
    tagQueryObj = { 'tags.name': query.tags, ...priceRangeQueryObj };
  }

  //   filtering basis on date range
  let dateRangeQueryObj = { ...tagQueryObj };
  if (query?.startDate) {
    dateRangeQueryObj = {
      startDate: { $gte: query.startDate },
      ...tagQueryObj,
    };
  }
  if (query?.endDate) {
    dateRangeQueryObj = {
      endDate: { $lte: query.endDate },
      ...tagQueryObj,
    };
  }
  if (query?.startDate && query?.endDate) {
    dateRangeQueryObj = {
      startDate: { $gte: query.startDate },
      endDate: { $lte: query.endDate },
      ...tagQueryObj,
    };
  }

  //   filtering object basis on level
  let levelQueryObj = { ...dateRangeQueryObj };
  if (query?.level) {
    levelQueryObj = {
      'details.level': query.level,
      ...dateRangeQueryObj,
    };
  }

  // sorting object
  const sortOptions: [string, 'asc' | 'desc'][] = [];
  if (query?.sortBy && query?.sortOrder) {
    sortOptions.push([
      query.sortBy as string,
      query.sortOrder as 'asc' | 'desc',
    ]);
  } else if (query?.sortBy) {
    sortOptions.push([query.sortBy as string, 'desc']);
  } else if (query?.sortOrder) {
    sortOptions.push(['createdAt', query.sortOrder as 'asc' | 'desc']);
  }

  // Perform the search query
  const sortQuery = CourseModel.find(levelQueryObj, {
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  }).sort(sortOptions);

  //pagination and limiting
  let page = 1;
  let limit = 10;
  let skip = 0;
  if (query?.limit) {
    limit = Number(query?.limit);
  }
  if (query?.page) {
    page = Number(query?.page);
    skip = (page - 1) * limit;
  }
  const paginateQuery = sortQuery.skip(skip);
  const result = await paginateQuery.limit(limit);

  const count = await CourseModel.countDocuments();

  return { data: result, count: count };
};

const getSingleCourseWithReviewFromDB = async (courseId: string) => {
  const result = await CourseModel.findOne(
    { _id: courseId },
    { updatedAt: 0, __v: 0 },
  );
  const reviews = await ReviewModel.find({ courseId: courseId });
  return { course: result, reviews: reviews };
};

const updateCourseIntoDB = async (courseId: string, data: Partial<TCourse>) => {
  const { tags, details, ...rest } = data;
  const newData: Record<string, unknown> = { ...rest };

  const findData = await CourseModel.findOne(
    { _id: courseId },
    { startDate: 1, endDate: 1, _id: 0 },
  );

  if (!findData) {
    throw new AppError(StatusCodes.NOT_FOUND, `${courseId} is not available.`);
  }

  if (rest?.startDate && rest?.endDate) {
    if (
      !(new Date(rest?.endDate).getTime() > new Date(rest?.startDate).getTime())
    ) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'End date must be greater than start date',
      );
    } else {
      const durationInWeeks = Math.ceil(
        (new Date(rest?.endDate).getTime() -
          new Date(rest?.startDate).getTime()) /
          (24 * 3600 * 1000 * 7),
      );
      newData.durationInWeeks = durationInWeeks;
    }
  } else if (rest?.startDate && !rest?.endDate && findData.endDate) {
    if (
      !(
        new Date(findData.endDate).getTime() >
        new Date(rest?.startDate).getTime()
      )
    ) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'End date must be greater than start date',
      );
    } else {
      const durationInWeeks = Math.ceil(
        (new Date(findData.endDate).getTime() -
          new Date(rest?.startDate).getTime()) /
          (24 * 3600 * 1000 * 7),
      );
      newData.durationInWeeks = durationInWeeks;
    }
  } else if (rest?.endDate && !rest?.startDate && findData.startDate) {
    if (
      !(
        new Date(rest?.endDate).getTime() >
        new Date(findData.startDate).getTime()
      )
    ) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'End date must be greater than start date',
      );
    } else {
      const durationInWeeks = Math.ceil(
        (new Date(rest?.endDate).getTime() -
          new Date(findData.startDate).getTime()) /
          (24 * 3600 * 1000 * 7),
      );
      newData.durationInWeeks = durationInWeeks;
    }
  }

  if (details && Object.keys(details).length) {
    for (const [key, value] of Object.entries(details)) {
      newData[`details.${key}`] = value;
    }
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await CourseModel.findOneAndUpdate(
      {
        _id: courseId,
      },
      newData,
      { new: true, runValidators: true, session },
    );

    if (tags && tags.length > 0) {
      // delete tags
      const deleteTags = tags
        .filter(d => d.name && d.isDeleted)
        .map(d => d.name);
      await CourseModel.findOneAndUpdate(
        { _id: courseId },
        {
          $pull: { tags: { name: { $in: deleteTags } } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      // add tags
      const addTags = tags.filter(d => d.name && !d.isDeleted);
      await CourseModel.findOneAndUpdate(
        { _id: courseId },
        {
          $addToSet: { tags: { $each: addTags } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
    }
    await session.commitTransaction();
    await session.endSession();

    const result = await CourseModel.findById(courseId);
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course!');
  }
};

export const coursesServices = {
  getExpectedCoursesFromDB,
  getSingleCourseWithReviewFromDB,
  updateCourseIntoDB,
};
