"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyJobs = exports.updateApplicationStatus = exports.getJobApplicants = exports.getCompanyProfile = exports.updateCompanyProfile = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const client_1 = require("@prisma/client");
const notificationHelper_1 = require("../lib/notificationHelper");
const updateCompanyProfile = async (req, res) => {
    try {
        const { companyName, description, industry, website, location, phone } = req.body;
        const company = await prisma_1.default.company.findUnique({
            where: { userId: req.userId },
        });
        if (!company) {
            // Create profile if it doesn't exist yet
            const newCompany = await prisma_1.default.company.create({
                data: {
                    userId: req.userId,
                    companyName,
                    description,
                    industry,
                    website: website || null,
                    location,
                    phone,
                },
            });
            return res.status(201).json({
                message: "Company profile created successfully",
                company: { ...newCompany, isApproved: newCompany.approved },
            });
        }
        const updatedCompany = await prisma_1.default.company.update({
            where: { userId: req.userId },
            data: {
                companyName,
                description,
                industry,
                website: website || null,
                location,
                phone,
            },
        });
        return res.status(200).json({
            message: "Company profile updated successfully",
            company: { ...updatedCompany, isApproved: updatedCompany.approved },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateCompanyProfile = updateCompanyProfile;
const getCompanyProfile = async (req, res) => {
    try {
        const company = await prisma_1.default.company.findUnique({
            where: { userId: req.userId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!company) {
            return res.status(404).json({ message: "Company profile not found" });
        }
        return res.status(200).json({
            message: "Company profile fetched successfully",
            profile: { ...company, isApproved: company.approved },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getCompanyProfile = getCompanyProfile;
const getJobApplicants = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const company = await prisma_1.default.company.findUnique({
            where: { userId: req.userId },
        });
        if (!company) {
            return res.status(404).json({ message: "Company profile not found" });
        }
        const job = await prisma_1.default.job.findUnique({ where: { id: jobId } });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        if (job.companyId !== company.id) {
            return res.status(403).json({ message: "Unauthorized access to applicants" });
        }
        const applications = await prisma_1.default.application.findMany({
            where: { jobId },
            include: {
                student: {
                    include: {
                        user: {
                            select: { name: true, email: true },
                        },
                    },
                },
            },
            orderBy: { appliedAt: "desc" },
        });
        return res.status(200).json({
            message: "Applicants fetched successfully",
            applications,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getJobApplicants = getJobApplicants;
const updateApplicationStatus = async (req, res) => {
    try {
        const applicationId = req.params.applicationId;
        const { status } = req.body;
        if (!Object.values(client_1.ApplicationStatus).includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        const company = await prisma_1.default.company.findUnique({
            where: { userId: req.userId },
        });
        if (!company) {
            return res.status(404).json({ message: "Company profile not found" });
        }
        const application = await prisma_1.default.application.findUnique({
            where: { id: applicationId },
            include: { job: true },
        });
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        if (application.job.companyId !== company.id) {
            return res.status(403).json({ message: "Unauthorized action" });
        }
        const updatedApplication = await prisma_1.default.application.update({
            where: { id: applicationId },
            data: { status },
        });
        await (0, notificationHelper_1.notifyApplicationStatusChange)(applicationId, status);
        return res.status(200).json({
            message: "Application status updated successfully",
            application: updatedApplication,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
const getCompanyJobs = async (req, res) => {
    try {
        const company = await prisma_1.default.company.findUnique({
            where: { userId: req.userId },
        });
        if (!company) {
            return res.status(404).json({ message: "Company profile not found" });
        }
        const jobs = await prisma_1.default.job.findMany({
            where: { companyId: company.id },
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json({ jobs });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getCompanyJobs = getCompanyJobs;
