"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const student_controller_1 = require("../controllers/student.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const student_validation_1 = require("../validations/student.validation");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = express_1.default.Router();
router.put("/profile", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["STUDENT"]), (0, validate_middleware_1.validate)(student_validation_1.updateStudentSchema), student_controller_1.updateStudentProfile);
router.get("/applications", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["STUDENT"]), student_controller_1.getMyApplications);
exports.default = router;
