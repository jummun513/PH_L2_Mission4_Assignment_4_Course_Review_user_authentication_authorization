import express from 'express';
import { authValidations } from './auth.validation';
import { authControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './auth.constant';

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

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(authValidations.passwordChangeValidationSchema),
  authControllers.changePassword,
);

export const authRoutes = router;
