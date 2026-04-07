"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastAnnouncement = exports.markAllAsRead = exports.markOneAsRead = exports.getMyNotifications = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
// ─── Get My Notifications ─────────────────────────────────────────────────────
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await prisma_1.default.notification.findMany({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getMyNotifications = getMyNotifications;
// ─── Mark One as Read ─────────────────────────────────────────────────────────
const markOneAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await prisma_1.default.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        if (notification.userId !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        await prisma_1.default.notification.update({
            where: { id },
            data: { read: true },
        });
        return res.status(200).json({ message: "Marked as read" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.markOneAsRead = markOneAsRead;
// ─── Mark All as Read ─────────────────────────────────────────────────────────
const markAllAsRead = async (req, res) => {
    try {
        await prisma_1.default.notification.updateMany({
            where: { userId: req.userId, read: false },
            data: { read: true },
        });
        return res.status(200).json({ message: "All notifications marked as read" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.markAllAsRead = markAllAsRead;
// ─── Admin Broadcast Announcement ─────────────────────────────────────────────
const broadcastAnnouncement = async (req, res) => {
    try {
        const { title, message, target } = req.body;
        // target: "ALL" | "STUDENT" | "COMPANY"
        if (!title || !message) {
            return res.status(400).json({ message: "Title and message are required" });
        }
        // Find all target users
        const whereClause = target === "STUDENT"
            ? { role: "STUDENT" }
            : target === "COMPANY"
                ? { role: "COMPANY" }
                : { role: { in: ["STUDENT", "COMPANY"] } };
        const users = await prisma_1.default.user.findMany({
            where: whereClause,
            select: { id: true },
        });
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found for this target" });
        }
        // Bulk create notifications
        await prisma_1.default.notification.createMany({
            data: users.map((u) => ({
                userId: u.id,
                type: "ANNOUNCEMENT",
                title,
                message,
            })),
        });
        return res.status(201).json({
            message: `Announcement sent to ${users.length} users`,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.broadcastAnnouncement = broadcastAnnouncement;
