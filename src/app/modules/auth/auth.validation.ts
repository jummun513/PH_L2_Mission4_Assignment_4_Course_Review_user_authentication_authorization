import { z } from 'zod';

/*----------user registration validation schema------
------------------------------------------------*/
const userRegisterValidationSchema = z.object({
  username: z.string({
    required_error: 'User Name field is required!',
    invalid_type_error: 'User Name field allowed only string!',
  }),
  email: z
    .string({
      required_error: 'Email field is required!',
    })
    .email({ message: 'Invalid email address!' }),
  password: z
    .string({
      required_error: 'Password is required!',
    })
    .min(8, 'Password minimum length 8 characters!')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/,
      'Password should contain A-Z, a-z, 0-9, special characters(@$!%*#?&).',
    ),
  role: z.enum(['user', 'admin'], {
    required_error: 'Level field is required!',
    invalid_type_error: "Level field allowed only 'user', 'admin'",
  }),
});

/*----------user login validation schema------
------------------------------------------------*/
const userLoginValidationSchema = z.object({
  username: z.string({
    required_error: 'User Name field is required!',
    invalid_type_error: 'User Name field allowed only string!',
  }),
  password: z
    .string({
      required_error: 'Password is required!',
    })
    .min(8, 'Password minimum length 8 characters!')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/,
      'Password should contain A-Z, a-z, 0-9, special characters(@$!%*#?&).',
    ),
});

export const authValidations = {
  userRegisterValidationSchema,
  userLoginValidationSchema,
};
