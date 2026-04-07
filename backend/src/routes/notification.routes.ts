import express from "express";
import {
  getMyNotifications,
  markOneAsRead,
  markAllAsRead,
  broadcastAnnouncement,
} from "../controllers/notification.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = express.Router();

// Student + Company — fetch their own notifications
router.get("/", authMiddleware, getMyNotifications);

// ⚠️ read-all MUST come before /:id/read
router.patch("/read-all", authMiddleware, markAllAsRead);
router.patch("/:id/read", authMiddleware, markOneAsRead);

// Admin only — broadcast announcement
router.post(
  "/announce",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  broadcastAnnouncement
);

export default router;