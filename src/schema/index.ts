import { z } from "zod";

export const securePdfFormSchema = z.object({
  password: z
    .string()
    .min(2, {
      message: "Password must be at least 2 characters.",
    })
    .max(50),
  confirmPassword: z
    .string()
    .min(2, {
      message: "Confirm Password must be at least 2 characters.",
    })
    .max(50),
});
