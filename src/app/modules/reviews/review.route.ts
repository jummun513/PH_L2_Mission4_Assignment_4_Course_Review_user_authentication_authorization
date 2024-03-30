import express from 'express';
import validateRequest from '../../utilities/validateRequest';
import { reviewValidations } from './reviews.validation';
import { reviewControllers } from './reviews.controller';

const router = express.Router();

// call controller function to create a new review
router.post(
  '/',
  validateRequest(reviewValidations.reviewCreateValidationSchema),
  reviewControllers.createReview,
);

export const reviewRoutes = router;
