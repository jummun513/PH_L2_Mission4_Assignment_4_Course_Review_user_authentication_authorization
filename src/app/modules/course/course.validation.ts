import { z } from 'zod';

/*----------course create validation schema------
------------------------------------------------*/
const tagCreateValidationSchema = z.object({
  name: z.string({
    required_error: 'Tag name field is required!',
    invalid_type_error: 'Tag name field allowed only string!',
  }),
  isDeleted: z.boolean().optional(),
});

const detailCreateValidationSchema = z.object({
  level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    required_error: 'Level field is required!',
    invalid_type_error:
      "Level field allowed only 'Beginner', 'Intermediate', 'Advanced'!",
  }),
  description: z.string({
    required_error: 'Description field is required!',
    invalid_type_error: 'Description field allowed only string!',
  }),
});

const courseCreateValidationSchema = z.object({
  title: z.string({
    required_error: 'Title field is required!',
    invalid_type_error: 'Title field allowed only string!',
  }),
  instructor: z.string({
    required_error: 'Instructor field is required!',
    invalid_type_error: 'Instructor field allowed only string!',
  }),
  categoryId: z.string({
    required_error: 'Course Id is required!',
    invalid_type_error: 'Course Id allowed only string!',
  }),
  price: z
    .number({
      required_error: 'Price field is required!',
      invalid_type_error: 'Price field allowed only number!',
    })
    .gte(0, { message: 'Only positive integer allowed!' }),
  tags: z.array(tagCreateValidationSchema),
  startDate: z.string({
    required_error: 'Start Date field is required!',
    invalid_type_error: 'Start Date field allowed only string!',
  }),
  endDate: z.string({
    required_error: 'End Date field is required!',
    invalid_type_error: 'End Date field allowed only string!',
  }),
  language: z.string({
    required_error: 'Language field is required!',
    invalid_type_error: 'Language field allowed only string!',
  }),
  provider: z.string({
    required_error: 'Provider field is required!',
    invalid_type_error: 'Provider field allowed only string!',
  }),
  details: detailCreateValidationSchema,
});

/*----------course update validation schema------
------------------------------------------------*/

const tagUpdateValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Tag name field allowed only string!',
    })
    .optional(),
  isDeleted: z.boolean().optional(),
});

const detailUpdateValidationSchema = z.object({
  level: z
    .enum(['Beginner', 'Intermediate', 'Advanced'], {
      invalid_type_error:
        "Level field allowed only 'Beginner', 'Intermediate', 'Advanced'!",
    })
    .optional(),
  description: z
    .string({
      invalid_type_error: 'Description field allowed only string!',
    })
    .optional(),
});

const courseUpdateValidationSchema = z.object({
  title: z
    .string({
      invalid_type_error: 'Title field allowed only string!',
    })
    .optional(),
  instructor: z
    .string({
      invalid_type_error: 'Instructor field allowed only string!',
    })
    .optional(),
  categoryId: z
    .string({
      invalid_type_error: 'Course Id allowed only string!',
    })
    .optional(),
  price: z
    .number({
      invalid_type_error: 'Price field allowed only number!',
    })
    .gte(0, { message: 'Only positive integer allowed!' })
    .optional(),
  tags: z.array(tagUpdateValidationSchema).optional(),
  startDate: z
    .string({
      invalid_type_error: 'Start Date field allowed only string!',
    })
    .optional(),
  endDate: z
    .string({
      invalid_type_error: 'End Date field allowed only string!',
    })
    .optional(),
  language: z
    .string({
      invalid_type_error: 'Language field allowed only string!',
    })
    .optional(),
  provider: z
    .string({
      invalid_type_error: 'Provider field allowed only string!',
    })
    .optional(),
  details: detailUpdateValidationSchema.optional(),
});

export const courseValidations = {
  courseCreateValidationSchema,
  courseUpdateValidationSchema,
};
