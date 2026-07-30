import { z } from 'zod';

export const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  city: z.string().min(2, 'Please select or enter your city'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const membershipSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  city: z.string().min(2, 'City is required'),
  postcode: z.string().min(3, 'Valid UK postcode is required'),
  tier: z.string().min(1, 'Please select a membership tier'),
  interests: z.array(z.string()).min(1, 'Select at least one area of interest'),
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: 'You must accept the community code of conduct and terms',
  }),
});
