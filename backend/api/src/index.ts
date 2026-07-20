import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import tasksRoutes from "./routes/tasks";
import financialRoutes from "./routes/financial";
import reportsRoutes from "./routes/reports";
import competitorRoutes from "./routes/competitor";
import chatRoutes from "./routes/chat";
import adminRoutes from "./routes/admin";
import businessRoutes from "./routes/business";

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());

const allowedOrigins = (env.FRONTEND_URL || env.CORS_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later" },
});
app.use(limiter);

// ─── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    service: "EvoAI Core API",
    version: "1.0.0",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/financial", financialRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/competitor", competitorRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/business", businessRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
const PORT = parseInt(env.PORT, 10);

const start = async () => {
  try {
    await connectDB();
  } catch {
    console.warn("⚠️  PostgreSQL unavailable — DB routes will fail until connected.");
    console.warn("    Set DATABASE_URL in .env and restart to enable full API.\n");
  }
  app.listen(PORT, () => {
    console.log(`\n🚀 EvoAI API Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
    console.log(`🤖 AI Service: ${env.AI_SERVICE_URL}`);
    console.log(`📋 Health: http://localhost:${PORT}/health\n`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

export default app;

