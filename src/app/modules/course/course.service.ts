import { ReviewModel } from '../reviews/reviews.model';
import { TCourse } from './course.interface';
import { CourseModel } from './course.model';

const createCourseIntoDB = async (course: TCourse) => {
  const result = await CourseModel.create(course);

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

const getBestCourseFromDB = async () => {
  const bestCourseData = await ReviewModel.aggregate([
    {
      $group: {
        _id: '$courseId',
        averageRating: { $avg: '$rating' },
        totalReview: { $sum: 1 },
      },
    },
    { $sort: { averageRating: -1 } },
    { $limit: 1 },
  ]);

  const bestCourseDetails = await CourseModel.findById(bestCourseData[0]._id, {
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });

  const bestCourse = {
    course: bestCourseDetails,
    averageRating: bestCourseData[0].averageRating,
    reviewCount: bestCourseData[0].totalReview,
  };

  return bestCourse;
};

export const courseServices = {
  createCourseIntoDB,
  getBestCourseFromDB,
};
