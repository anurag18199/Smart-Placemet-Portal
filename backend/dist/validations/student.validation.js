"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentSchema = void 0;
const zod_1 = require("zod");
exports.updateStudentSchema = zod_1.z.object({
    rollNumber: zod_1.z.string().min(1),
    branch: zod_1.z.string().min(2),
    cgpa: zod_1.z.number().min(0).max(10),
    graduationYear: zod_1.z.number().min(2020).max(2035),
    phone: zod_1.z.string().min(10),
    linkedinUrl: zod_1.z.string().url().optional(),
    githubUrl: zod_1.z.string().url().optional(),
    resumeUrl: zod_1.z.string().url().optional()
});
