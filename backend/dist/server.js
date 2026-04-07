"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const student_routes_1 = __importDefault(require("./routes/student.routes"));
const company_routes_1 = __importDefault(require("./routes/company.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const cors_1 = __importDefault(require("cors"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/student", student_routes_1.default);
app.use("/api/company", company_routes_1.default);
app.use("/api/job", job_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/notifications", notification_routes_1.default);
console.log("Notification routes loaded");
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running on port 5000");
});
