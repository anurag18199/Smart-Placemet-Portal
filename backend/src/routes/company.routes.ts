import express from "express";
import { getCompanyJobs , getCompanyProfile, updateCompanyProfile, getJobApplicants , updateApplicationStatus  } from "../controllers/company.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { updateCompanySchema } from "../validations/company.validation";
import { validate } from "../middleware/validate.middleware";

const router = express.Router();

router.get(
  "/profile",
  authMiddleware,
  roleMiddleware(["COMPANY"]),
  getCompanyProfile
);

router.put(
  "/profile",
  authMiddleware,
  roleMiddleware(["COMPANY"]),
  validate(updateCompanySchema),
  updateCompanyProfile
);


router.get(
  "/jobs",
  authMiddleware,
  roleMiddleware(["COMPANY"]),
  getCompanyJobs
);


router.get(
  "/job/:jobId/applicants",
  authMiddleware,
  roleMiddleware(["COMPANY"]),
  getJobApplicants
);



router.patch(
  "/application/:applicationId/status",
  authMiddleware,
  roleMiddleware(["COMPANY"]),
  updateApplicationStatus
);

export default router;