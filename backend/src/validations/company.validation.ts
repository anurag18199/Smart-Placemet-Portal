import { z } from "zod";

export const updateCompanySchema = z.object({
  companyName: z.string().min(2),
  description: z.string().min(10),
  industry: z.string().min(2),
  website: z.union([
    z.string().regex(/^https?:\/\/.+\..+/, "Enter a valid URL"),
    z.literal(""),
    z.undefined()
  ]).optional(),
  location: z.string().min(2),
  phone: z.string().min(6),
});