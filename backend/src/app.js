import express from "express";
import cors from "cors";
import prisma from "./config/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import periodRoutes from "./routes/period.routes.js";
import companyRoutes from "./routes/company.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import evaluationRoutes from "./routes/evaluation.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Intern Management System API is running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    message: "Backend server is healthy",
  });
});

app.get("/health/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      status: "OK",
      database: "connected",
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      status: "ERROR",
      database: "disconnected",
      message: error.message,
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/periods", periodRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/applications",applicationRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;
