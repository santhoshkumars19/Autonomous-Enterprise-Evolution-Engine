"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../config/db");
const auth_1 = require("../middleware/auth");
const aiEngine_1 = require("../services/aiEngine");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// Helper to fetch fresh user business metrics and run dynamic AI analysis
async function getUserAIAnalysis(userId) {
    const userRows = await (0, db_1.query)("SELECT company, company_id FROM users WHERE id = $1", [userId]);
    const user = userRows[0] || { company: "Enterprise Company", company_id: null };
    let companyData = null;
    if (user.company_id) {
        const [c] = await (0, db_1.query)("SELECT name, business_type, industry FROM companies WHERE id = $1", [user.company_id]);
        companyData = c;
    }
    const metricsRows = await (0, db_1.query)("SELECT revenue, expenses, inventory_value, active_customers, churn_rate, growth_rate, currency FROM business_metrics WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 1", [userId]);
    const metrics = metricsRows[0] || {
        revenue: 0,
        expenses: 0,
        inventory_value: 0,
        active_customers: 0,
        churn_rate: 0,
        growth_rate: 0,
        currency: "USD",
    };
    const analysis = await (0, aiEngine_1.generatePersonalizedAIAnalysis)({
        userId,
        companyId: user.company_id || undefined,
        companyName: companyData?.name || user.company || "Enterprise Company",
        businessType: companyData?.business_type || "General Enterprise",
        revenue: Number(metrics.revenue),
        expenses: Number(metrics.expenses),
        inventoryValue: Number(metrics.inventory_value),
        activeCustomers: Number(metrics.active_customers),
        churnRate: Number(metrics.churn_rate),
        growthRate: Number(metrics.growth_rate),
        currency: metrics.currency || "USD",
    });
    return { healthScore: analysis.healthScore, analysis };
}
const industryEngine_1 = require("../services/industryEngine");
// GET /api/reports — List all reports for logged in user (with industry defaults if empty)
router.get("/", async (req, res) => {
    try {
        const ctx = await (0, industryEngine_1.getCompanyContext)(req.user.id);
        let reports = await (0, db_1.query)("SELECT * FROM reports WHERE user_id = $1 ORDER BY created_at DESC", [req.user.id]);
        if (reports.length === 0) {
            const defaultReps = (0, industryEngine_1.getIndustryReports)(ctx);
            reports = defaultReps.map((r) => ({
                id: r.id,
                user_id: req.user.id,
                company_id: ctx.companyId,
                title: r.title,
                type: r.type.toLowerCase(),
                period: r.period,
                status: "ready",
                metadata: { score: r.score, industry: ctx.industry },
                created_at: new Date().toISOString(),
            }));
        }
        res.json({ success: true, reports, industry: ctx.industry, businessType: ctx.businessType });
    }
    catch (error) {
        console.error("Get reports error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
// GET /api/reports/swot — Personalized SWOT analysis
router.get("/swot", async (req, res) => {
    try {
        const { analysis } = await getUserAIAnalysis(req.user.id);
        res.json({ success: true, swot: analysis.swotAnalysis, companyName: analysis.companyName });
    }
    catch (error) {
        console.error("SWOT error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
// GET /api/reports/health — Personalized Business Health radar data & CEO Recommendations
router.get("/health", async (req, res) => {
    try {
        const ctx = await (0, industryEngine_1.getCompanyContext)(req.user.id);
        const { healthScore, analysis } = await getUserAIAnalysis(req.user.id);
        const ceoRecs = (0, industryEngine_1.getIndustryCEORecommendations)(ctx);
        const indTrends = (0, industryEngine_1.getIndustryTrends)(ctx);
        const pMargin = Math.min(100, Math.max(10, Math.round(analysis.profitAnalysis.profitMargin)));
        const cRetention = Math.min(100, Math.max(10, Math.round(100 - (analysis.customerAnalysis.churnRate || 3))));
        const gRate = Math.min(100, Math.max(10, Math.round((analysis.revenueAnalysis.growthRate || 15) * 3)));
        const riskScore = Math.min(100, Math.max(10, Math.round(100 - (analysis.riskAssessment.financialRiskScore || 20))));
        const radarData = [
            { metric: "Profit Margin", score: pMargin },
            { metric: "Customer Retention", score: cRetention },
            { metric: "Revenue Growth", score: gRate },
            { metric: "Risk Defense", score: riskScore },
            { metric: "Executive Health", score: healthScore },
        ];
        res.json({
            success: true,
            score: healthScore,
            radarData,
            analysis,
            ceoRecommendations: ceoRecs,
            industryTrends: indTrends,
            industry: ctx.industry,
            businessType: ctx.businessType,
        });
    }
    catch (error) {
        console.error("Health error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
// POST /api/reports/generate — Generate a personalized report record
router.post("/generate", async (req, res) => {
    try {
        const schema = zod_1.z.object({
            title: zod_1.z.string().min(1),
            type: zod_1.z.enum(["executive_summary", "financial", "competitor", "swot", "custom"]),
            period: zod_1.z.string().optional(),
        });
        const body = schema.parse(req.body);
        const { analysis } = await getUserAIAnalysis(req.user.id);
        const [user] = await (0, db_1.query)("SELECT company_id FROM users WHERE id = $1", [req.user.id]);
        const [report] = await (0, db_1.query)(`INSERT INTO reports (user_id, company_id, title, type, period, status, metadata)
       VALUES ($1, $2, $3, $4, $5, 'ready', $6)
       RETURNING *`, [
            req.user.id,
            user?.company_id || null,
            body.title,
            body.type,
            body.period ?? "Q4 2026",
            JSON.stringify({ executiveSummary: analysis.executiveSummary, healthScore: analysis.healthScore }),
        ]);
        res.status(201).json({ success: true, report, analysis });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
            return;
        }
        console.error("Generate report error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=reports.js.map