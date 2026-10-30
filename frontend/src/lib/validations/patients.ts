import { z } from 'zod';

export const patientSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  email: z.string().trim().email('Enter a valid email').max(255),
  phoneNumber: z.string().trim().min(1, 'Phone number is required').max(30),
  dob: z.string().min(1, 'Date of birth is required'),
});

export type PatientFormValues = z.infer<typeof patientSchema>;
