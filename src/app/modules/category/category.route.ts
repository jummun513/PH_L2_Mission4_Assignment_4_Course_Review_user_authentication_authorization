import express from 'express';
import { categoryControllers } from './category.controller';
import { categoryValidations } from './category.validation';
import validateRequest from '../../utilities/validateRequest';

const router = express.Router();

// call controller function to create a new category
router.post(
  '/',
  validateRequest(categoryValidations.categoryCreateValidationSchema),
  categoryControllers.createCategory,
);

router.get('/', categoryControllers.getAllCategories);

export const categoryRoutes = router;
