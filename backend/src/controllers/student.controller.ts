import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma";

export const updateStudentProfile = async (req: Request, res: Response) => {
  try {
    const {
      rollNumber,
      branch,
      cgpa,
      graduationYear,
      phone,
      linkedinUrl,
      githubUrl,
      resumeUrl
    } = req.body;

    // 1️⃣ Find student using logged-in userId
    const student = await prisma.student.findUnique({
      where: { userId: req.userId }
    });

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // 2️⃣ Update profile
    const updatedStudent = await prisma.student.update({
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

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyApplications = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Find logged-in student
    const student = await prisma.student.findUnique({
      where: { userId: req.userId }
    });

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // 2️⃣ Fetch applications
    const applications = await prisma.application.findMany({
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

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};