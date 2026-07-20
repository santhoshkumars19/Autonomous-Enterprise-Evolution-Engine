"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.query = exports.pool = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const isProduction = env_1.env.NODE_ENV === "production" || env_1.env.DATABASE_URL.includes("sslmode=require");
const disableSsl = env_1.env.DATABASE_URL.includes("sslmode=disable");
exports.pool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: disableSsl ? false : isProduction ? { rejectUnauthorized: false } : false,
});
exports.pool.on("error", (err) => {
    console.error("❌ Unexpected PostgreSQL pool error:", err);
});
const query = async (text, params) => {
    const client = await exports.pool.connect();
    try {
        const result = await client.query(text, params);
        return result.rows;
    }
    finally {
        client.release();
    }
};
exports.query = query;
const connectDB = async () => {
    try {
        const client = await exports.pool.connect();
        const result = await client.query("SELECT NOW()");
        console.log(`✅ PostgreSQL connected at ${result.rows[0].now}`);
        try {
            const schemaPath = path_1.default.join(__dirname, "../db/schema.sql");
            if (fs_1.default.existsSync(schemaPath)) {
                const sql = fs_1.default.readFileSync(schemaPath, "utf-8");
                await client.query(sql);
                console.log("✅ Database schema verified/initialized successfully.");
            }
        }
        catch (schemaErr) {
            console.warn("⚠️ Database auto-schema warning:", schemaErr);
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error("❌ PostgreSQL connection failed:", error);
        throw error;
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map