"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("4000"),
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    DATABASE_URL: zod_1.z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET: zod_1.z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_EXPIRES_IN: zod_1.z.string().default("7d"),
    AI_SERVICE_URL: zod_1.z.string().default("http://localhost:8000"),
    CORS_ORIGIN: zod_1.z.string().default("*"),
    FRONTEND_URL: zod_1.z.string().optional(),
    OPENAI_API_KEY: zod_1.z.string().optional(),
    GEMINI_API_KEY: zod_1.z.string().optional(),
    DEFAULT_PROVIDER: zod_1.z.string().default("openai"),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map