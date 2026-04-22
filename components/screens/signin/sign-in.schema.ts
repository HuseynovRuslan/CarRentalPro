import { z } from "zod";

export const signInSchema = z.object({
    identifier: z.string().min(3, "Please enter a valid email or username"),
    password: z.string()
        .min(8, "Your password must be at least 8 characters long")
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "Password must contain at least one letter and one number"),
});

export type SignInSchema = z.infer<typeof signInSchema>;