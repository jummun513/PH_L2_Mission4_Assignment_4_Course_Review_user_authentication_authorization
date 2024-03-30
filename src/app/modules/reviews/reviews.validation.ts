import { z } from 'zod';

const reviewCreateValidationSchema = z.object({
  courseId: z.string({
    required_error: 'Course Id is required!',
    invalid_type_error: 'Course Id allowed only string!',
  }),
  rating: z
    .number({
      required_error: 'Rating field is required!',
      invalid_type_error: 'Rating field allowed only number!',
    })
    .int({ message: 'Only integer value allowed' })
    .gte(0, { message: 'Number is between 0 to 5' })
    .lte(5, { message: 'Number is between 0 to 5' }),
  review: z.string({
    required_error: 'Review field is required!',
    invalid_type_error: 'Review field allowed only string!',
  }),
});

export const reviewValidations = {
  reviewCreateValidationSchema,
};
