import express from 'express';
import { coursesControllers } from './courses.controller';
import validateRequest from '../../utilities/validateRequest';
import { courseValidations } from '../course/course.validation';

const router = express.Router();

// call controller function to create a new category
router.get('/', coursesControllers.getExpectedCourses);
router.get('/:courseId/reviews', coursesControllers.getSingleCourseWithReview);
router.put(
  '/:courseId',
  validateRequest(courseValidations.courseUpdateValidationSchema),
  coursesControllers.updateCourse,
);

export const coursesRoutes = router;
