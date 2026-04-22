import { z } from "zod";

export const personalInformationSchema = z.object({
    avatarUrl: z.string().optional(),
    firstName: z.string().min(2, "First name is required for your profile"),
    lastName: z.string().min(2, "Last name is required"),
    emailAddress: z.string().email("A valid email ensures account safety"),
    phoneNumber: z.string().regex(/^\+?[0-9\s\-]{9,18}$/, "Enter a valid phone number (e.g., +1 234 567 8900)"),
    city: z.string().min(2, "City Name is required for localization"),
    addressLine: z.string().min(5, "Please provide a complete street address"),
});

export type UserProfileFormSchema = z.infer<typeof personalInformationSchema>;