import express from "express";
// import { createJob } from "../controllers/job.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { createJob, applyJob, getAllJobs, getJobById  } from "../controllers/job.controller";
import { createJobSchema } from "../validations/job.validation";
import { validate } from "../middleware/validate.middleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["COMPANY"]),
  validate(createJobSchema),
  createJob
);

router.get("/", getAllJobs);
router.get("/:jobId", getJobById);

router.post(
    "/:jobId/apply",
    authMiddleware,
    roleMiddleware(["STUDENT"]),
    applyJob
  );

  

export default router;