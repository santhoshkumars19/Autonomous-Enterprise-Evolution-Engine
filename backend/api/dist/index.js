"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const auth_1 = __importDefault(require("./routes/auth"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const financial_1 = __importDefault(require("./routes/financial"));
const reports_1 = __importDefault(require("./routes/reports"));
const competitor_1 = __importDefault(require("./routes/competitor"));
const chat_1 = __importDefault(require("./routes/chat"));
const admin_1 = __importDefault(require("./routes/admin"));
const business_1 = __importDefault(require("./routes/business"));
const app = (0, express_1.default)();
// ─── Security Middleware ───────────────────────────────────────────────────────
app.use((0, helmet_1.default)());
const allowedOrigins = (env_1.env.FRONTEND_URL || env_1.env.CORS_ORIGIN || "*")
    .split(",")
    .map((o) => o.trim());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(null, true);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// ─── Rate Limiting ─────────────────────────────────────────────────────────────
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later" },
});
app.use(limiter);
// ─── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({
        success: true,
        service: "EvoAI Core API",
        version: "1.0.0",
        environment: env_1.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});
// ─── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", auth_1.default);
app.use("/api/tasks", tasks_1.default);
app.use("/api/financial", financial_1.default);
app.use("/api/reports", reports_1.default);
app.use("/api/competitor", competitor_1.default);
app.use("/api/chat", chat_1.default);
app.use("/api/admin", admin_1.default);
app.use("/api/business", business_1.default);
// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
});
// ─── Boot ─────────────────────────────────────────────────────────────────────
const PORT = parseInt(env_1.env.PORT, 10);
const start = async () => {
    try {
        await (0, db_1.connectDB)();
    }
    catch {
        console.warn("⚠️  PostgreSQL unavailable — DB routes will fail until connected.");
        console.warn("    Set DATABASE_URL in .env and restart to enable full API.\n");
    }
    app.listen(PORT, () => {
        console.log(`\n🚀 EvoAI API Server running on http://localhost:${PORT}`);
        console.log(`🌍 Environment: ${env_1.env.NODE_ENV}`);
        console.log(`🤖 AI Service: ${env_1.env.AI_SERVICE_URL}`);
        console.log(`📋 Health: http://localhost:${PORT}/health\n`);
    });
};
start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=index.js.map