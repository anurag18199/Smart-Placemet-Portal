"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyApplications = exports.updateStudentProfile = void 0;
// import { PrismaClient } from "@prisma/client";
const prisma_1 = __importDefault(require("../lib/prisma"));
const updateStudentProfile = async (req, res) => {
    try {
        const { rollNumber, branch, cgpa, graduationYear, phone, linkedinUrl, githubUrl, resumeUrl } = req.body;
        // 1️⃣ Find student using logged-in userId
        const student = await prisma_1.default.student.findUnique({
            where: { userId: req.userId }
        });
        if (!student) {
            return res.status(404).json({ message: "Student profile not found" });
        }
        // 2️⃣ Update profile
        const updatedStudent = await prisma_1.default.student.update({
            where: { userId: req.userId },
            data: {
                rollNumber,
                branch,
                cgpa,
                graduationYear,
                phone,
                linkedinUrl,
                githubUrl,
                resumeUrl
            }
        });
        return res.status(200).json({
            message: "Student profile updated successfully",
            student: updatedStudent
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateStudentProfile = updateStudentProfile;
const getMyApplications = async (req, res) => {
    try {
        // 1️⃣ Find logged-in student
        const student = await prisma_1.default.student.findUnique({
            where: { userId: req.userId }
        });
        if (!student) {
            return res.status(404).json({ message: "Student profile not found" });
        }
        // 2️⃣ Fetch applications
        const applications = await prisma_1.default.application.findMany({
            where: { studentId: student.id },
            include: {
                job: {
                    include: {
                        company: {
                            select: {
                                companyName: true,
                                location: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                appliedAt: "desc"
            }
        });
        return res.status(200).json({
            message: "Applications fetched successfully",
            applications
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getMyApplications = getMyApplications;
