// lib/validations/form-schema.ts
import * as z from 'zod'

export const tripFormSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be less than 50 characters'),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD)'),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  images: z.array(z.string()).optional(),
})

export type TripFormValues = z.infer<typeof tripFormSchema>

