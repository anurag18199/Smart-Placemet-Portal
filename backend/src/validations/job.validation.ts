import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(2),
  salary: z.string().min(1),
  jobType: z.enum(["INTERNSHIP", "FULLTIME"]),
  minCgpa: z.number().min(0).max(10),
  deadline: z.string()
});