"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.query = exports.pool = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
const isProduction = env_1.env.NODE_ENV === "production" || env_1.env.DATABASE_URL.includes("sslmode=require");
exports.pool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
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
        client.release();
        console.log(`✅ PostgreSQL connected at ${result.rows[0].now}`);
    }
    catch (error) {
        console.error("❌ PostgreSQL connection failed:", error);
        throw error;
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map