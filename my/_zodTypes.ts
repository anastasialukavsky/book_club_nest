import { ZodType, z } from 'zod';
import { LoginFormData } from './_types';

export const zodLogin: ZodType<LoginFormData> = z
  .object({
    email: z.string().email({ message: 'please enter a valid e-mail address' }),
    password: z
      .string()
      .min(10, { message: 'should be at least 10 characters' })
      .max(28, { message: 'should be at most 28 characters' }),
  })
  .strict();
