import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { ApplicationStatus } from "@prisma/client";
import { notifyApplicationStatusChange } from "../lib/notificationHelper";

export const updateCompanyProfile = async (req: Request, res: Response) => {
  try {
    const { companyName, description, industry, website, location, phone } = req.body;

    const company = await prisma.company.findUnique({
      where: { userId: req.userId },
    });

    if (!company) {
      // Create profile if it doesn't exist yet
      const newCompany = await prisma.company.create({
        data: {
          userId: req.userId!,
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

    const updatedCompany = await prisma.company.update({
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCompanyProfile = async (req: Request, res: Response) => {
  try {
    const company = await prisma.company.findUnique({
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getJobApplicants = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId as string;

    const company = await prisma.company.findUnique({
      where: { userId: req.userId },
    });

    if (!company) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.companyId !== company.id) {
      return res.status(403).json({ message: "Unauthorized access to applicants" });
    }

    const applications = await prisma.application.findMany({
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const applicationId = req.params.applicationId as string;
    const { status } = req.body;

    if (!Object.values(ApplicationStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const company = await prisma.company.findUnique({
      where: { userId: req.userId },
    });

    if (!company) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.job.companyId !== company.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    await notifyApplicationStatusChange(applicationId, status);

    return res.status(200).json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCompanyJobs = async (req: Request, res: Response) => {
  try {
    const company = await prisma.company.findUnique({
      where: { userId: req.userId },
    });

    if (!company) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    const jobs = await prisma.job.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ jobs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};