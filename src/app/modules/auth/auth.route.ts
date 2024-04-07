import express from 'express';
import { authValidations } from './auth.validation';
import { authControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// call controller function to create a new course
router.post(
  '/register',
  validateRequest(authValidations.userRegisterValidationSchema),
  authControllers.registerUser,
);

router.post(
  '/login',
  validateRequest(authValidations.userLoginValidationSchema),
  authControllers.loginUser,
);

export const authRoutes = router;
