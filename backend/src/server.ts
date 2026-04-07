import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import studentRoutes from "./routes/student.routes";
import companyRoutes from "./routes/company.routes";
import jobRoutes from "./routes/job.routes";
import adminRoutes from "./routes/admin.routes";
import cors from "cors";
import notificationRoutes from "./routes/notification.routes";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
console.log("Notification routes loaded");

app.listen(5000, () => {
  console.log("Server running on port 5000");
});