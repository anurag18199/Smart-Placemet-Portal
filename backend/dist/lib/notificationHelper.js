"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyCompanyApproved = exports.notifyNewJob = exports.notifyApplicationStatusChange = exports.createNotification = void 0;
const prisma_1 = __importDefault(require("./prisma"));
// ─── Create a single notification ─────────────────────────────────────────────
const createNotification = async ({ userId, type, title, message, }) => {
    try {
        await prisma_1.default.notification.create({
            data: { userId, type, title, message },
        });
    }
    catch (error) {
        // Never let notification failure crash the main operation
        console.error("Failed to create notification:", error);
    }
};
exports.createNotification = createNotification;
// ─── Notify student when application status changes ───────────────────────────
const notifyApplicationStatusChange = async (applicationId, newStatus) => {
    try {
        const application = await prisma_1.default.application.findUnique({
            where: { id: applicationId },
            include: {
                student: {
                    include: { user: true },
                },
                job: {
                    include: {
                        company: { select: { companyName: true } },
                    },
                },
            },
        });
        if (!application)
            return;
        const statusMessages = {
            SHORTLISTED: {
                title: "You've been Shortlisted! 🎉",
                message: `You have been shortlisted for ${application.job.title} at ${application.job.company.companyName}. Stay tuned for further updates.`,
            },
            SELECTED: {
                title: "Congratulations! You're Selected! 🎊",
                message: `You have been selected for ${application.job.title} at ${application.job.company.companyName}. The placement cell will contact you shortly.`,
            },
            REJECTED: {
                title: "Application Update",
                message: `Your application for ${application.job.title} at ${application.job.company.companyName} was not successful this time. Keep applying!`,
            },
        };
        const content = statusMessages[newStatus];
        if (!content)
            return;
        await (0, exports.createNotification)({
            userId: application.student.userId,
            type: "APPLICATION_STATUS",
            title: content.title,
            message: content.message,
        });
    }
    catch (error) {
        console.error("Failed to notify application status change:", error);
    }
};
exports.notifyApplicationStatusChange = notifyApplicationStatusChange;
// ─── Notify all students when a new job is posted ─────────────────────────────
const notifyNewJob = async (jobId) => {
    try {
        const job = await prisma_1.default.job.findUnique({
            where: { id: jobId },
            include: {
                company: { select: { companyName: true } },
            },
        });
        if (!job)
            return;
        // Get all students' userIds
        const students = await prisma_1.default.student.findMany({
            select: { userId: true },
        });
        if (students.length === 0)
            return;
        await prisma_1.default.notification.createMany({
            data: students.map((s) => ({
                userId: s.userId,
                type: "NEW_JOB",
                title: `New Job: ${job.title}`,
                message: `${job.company.companyName} is hiring for ${job.title} in ${job.location}. Min CGPA: ${job.minCgpa}. Apply before the deadline!`,
            })),
        });
    }
    catch (error) {
        console.error("Failed to notify new job:", error);
    }
};
exports.notifyNewJob = notifyNewJob;
// ─── Notify company when approved ─────────────────────────────────────────────
const notifyCompanyApproved = async (companyId) => {
    try {
        const company = await prisma_1.default.company.findUnique({
            where: { id: companyId },
            include: { user: true },
        });
        if (!company)
            return;
        await (0, exports.createNotification)({
            userId: company.userId,
            type: "COMPANY_APPROVED",
            title: "Your Company is Approved! ✅",
            message: `${company.companyName} has been approved by the placement cell. You can now post jobs and manage applicants.`,
        });
    }
    catch (error) {
        console.error("Failed to notify company approval:", error);
    }
};
exports.notifyCompanyApproved = notifyCompanyApproved;
