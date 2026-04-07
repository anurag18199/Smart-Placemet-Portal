import prisma from "./prisma";
import { NotificationType } from "@prisma/client";

// ─── Create a single notification ─────────────────────────────────────────────
export const createNotification = async ({
  userId,
  type,
  title,
  message,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}) => {
  try {
    await prisma.notification.create({
      data: { userId, type, title, message },
    });
  } catch (error) {
    // Never let notification failure crash the main operation
    console.error("Failed to create notification:", error);
  }
};

// ─── Notify student when application status changes ───────────────────────────
export const notifyApplicationStatusChange = async (
  applicationId: string,
  newStatus: string
) => {
  try {
    const application = await prisma.application.findUnique({
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

    if (!application) return;

    const statusMessages: Record<string, { title: string; message: string }> = {
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
    if (!content) return;

    await createNotification({
      userId: application.student.userId,
      type: "APPLICATION_STATUS",
      title: content.title,
      message: content.message,
    });
  } catch (error) {
    console.error("Failed to notify application status change:", error);
  }
};

// ─── Notify all students when a new job is posted ─────────────────────────────
export const notifyNewJob = async (jobId: string) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: { select: { companyName: true } },
      },
    });

    if (!job) return;

    // Get all students' userIds
    const students = await prisma.student.findMany({
      select: { userId: true },
    });

    if (students.length === 0) return;

    await prisma.notification.createMany({
      data: students.map((s) => ({
        userId: s.userId,
        type: "NEW_JOB" as NotificationType,
        title: `New Job: ${job.title}`,
        message: `${job.company.companyName} is hiring for ${job.title} in ${job.location}. Min CGPA: ${job.minCgpa}. Apply before the deadline!`,
      })),
    });
  } catch (error) {
    console.error("Failed to notify new job:", error);
  }
};

// ─── Notify company when approved ─────────────────────────────────────────────
export const notifyCompanyApproved = async (companyId: string) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { user: true },
    });

    if (!company) return;

    await createNotification({
      userId: company.userId,
      type: "COMPANY_APPROVED",
      title: "Your Company is Approved! ✅",
      message: `${company.companyName} has been approved by the placement cell. You can now post jobs and manage applicants.`,
    });
  } catch (error) {
    console.error("Failed to notify company approval:", error);
  }
};