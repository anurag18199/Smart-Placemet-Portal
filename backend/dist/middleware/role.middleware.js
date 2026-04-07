"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const roleMiddleware = (roles) => {
    return async (req, res, next) => {
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.userId }
        });
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
