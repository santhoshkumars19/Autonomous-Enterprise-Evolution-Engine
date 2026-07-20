import { Pool } from "pg";
import bcrypt from "bcryptjs";
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

const autoSeedDefaults = async (client: any): Promise<void> => {
  try {
    // 1. Seed required System Admin (admin@evoai.com / Admin@123)
    const adminEmail = "admin@evoai.com";
    const existingAdmin = await client.query("SELECT id FROM users WHERE LOWER(email) = LOWER($1)", [adminEmail]);

    if (existingAdmin.rows.length === 0) {
      const passwordHash = await bcrypt.hash("Admin@123", 12);
      await client.query(
        `INSERT INTO users (name, email, password_hash, company, role, setup_completed)
         VALUES ($1, $2, $3, $4, 'admin', TRUE)`,
        ["EvoAI System Admin", adminEmail, passwordHash, "EvoAI Corporation"]
      );
      console.log(`👤 Auto-seeded system admin user: ${adminEmail}`);
    }

    // 2. Seed Company A User (compA@evoai.com / User@123)
    const userAEmail = "compA@evoai.com";
    const existingA = await client.query("SELECT id FROM users WHERE LOWER(email) = LOWER($1)", [userAEmail]);

    if (existingA.rows.length === 0) {
      const hashA = await bcrypt.hash("User@123", 12);
      const resA = await client.query(
        `INSERT INTO users (name, email, password_hash, company, role, setup_completed)
         VALUES ($1, $2, $3, $4, 'user', TRUE) RETURNING id`,
        ["User A (Enterprise Tech)", userAEmail, hashA, "Company A Enterprises"]
      );
      const userAId = resA.rows[0].id;
      await client.query(
        `INSERT INTO business_metrics (user_id, revenue, expenses, active_customers, churn_rate, growth_rate, currency)
         VALUES ($1, 5000000, 3200000, 350, 2.2, 28.5, 'USD')`,
        [userAId]
      );
      console.log(`🏢 Auto-seeded demo user: ${userAEmail}`);
    }
  } catch (seedErr) {
    console.warn("⚠️ Database auto-seed warning:", seedErr);
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
      await autoSeedDefaults(client);
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
