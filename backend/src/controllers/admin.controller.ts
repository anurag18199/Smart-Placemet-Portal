import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { notifyCompanyApproved } from "../lib/notificationHelper";

// ─── Dashboard Stats ───────────────────────────────────────────────────────────

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalStudents,
      totalCompanies,
      totalJobs,
      totalApplications,
      totalPlacements,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.company.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.application.count({ where: { status: "SELECTED" } }),
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── Students ─────────────────────────────────────────────────────────────────

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const  studentId  = req.params.studentId as string;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete applications first (foreign key constraint)
    await prisma.application.deleteMany({ where: { studentId } });
    await prisma.studentSkill.deleteMany({ where: { studentId } });
    await prisma.student.delete({ where: { id: studentId } });
    await prisma.user.delete({ where: { id: student.userId } });

    return res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── Companies ────────────────────────────────────────────────────────────────

export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await prisma.company.findMany({
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const approveCompany = async (req: Request, res: Response) => {
  try {
    const  companyId  = req.params.companyId as string;

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const updated = await prisma.company.update({
      where: { id: companyId },
      data: { approved: true },
    });

    await notifyCompanyApproved(companyId);

    return res.status(200).json({
      message: "Company approved successfully",
      company: { ...updated, isApproved: updated.approved },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const  companyId  = req.params.companyId as string;

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Delete in order to respect foreign key constraints
    const jobs = await prisma.job.findMany({ where: { companyId } });
    const jobIds = jobs.map((j) => j.id);

    await prisma.application.deleteMany({ where: { jobId: { in: jobIds } } });
    await prisma.job.deleteMany({ where: { companyId } });
    await prisma.company.delete({ where: { id: companyId } });
    await prisma.user.delete({ where: { id: company.userId } });

    return res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};