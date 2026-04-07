"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("../controllers/notification.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = express_1.default.Router();
// Student + Company — fetch their own notifications
router.get("/", auth_middleware_1.authMiddleware, notification_controller_1.getMyNotifications);
// ⚠️ read-all MUST come before /:id/read
router.patch("/read-all", auth_middleware_1.authMiddleware, notification_controller_1.markAllAsRead);
router.patch("/:id/read", auth_middleware_1.authMiddleware, notification_controller_1.markOneAsRead);
// Admin only — broadcast announcement
router.post("/announce", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), notification_controller_1.broadcastAnnouncement);
exports.default = router;
