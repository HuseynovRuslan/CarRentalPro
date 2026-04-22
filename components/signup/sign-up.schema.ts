import { z } from "zod";

export const signUpSchema = z.object({
    fullName: z.string().min(3, "Please provide your full legal name"),
    email: z.string().email("Please provide a valid email address"),
    phone: z.string().regex(/^\+?[0-9\s\-]{9,18}$/, "Enter a valid phone number (e.g., +1 234 567 8900)"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password is too long (max 32)")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password requires uppercase, lowercase, and a number"),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine(val => val === true, "You must accept our Terms of Service to register"),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "The passwords you entered do not match",
});

export type SignUpSchema = z.infer<typeof signUpSchema>;