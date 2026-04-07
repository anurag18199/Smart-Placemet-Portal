import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { Role } from "@prisma/client";

// ─── Get My Notifications ─────────────────────────────────────────────────────
export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return res.status(200).json({
      message: "Notifications fetched successfully",
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── Mark One as Read ─────────────────────────────────────────────────────────
export const markOneAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return res.status(200).json({ message: "Marked as read" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── Mark All as Read ─────────────────────────────────────────────────────────
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.userId, read: false },
      data: { read: true },
    });

    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── Admin Broadcast Announcement ─────────────────────────────────────────────
export const broadcastAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, message, target } = req.body;
    // target: "ALL" | "STUDENT" | "COMPANY"

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    // Find all target users
    const whereClause =
      target === "STUDENT"
        ? { role: "STUDENT" as const }
        : target === "COMPANY"
        ? { role: "COMPANY" as const }
        : { role: { in: ["STUDENT", "COMPANY"] as Role[] } };

    const users = await prisma.user.findMany({
      where: whereClause,
      select: { id: true },
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found for this target" });
    }

    // Bulk create notifications
    await prisma.notification.createMany({
      data: users.map((u) => ({
        userId: u.id,
        type: "ANNOUNCEMENT" as const,
        title,
        message,
      })),
    });

    return res.status(201).json({
      message: `Announcement sent to ${users.length} users`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};