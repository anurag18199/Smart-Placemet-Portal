"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = express_1.default.Router();
// Dashboard stats
router.get("/dashboard", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), admin_controller_1.getDashboardStats);
// Students
router.get("/students", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), admin_controller_1.getAllStudents);
router.delete("/student/:studentId", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), admin_controller_1.deleteStudent);
// Companies
router.get("/companies", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), admin_controller_1.getAllCompanies);
router.patch("/company/:companyId/approve", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), admin_controller_1.approveCompany);
router.delete("/company/:companyId", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), admin_controller_1.deleteCompany);
exports.default = router;
