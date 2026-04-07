"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompanySchema = void 0;
const zod_1 = require("zod");
exports.updateCompanySchema = zod_1.z.object({
    companyName: zod_1.z.string().min(2),
    description: zod_1.z.string().min(10),
    industry: zod_1.z.string().min(2),
    website: zod_1.z.union([
        zod_1.z.string().regex(/^https?:\/\/.+\..+/, "Enter a valid URL"),
        zod_1.z.literal(""),
        zod_1.z.undefined()
    ]).optional(),
    location: zod_1.z.string().min(2),
    phone: zod_1.z.string().min(6),
});
