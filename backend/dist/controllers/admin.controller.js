"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompany = exports.approveCompany = exports.getAllCompanies = exports.deleteStudent = exports.getAllStudents = exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const notificationHelper_1 = require("../lib/notificationHelper");
// ─── Dashboard Stats ───────────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
    try {
        const [totalStudents, totalCompanies, totalJobs, totalApplications, totalPlacements,] = await Promise.all([
            prisma_1.default.student.count(),
            prisma_1.default.company.count(),
            prisma_1.default.job.count(),
            prisma_1.default.application.count(),
            prisma_1.default.application.count({ where: { status: "SELECTED" } }),
        ]);
        return res.status(200).json({
            message: "Dashboard stats fetched successfully",
            stats: {
                totalStudents,
                totalCompanies,
                totalJobs,
                totalApplications,
                totalPlacements,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getDashboardStats = getDashboardStats;
// ─── Students ─────────────────────────────────────────────────────────────────
const getAllStudents = async (req, res) => {
    try {
        const students = await prisma_1.default.student.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        createdAt: true,
                    },
                },
                applications: {
                    include: {
                        job: {
                            select: {
                                title: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json({
            message: "Students fetched successfully",
            totalStudents: students.length,
            students,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getAllStudents = getAllStudents;
const deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const student = await prisma_1.default.student.findUnique({
            where: { id: studentId },
        });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        // Delete applications first (foreign key constraint)
        await prisma_1.default.application.deleteMany({ where: { studentId } });
        await prisma_1.default.studentSkill.deleteMany({ where: { studentId } });
        await prisma_1.default.student.delete({ where: { id: studentId } });
        await prisma_1.default.user.delete({ where: { id: student.userId } });
        return res.status(200).json({ message: "Student deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.deleteStudent = deleteStudent;
// ─── Companies ────────────────────────────────────────────────────────────────
const getAllCompanies = async (req, res) => {
    try {
        const companies = await prisma_1.default.company.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        createdAt: true,
                    },
                },
                jobs: {
                    select: {
                        id: true,
                        title: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        // Map approved → isApproved for frontend consistency
        const mapped = companies.map((c) => ({
            ...c,
            isApproved: c.approved,
        }));
        return res.status(200).json({
            message: "Companies fetched successfully",
            totalCompanies: companies.length,
            companies: mapped,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getAllCompanies = getAllCompanies;
const approveCompany = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const company = await prisma_1.default.company.findUnique({
            where: { id: companyId },
        });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        const updated = await prisma_1.default.company.update({
            where: { id: companyId },
            data: { approved: true },
        });
        await (0, notificationHelper_1.notifyCompanyApproved)(companyId);
        return res.status(200).json({
            message: "Company approved successfully",
            company: { ...updated, isApproved: updated.approved },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.approveCompany = approveCompany;
const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const company = await prisma_1.default.company.findUnique({
            where: { id: companyId },
        });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        // Delete in order to respect foreign key constraints
        const jobs = await prisma_1.default.job.findMany({ where: { companyId } });
        const jobIds = jobs.map((j) => j.id);
        await prisma_1.default.application.deleteMany({ where: { jobId: { in: jobIds } } });
        await prisma_1.default.job.deleteMany({ where: { companyId } });
        await prisma_1.default.company.delete({ where: { id: companyId } });
        await prisma_1.default.user.delete({ where: { id: company.userId } });
        return res.status(200).json({ message: "Company deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.deleteCompany = deleteCompany;
