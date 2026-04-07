import express from "express";
import { register, login } from "../controllers/auth.controller";
import { getCurrentUser } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { registerSchema, loginSchema } from "../validations/auth.validation";

const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authMiddleware, getCurrentUser);


export default router;