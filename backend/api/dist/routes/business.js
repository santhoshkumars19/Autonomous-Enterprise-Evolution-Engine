"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../config/db");
const auth_1 = require("../middleware/auth");
const aiEngine_1 = require("../services/aiEngine");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// GET /api/business/setup — Fetch company setup details & status
router.get("/setup", async (req, res) => {
    try {
        const userId = req.user.id;
        if (req.user.role === "admin") {
            res.json({
                success: true,
                setupCompleted: true,
                role: "admin",
                message: "Business Setup is not applicable for Admin users.",
            });
            return;
        }
        const [user] = await (0, db_1.query)("SELECT company_id, company, setup_completed FROM users WHERE id = $1", [userId]);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        let companyData = null;
        if (user.company_id) {
            const [comp] = await (0, db_1.query)(`SELECT id, name, industry, business_type, company_size, num_employees,
                country, state, city, products_services, setup_completed
         FROM companies WHERE id = $1`, [user.company_id]);
            companyData = comp;
        }
        const [metrics] = await (0, db_1.query)("SELECT revenue, expenses, currency FROM business_metrics WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 1", [userId]);
        res.json({
            success: true,
            setupCompleted: user.setup_completed || companyData?.setup_completed || false,
            userCompany: user.company,
            company: companyData,
            metrics,
        });
    }
    catch (error) {
        console.error("Get setup error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
// POST /api/business/setup — Submit Business Setup Wizard
const setupSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(1),
    businessType: zod_1.z.string().min(1),
    industry: zod_1.z.string().min(1),
    companySize: zod_1.z.string().optional(),
    numEmployees: zod_1.z.number().or(zod_1.z.string()).optional(),
    country: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    productsServices: zod_1.z.string().optional(),
    annualRevenue: zod_1.z.number().or(zod_1.z.string()),
    annualExpenses: zod_1.z.number().or(zod_1.z.string()),
    currency: zod_1.z.string().optional(),
});
router.post("/setup", async (req, res) => {
    try {
        const userId = req.user.id;
        const body = setupSchema.parse(req.body);
        const revenue = Number(body.annualRevenue) || 0;
        const expenses = Number(body.annualExpenses) || 0;
        const numEmp = Number(body.numEmployees) || 10;
        const currency = body.currency || "USD";
        // 1. Create or Update Company
        const [user] = await (0, db_1.query)("SELECT company_id FROM users WHERE id = $1", [userId]);
        let companyId = user?.company_id;
        if (companyId) {
            await (0, db_1.query)(`UPDATE companies
         SET name = $1, business_type = $2, industry = $3, company_size = $4,
             num_employees = $5, country = $6, state = $7, city = $8,
             products_services = $9, setup_completed = TRUE, updated_at = NOW()
         WHERE id = $10`, [
                body.companyName,
                body.businessType,
                body.industry,
                body.companySize || "11-50",
                numEmp,
                body.country || "United States",
                body.state || "California",
                body.city || "San Francisco",
                body.productsServices || "Services",
                companyId,
            ]);
        }
        else {
            const [newComp] = await (0, db_1.query)(`INSERT INTO companies
         (name, business_type, industry, company_size, num_employees, country, state, city, products_services, setup_completed)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE)
         RETURNING id`, [
                body.companyName,
                body.businessType,
                body.industry,
                body.companySize || "11-50",
                numEmp,
                body.country || "United States",
                body.state || "California",
                body.city || "San Francisco",
                body.productsServices || "Services",
            ]);
            companyId = newComp.id;
        }
        // 2. Update user record
        await (0, db_1.query)("UPDATE users SET company = $1, company_id = $2, setup_completed = TRUE, updated_at = NOW() WHERE id = $3", [body.companyName, companyId, userId]);
        // 3. Save initial business metrics
        await (0, db_1.query)(`INSERT INTO business_metrics
       (user_id, company_id, revenue, expenses, active_customers, churn_rate, growth_rate, currency)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [userId, companyId, revenue, expenses, Math.max(10, Math.round(revenue / 5000)), 3.2, 18.0, currency]);
        // 4. Trigger personalized AI analysis
        const analysis = await (0, aiEngine_1.generatePersonalizedAIAnalysis)({
            userId,
            companyId,
            companyName: body.companyName,
            businessType: body.businessType,
            revenue,
            expenses,
            currency,
        });
        res.json({
            success: true,
            message: "Business Setup completed successfully!",
            setupCompleted: true,
            analysis,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
            return;
        }
        console.error("Submit setup error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
// POST /api/business/operations — Save Business Operations entry
router.post("/operations", async (req, res) => {
    try {
        const userId = req.user.id;
        const { businessType, metricsData } = req.body;
        const [user] = await (0, db_1.query)("SELECT company_id, company FROM users WHERE id = $1", [userId]);
        const [opEntry] = await (0, db_1.query)(`INSERT INTO business_operations (user_id, company_id, business_type, metrics_data)
       VALUES ($1, $2, $3, $4)
       RETURNING *`, [userId, user?.company_id || null, businessType || "General", JSON.stringify(metricsData || {})]);
        // Extract dynamic revenue & expenses if present to update metrics
        const rev = Number(metricsData.revenue || metricsData.dailySales || metricsData.projectRevenue || metricsData.orders * 500) || 0;
        const exp = Number(metricsData.expenses || metricsData.operationalExpenses || metricsData.foodCost) || 0;
        if (rev > 0 || exp > 0) {
            await (0, db_1.query)(`INSERT INTO business_metrics (user_id, company_id, revenue, expenses)
         VALUES ($1, $2, $3, $4)`, [userId, user?.company_id || null, rev, exp]);
        }
        // Fetch latest metrics from DB if operations entry didn't contain explicit revenue/expenses
        const [latestMetrics] = await (0, db_1.query)("SELECT revenue, expenses FROM business_metrics WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 1", [userId]);
        const finalRevenue = rev > 0 ? rev : Number(latestMetrics?.revenue || 0);
        const finalExpenses = exp > 0 ? exp : Number(latestMetrics?.expenses || 0);
        // Re-trigger AI analysis
        const analysis = await (0, aiEngine_1.generatePersonalizedAIAnalysis)({
            userId,
            companyId: user?.company_id || undefined,
            companyName: user?.company || "Enterprise Company",
            businessType: businessType || "General",
            revenue: finalRevenue,
            expenses: finalExpenses,
        });
        res.json({
            success: true,
            message: "Business Operations Data saved & AI analysis refreshed!",
            operation: opEntry,
            analysis,
        });
    }
    catch (error) {
        console.error("Operations submit error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
const industryEngine_1 = require("../services/industryEngine");
// GET /api/business/operations — List logged-in user's operations logs & marketing campaigns
router.get("/operations", async (req, res) => {
    try {
        const userId = req.user.id;
        const ctx = await (0, industryEngine_1.getCompanyContext)(userId);
        const ops = await (0, db_1.query)("SELECT * FROM business_operations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50", [userId]);
        const campaigns = (0, industryEngine_1.getIndustryMarketing)(ctx);
        res.json({ success: true, operations: ops, campaigns, industry: ctx.industry, businessType: ctx.businessType });
    }
    catch (error) {
        console.error("Get operations error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=business.js.map