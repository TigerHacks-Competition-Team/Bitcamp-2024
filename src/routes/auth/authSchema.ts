import { z } from 'zod';

export const authSchema = z.object({
    email: z
        .string({required_error: "Email is required"})
        .email({ message: 'Please enter a valid email address' }),
    password: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.trim()
})

export type AuthSchema = typeof authSchema;