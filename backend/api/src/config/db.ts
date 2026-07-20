import { Pool } from "pg";
import { env } from "./env";
import { SCHEMA_DDL } from "../db/schemaDDL";

const isProduction = env.NODE_ENV === "production" || env.DATABASE_URL.includes("sslmode=require");
const disableSsl = env.DATABASE_URL.includes("sslmode=disable");

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: disableSsl ? false : isProduction ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL pool error:", err);
});

export const query = async <T = unknown>(
  text: string,
  params?: unknown[]
): Promise<T[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
};

export const connectDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log(`✅ PostgreSQL connected at ${result.rows[0].now}`);

    try {
      await client.query(SCHEMA_DDL);
      console.log("✅ Database schema auto-verified/initialized successfully.");
    } catch (schemaErr) {
      console.warn("⚠️ Database auto-schema warning:", schemaErr);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error);
    throw error;
  }
};
