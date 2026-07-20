import { query } from "../config/db";

export interface CompanyContext {
  userId: string;
  companyId?: string;
  companyName: string;
  industry: string;
  businessType: string;
  companySize?: string;
  productsServices?: string;
  revenue: number;
  expenses: number;
  currency: string;
}

/**
 * Fetch authenticated company context from database
 */
export async function getCompanyContext(userId: string): Promise<CompanyContext> {
  const userRows = await query<{ company_id: string; company: string }>(
    "SELECT company_id, company FROM users WHERE id = $1",
    [userId]
  );
  const user = userRows[0];
  const companyId = user?.company_id;

  let companyData: any = {};
  if (companyId) {
    const compRows = await query<any>(
      "SELECT id, name, industry, business_type, company_size, products_services FROM companies WHERE id = $1",
      [companyId]
    );
    if (compRows.length > 0) companyData = compRows[0];
  }

  const metricRows = await query<{ revenue: number; expenses: number; currency: string }>(
    "SELECT revenue, expenses, currency FROM business_metrics WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 1",
    [userId]
  );
  const metrics = metricRows[0];

  return {
    userId,
    companyId,
    companyName: companyData.name || user?.company || "Enterprise Company",
    industry: (companyData.industry || "Information Technology").trim(),
    businessType: (companyData.business_type || "Software Company").trim(),
    companySize: companyData.company_size || "Medium",
    productsServices: companyData.products_services || "",
    revenue: Number(metrics?.revenue) || 1200000,
    expenses: Number(metrics?.expenses) || 800000,
    currency: metrics?.currency || "USD",
  };
}

/**
 * 1. Competitors Module Adaptation
 */
export function getIndustryCompetitors(ctx: CompanyContext) {
  const ind = ctx.industry.toLowerCase();
  const btype = ctx.businessType.toLowerCase();

  let compList: Array<{ name: string; share: string; growth: string; pricing: number; tag: string; activity: string }> = [];

  if (ind.includes("retail") || btype.includes("retail") || btype.includes("supermarket") || btype.includes("store")) {
    if (btype.includes("fashion") || btype.includes("apparel")) {
      compList = [
        { name: "Zara", share: "28%", growth: "+14%", pricing: 120, tag: "Challenger", activity: "Zara launched autumn sustainable apparel collection" },
        { name: "H&M", share: "22%", growth: "+9%", pricing: 90, tag: "Follower", activity: "H&M expanded digital omnichannel loyalty program" },
        { name: "Uniqlo", share: "18%", growth: "+16%", pricing: 110, tag: "Niche", activity: "Uniqlo opened 15 new flagship retail stores" },
        { name: "Reliance Trends", share: "14%", growth: "+22%", pricing: 75, tag: "Aggressive", activity: "Reliance Trends cut prices by 15% across tier-2 cities" },
      ];
    } else {
      compList = [
        { name: "D-Mart", share: "32%", growth: "+21%", pricing: 85, tag: "Cost Leader", activity: "D-Mart added 12 hypermarket fulfillment hubs" },
        { name: "Reliance Smart", share: "26%", growth: "+18%", pricing: 95, tag: "Challenger", activity: "Reliance Smart integrated 1-hour grocery delivery" },
        { name: "More Supermarket", share: "15%", growth: "+8%", pricing: 105, tag: "Regional", activity: "More Supermarket expanded fresh produce supply chain" },
        { name: "Spencer's", share: "11%", growth: "+6%", pricing: 115, tag: "Niche", activity: "Spencer's launched gourmet imported foods section" },
      ];
    }
  } else if (ind.includes("restaurant") || ind.includes("food") || btype.includes("restaurant") || btype.includes("cafe")) {
    compList = [
      { name: "McDonald's", share: "30%", growth: "+15%", pricing: 15, tag: "Global Leader", activity: "McDonald's introduced AI automated drive-thru ordering" },
      { name: "Dominos", share: "24%", growth: "+19%", pricing: 18, tag: "Delivery Giant", activity: "Dominos guaranteed 20-minute app delivery window" },
      { name: "KFC", share: "18%", growth: "+11%", pricing: 22, tag: "Challenger", activity: "KFC expanded regional franchise outlet footprint" },
      { name: "Burger King", share: "14%", growth: "+12%", pricing: 16, tag: "Follower", activity: "Burger King launched plant-based value meals" },
    ];
  } else if (ind.includes("health") || ind.includes("hospital") || btype.includes("hospital") || btype.includes("clinic")) {
    compList = [
      { name: "Apollo Hospitals", share: "34%", growth: "+16%", pricing: 450, tag: "Market Leader", activity: "Apollo Hospitals deployed AI robotic surgery units" },
      { name: "Fortis Healthcare", share: "22%", growth: "+11%", pricing: 380, tag: "Challenger", activity: "Fortis launched 24/7 tele-ICU remote monitoring" },
      { name: "Aster DM Healthcare", share: "16%", growth: "+14%", pricing: 320, tag: "Regional Leader", activity: "Aster opened 300-bed multispecialty center" },
      { name: "Kauvery Hospital", share: "12%", growth: "+18%", pricing: 290, tag: "Fast Growing", activity: "Kauvery Hospital expanded cardiac & oncology wings" },
    ];
  } else if (ind.includes("manufactur") || btype.includes("factory") || btype.includes("industrial")) {
    compList = [
      { name: "Tata Steel", share: "29%", growth: "+12%", pricing: 1400, tag: "Industry Giant", activity: "Tata Steel commissioned green hydrogen plant" },
      { name: "Larsen & Toubro", share: "24%", growth: "+15%", pricing: 1800, tag: "Leader", activity: "L&T bagged $1.2B EPC infrastructure contract" },
      { name: "BHEL", share: "17%", growth: "+7%", pricing: 1100, tag: "State Enterprise", activity: "BHEL upgraded heavy electrical turbine production" },
      { name: "Godrej Industries", share: "13%", growth: "+10%", pricing: 950, tag: "Diversified", activity: "Godrej automated consumer goods packaging lines" },
    ];
  } else if (ind.includes("e-commerce") || btype.includes("e-commerce")) {
    compList = [
      { name: "Amazon", share: "38%", growth: "+22%", pricing: 120, tag: "Global Leader", activity: "Amazon expanded Same-Day delivery to 40 new cities" },
      { name: "Flipkart", share: "31%", growth: "+19%", pricing: 110, tag: "Challenger", activity: "Flipkart launched AI shopping assistant" },
      { name: "Meesho", share: "14%", growth: "+35%", pricing: 45, tag: "Social Commerce", activity: "Meesho eliminated seller commission fees" },
      { name: "Myntra", share: "10%", growth: "+16%", pricing: 130, tag: "Fashion Leader", activity: "Myntra hosted 48-hour end of season sale" },
    ];
  } else {
    // IT / Software / Default B2B Tech
    compList = [
      { name: "TCS", share: "31%", growth: "+12%", pricing: 1200, tag: "Market Leader", activity: "TCS won $500M digital cloud transformation deal" },
      { name: "Infosys", share: "25%", growth: "+14%", pricing: 1100, tag: "Challenger", activity: "Infosys launched generative AI platform for enterprise" },
      { name: "Wipro", share: "18%", growth: "+8%", pricing: 950, tag: "Global IT", activity: "Wipro expanded European consulting practice" },
      { name: "Accenture", share: "14%", growth: "+16%", pricing: 1400, tag: "Consulting Giant", activity: "Accenture acquired 3 AI & cybersecurity boutiques" },
    ];
  }

  const userScore = Math.min(98, Math.max(70, Math.round((ctx.revenue / (ctx.expenses || 1)) * 50 + 40)));

  const competitors = [
    { name: `You (${ctx.companyName})`, score: userScore, growth: "+24%", share: "16%", tag: "Your Business", highlight: true, pricing: Math.round(ctx.revenue / 2000) || 499 },
    ...compList.map((c, i) => ({
      name: c.name,
      score: Math.max(40, userScore - (i + 1) * 6),
      growth: c.growth,
      share: c.share,
      tag: c.tag,
      pricing: c.pricing,
      highlight: false,
    })),
  ];

  const feed = compList.map((c, i) => ({
    time: `${(i + 1) * 18}m ago`,
    event: c.activity,
    severity: i === 0 ? "high" : i === 1 ? "medium" : "low",
  }));

  return { competitors, feed };
}

/**
 * 2. Market Trends Module Adaptation
 */
export function getIndustryTrends(ctx: CompanyContext) {
  const ind = ctx.industry.toLowerCase();
  const btype = ctx.businessType.toLowerCase();

  if (ind.includes("retail") || btype.includes("retail") || btype.includes("supermarket")) {
    return {
      metrics: [
        { label: "Consumer Buying Index", value: "84%", growth: "+14% YoY" },
        { label: "Inventory Demand Velocity", value: "92%", growth: "+18% YoY" },
        { label: "Seasonal Peak Growth", value: "+34%", growth: "Q4 Surge" },
        { label: "Omnichannel Footfall", value: "78%", growth: "+12% YoY" },
      ],
      topics: ["Consumer buying trends", "Inventory demand", "Seasonal sales spikes", "Smart Checkout POS"],
    };
  }
  if (ind.includes("restaurant") || btype.includes("restaurant") || btype.includes("food")) {
    return {
      metrics: [
        { label: "Online Delivery Share", value: "68%", growth: "+28% YoY" },
        { label: "Table Turnover Rate", value: "4.2x", growth: "+1.1x YoY" },
        { label: "Food Cost Ratio", value: "28.5%", growth: "-2.4% Optimal" },
        { label: "Dine-In Customer NPS", value: "4.8/5", growth: "+0.4 pts" },
      ],
      topics: ["Online Delivery Apps", "Food Cost Optimization", "Customer Dining Preferences", "Ghost Kitchen Expansion"],
    };
  }
  if (ind.includes("health") || ind.includes("hospital") || btype.includes("hospital")) {
    return {
      metrics: [
        { label: "Telemedicine Adoption", value: "76%", growth: "+32% YoY" },
        { label: "Digital Health Records", value: "94%", growth: "+19% YoY" },
        { label: "Medical AI Diagnostics", value: "81%", growth: "+45% YoY" },
        { label: "Bed Occupancy Efficiency", value: "88%", growth: "+8% Optimal" },
      ],
      topics: ["Telemedicine", "Digital Health Records", "Medical AI Diagnostics", "Preventive Care Outpatient"],
    };
  }
  if (ind.includes("manufactur") || btype.includes("industrial")) {
    return {
      metrics: [
        { label: "Factory Automation (OEE)", value: "86%", growth: "+15% YoY" },
        { label: "Supply Chain Resilience", value: "79%", growth: "+11% YoY" },
        { label: "IoT Sensor Deployment", value: "91%", growth: "+26% YoY" },
        { label: "Raw Material Efficiency", value: "93%", growth: "+6% YoY" },
      ],
      topics: ["Smart Factory Automation", "Supply Chain Resilience", "Industry 4.0 IoT", "Zero-Defect Quality Control"],
    };
  }

  // IT / Software / Default
  return {
    metrics: [
      { label: "Enterprise AI Adoption", value: "82%", growth: "+48% YoY" },
      { label: "Cloud Infrastructure Spend", value: "+89%", growth: "+31% YoY" },
      { label: "Cybersecurity Compliance", value: "95%", growth: "+12% YoY" },
      { label: "SaaS Net Retention (NRR)", value: "118%", growth: "+8% YoY" },
    ],
    topics: ["AI Adoption", "Cloud Computing", "Cybersecurity", "SaaS Growth & NRR"],
  };
}

/**
 * 3. Marketing Studio Module Adaptation
 */
export function getIndustryMarketing(ctx: CompanyContext) {
  const ind = ctx.industry.toLowerCase();
  const btype = ctx.businessType.toLowerCase();

  if (ind.includes("retail") || btype.includes("retail") || btype.includes("supermarket")) {
    return [
      { title: "Festival Discount Bonanza", type: "In-Store & App", status: "Active", budget: "$25,000", spent: "$14,200", roi: "340%", reach: "1.2M", usedPercent: 57 },
      { title: "Buy One Get One (BOGO) Offer", type: "Local Print & Social", status: "Active", budget: "$18,000", spent: "$11,400", roi: "280%", reach: "650K", usedPercent: 63 },
      { title: "VIP Customer Loyalty Rewards", type: "SMS & WhatsApp", status: "Scheduled", budget: "$12,000", spent: "$0", roi: "-", reach: "-", usedPercent: 0 },
    ];
  }
  if (ind.includes("restaurant") || btype.includes("restaurant") || btype.includes("food")) {
    return [
      { title: "Weekend Family Combo Special", type: "Social & Delivery App", status: "Active", budget: "$15,000", spent: "$9,800", roi: "410%", reach: "480K", usedPercent: 65 },
      { title: "Free Delivery Friday Promo", type: "Swiggy / Zomato / App", status: "Active", budget: "$10,000", spent: "$6,500", roi: "320%", reach: "310K", usedPercent: 65 },
      { title: "Seasonal Chef Menu Drop", type: "Instagram & Local Influencer", status: "Scheduled", budget: "$8,000", spent: "$0", roi: "-", reach: "-", usedPercent: 0 },
    ];
  }
  if (ind.includes("health") || ind.includes("hospital") || btype.includes("hospital")) {
    return [
      { title: "Free Community Health Checkup Camp", type: "Local Media & Community Outreach", status: "Active", budget: "$35,000", spent: "$22,000", roi: "290%", reach: "250K", usedPercent: 63 },
      { title: "Preventive Cardiac Health Package", type: "Google Search & Print", status: "Active", budget: "$20,000", spent: "$12,800", roi: "215%", reach: "180K", usedPercent: 64 },
      { title: "Senior Citizen Wellness Awareness", type: "Newspaper & Direct Mail", status: "Scheduled", budget: "$15,000", spent: "$0", roi: "-", reach: "-", usedPercent: 0 },
    ];
  }
  if (ind.includes("manufactur") || btype.includes("industrial")) {
    return [
      { title: "Annual Industrial Equipment Expo", type: "Trade Show & B2B Booth", status: "Active", budget: "$50,000", spent: "$32,000", roi: "240%", reach: "45K Buyers", usedPercent: 64 },
      { title: "OEM Supplier Catalog Outreach", type: "Direct B2B Email & Sales", status: "Active", budget: "$22,000", spent: "$14,500", roi: "310%", reach: "12K Leads", usedPercent: 66 },
      { title: "ISO Green Manufacturing Drive", type: "Industry Journal PR", status: "Scheduled", budget: "$18,000", spent: "$0", roi: "-", reach: "-", usedPercent: 0 },
    ];
  }

  // IT / Software / Default B2B Tech
  return [
    { title: "LinkedIn Thought Leadership & Ads", type: "B2B Social & Retargeting", status: "Active", budget: "$45,000", spent: "$28,420", roi: "312%", reach: "2.4M", usedPercent: 63 },
    { title: "Enterprise Product Launch Webinar", type: "Email & LinkedIn Live", status: "Active", budget: "$30,000", spent: "$18,200", roi: "241%", reach: "420K", usedPercent: 61 },
    { title: "SaaS Free Trial Conversion Funnel", type: "Paid Search & Content", status: "Scheduled", budget: "$60,000", spent: "$0", roi: "-", reach: "-", usedPercent: 0 },
  ];
}

/**
 * 4. Financial Analytics Module Adaptation
 */
export function getIndustryFinancialKPIs(ctx: CompanyContext) {
  const ind = ctx.industry.toLowerCase();
  const btype = ctx.businessType.toLowerCase();

  const revFormatted = ctx.currency === "INR" 
    ? `₹${(ctx.revenue / 100000).toFixed(2)}L` 
    : `$${(ctx.revenue / 1000000).toFixed(2)}M`;

  const profitMargin = ctx.revenue > 0 ? (((ctx.revenue - ctx.expenses) / ctx.revenue) * 100).toFixed(1) : "35.0";

  if (ind.includes("retail") || btype.includes("retail") || btype.includes("supermarket")) {
    return {
      kpi1: { label: "Total Sales Revenue", value: revFormatted, change: "+19.4% YoY" },
      kpi2: { label: "Inventory Turnover", value: "8.4x / yr", change: "+1.2x Faster" },
      kpi3: { label: "Gross Profit Margin", value: `${profitMargin}%`, change: "+2.1% Optimal" },
      kpi4: { label: "Stockout Prevention Rate", value: "98.2%", change: "+3.4% SLA" },
      expenseBreakdown: [
        { name: "Merchandise & Goods", value: 50, color: "#6366f1" },
        { name: "Store Rent & Operations", value: 22, color: "#a855f7" },
        { name: "Retail Staff Payroll", value: 18, color: "#10b981" },
        { name: "Promotions & Loyalty", value: 10, color: "#06b6d4" },
      ],
    };
  }
  if (ind.includes("restaurant") || btype.includes("restaurant") || btype.includes("food")) {
    return {
      kpi1: { label: "Total Restaurant Revenue", value: revFormatted, change: "+22.1% YoY" },
      kpi2: { label: "Table Turnover Rate", value: "4.5x / day", change: "+0.8x Peak" },
      kpi3: { label: "Food Cost Ratio", value: "27.8%", change: "-2.1% Below 30%" },
      kpi4: { label: "Average Order Value (AOV)", value: `$${Math.round(ctx.revenue / 80000)}`, change: "+14% Upsell" },
      expenseBreakdown: [
        { name: "Ingredients & Food Stock", value: 38, color: "#6366f1" },
        { name: "Kitchen & Dining Staff", value: 30, color: "#a855f7" },
        { name: "Rent & Utilities", value: 20, color: "#10b981" },
        { name: "Delivery App Commissions", value: 12, color: "#06b6d4" },
      ],
    };
  }
  if (ind.includes("health") || ind.includes("hospital") || btype.includes("hospital")) {
    return {
      kpi1: { label: "Hospital Operating Revenue", value: revFormatted, change: "+16.8% YoY" },
      kpi2: { label: "Bed Occupancy Rate", value: "84.5%", change: "+5.2% Optimal" },
      kpi3: { label: "Patient Satisfaction (CSAT)", value: "94.2%", change: "+2.8% Quality" },
      kpi4: { label: "Insurance Claims Days", value: "26 days", change: "-6 days Accelerated" },
      expenseBreakdown: [
        { name: "Medical Staff & Doctors", value: 45, color: "#6366f1" },
        { name: "Pharmaceutical & Supplies", value: 25, color: "#a855f7" },
        { name: "Facility & ICU Ops", value: 18, color: "#10b981" },
        { name: "Equipment Maintenance", value: 12, color: "#06b6d4" },
      ],
    };
  }

  // IT / Software / Default
  return {
    kpi1: { label: "Annual Recurring Revenue (ARR)", value: revFormatted, change: "+24.8% YoY" },
    kpi2: { label: "Monthly Recurring Revenue (MRR)", value: `$${(ctx.revenue / 12 / 1000).toFixed(0)}K`, change: "+3.2% MoM" },
    kpi3: { label: "Client Net Retention (NRR)", value: "118%", change: "+6% Expansion" },
    kpi4: { label: "Billable Utilization", value: "82%", change: "+5% Target" },
    expenseBreakdown: [
      { name: "Engineering Payroll", value: 45, color: "#6366f1" },
      { name: "Cloud Infrastructure", value: 25, color: "#a855f7" },
      { name: "Sales & Marketing", value: 18, color: "#10b981" },
      { name: "R&D Software Tools", value: 12, color: "#06b6d4" },
    ],
  };
}

/**
 * 5. CEO Recommendations Adaptation
 */
export function getIndustryCEORecommendations(ctx: CompanyContext) {
  const ind = ctx.industry.toLowerCase();
  const btype = ctx.businessType.toLowerCase();

  if (ind.includes("retail") || btype.includes("retail") || btype.includes("supermarket")) {
    return [
      "Inventory Management: Implement Just-In-Time restocking to reduce warehouse holding cost by 18%",
      "Supplier Negotiations: Renegotiate payment terms with top 5 distributors to extend AP window to 45 days",
      "Retail Omnichannel: Connect offline POS inventory with mobile app to drive repeat footfall",
    ];
  }
  if (ind.includes("restaurant") || btype.includes("restaurant") || btype.includes("food")) {
    return [
      "Menu Profitability: Audit high-margin signature dishes and optimize portion control to keep food cost <28%",
      "Kitchen Operations: Streamline kitchen prep workflows to reduce order prep time from 18m to 12m",
      "Direct Ordering: Encourage direct app orders to save 18% third-party delivery commissions",
    ];
  }
  if (ind.includes("health") || ind.includes("hospital") || btype.includes("hospital")) {
    return [
      "Patient Wait Times: Automate OPD registration & digital triage to reduce waiting times to <15 mins",
      "Staff Rostering: Deploy AI shift scheduling for nurses & doctors to eliminate costly overtime pay",
      "Equipment Utilization: Maximize daily throughput for diagnostic scanners (MRI/CT) during non-peak hours",
    ];
  }

  // IT / Software / Default
  return [
    "Project Delivery: Increase billable engineer utilization target to 85% across active client SOWs",
    "Cloud Infrastructure: Implement auto-scaling & reserved instances to slash monthly cloud costs by 22%",
    "Client Retention: Establish quarterly C-suite health reviews for top enterprise accounts",
  ];
}

/**
 * 6. AI Task Planner Initial Tasks Adaptation
 */
export function getIndustryTasks(ctx: CompanyContext) {
  const ind = ctx.industry.toLowerCase();
  const btype = ctx.businessType.toLowerCase();

  if (ind.includes("retail") || btype.includes("retail") || btype.includes("supermarket")) {
    return [
      { id: "task-r1", title: "Restock Fast-Moving Inventory", description: "Audit stock levels and place POs for top 20 retail SKUs", priority: "high", status: "in_progress", assignee: "Supply Chain Manager", due_date: "Today", ai_score: 95 },
      { id: "task-r2", title: "Review Distributor Invoices", description: "Reconcile weekly supplier delivery invoices against PO pricing", priority: "medium", status: "todo", assignee: "Accounts Officer", due_date: "Tomorrow", ai_score: 88 },
      { id: "task-r3", title: "Setup Weekend Promo POS Discount", description: "Configure checkout scanners for 15% festival discount promo", priority: "high", status: "done", assignee: "Store Manager", due_date: "Yesterday", ai_score: 92 },
    ];
  }
  if (ind.includes("restaurant") || btype.includes("restaurant") || btype.includes("food")) {
    return [
      { id: "task-f1", title: "Update Weekly Specials Menu", description: "Finalize seasonal specials menu and update digital QR codes", priority: "high", status: "in_progress", assignee: "Head Chef", due_date: "Today", ai_score: 94 },
      { id: "task-f2", title: "Daily Perishable Inventory Audit", description: "Check cold storage temperatures and inspect meat & produce stock", priority: "critical", status: "todo", assignee: "Kitchen Supervisor", due_date: "Today", ai_score: 96 },
      { id: "task-f3", title: "Staff Shift Roster Planning", description: "Assign dining hall & kitchen shifts for upcoming weekend surge", priority: "medium", status: "done", assignee: "Floor Manager", due_date: "Yesterday", ai_score: 89 },
    ];
  }
  if (ind.includes("health") || ind.includes("hospital") || btype.includes("hospital")) {
    return [
      { id: "task-h1", title: "Schedule Doctor & Nurse Shifts", description: "Coordinate emergency room and ICU shift rotations", priority: "critical", status: "in_progress", assignee: "Clinical Director", due_date: "Today", ai_score: 98 },
      { id: "task-h2", title: "MRI Equipment Maintenance Inspection", description: "Complete bi-monthly preventative maintenance audit on MRI Suite #2", priority: "high", status: "todo", assignee: "Bio-Med Engineer", due_date: "Tomorrow", ai_score: 91 },
      { id: "task-h3", title: "Process Outpatient Insurance Claims", description: "Batch submit verified medical insurance claims to clearance portal", priority: "medium", status: "done", assignee: "Billing Desk", due_date: "Yesterday", ai_score: 90 },
    ];
  }

  // IT / Software / Default
  return [
    { id: "task-t1", title: "Complete Q4 Sprint Planning", description: "Develop comprehensive Q4 product roadmap leveraging customer telemetry", priority: "critical", status: "in_progress", assignee: "Product Manager", due_date: "Today", ai_score: 95 },
    { id: "task-t2", title: "Conduct Senior Code Review", description: "Review pull requests for core authentication & RBAC microservice", priority: "high", status: "todo", assignee: "Lead Architect", due_date: "Tomorrow", ai_score: 88 },
    { id: "task-t3", title: "Client Enterprise Demo Meeting", description: "Demonstrate AI telemetry features to prospective Fortune 500 account", priority: "high", status: "done", assignee: "Solutions Engineer", due_date: "Yesterday", ai_score: 94 },
  ];
}

/**
 * 7. Reports Center List Adaptation
 */
export function getIndustryReports(ctx: CompanyContext) {
  const ind = ctx.industry.toLowerCase();
  const btype = ctx.businessType.toLowerCase();

  if (ind.includes("retail") || btype.includes("retail") || btype.includes("supermarket")) {
    return [
      { id: "rep-1", title: "Retail Inventory & Stockout Report", type: "Inventory", period: "Monthly", score: 94 },
      { id: "rep-2", title: "Store Sales & Gross Margin Audit", type: "Financial", period: "Quarterly", score: 91 },
      { id: "rep-3", title: "Promotions & Customer Loyalty Impact", type: "Marketing", period: "Weekly", score: 88 },
    ];
  }
  if (ind.includes("restaurant") || btype.includes("restaurant") || btype.includes("food")) {
    return [
      { id: "rep-1", title: "Food Cost & Kitchen Waste Audit", type: "Operations", period: "Weekly", score: 95 },
      { id: "rep-2", title: "Table Turnover & Dining Revenue", type: "Financial", period: "Monthly", score: 92 },
      { id: "rep-3", title: "Delivery Channel ROI & Ratings Summary", type: "Marketing", period: "Monthly", score: 89 },
    ];
  }
  if (ind.includes("health") || ind.includes("hospital") || btype.includes("hospital")) {
    return [
      { id: "rep-1", title: "Patient Performance & CSAT Index", type: "Clinical", period: "Monthly", score: 96 },
      { id: "rep-2", title: "Clinical Operations & ICU Capacity", type: "Operations", period: "Weekly", score: 93 },
      { id: "rep-3", title: "Insurance Claim Payout & Accounts Report", type: "Financial", period: "Quarterly", score: 90 },
    ];
  }

  // IT / Software / Default
  return [
    { id: "rep-1", title: "Project Performance & Engineering Velocity", type: "Productivity", period: "Monthly", score: 94 },
    { id: "rep-2", title: "Resource Utilization & Billable Efficiency", type: "Operations", period: "Weekly", score: 92 },
    { id: "rep-3", title: "SaaS ARR & Net Revenue Retention Audit", type: "Financial", period: "Quarterly", score: 96 },
  ];
}

/**
 * 8. AI System Prompt Adaptation
 */
export function getIndustrySystemPrompt(ctx: CompanyContext): string {
  return `You are EvoAI — the Autonomous C-Suite AI Business Intelligence Engine for "${ctx.companyName}".
Company Details:
- Industry: ${ctx.industry}
- Business Type: ${ctx.businessType}
- Revenue: ${ctx.currency} ${ctx.revenue.toLocaleString()}
- Operating Expenses: ${ctx.currency} ${ctx.expenses.toLocaleString()}
- Net Profit Margin: ${(((ctx.revenue - ctx.expenses) / (ctx.revenue || 1)) * 100).toFixed(1)}%

Instruction:
You MUST provide answers specifically tailored to the ${ctx.industry} industry and ${ctx.businessType} business model.
Use exact operational terminology appropriate for ${ctx.industry} (e.g. SKUs/footfall/inventory for Retail, food cost/table turnover for Restaurants, billable utilization/sprints/cloud cost for IT, bed occupancy/triage/claims for Hospitals).
Always provide actionable, data-driven executive recommendations.`;
}
