import { ReviewModel } from '../reviews/reviews.model';
import { CourseModel } from './course.model';

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
  }).populate('createdBy', '-password -isDeleted -createdAt -updatedAt -__v');

  const bestCourse = {
    course: bestCourseDetails,
    averageRating: bestCourseData[0].averageRating,
    reviewCount: bestCourseData[0].totalReview,
  };

  return bestCourse;
};

export const courseServices = {
  getBestCourseFromDB,
};
