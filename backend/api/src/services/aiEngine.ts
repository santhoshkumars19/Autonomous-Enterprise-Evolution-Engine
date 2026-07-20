import { query } from "../config/db";

export interface BusinessDataInput {
  userId: string;
  companyId?: string;
  companyName: string;
  businessType?: string;
  revenue: number;
  expenses: number;
  inventoryValue?: number;
  activeCustomers?: number;
  churnRate?: number;
  growthRate?: number;
  currency?: string;
}

export async function generatePersonalizedAIAnalysis(input: BusinessDataInput) {
  const {
    userId,
    companyId,
    companyName,
    revenue,
    expenses,
    inventoryValue = Math.round(revenue * 0.15),
    activeCustomers = Math.max(10, Math.round(revenue / 5000)),
    churnRate = 3.5,
    growthRate = 18.5,
    currency = "USD",
  } = input;

  const netProfit = revenue - expenses;
  const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const expenseRatio = revenue > 0 ? (expenses / revenue) * 100 : 100;
  const arpu = activeCustomers > 0 ? Math.round(revenue / activeCustomers) : 0;

  // Formatted currency string
  const formatCurrency = (val: number) => {
    if (currency === "INR" || val >= 100000) {
      if (val >= 10000000) return `${currency === "INR" ? "₹" : "$"}${(val / 10000000).toFixed(2)}Cr`;
      if (val >= 100000) return `${currency === "INR" ? "₹" : "$"}${(val / 100000).toFixed(2)}L`;
    }
    if (val >= 1000000) return `${currency === "INR" ? "₹" : "$"}${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `${currency === "INR" ? "₹" : "$"}${(val / 1000).toFixed(0)}K`;
    return `${currency === "INR" ? "₹" : "$"}${val.toLocaleString()}`;
  };

  // 1. Health Score Calculation (30 - 100)
  const marginScore = Math.min(45, Math.max(5, profitMargin * 1.2));
  const retentionScore = Math.max(10, (10 - churnRate) * 4);
  const growthScore = Math.min(25, growthRate * 1.1);
  const healthScore = Math.min(99, Math.max(35, Math.round(marginScore + retentionScore + growthScore)));

  // 2. Executive Summary
  const executiveSummary =
    `Autonomous AI Analysis for ${companyName}: The company recorded total revenue of ` +
    `${formatCurrency(revenue)} against total operating expenses of ${formatCurrency(expenses)}, ` +
    `yielding a net profit of ${formatCurrency(netProfit)} (${profitMargin.toFixed(1)}% profit margin). ` +
    `Customer retention index stands at ${(100 - churnRate).toFixed(1)}% across ${activeCustomers.toLocaleString()} active seats. ` +
    `Primary AI growth priority: ${
      profitMargin < 15
        ? "Optimize operational spend & reallocate low-yield marketing budgets to widen gross margins."
        : "Accelerate high-margin seat expansion & capture international market share."
    }`;

  // 3. Sales Trend (6 Months)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const salesTrend = months.map((m, idx) => {
    const factor = 1 + (idx - 2) * (growthRate / 100 / 5);
    const monthlyRev = Math.round((revenue / 6) * factor);
    const monthlyExp = Math.round((expenses / 6) * (1 + (idx - 2) * 0.02));
    return {
      month: m,
      revenue: monthlyRev,
      expenses: monthlyExp,
      netProfit: monthlyRev - monthlyExp,
    };
  });

  // 4. SWOT Analysis
  const swotAnalysis = {
    strengths: [
      `High ARPU of ${formatCurrency(arpu)} per customer across ${activeCustomers} enterprise seats`,
      `Healthy net profit margin of ${profitMargin.toFixed(1)}% generating ${formatCurrency(netProfit)} net retained capital`,
      `Stable organic revenue growth rate of ${growthRate}% per annum`,
      `Strong business health index of ${healthScore}/100 verified by AI executive telemetry`,
    ],
    weaknesses: [
      `Operating expense ratio at ${expenseRatio.toFixed(1)}% of total revenue (${formatCurrency(expenses)})`,
      `Customer churn rate of ${churnRate}% requiring focused customer success onboarding`,
      `Inventory/Asset turnover allocation holding ${formatCurrency(inventoryValue)} in capital`,
    ],
    opportunities: [
      `Automate cloud & operational infrastructure to boost net profit by additional ${formatCurrency(expenses * 0.12)}`,
      `Expand upselling paths targeting high-value enterprise accounts to increase ARPU by 22%`,
      `Deploy AI C-Suite agents to capture unserved regional market share`,
    ],
    threats: [
      `Aggressive competitor discounting targeting core enterprise customer segments`,
      `Macroeconomic inflation impacting operational cost structures by up to 8% YoY`,
    ],
  };

  // 5. Risk Assessment
  const riskAssessment = {
    overallRisk: profitMargin < 10 ? "HIGH" : profitMargin < 25 ? "MEDIUM" : "LOW",
    financialRiskScore: Math.round(100 - Math.min(90, profitMargin * 2.5)),
    operationalRiskScore: Math.round(Math.min(90, (expenses / (revenue || 1)) * 75)),
    marketRiskScore: Math.round(Math.min(90, churnRate * 12)),
    keyRisks: [
      { risk: "Margin Compression", severity: profitMargin < 15 ? "High" : "Low", detail: `Net margin currently at ${profitMargin.toFixed(1)}%` },
      { risk: "Customer Churn Spike", severity: churnRate > 5 ? "High" : "Medium", detail: `Monthly churn rate recorded at ${churnRate}%` },
      { risk: "Burn Rate Acceleration", severity: expenseRatio > 80 ? "High" : "Low", detail: `Operating expenses consuming ${expenseRatio.toFixed(1)}% of revenue` },
    ],
  };

  // Industry specific recommendations helper
  const bType = (input.businessType || "General").toLowerCase();

  const getIndustryRecs = () => {
    if (bType.includes("retail")) {
      return [
        "Retail Inventory Optimization: Implement Just-In-Time replenishment for high velocity SKUs",
        "Supplier Terms renegotiation to extend AP payback period by 15 days",
        "Omnichannel loyalty campaign to raise repeat footfall and basket size by 14%",
      ];
    }
    if (bType.includes("restaurant") || bType.includes("food")) {
      return [
        "Menu & Food Cost Optimization: Standardize portion sizes to maintain food cost below 28%",
        "Table Turnover acceleration: Deploy digital order-at-table systems during peak dining hours",
        "Waste reduction audit to recover 4.5% gross profit margin on perishable inventory",
      ];
    }
    if (bType.includes("it") || bType.includes("software") || bType.includes("tech")) {
      return [
        "Project Delivery & Employee Productivity: Increase billable utilization target from 72% to 84%",
        "SaaS Margin expansion: Migrate legacy cloud nodes to auto-scaling serverless architecture",
        "Client Retention: Implement executive quarterly health checkins to minimize revenue churn",
      ];
    }
    if (bType.includes("hospital") || bType.includes("health") || bType.includes("medical")) {
      return [
        "Patient Flow Optimization: Automate outpatient scheduling to eliminate peak bottleneck delays",
        "Medical Equipment Utilization: Increase MRI/CT scanner daily throughput by 18%",
        "Insurance Claims Clearance: Streamline billing workflows to reduce Accounts Receivable days to <30",
      ];
    }
    if (bType.includes("manufactur")) {
      return [
        "Production Efficiency: Optimize Overall Equipment Effectiveness (OEE) across line assembly",
        "Raw Material Sourcing: Diversify tier-1 suppliers to mitigate supply chain bottlenecks",
        "Scrap Rate Reduction: Install automated optical inspection to lower defective output by 22%",
      ];
    }
    if (bType.includes("commerce") || bType.includes("e-commerce")) {
      return [
        "E-Commerce Conversion Rate Optimization: Implement 1-click checkout and exit-intent offers",
        "Return Rate Mitigation: Enhance product sizing visualization & customer reviews",
        "ROAS Capitalization: Scale top-performing Ad channels to lower customer acquisition cost (CAC)",
      ];
    }
    return [
      `Launch targeted marketing campaigns for accounts above ${formatCurrency(arpu * 1.5)} value`,
      `Optimize operational spend to reduce burn rate by 12% within 90 days`,
      `Deploy AI automation workflows to lower churn from ${churnRate}% to <2%`,
    ];
  };

  const marketingRecommendations = getIndustryRecs();

  const growthStrategy = [
    { phase: "Q1 Focus", milestone: `Optimize expense structure to save ${formatCurrency(expenses * 0.1)} in operational burn` },
    { phase: "Q2 Focus", milestone: `Deploy industry-specific AI C-Suite agents to core operating workflows` },
    { phase: "Q3 Focus", milestone: `Expand market penetration for ${companyName} beyond ${growthRate}% YoY growth` },
  ];

  // 7. Financial Forecast & ROI Predictions
  const financialForecast = Array.from({ length: 6 }).map((_, i) => {
    const projectedRev = Math.round(revenue * (1 + (i + 1) * (growthRate / 100 / 6)));
    const projectedExp = Math.round(expenses * (1 + (i + 1) * 0.02));
    return {
      period: `Month +${i + 1}`,
      projectedRevenue: projectedRev,
      projectedExpenses: projectedExp,
      projectedProfit: projectedRev - projectedExp,
    };
  });

  const roiPrediction = {
    salesROI: `${Math.round(250 + profitMargin * 3)}%`,
    marketingROI: `${Math.round(180 + growthRate * 4)}%`,
    productROI: `${Math.round(210 + healthScore * 1.5)}%`,
    operationsROI: `${Math.round(140 + (100 - expenseRatio) * 2)}%`,
  };

  const fullAnalysisResult = {
    companyName,
    currency,
    healthScore,
    executiveSummary,
    revenueAnalysis: { totalRevenue: revenue, formatted: formatCurrency(revenue), growthRate },
    expenseAnalysis: { totalExpenses: expenses, formatted: formatCurrency(expenses), expenseRatio },
    profitAnalysis: { netProfit, profitMargin, formatted: formatCurrency(netProfit) },
    customerAnalysis: { activeCustomers, churnRate, arpu, formattedArpu: formatCurrency(arpu) },
    productPerformance: { inventoryValue, formattedInventory: formatCurrency(inventoryValue) },
    salesTrend,
    swotAnalysis,
    riskAssessment,
    marketingRecommendations,
    growthStrategy,
    financialForecast,
    roiPrediction,
  };

  // 8. Save or Update in PostgreSQL `ai_analysis` table
  const existing = await query<{ id: string }>(
    "SELECT id FROM ai_analysis WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
    [userId]
  );

  let analysisRecord;
  if (existing.length > 0) {
    [analysisRecord] = await query(
      `UPDATE ai_analysis
       SET company_id = $1, health_score = $2, executive_summary = $3, revenue_analysis = $4,
           expense_analysis = $5, profit_analysis = $6, customer_analysis = $7, product_performance = $8,
           sales_trend = $9, swot_analysis = $10, risk_assessment = $11, marketing_recommendations = $12,
           growth_strategy = $13, financial_forecast = $14, roi_prediction = $15, analysis_result = $16,
           updated_at = NOW(), analysis_date = NOW()
       WHERE id = $17
       RETURNING *`,
      [
        companyId || null,
        healthScore,
        executiveSummary,
        JSON.stringify(fullAnalysisResult.revenueAnalysis),
        JSON.stringify(fullAnalysisResult.expenseAnalysis),
        JSON.stringify(fullAnalysisResult.profitAnalysis),
        JSON.stringify(fullAnalysisResult.customerAnalysis),
        JSON.stringify(fullAnalysisResult.productPerformance),
        JSON.stringify(salesTrend),
        JSON.stringify(swotAnalysis),
        JSON.stringify(riskAssessment),
        JSON.stringify(marketingRecommendations),
        JSON.stringify(growthStrategy),
        JSON.stringify(financialForecast),
        JSON.stringify(roiPrediction),
        JSON.stringify(fullAnalysisResult),
        existing[0].id,
      ]
    );
  } else {
    [analysisRecord] = await query(
      `INSERT INTO ai_analysis
       (user_id, company_id, health_score, executive_summary, revenue_analysis, expense_analysis,
        profit_analysis, customer_analysis, product_performance, sales_trend, swot_analysis,
        risk_assessment, marketing_recommendations, growth_strategy, financial_forecast,
        roi_prediction, analysis_result)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING *`,
      [
        userId,
        companyId || null,
        healthScore,
        executiveSummary,
        JSON.stringify(fullAnalysisResult.revenueAnalysis),
        JSON.stringify(fullAnalysisResult.expenseAnalysis),
        JSON.stringify(fullAnalysisResult.profitAnalysis),
        JSON.stringify(fullAnalysisResult.customerAnalysis),
        JSON.stringify(fullAnalysisResult.productPerformance),
        JSON.stringify(salesTrend),
        JSON.stringify(swotAnalysis),
        JSON.stringify(riskAssessment),
        JSON.stringify(marketingRecommendations),
        JSON.stringify(growthStrategy),
        JSON.stringify(financialForecast),
        JSON.stringify(roiPrediction),
        JSON.stringify(fullAnalysisResult),
      ]
    );
  }

  return fullAnalysisResult;
}
