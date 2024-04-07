import express from 'express';
import { categoryControllers } from './category.controller';
import { categoryValidations } from './category.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';

const router = express.Router();

// call controller function to create a new category
router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(categoryValidations.categoryCreateValidationSchema),
  categoryControllers.createCategory,
);

router.get('/', categoryControllers.getAllCategories);

export const categoryRoutes = router;
