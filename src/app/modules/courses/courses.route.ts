import express from 'express';
import { coursesControllers } from './courses.controller';
import { courseValidations } from '../course/course.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';

const router = express.Router();

// call controller function to create a new course
router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(courseValidations.courseCreateValidationSchema),
  coursesControllers.createCourse,
);
router.get('/', coursesControllers.getExpectedCourses);
router.get('/:courseId/reviews', coursesControllers.getSingleCourseWithReview);
router.put(
  '/:courseId',
  auth(USER_ROLE.admin),
  validateRequest(courseValidations.courseUpdateValidationSchema),
  coursesControllers.updateCourse,
);

export const coursesRoutes = router;
