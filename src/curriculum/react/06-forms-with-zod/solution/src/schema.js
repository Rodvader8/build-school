import { z } from 'zod';

export const schema = z.object({
  name: z.string().trim().min(2, 'Enter a name of at least 2 characters'),
  email: z.email('Enter a valid email address'),
  // Form fields are always strings, so coerce turns "2400000" into 2400000 before the checks run.
  value: z.coerce.number('Enter a number').min(1, 'Value must be at least $1'),
});
