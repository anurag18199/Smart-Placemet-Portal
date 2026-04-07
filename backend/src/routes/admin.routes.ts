import express from "express";
import {
  approveCompany,
  getAllStudents,
  getAllCompanies,
  getDashboardStats,
  deleteStudent,
  deleteCompany,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = express.Router();

// Dashboard stats
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getDashboardStats
);

// Students
router.get(
  "/students",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getAllStudents
);

router.delete(
  "/student/:studentId",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  deleteStudent
);

// Companies
router.get(
  "/companies",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getAllCompanies
);

router.patch(
  "/company/:companyId/approve",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  approveCompany
);

router.delete(
  "/company/:companyId",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  deleteCompany
);

export default router;