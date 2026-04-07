import express from "express";
import { updateStudentProfile, getMyApplications  } from "../controllers/student.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { updateStudentSchema } from "../validations/student.validation";
import { validate } from "../middleware/validate.middleware";

const router = express.Router();

router.put(
  "/profile",
  authMiddleware,
  roleMiddleware(["STUDENT"]),
  validate(updateStudentSchema),
  updateStudentProfile
);

router.get(
  "/applications",
  authMiddleware,
  roleMiddleware(["STUDENT"]),
  getMyApplications
);

export default router;