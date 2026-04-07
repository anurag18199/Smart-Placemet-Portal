import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { notifyNewJob } from "../lib/notificationHelper";

export const createJob = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      location,
      salary,
      jobType,
      minCgpa,
      deadline
    } = req.body;

    // 1️⃣ Find company using logged-in userId
    const company = await prisma.company.findUnique({
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
    const job = await prisma.job.create({
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

    await notifyNewJob(job.id);

    return res.status(201).json({
      message: "Job created successfully",
      job
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const applyJob = async (req: Request, res: Response) => {
    try {
        const jobId = req.params.jobId as string;  // ✅ force string

        // 1️⃣ Find logged-in student
        const student = await prisma.student.findUnique({
          where: { userId: req.userId }
        });
    
        if (!student) {
          return res.status(404).json({ message: "Student profile not found" });
        }
    
        // 2️⃣ Find job
        const job = await prisma.job.findUnique({
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
      const existingApplication = await prisma.application.findFirst({
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
      const application = await prisma.application.create({
        data: {
          studentId: student.id,
          jobId: job.id
        }
      });
  
      return res.status(201).json({
        message: "Applied successfully",
        application
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };


  export const getAllJobs = async (req: Request, res: Response) => {
    try {
      const {
        page = "1",
        limit = "5",
        location,
        jobType,
        minCgpa,
        search,
        sortBy = "createdAt",
        order = "desc",
        active
      } = req.query;
  
      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(limit as string);
  
      const filters: any = {};
  
      // 🔎 Filter by location
      if (location) {
        filters.location = {
          contains: location as string,
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
          lte: parseFloat(minCgpa as string)
        };
      }
  
      // 🔎 Search by title keyword
      if (search) {
        filters.title = {
          contains: search as string,
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
      const sortField = validSortFields.includes(sortBy as string)
        ? sortBy
        : "createdAt";
  
      const sortOrder = order === "asc" ? "asc" : "desc";
  
      const jobs = await prisma.job.findMany({
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
          [sortField as string]: sortOrder
        }
      });
  
      const totalJobs = await prisma.job.count({ where: filters });
  
      return res.status(200).json({
        message: "Jobs fetched successfully",
        currentPage: pageNumber,
        totalPages: Math.ceil(totalJobs / pageSize),
        totalJobs,
        jobs
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  export const getJobById = async (req: Request, res: Response) => {
    try {
      const jobId = req.params.jobId as string;
  
      const job = await prisma.job.findUnique({
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
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };