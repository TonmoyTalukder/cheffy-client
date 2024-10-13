import { z } from "zod";

export const formSchema = z
  .object({
    name: z.string().min(1, "Please enter your name!"),
    email: z.string().email("Please enter a valid email address!"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirm_password: z.string(),
    // sex: z.enum(["male", "female"], "Please select your sex"),
    city: z.string().min(1, "Please enter your city"),
    bio: z.string().optional(),
    // food_habit: z.enum(["vegan", "veg", "non_veg"], "Please select a food habit"),
  })
  .superRefine((data, ctx) => {
    if (data.confirm_password !== data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirm_password"],
      });
    }
  });
