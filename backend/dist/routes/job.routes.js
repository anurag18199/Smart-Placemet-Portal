"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { createJob } from "../controllers/job.controller";
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const job_controller_1 = require("../controllers/job.controller");
const job_validation_1 = require("../validations/job.validation");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["COMPANY"]), (0, validate_middleware_1.validate)(job_validation_1.createJobSchema), job_controller_1.createJob);
router.get("/", job_controller_1.getAllJobs);
router.get("/:jobId", job_controller_1.getJobById);
router.post("/:jobId/apply", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["STUDENT"]), job_controller_1.applyJob);
exports.default = router;
