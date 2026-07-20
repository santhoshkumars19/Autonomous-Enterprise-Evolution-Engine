"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function setupDatabase() {
    console.log("\n🐘 Initializing EvoAI PostgreSQL Database...");
    try {
        // 1. Read schema.sql
        const schemaPath = path_1.default.join(__dirname, "schema.sql");
        const sql = fs_1.default.readFileSync(schemaPath, "utf-8");
        // 2. Execute full schema DDL
        await db_1.pool.query(sql);
        console.log("✅ Database schema tables & indexes created successfully!");
        // 3. Create required Admin User (admin@evoai.com) if not existing
        const adminEmail = "admin@evoai.com";
        const existingAdmin = await db_1.pool.query("SELECT id FROM users WHERE email = $1", [adminEmail]);
        if (existingAdmin.rowCount === 0) {
            const passwordHash = await bcryptjs_1.default.hash("Admin@123", 12);
            await db_1.pool.query(`INSERT INTO users (name, email, password_hash, company, role)
         VALUES ($1, $2, $3, $4, 'admin')`, ["EvoAI System Admin", adminEmail, passwordHash, "EvoAI Corporation"]);
            console.log(`👤 Seeded required admin user: ${adminEmail} (Role: admin)`);
        }
        // 4. Seed Company A User (compA@evoai.com) & Metrics
        const userAEmail = "compA@evoai.com";
        const existingA = await db_1.pool.query("SELECT id FROM users WHERE email = $1", [userAEmail]);
        if (existingA.rowCount === 0) {
            const hashA = await bcryptjs_1.default.hash("User@123", 12);
            const resA = await db_1.pool.query(`INSERT INTO users (name, email, password_hash, company, role)
         VALUES ($1, $2, $3, $4, 'user') RETURNING id`, ["User A (Enterprise Tech)", userAEmail, hashA, "Company A Enterprises"]);
            const userAId = resA.rows[0].id;
            await db_1.pool.query(`INSERT INTO business_metrics (user_id, revenue, expenses, active_customers, churn_rate, growth_rate, currency)
         VALUES ($1, 5000000, 3200000, 350, 2.2, 28.5, 'USD')`, [userAId]);
            console.log(`🏢 Seeded Company A user: ${userAEmail} (Revenue: $5,000,000, Expenses: $3,200,000)`);
        }
        // 5. Seed Company B User (compB@evoai.com) & Metrics
        const userBEmail = "compB@evoai.com";
        const existingB = await db_1.pool.query("SELECT id FROM users WHERE email = $1", [userBEmail]);
        if (existingB.rowCount === 0) {
            const hashB = await bcryptjs_1.default.hash("User@123", 12);
            const resB = await db_1.pool.query(`INSERT INTO users (name, email, password_hash, company, role)
         VALUES ($1, $2, $3, $4, 'user') RETURNING id`, ["User B (Regional Logistics)", userBEmail, hashB, "Company B Logistics"]);
            const userBId = resB.rows[0].id;
            await db_1.pool.query(`INSERT INTO business_metrics (user_id, revenue, expenses, active_customers, churn_rate, growth_rate, currency)
         VALUES ($1, 800000, 720000, 42, 6.4, 8.2, 'INR')`, [userBId]);
            console.log(`🏢 Seeded Company B user: ${userBEmail} (Revenue: ₹8,00,000, Expenses: ₹7,20,000)`);
        }
        console.log("🚀 Database setup completed cleanly!\n");
    }
    catch (error) {
        console.error("❌ Database setup failed:", error);
        process.exit(1);
    }
    finally {
        await db_1.pool.end();
    }
}
setupDatabase();
//# sourceMappingURL=setup.js.map