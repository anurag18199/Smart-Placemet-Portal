"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobById = exports.getAllJobs = exports.applyJob = exports.createJob = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const notificationHelper_1 = require("../lib/notificationHelper");
const createJob = async (req, res) => {
    try {
        const { title, description, location, salary, jobType, minCgpa, deadline } = req.body;
        // 1️⃣ Find company using logged-in userId
        const company = await prisma_1.default.company.findUnique({
            where: { userId: req.userId }
        });
        if (!company) {
            return res.status(404).json({ message: "Company profile not found" });
        }
        // 2️⃣ Check if company is approved
        if (!company.approved) {
            return res.status(403).json({
                message: "Company not approved by admin yet"
            });
        }
        // 3️⃣ Create Job
        const job = await prisma_1.default.job.create({
            data: {
                companyId: company.id,
                title,
                description,
                location,
                salary,
                jobType,
                minCgpa,
                deadline: new Date(deadline)
            }
        });
        await (0, notificationHelper_1.notifyNewJob)(job.id);
        return res.status(201).json({
            message: "Job created successfully",
            job
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.createJob = createJob;
const applyJob = async (req, res) => {
    try {
        const jobId = req.params.jobId; // ✅ force string
        // 1️⃣ Find logged-in student
        const student = await prisma_1.default.student.findUnique({
            where: { userId: req.userId }
        });
        if (!student) {
            return res.status(404).json({ message: "Student profile not found" });
        }
        // 2️⃣ Find job
        const job = await prisma_1.default.job.findUnique({
            where: { id: jobId }
        });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        // 3️⃣ Check CGPA eligibility
        if (student.cgpa < job.minCgpa) {
            return res.status(403).json({
                message: "You do not meet the minimum CGPA requirement"
            });
        }
        // 4️⃣ Prevent duplicate application
        const existingApplication = await prisma_1.default.application.findFirst({
            where: {
                studentId: student.id,
                jobId: job.id
            }
        });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job"
            });
        }
        // 5️⃣ Create application
        const application = await prisma_1.default.application.create({
            data: {
                studentId: student.id,
                jobId: job.id
            }
        });
        return res.status(201).json({
            message: "Applied successfully",
            application
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.applyJob = applyJob;
const getAllJobs = async (req, res) => {
    try {
        const { page = "1", limit = "5", location, jobType, minCgpa, search, sortBy = "createdAt", order = "desc", active } = req.query;
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);
        const filters = {};
        // 🔎 Filter by location
        if (location) {
            filters.location = {
                contains: location,
                mode: "insensitive"
            };
        }
        // 🔎 Filter by job type
        if (jobType) {
            filters.jobType = jobType;
        }
        // 🔎 Filter by CGPA eligibility
        if (minCgpa) {
            filters.minCgpa = {
                lte: parseFloat(minCgpa)
            };
        }
        // 🔎 Search by title keyword
        if (search) {
            filters.title = {
                contains: search,
                mode: "insensitive"
            };
        }
        // 🔎 Only active jobs (deadline > today)
        if (active === "true") {
            filters.deadline = {
                gte: new Date()
            };
        }
        // 🔀 Sorting
        const validSortFields = ["createdAt", "deadline", "salary"];
        const sortField = validSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";
        const sortOrder = order === "asc" ? "asc" : "desc";
        const jobs = await prisma_1.default.job.findMany({
            where: filters,
            include: {
                company: {
                    select: {
                        companyName: true,
                        location: true
                    }
                }
            },
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            orderBy: {
                [sortField]: sortOrder
            }
        });
        const totalJobs = await prisma_1.default.job.count({ where: filters });
        return res.status(200).json({
            message: "Jobs fetched successfully",
            currentPage: pageNumber,
            totalPages: Math.ceil(totalJobs / pageSize),
            totalJobs,
            jobs
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getAllJobs = getAllJobs;
const getJobById = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const job = await prisma_1.default.job.findUnique({
            where: { id: jobId },
            include: {
                company: {
                    select: {
                        companyName: true,
                        description: true,
                        website: true,
                        location: true
                    }
                }
            }
        });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        return res.status(200).json({
            message: "Job fetched successfully",
            job
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getJobById = getJobById;
