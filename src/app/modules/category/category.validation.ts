import { z } from 'zod';

// Zod schemas for validation
const categoryCreateValidationSchema = z.object({
  name: z.string({
    required_error: 'Name field is required!',
    invalid_type_error: 'Name field allowed only string!',
  }),
});

export const categoryValidations = {
  categoryCreateValidationSchema,
};
