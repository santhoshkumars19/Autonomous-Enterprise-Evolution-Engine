import { Router, Response } from "express";
import { z } from "zod";
import { query } from "../config/db";
import { authenticate, AuthRequest } from "../middleware/auth";
import { generatePersonalizedAIAnalysis } from "../services/aiEngine";

const router = Router();
router.use(authenticate);

// GET /api/business/setup — Fetch company setup details & status
router.get("/setup", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    if (req.user!.role === "admin") {
      res.json({
        success: true,
        setupCompleted: true,
        business_setup_completed: true,
        role: "admin",
        user_id: userId,
        message: "Business Setup is not applicable for Admin users.",
      });
      return;
    }

    const [user] = await query<{
      id: string;
      company_id: string;
      company: string;
      role: string;
      setup_completed: boolean;
    }>("SELECT id, company_id, company, role, setup_completed FROM users WHERE id = $1", [userId]);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    let companyData: { setup_completed?: boolean; [key: string]: any } | null = null;
    if (user.company_id) {
      const [comp] = await query<{ setup_completed: boolean; [key: string]: any }>(
        `SELECT id, name, industry, business_type, company_size, num_employees,
                country, state, city, products_services, setup_completed
         FROM companies WHERE id = $1`,
        [user.company_id]
      );
      companyData = comp;
    }

    const [metrics] = await query(
      "SELECT revenue, expenses, currency FROM business_metrics WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 1",
      [userId]
    );

    const isSetupCompleted = Boolean(user.setup_completed || companyData?.setup_completed);

    res.json({
      success: true,
      setupCompleted: isSetupCompleted,
      business_setup_completed: isSetupCompleted,
      role: user.role,
      company_id: user.company_id,
      user_id: user.id,
      userCompany: user.company,
      company: companyData,
      metrics,
    });
  } catch (error) {
    console.error("Get setup error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/business/setup — Submit Business Setup Wizard
const setupSchema = z.object({
  companyName: z.string().min(1),
  businessType: z.string().min(1),
  industry: z.string().min(1),
  companySize: z.string().optional(),
  numEmployees: z.number().or(z.string()).optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  productsServices: z.string().optional(),
  annualRevenue: z.number().or(z.string()),
  annualExpenses: z.number().or(z.string()),
  currency: z.string().optional(),
});

router.post("/setup", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const body = setupSchema.parse(req.body);

    const revenue = Number(body.annualRevenue) || 0;
    const expenses = Number(body.annualExpenses) || 0;
    const numEmp = Number(body.numEmployees) || 10;
    const currency = body.currency || "USD";

    // 1. Create or Update Company
    const [user] = await query<{ company_id: string }>("SELECT company_id FROM users WHERE id = $1", [userId]);
    let companyId = user?.company_id;

    if (companyId) {
      await query(
        `UPDATE companies
         SET name = $1, business_type = $2, industry = $3, company_size = $4,
             num_employees = $5, country = $6, state = $7, city = $8,
             products_services = $9, setup_completed = TRUE, updated_at = NOW()
         WHERE id = $10`,
        [
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
        ]
      );
    } else {
      const [newComp] = await query<{ id: string }>(
        `INSERT INTO companies
         (name, business_type, industry, company_size, num_employees, country, state, city, products_services, setup_completed)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE)
         RETURNING id`,
        [
          body.companyName,
          body.businessType,
          body.industry,
          body.companySize || "11-50",
          numEmp,
          body.country || "United States",
          body.state || "California",
          body.city || "San Francisco",
          body.productsServices || "Services",
        ]
      );
      companyId = newComp.id;
    }

    // 2. Update user record
    await query(
      "UPDATE users SET company = $1, company_id = $2, setup_completed = TRUE, updated_at = NOW() WHERE id = $3",
      [body.companyName, companyId, userId]
    );

    // 3. Save initial business metrics
    await query(
      `INSERT INTO business_metrics
       (user_id, company_id, revenue, expenses, active_customers, churn_rate, growth_rate, currency)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId, companyId, revenue, expenses, Math.max(10, Math.round(revenue / 5000)), 3.2, 18.0, currency]
    );

    // 4. Trigger personalized AI analysis
    const analysis = await generatePersonalizedAIAnalysis({
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.flatten().fieldErrors });
      return;
    }
    console.error("Submit setup error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/business/operations — Save Business Operations entry
router.post("/operations", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { businessType, metricsData } = req.body;

    const [user] = await query<{ company_id: string; company: string }>(
      "SELECT company_id, company FROM users WHERE id = $1",
      [userId]
    );

    const [opEntry] = await query(
      `INSERT INTO business_operations (user_id, company_id, business_type, metrics_data)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, user?.company_id || null, businessType || "General", JSON.stringify(metricsData || {})]
    );

    // Extract dynamic revenue & expenses if present to update metrics
    const rev = Number(metricsData.revenue || metricsData.dailySales || metricsData.projectRevenue || metricsData.orders * 500) || 0;
    const exp = Number(metricsData.expenses || metricsData.operationalExpenses || metricsData.foodCost) || 0;

    if (rev > 0 || exp > 0) {
      await query(
        `INSERT INTO business_metrics (user_id, company_id, revenue, expenses)
         VALUES ($1, $2, $3, $4)`,
        [userId, user?.company_id || null, rev, exp]
      );
    }

    // Fetch latest metrics from DB if operations entry didn't contain explicit revenue/expenses
    const [latestMetrics] = await query<{ revenue: number; expenses: number }>(
      "SELECT revenue, expenses FROM business_metrics WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 1",
      [userId]
    );

    const finalRevenue = rev > 0 ? rev : Number(latestMetrics?.revenue || 0);
    const finalExpenses = exp > 0 ? exp : Number(latestMetrics?.expenses || 0);

    // Re-trigger AI analysis
    const analysis = await generatePersonalizedAIAnalysis({
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
  } catch (error) {
    console.error("Operations submit error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

import { getCompanyContext, getIndustryMarketing } from "../services/industryEngine";

// GET /api/business/operations — List logged-in user's operations logs & marketing campaigns
router.get("/operations", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const ctx = await getCompanyContext(userId);
    const ops = await query(
      "SELECT * FROM business_operations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
      [userId]
    );
    const campaigns = getIndustryMarketing(ctx);
    res.json({ success: true, operations: ops, campaigns, industry: ctx.industry, businessType: ctx.businessType });
  } catch (error) {
    console.error("Get operations error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
