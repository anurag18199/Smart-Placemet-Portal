"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobSchema = void 0;
const zod_1 = require("zod");
exports.createJobSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().min(10),
    location: zod_1.z.string().min(2),
    salary: zod_1.z.string().min(1),
    jobType: zod_1.z.enum(["INTERNSHIP", "FULLTIME"]),
    minCgpa: zod_1.z.number().min(0).max(10),
    deadline: zod_1.z.string()
});
