import express from 'express';
import { reviewValidations } from './reviews.validation';
import { reviewControllers } from './reviews.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';

const router = express.Router();

// call controller function to create a new review
router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(reviewValidations.reviewCreateValidationSchema),
  reviewControllers.createReview,
);

export const reviewRoutes = router;
