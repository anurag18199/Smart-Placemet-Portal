import { z } from "zod";

export const updateStudentSchema = z.object({
  rollNumber: z.string().min(1),
  branch: z.string().min(2),
  cgpa: z.number().min(0).max(10),
  graduationYear: z.number().min(2020).max(2035),
  phone: z.string().min(10),
  linkedinUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  resumeUrl: z.string().url().optional()
});