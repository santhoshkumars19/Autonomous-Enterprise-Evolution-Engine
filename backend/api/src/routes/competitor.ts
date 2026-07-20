import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { getCompanyContext, getIndustryCompetitors } from "../services/industryEngine";

const router = Router();
router.use(authenticate);

// GET /api/competitor/overview — Benchmark competitor cards per company
router.get("/overview", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ctx = await getCompanyContext(req.user!.id);
    const { competitors } = getIndustryCompetitors(ctx);

    const matrix = [
      { feature: "Industry AI Telemetry", you: true, x: false, tech: true, data: false, ent: false },
      { feature: "Real-Time Telemetry", you: true, x: true, tech: false, data: false, ent: false },
      { feature: "Multi-Market Intel", you: true, x: false, tech: true, data: true, ent: false },
      { feature: "Financial Modeling", you: true, x: true, tech: false, data: true, ent: true },
      { feature: "SOC2 + ISO27001", you: true, x: true, tech: true, data: false, ent: true },
    ];

    const pricing = competitors.map((c) => ({
      name: c.name,
      price: c.pricing || 199,
    }));

    res.json({ success: true, competitors, matrix, pricing, industry: ctx.industry, businessType: ctx.businessType });
  } catch (error) {
    console.error("Competitor overview error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET /api/competitor/activity — Live activity feed
router.get("/activity", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ctx = await getCompanyContext(req.user!.id);
    const { feed } = getIndustryCompetitors(ctx);
    res.json({ success: true, feed, industry: ctx.industry, businessType: ctx.businessType });
  } catch (error) {
    console.error("Competitor activity error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
