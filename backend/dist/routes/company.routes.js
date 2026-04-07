"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const company_controller_1 = require("../controllers/company.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const company_validation_1 = require("../validations/company.validation");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = express_1.default.Router();
router.get("/profile", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["COMPANY"]), company_controller_1.getCompanyProfile);
router.put("/profile", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["COMPANY"]), (0, validate_middleware_1.validate)(company_validation_1.updateCompanySchema), company_controller_1.updateCompanyProfile);
router.get("/jobs", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["COMPANY"]), company_controller_1.getCompanyJobs);
router.get("/job/:jobId/applicants", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["COMPANY"]), company_controller_1.getJobApplicants);
router.patch("/application/:applicationId/status", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["COMPANY"]), company_controller_1.updateApplicationStatus);
exports.default = router;
