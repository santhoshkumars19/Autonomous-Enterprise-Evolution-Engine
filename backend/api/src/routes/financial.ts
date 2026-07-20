import { Router, Response } from "express";
import { query } from "../config/db";
import { authenticate, AuthRequest } from "../middleware/auth";
import { generatePersonalizedAIAnalysis } from "../services/aiEngine";

const router = Router();
router.use(authenticate);

// Helper to get or create isolated user business metrics
async function getUserBusinessMetrics(userId: string) {
  const userRows = await query<{ name: string; email: string; company: string; company_id: string }>(
    "SELECT name, email, company, company_id FROM users WHERE id = $1",
    [userId]
  );
  const user = userRows[0] || { name: "User", email: "user@enterprise.com", company: "Enterprise Corp", company_id: null };

  let companyData: { name?: string; business_type?: string; industry?: string } | null = null;
  if (user.company_id) {
    const [c] = await query<{ name: string; business_type: string; industry: string }>(
      "SELECT name, business_type, industry FROM companies WHERE id = $1",
      [user.company_id]
    );
    companyData = c;
  }

  const metricsRows = await query<{
    revenue: number;
    expenses: number;
    inventory_value: number;
    active_customers: number;
    churn_rate: number;
    growth_rate: number;
    currency: string;
  }>(
    "SELECT revenue, expenses, inventory_value, active_customers, churn_rate, growth_rate, currency FROM business_metrics WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 1",
    [userId]
  );

  let metrics = metricsRows[0];

  if (!metrics) {
    metrics = {
      revenue: 0,
      expenses: 0,
      inventory_value: 0,
      active_customers: 0,
      churn_rate: 0,
      growth_rate: 0,
      currency: "USD",
    };
  }

  const analysis = await generatePersonalizedAIAnalysis({
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

  return { user, metrics, analysis };
}

import { getCompanyContext, getIndustryFinancialKPIs } from "../services/industryEngine";

// GET /api/financial/overview — Personalized KPI summary
router.get("/overview", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ctx = await getCompanyContext(req.user!.id);
    const { metrics, analysis } = await getUserBusinessMetrics(req.user!.id);
    const indKpis = getIndustryFinancialKPIs(ctx);

    const kpis = {
      revenue: {
        value: Number(metrics.revenue),
        formatted: analysis.revenueAnalysis.formatted,
        label: indKpis.kpi1.label,
        change: Number(metrics.growth_rate),
        currency: metrics.currency,
      },
      net_profit: {
        value: Number(metrics.revenue) - Number(metrics.expenses),
        formatted: analysis.profitAnalysis.formatted,
        label: indKpis.kpi3.label,
        change: Number(analysis.profitAnalysis.profitMargin.toFixed(1)),
        currency: metrics.currency,
      },
      burn_rate: {
        value: Number(metrics.expenses),
        formatted: analysis.expenseAnalysis.formatted,
        label: indKpis.kpi2.label,
        change: Number(analysis.expenseAnalysis.expenseRatio.toFixed(1)),
        currency: metrics.currency,
      },
      runway_months: {
        value: Math.max(6, Math.round((Number(metrics.revenue) / (Number(metrics.expenses) || 1)) * 12)),
        label: indKpis.kpi4.label,
        change: analysis.healthScore,
        unit: "/100",
      },
    };
    res.json({ success: true, kpis, analysis, industry: ctx.industry, businessType: ctx.businessType, industryKpis: indKpis });
  } catch (error) {
    console.error("Financial overview error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET /api/financial/revenue-forecast — Monthly personalized revenue chart
router.get("/revenue-forecast", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { analysis } = await getUserBusinessMetrics(req.user!.id);
    const data = analysis.salesTrend.map((st: any) => ({
      month: st.month,
      actual: st.revenue,
      forecast: Math.round(st.revenue * 1.08),
    }));
    res.json({ success: true, data });
  } catch (error) {
    console.error("Revenue forecast error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET /api/financial/cashflow — Cash flow data for bar chart
router.get("/cashflow", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { metrics } = await getUserBusinessMetrics(req.user!.id);
    const rev = Number(metrics.revenue);
    const exp = Number(metrics.expenses);
    const data = [
      { month: "Q1", inflow: Math.round(rev * 0.22), outflow: Math.round(exp * 0.24) },
      { month: "Q2", inflow: Math.round(rev * 0.24), outflow: Math.round(exp * 0.25) },
      { month: "Q3", inflow: Math.round(rev * 0.26), outflow: Math.round(exp * 0.25) },
      { month: "Q4 (Proj)", inflow: Math.round(rev * 0.28), outflow: Math.round(exp * 0.26) },
    ];
    res.json({ success: true, data });
  } catch (error) {
    console.error("Cashflow error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET /api/financial/expenses — Personalized expense breakdown
router.get("/expenses", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ctx = await getCompanyContext(req.user!.id);
    const indKpis = getIndustryFinancialKPIs(ctx);
    const exp = Number(ctx.expenses);

    const data = indKpis.expenseBreakdown.map((b) => ({
      category: b.name,
      value: Math.round((exp * b.value) / 100),
      percentage: b.value,
      color: b.color,
    }));
    res.json({ success: true, data, industry: ctx.industry, businessType: ctx.businessType });
  } catch (error) {
    console.error("Expenses error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET /api/financial/roi — Department ROI predictions
router.get("/roi", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { analysis } = await getUserBusinessMetrics(req.user!.id);
    const data = [
      { department: "Sales", roi: parseInt(analysis.roiPrediction.salesROI, 10) || 280 },
      { department: "Marketing", roi: parseInt(analysis.roiPrediction.marketingROI, 10) || 210 },
      { department: "Product", roi: parseInt(analysis.roiPrediction.productROI, 10) || 190 },
      { department: "Operations", roi: parseInt(analysis.roiPrediction.operationsROI, 10) || 150 },
    ];
    res.json({ success: true, data });
  } catch (error) {
    console.error("ROI error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/financial/update-metrics — Update user's company metrics dynamically
router.post("/update-metrics", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { revenue, expenses, activeCustomers, churnRate, growthRate, currency } = req.body;
    const userId = req.user!.id;

    const [user] = await query<{ company_id: string; company: string }>(
      "SELECT company_id, company FROM users WHERE id = $1",
      [userId]
    );

    const [inserted] = await query(
      `INSERT INTO business_metrics
       (user_id, company_id, revenue, expenses, active_customers, churn_rate, growth_rate, currency)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        userId,
        user?.company_id || null,
        revenue,
        expenses,
        activeCustomers || 50,
        churnRate || 3.0,
        growthRate || 15.0,
        currency || "USD",
      ]
    );

    const newAnalysis = await generatePersonalizedAIAnalysis({
      userId,
      companyId: user?.company_id || undefined,
      companyName: user?.company || "Enterprise Company",
      revenue: Number(revenue),
      expenses: Number(expenses),
      activeCustomers: Number(activeCustomers || 50),
      churnRate: Number(churnRate || 3.0),
      growthRate: Number(growthRate || 15.0),
      currency: currency || "USD",
    });

    res.json({ success: true, message: "Company metrics updated & AI re-analyzed!", metrics: inserted, analysis: newAnalysis });
  } catch (error) {
    console.error("Update metrics error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
