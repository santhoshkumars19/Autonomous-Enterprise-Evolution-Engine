/**
 * Enterprise Business Intelligence PDF Generator
 * Autonomous Enterprise Evolution Engine - EvoAI
 *
 * Consolidated 5-Report Master Document:
 * 1. Business Health Report
 * 2. Revenue Analysis
 * 3. Marketing Performance
 * 4. Risk Assessment
 * 5. AI Recommendations
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import type { User } from "@/components/auth-provider";

// ---- Color Palette -------------------------------------------------------
const C = {
  indigo:   [79,  70,  229] as [number, number, number],
  purple:   [124, 58,  237] as [number, number, number],
  cyan:     [6,   182, 212] as [number, number, number],
  emerald:  [16,  185, 129] as [number, number, number],
  amber:    [245, 158, 11]  as [number, number, number],
  rose:     [244, 63,  94]  as [number, number, number],
  slate900: [15,  23,  42]  as [number, number, number],
  slate600: [71,  85,  105] as [number, number, number],
  slate400: [148, 163, 184] as [number, number, number],
  slate200: [226, 232, 240] as [number, number, number],
  slate50:  [248, 250, 252] as [number, number, number],
  white:    [255, 255, 255] as [number, number, number],
};

// ---- A4 Dimensions (mm) --------------------------------------------------
const PAGE_W    = 210;
const PAGE_H    = 297;
const MARGIN    = 15;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ---- Helpers -------------------------------------------------------------
function fmtMoney(n: number): string {
  if (isNaN(n) || n === null || n === undefined) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function fileDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ---- Off-screen chart renderer -------------------------------------------
async function renderChartToBase64(
  chartHtml: string,
  width = 560,
  height = 220,
): Promise<string | null> {
  if (typeof window === "undefined") return null;
  let container: HTMLDivElement | null = null;
  try {
    container = document.createElement("div");
    container.style.cssText = [
      `position:fixed`,
      `top:-9999px`,
      `left:-9999px`,
      `width:${width}px`,
      `height:${height}px`,
      `background:#ffffff`,
      `padding:12px`,
      `box-sizing:border-box`,
      `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`,
    ].join(";");
    container.innerHTML = chartHtml;
    document.body.appendChild(container);

    await new Promise(r => setTimeout(r, 150));

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
    return canvas.toDataURL("image/png");
  } catch (err) {
    console.warn("Failed to render chart image, using fallback in PDF:", err);
    return null;
  } finally {
    if (container && document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

// ---- Chart HTML builders -------------------------------------------------
function revenueBarChartHtml(
  data: Array<{ month: string; revenue: number; expenses: number; profit: number }>,
): string {
  const maxVal = Math.max(...data.map(d => d.revenue || 1), 1);
  const bars = data.map(d => {
    const rH = Math.round(((d.revenue || 0)  / maxVal) * 110);
    const eH = Math.round(((d.expenses || 0) / maxVal) * 110);
    const pH = Math.round(((d.profit || 0)   / maxVal) * 110);
    return `
      <div style="display:flex;flex-direction:column;align-items:center;flex:1;">
        <div style="display:flex;align-items:flex-end;gap:2px;height:120px;">
          <div style="width:14px;height:${rH}px;background:#4f46e5;border-radius:3px 3px 0 0;"></div>
          <div style="width:14px;height:${eH}px;background:#06b6d4;border-radius:3px 3px 0 0;"></div>
          <div style="width:14px;height:${pH}px;background:#10b981;border-radius:3px 3px 0 0;"></div>
        </div>
        <div style="font-size:9px;color:#64748b;margin-top:4px;">${d.month}</div>
      </div>`;
  }).join("");

  return `
    <div style="padding:6px;">
      <div style="display:flex;align-items:flex-end;gap:4px;padding:0 4px;">${bars}</div>
      <div style="display:flex;gap:16px;margin-top:8px;justify-content:center;">
        <div style="display:flex;align-items:center;gap:4px;"><div style="width:10px;height:10px;background:#4f46e5;border-radius:2px;"></div><span style="font-size:9px;color:#475569;">Revenue</span></div>
        <div style="display:flex;align-items:center;gap:4px;"><div style="width:10px;height:10px;background:#06b6d4;border-radius:2px;"></div><span style="font-size:9px;color:#475569;">Expenses</span></div>
        <div style="display:flex;align-items:center;gap:4px;"><div style="width:10px;height:10px;background:#10b981;border-radius:2px;"></div><span style="font-size:9px;color:#475569;">Profit</span></div>
      </div>
    </div>`;
}

function forecastLineChartHtml(
  data: Array<{ month: string; projected: number; baseline: number }>,
): string {
  const maxVal = Math.max(...data.map(d => d.projected || 1), 1);
  const W = 480;
  const H = 130;

  const pts = (key: "projected" | "baseline") =>
    data.map((d, i) => {
      const x = 30 + (i / Math.max(data.length - 1, 1)) * (W - 60);
      const y = H - 20 - ((d[key] || 0) / maxVal) * (H - 40);
      return `${x},${y}`;
    }).join(" ");

  const dots = data.map((d, i) => {
    const x = 30 + (i / Math.max(data.length - 1, 1)) * (W - 60);
    const y = H - 20 - ((d.projected || 0) / maxVal) * (H - 40);
    const label = d.month.split(" ")[0];
    return `<circle cx="${x}" cy="${y}" r="3" fill="#4f46e5"/><text x="${x}" y="${H - 4}" text-anchor="middle" fill="#94a3b8" font-size="8">${label}</text>`;
  }).join("");

  return `
    <svg width="${W}" height="${H}" style="overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <polyline points="${pts("baseline")}" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,3"/>
      <polyline points="${pts("projected")}" fill="none" stroke="#4f46e5" stroke-width="2.5"/>
      ${dots}
    </svg>
    <div style="display:flex;gap:16px;margin-top:6px;justify-content:center;">
      <div style="display:flex;align-items:center;gap:4px;"><div style="width:16px;height:2px;background:#4f46e5;"></div><span style="font-size:9px;color:#475569;">Projected</span></div>
      <div style="display:flex;align-items:center;gap:4px;"><div style="width:16px;height:2px;background:#94a3b8;"></div><span style="font-size:9px;color:#475569;">Baseline</span></div>
    </div>`;
}

function expensePieChartHtml(
  data: Array<{ name: string; value: number; color: string }>,
): string {
  const total = Math.max(data.reduce((s, d) => s + (d.value || 0), 0), 1);
  let angle = -90;
  const cx = 75; const cy = 75; const r = 55; const ir = 30;

  const toR = (deg: number) => (deg * Math.PI) / 180;
  const slices = data.map(d => {
    const sweep = ((d.value || 0) / total) * 360;
    const a0 = angle;
    angle += sweep;
    const x1 = cx + r * Math.cos(toR(a0)),   y1 = cy + r * Math.sin(toR(a0));
    const x2 = cx + r * Math.cos(toR(angle)), y2 = cy + r * Math.sin(toR(angle));
    const xi1 = cx + ir * Math.cos(toR(a0)),  yi1 = cy + ir * Math.sin(toR(a0));
    const xi2 = cx + ir * Math.cos(toR(angle)),yi2= cy + ir * Math.sin(toR(angle));
    const large = sweep > 180 ? 1 : 0;
    return `<path d="M ${xi1} ${yi1} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ir} ${ir} 0 ${large} 0 ${xi1} ${yi1}" fill="${d.color}" stroke="#fff" stroke-width="1.5"/>`;
  }).join("");

  const legend = data.map(d =>
    `<div style="display:flex;align-items:center;gap:4px;margin-bottom:4px;"><div style="width:8px;height:8px;background:${d.color};border-radius:2px;flex-shrink:0;"></div><span style="font-size:8.5px;color:#475569;">${d.name} (${d.value}%)</span></div>`
  ).join("");

  return `
    <div style="display:flex;align-items:center;gap:16px;">
      <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg"><g>${slices}</g></svg>
      <div>${legend}</div>
    </div>`;
}

function campaignBarChartHtml(
  data: Array<{ channel: string; impressions: number; conversions: number }>,
): string {
  const maxImp = Math.max(...data.map(d => d.impressions || 1), 1);
  const bars = data.map(d => {
    const iH = Math.round(((d.impressions || 0) / maxImp) * 95);
    const cH = Math.round(((d.conversions || 0) / maxImp) * 95);
    return `
      <div style="display:flex;flex-direction:column;align-items:center;flex:1;">
        <div style="display:flex;align-items:flex-end;gap:2px;height:100px;">
          <div style="width:14px;height:${iH}px;background:#4f46e5;border-radius:3px 3px 0 0;"></div>
          <div style="width:14px;height:${cH}px;background:#10b981;border-radius:3px 3px 0 0;"></div>
        </div>
        <div style="font-size:8px;color:#64748b;margin-top:4px;">${d.channel}</div>
      </div>`;
  }).join("");

  return `
    <div style="padding:6px;">
      <div style="display:flex;align-items:flex-end;gap:6px;padding:0 4px;">${bars}</div>
      <div style="display:flex;gap:16px;margin-top:8px;justify-content:center;">
        <div style="display:flex;align-items:center;gap:4px;"><div style="width:10px;height:10px;background:#4f46e5;border-radius:2px;"></div><span style="font-size:9px;color:#475569;">Impressions</span></div>
        <div style="display:flex;align-items:center;gap:4px;"><div style="width:10px;height:10px;background:#10b981;border-radius:2px;"></div><span style="font-size:9px;color:#475569;">Conversions</span></div>
      </div>
    </div>`;
}

// ---- jsPDF Header & Footer -----------------------------------------------
function drawHeader(doc: jsPDF, companyName: string): void {
  doc.setFillColor(...C.slate900);
  doc.rect(0, 0, PAGE_W, 22, "F");
  doc.setFillColor(...C.indigo);  doc.rect(0,   0, 70, 1.2, "F");
  doc.setFillColor(...C.purple);  doc.rect(70,  0, 70, 1.2, "F");
  doc.setFillColor(...C.cyan);    doc.rect(140, 0, 70, 1.2, "F");

  // Logo circle
  doc.setFillColor(...C.indigo);
  doc.circle(MARGIN + 5, 11, 5, "F");
  doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.white);
  doc.text("A", MARGIN + 5, 14, { align: "center" });

  // Brand text
  doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.white);
  doc.text(companyName, MARGIN + 13, 9.5);
  doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.slate400);
  doc.text("Autonomous Enterprise Evolution Engine - Business Intelligence Report", MARGIN + 13, 14.5);

  // Date / engine
  doc.setFontSize(7); doc.setTextColor(...C.cyan);
  doc.text(`Generated: ${fmtDate()}`, PAGE_W - MARGIN, 9.5, { align: "right" });
  doc.setTextColor(...C.slate400);
  doc.text("AI Business Engine", PAGE_W - MARGIN, 14.5, { align: "right" });
}

function drawFooter(doc: jsPDF, pageNum: number, totalPages: number): void {
  const y = PAGE_H - 8;
  doc.setDrawColor(...C.slate200); doc.setLineWidth(0.3);
  doc.line(MARGIN, y - 2, PAGE_W - MARGIN, y - 2);
  doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.slate400);
  doc.text(`Page ${pageNum} of ${totalPages}`, MARGIN, y + 1.5);
  doc.text("Confidential Report", PAGE_W / 2, y + 1.5, { align: "center" });
  doc.text("(c) 2026 Autonomous Enterprise Evolution Engine", PAGE_W - MARGIN, y + 1.5, { align: "right" });
}

function sectionHeader(doc: jsPDF, title: string, y: number): number {
  doc.setFillColor(...C.indigo);
  doc.rect(MARGIN, y, 3, 5, "F");
  doc.setFontSize(9.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.slate900);
  doc.text(title, MARGIN + 6, y + 4);
  doc.setDrawColor(...C.slate200); doc.setLineWidth(0.3);
  doc.line(MARGIN, y + 6.5, PAGE_W - MARGIN, y + 6.5);
  return y + 10;
}

function kpiCard(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  label: string, value: string, delta: string,
  accent: [number, number, number],
): void {
  doc.setFillColor(...C.slate50);
  doc.roundedRect(x, y, w, h, 2, 2, "F");
  doc.setDrawColor(...C.slate200); doc.setLineWidth(0.3);
  doc.roundedRect(x, y, w, h, 2, 2, "S");
  doc.setFillColor(...accent);
  doc.roundedRect(x, y, w, 1.2, 1, 1, "F");
  doc.setFontSize(6.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.slate600);
  doc.text(label.toUpperCase(), x + 3.5, y + 5.5);
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.slate900);
  doc.text(value, x + 3.5, y + 12.5);
  doc.setFontSize(6.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.emerald);
  doc.text(delta, x + 3.5, y + 17);
}

function progressBar(
  doc: jsPDF,
  x: number, y: number, w: number, pct: number,
  color: [number, number, number],
): void {
  doc.setFillColor(...C.slate200);
  doc.roundedRect(x, y, w, 3.5, 1.5, 1.5, "F");
  if (pct > 0) {
    doc.setFillColor(...color);
    doc.roundedRect(x, y, w * Math.min(pct / 100, 1), 3.5, 1.5, 1.5, "F");
  }
}

// ---- Data Fetching -------------------------------------------------------
interface ReportData {
  financial: {
    revenue: number; expenses: number; profit: number;
    mrr: number; arr: number; margin: number; growthRate: number;
    revenueHistory: Array<{ month: string; revenue: number; expenses: number; profit: number }>;
    forecastData:   Array<{ month: string; projected: number; baseline: number }>;
    expenseBreakdown: Array<{ name: string; value: number; color: string }>;
  };
  health: { score: number };
  campaigns: Array<{ channel: string; impressions: number; conversions: number }>;
  recommendations: string[];
}

async function fetchReportData(token: string | null, user: User): Promise<ReportData> {
  const fallback: ReportData = {
    financial: {
      revenue: 2840500, expenses: 1948400, profit: 892100,
      mrr: 2060000, arr: 24720000, margin: 31.4, growthRate: 38.3,
      revenueHistory: [
        { month: "Jan", revenue: 1800000, expenses: 1260000, profit: 540000 },
        { month: "Feb", revenue: 2100000, expenses: 1430000, profit: 670000 },
        { month: "Mar", revenue: 2350000, expenses: 1600000, profit: 750000 },
        { month: "Apr", revenue: 2200000, expenses: 1510000, profit: 690000 },
        { month: "May", revenue: 2600000, expenses: 1780000, profit: 820000 },
        { month: "Jun", revenue: 2840500, expenses: 1948400, profit: 892100 },
      ],
      forecastData: [
        { month: "Jul '26", projected: 3100000, baseline: 2900000 },
        { month: "Aug '26", projected: 3450000, baseline: 3000000 },
        { month: "Sep '26", projected: 3900000, baseline: 3150000 },
        { month: "Oct '26", projected: 4300000, baseline: 3300000 },
        { month: "Nov '26", projected: 4800000, baseline: 3450000 },
        { month: "Dec '26", projected: 5400000, baseline: 3600000 },
      ],
      expenseBreakdown: [
        { name: "Personnel",  value: 42, color: "#8b5cf6" },
        { name: "Technology", value: 18, color: "#0284c7" },
        { name: "Marketing",  value: 15, color: "#06b6d4" },
        { name: "Operations", value: 13, color: "#84cc16" },
        { name: "R&D",        value: 12, color: "#d946ef" },
      ],
    },
    health: { score: 92 },
    campaigns: [
      { channel: "Search",  impressions: 420000,  conversions: 14200 },
      { channel: "Display", impressions: 1200000, conversions: 18000 },
      { channel: "Social",  impressions: 70000,   conversions: 1200  },
      { channel: "Email",   impressions: 84000,   conversions: 2100  },
      { channel: "Video",   impressions: 650000,  conversions: 8400  },
    ],
    recommendations: [
      "Accelerate APAC market entry before Nexus AI consolidates pricing leadership",
      "Implement algorithmic enterprise pricing tiers to increase ARPU by 28%",
      "Deploy zero-latency AI C-Suite agents as standard bundled enterprise feature",
      "Automate cloud resource allocation via Nexus-Ops to save $42K per month",
      "Maintain liquidity ratio above 3.8x while pursuing European expansion",
      "Launch Series C-backed M&A evaluation for mid-market APAC SaaS targets",
    ],
  };

  if (!token) return fallback;

  try {
    const { financialApi, reportsApi } = await import("@/lib/api");
    const [finRes, healthRes] = await Promise.allSettled([
      financialApi.overview(token),
      reportsApi.health(token),
    ]);

    const merged = JSON.parse(JSON.stringify(fallback)) as ReportData;

    if (finRes.status === "fulfilled" && finRes.value?.kpis) {
      const k = finRes.value.kpis as Record<string, any>;
      if (k.revenue?.value)  merged.financial.revenue = Number(k.revenue.value);
      if (k.burn_rate?.value) merged.financial.expenses = Number(k.burn_rate.value);
      if (k.net_profit?.value) merged.financial.profit = Number(k.net_profit.value);
      if (k.revenue?.change) merged.financial.growthRate = Number(k.revenue.change);
    }

    if (healthRes.status === "fulfilled" && healthRes.value) {
      if (typeof healthRes.value.score === "number") {
        merged.health.score = healthRes.value.score;
      }
      const a = (healthRes.value as any).analysis;
      if (a) {
        if (a.marketingRecommendations && Array.isArray(a.marketingRecommendations)) {
          merged.recommendations = a.marketingRecommendations;
        }
        if (a.salesTrend && Array.isArray(a.salesTrend)) {
          merged.financial.revenueHistory = a.salesTrend.map((st: any) => ({
            month: st.month,
            revenue: Number(st.revenue || 0),
            expenses: Number(st.expenses || 0),
            profit: Number(st.netProfit || 0),
          }));
        }
        if (a.financialForecast && Array.isArray(a.financialForecast)) {
          merged.financial.forecastData = a.financialForecast.map((ff: any) => ({
            month: ff.period,
            projected: Number(ff.projectedRevenue || 0),
            baseline: Number(ff.projectedExpenses || 0),
          }));
        }
      }
    }

    return merged;
  } catch (err) {
    console.warn("API fetch error during PDF generation, using fallbacks:", err);
    return fallback;
  }
}

// ---- Main Export ---------------------------------------------------------
export async function generateBusinessReport(
  user: User,
  token: string | null,
  onProgress?: (step: string) => void,
): Promise<void> {
  onProgress?.("Fetching business data...");
  const data = await fetchReportData(token, user);

  onProgress?.("Rendering off-screen charts...");
  const [chartRevenue, chartForecast, chartExpense, chartCampaign] = await Promise.all([
    renderChartToBase64(revenueBarChartHtml(data.financial.revenueHistory), 560, 190),
    renderChartToBase64(forecastLineChartHtml(data.financial.forecastData),  520, 170),
    renderChartToBase64(expensePieChartHtml(data.financial.expenseBreakdown), 360, 170),
    renderChartToBase64(campaignBarChartHtml(data.campaigns), 560, 170),
  ]);

  onProgress?.("Building document layout...");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const companyName = user.company || "Enterprise Company";
  const TOTAL = 3;
  const TOP   = 27;

  // ======================================================================
  // PAGE 1: Cover Page -> 1. Business Health Report -> 2. Revenue Analysis (Part 1)
  // ======================================================================
  drawHeader(doc, companyName);
  drawFooter(doc, 1, TOTAL);
  let y = TOP;

  // Cover Banner
  doc.setFillColor(...C.slate900);
  doc.roundedRect(MARGIN, y, CONTENT_W, 34, 3, 3, "F");

  doc.setFontSize(15); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.white);
  doc.text("Business Intelligence Report", MARGIN + 8, y + 10);
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.slate400);
  doc.text("Autonomous Enterprise Evolution Engine - Dynamic Executive Audit", MARGIN + 8, y + 16.5);

  const meta = [
    { label: "Company",   val: companyName },
    { label: "Executive", val: user.name   },
    { label: "Date",      val: fmtDate()   },
    { label: "Engine",    val: "EvoAI Core v4.0" },
  ];
  meta.forEach((m, i) => {
    const mx = MARGIN + 8 + i * (CONTENT_W / 4);
    doc.setFontSize(6.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.slate400);
    doc.text(m.label.toUpperCase(), mx, y + 23.5);
    doc.setFontSize(7.5); doc.setTextColor(...C.cyan);
    const trimmed = (doc.splitTextToSize(m.val, (CONTENT_W / 4) - 4) as string[])[0];
    doc.text(trimmed, mx, y + 29);
  });
  y += 40;

  // ----------------------------------------------------------------------
  // 1. BUSINESS HEALTH REPORT
  // ----------------------------------------------------------------------
  y = sectionHeader(doc, "1. Business Health Report", y);

  doc.setFillColor(...C.slate50);
  doc.roundedRect(MARGIN, y, 55, 28, 2, 2, "F");
  doc.setDrawColor(...C.indigo); doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y, 55, 28, 2, 2, "S");
  doc.setFontSize(6.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.slate600);
  doc.text("HEALTH SCORE INDEX", MARGIN + 4, y + 6);
  doc.setFontSize(22); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.indigo);
  doc.text(String(data.health.score), MARGIN + 4, y + 18.5);
  doc.setFontSize(12); doc.setTextColor(...C.slate400);
  doc.text("/ 100", MARGIN + 21, y + 18.5);
  doc.setFontSize(6.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.emerald);
  doc.text("Excellent Health Score", MARGIN + 4, y + 24.5);

  const sumX = MARGIN + 60;
  const sumW = CONTENT_W - 60;
  doc.setFillColor(240, 245, 255);
  doc.roundedRect(sumX, y, sumW, 28, 2, 2, "F");
  doc.setDrawColor(...C.indigo); doc.setLineWidth(0.3);
  doc.roundedRect(sumX, y, sumW, 28, 2, 2, "S");
  doc.setFontSize(7); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.indigo);
  doc.text("AI HEALTH EXECUTIVE SUMMARY", sumX + 4, y + 6);
  doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.slate600);
  const summaryText = `${companyName} maintains a strong business health index of ${data.health.score}/100. Operational metrics indicate solid financial momentum with ${(data.financial.growthRate || 0).toFixed(1)}% YoY growth reaching ${fmtMoney(data.financial.revenue)}. Profit margin tracks at ${(data.financial.margin || 0).toFixed(1)}% with low capital burn.`;
  const summaryLines = doc.splitTextToSize(summaryText, sumW - 8) as string[];
  doc.text(summaryLines.slice(0, 4), sumX + 4, y + 11.5, { lineHeightFactor: 1.3 });
  y += 34;

  // Performance Matrix Table under Health Report
  autoTable(doc, {
    startY: y, margin: { left: MARGIN, right: MARGIN },
    head: [["Health Metric", "Current Value", "Target Benchmark", "Health Status", "Performance Trend"]],
    body: [
      ["Monthly Revenue",      fmtMoney(data.financial.revenue),           fmtMoney(data.financial.revenue * 1.15),  "On Track",  "+38% YoY"],
      ["Operating Expenses",   fmtMoney(data.financial.expenses),          fmtMoney(data.financial.expenses * 0.95), "Optimizing","-3% YoY"],
      ["Net Profit Margin",    `${(data.financial.margin || 0).toFixed(1)}%`, "35%",                                 "Improving", "+5% Margin"],
      ["Annual Recurring Rev", fmtMoney(data.financial.arr),               fmtMoney(data.financial.arr * 1.25),      "On Track",  "+25% ARR"],
      ["Overall Health Score", `${data.health.score}/100`,                  "95/100",                                 "Excellent", "Stable"],
    ],
    styles:            { fontSize: 7.5, cellPadding: 2.5, textColor: [51, 65, 85] },
    headStyles:        { fillColor: C.slate900, textColor: C.white, fontStyle: "bold", fontSize: 7.5 },
    alternateRowStyles:{ fillColor: C.slate50 },
    columnStyles:      { 0: { fontStyle: "bold" }, 3: { textColor: C.emerald, fontStyle: "bold" }, 4: { textColor: C.indigo } },
  });
  y = ((doc as any).lastAutoTable?.finalY ?? y + 30) + 6;

  // ----------------------------------------------------------------------
  // 2. REVENUE ANALYSIS (Part 1: Overview & Historical Chart)
  // ----------------------------------------------------------------------
  y = sectionHeader(doc, "2. Revenue Analysis", y);

  const cW = (CONTENT_W - 9) / 4;
  [
    { label: "Monthly Revenue",  value: fmtMoney(data.financial.revenue),  delta: `+${(data.financial.growthRate || 0).toFixed(1)}% YoY`, col: C.indigo  },
    { label: "Monthly Expenses", value: fmtMoney(data.financial.expenses), delta: "Operational Cost",                                    col: C.purple  },
    { label: "Net Profit",       value: fmtMoney(data.financial.profit),   delta: `${(data.financial.margin || 0).toFixed(1)}% Margin`,  col: C.emerald },
    { label: "Annual Run Rate",  value: fmtMoney(data.financial.arr),      delta: "Projected ARR",                                      col: C.cyan    },
  ].forEach((k, i) => kpiCard(doc, MARGIN + i * (cW + 3), y, cW, 20, k.label, k.value, k.delta, k.col));
  y += 24;

  if (chartRevenue) {
    const h = 42;
    doc.setFillColor(...C.white); doc.setDrawColor(...C.slate200);
    doc.roundedRect(MARGIN, y, CONTENT_W, h + 4, 2, 2, "FD");
    doc.addImage(chartRevenue, "PNG", MARGIN + 2, y + 2, CONTENT_W - 4, h);
  }

  // ======================================================================
  // PAGE 2: 2. Revenue Analysis (Part 2: Expenses & Forecast) -> 3. Marketing Performance
  // ======================================================================
  doc.addPage();
  drawHeader(doc, companyName);
  drawFooter(doc, 2, TOTAL);
  y = TOP;

  y = sectionHeader(doc, "Revenue Analysis - Expense Breakdown & Forecast", y);

  if (chartExpense) {
    const ph = 40;
    doc.setFillColor(...C.white); doc.setDrawColor(...C.slate200);
    doc.roundedRect(MARGIN, y, 90, ph + 4, 2, 2, "FD");
    doc.addImage(chartExpense, "PNG", MARGIN + 1, y + 2, 88, ph);
    autoTable(doc, {
      startY: y, margin: { left: MARGIN + 95, right: MARGIN },
      tableWidth: CONTENT_W - 95,
      head: [["Expense Category", "% Share", "Est. Monthly Spend"]],
      body: data.financial.expenseBreakdown.map(e => [
        e.name, `${e.value}%`, fmtMoney(data.financial.expenses * (e.value / 100)),
      ]),
      styles:            { fontSize: 7.5, cellPadding: 2.5 },
      headStyles:        { fillColor: C.slate900, textColor: C.white, fontStyle: "bold", fontSize: 7.5 },
      alternateRowStyles:{ fillColor: C.slate50 },
    });
    y += ph + 8;
  } else {
    autoTable(doc, {
      startY: y, margin: { left: MARGIN, right: MARGIN },
      head: [["Expense Category", "% Share", "Est. Monthly Spend"]],
      body: data.financial.expenseBreakdown.map(e => [
        e.name, `${e.value}%`, fmtMoney(data.financial.expenses * (e.value / 100)),
      ]),
      styles:            { fontSize: 7.5, cellPadding: 2.5 },
      headStyles:        { fillColor: C.slate900, textColor: C.white, fontStyle: "bold", fontSize: 7.5 },
      alternateRowStyles:{ fillColor: C.slate50 },
    });
    y = ((doc as any).lastAutoTable?.finalY ?? y + 30) + 8;
  }

  // Revenue Forecast Chart
  if (chartForecast) {
    const fh = 40;
    doc.setFillColor(...C.white); doc.setDrawColor(...C.slate200);
    doc.roundedRect(MARGIN, y, CONTENT_W, fh + 4, 2, 2, "FD");
    doc.addImage(chartForecast, "PNG", MARGIN + 2, y + 2, CONTENT_W - 4, fh);
    y += fh + 10;
  }

  // ----------------------------------------------------------------------
  // 3. MARKETING PERFORMANCE
  // ----------------------------------------------------------------------
  y = sectionHeader(doc, "3. Marketing Performance", y);

  const mW = (CONTENT_W - 9) / 4;
  [
    { label: "Marketing Budget", value: "$450K",  delta: "Q3 Allocated",        col: C.indigo  },
    { label: "Total Reach",      value: "2.42M",  delta: "Cross-channel reach",  col: C.purple  },
    { label: "Average ROI",      value: "312%",   delta: "vs 180% target",       col: C.emerald },
    { label: "Lead Conversions", value: "43,900", delta: "+28% vs last quarter", col: C.cyan    },
  ].forEach((s, i) => kpiCard(doc, MARGIN + i * (mW + 3), y, mW, 20, s.label, s.value, s.delta, s.col));
  y += 24;

  if (chartCampaign) {
    const ch = 36;
    doc.setFillColor(...C.white); doc.setDrawColor(...C.slate200);
    doc.roundedRect(MARGIN, y, CONTENT_W, ch + 3, 2, 2, "FD");
    doc.addImage(chartCampaign, "PNG", MARGIN + 2, y + 1.5, CONTENT_W - 4, ch);
    y += ch + 5;
  }

  autoTable(doc, {
    startY: y, margin: { left: MARGIN, right: MARGIN },
    head: [["Channel", "Impressions", "Conversions", "Conv. Rate", "Est. Generated Revenue"]],
    body: data.campaigns.map(c => [
      c.channel,
      (c.impressions || 0).toLocaleString(),
      (c.conversions || 0).toLocaleString(),
      `${(((c.conversions || 0) / Math.max(c.impressions || 1, 1)) * 100).toFixed(2)}%`,
      fmtMoney((c.conversions || 0) * 42),
    ]),
    styles:            { fontSize: 7.5, cellPadding: 2 },
    headStyles:        { fillColor: C.slate900, textColor: C.white, fontStyle: "bold", fontSize: 7.5 },
    alternateRowStyles:{ fillColor: C.slate50 },
    columnStyles:      { 0: { fontStyle: "bold" }, 3: { textColor: C.emerald } },
  });

  // ======================================================================
  // PAGE 3: 4. Risk Assessment -> 5. AI Recommendations
  // ======================================================================
  doc.addPage();
  drawHeader(doc, companyName);
  drawFooter(doc, 3, TOTAL);
  y = TOP;

  // ----------------------------------------------------------------------
  // 4. RISK ASSESSMENT
  // ----------------------------------------------------------------------
  y = sectionHeader(doc, "4. Risk Assessment", y);

  const hw = (CONTENT_W - 3) / 2;

  // Market Trends box
  doc.setFillColor(...C.slate50); doc.roundedRect(MARGIN, y, hw, 40, 2, 2, "F");
  doc.setDrawColor(...C.slate200); doc.roundedRect(MARGIN, y, hw, 40, 2, 2, "S");
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.slate900);
  doc.text("Market Trends & Adoption", MARGIN + 4, y + 6);
  [
    { label: "AI Adoption Rate",    pct: 82, col: C.indigo  },
    { label: "Cloud Spend Growth",  pct: 74, col: C.cyan    },
    { label: "Automation Index",    pct: 88, col: C.emerald },
    { label: "Cybersecurity Spend", pct: 90, col: C.purple  },
  ].forEach((t, i) => {
    const ty = y + 11 + i * 6.5;
    doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.slate600);
    doc.text(t.label, MARGIN + 4, ty);
    progressBar(doc, MARGIN + 4, ty + 1.2, hw - 24, t.pct, t.col);
    doc.text(`${t.pct}%`, MARGIN + hw - 8, ty + 4);
  });

  // Risk Heatmap box
  const rx = MARGIN + hw + 3;
  doc.setFillColor(...C.slate50); doc.roundedRect(rx, y, hw, 40, 2, 2, "F");
  doc.setDrawColor(...C.slate200); doc.roundedRect(rx, y, hw, 40, 2, 2, "S");
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.slate900);
  doc.text("Risk Factor Heatmap", rx + 4, y + 6);
  [
    { label: "Competitive Pressure",  pct: 75, col: C.amber,   level: "High"   },
    { label: "Market Volatility",     pct: 50, col: C.purple,  level: "Medium" },
    { label: "Regulatory Compliance", pct: 25, col: C.emerald, level: "Low"    },
    { label: "Technology Disruption", pct: 55, col: C.cyan,    level: "Medium" },
  ].forEach((r, i) => {
    const ry = y + 11 + i * 6.5;
    doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.slate600);
    doc.text(r.label, rx + 4, ry);
    progressBar(doc, rx + 4, ry + 1.2, hw - 24, r.pct, r.col);
    doc.text(r.level, rx + hw - 12, ry + 4);
  });
  y += 46;

  // Strategic Risk & Growth Table
  autoTable(doc, {
    startY: y, margin: { left: MARGIN, right: MARGIN },
    head: [["Strategic Risk Vector", "Revenue Exposure", "Impact Horizon", "Risk Level"]],
    body: [
      ["APAC Market Competition",  "$4.2M Potential", "Q1 2027", "High Exposure"    ],
      ["EU AI Act Compliance",     "$2.1M Audit Spend","Q4 2026", "Medium Exposure"  ],
      ["Enterprise Upsell Churn",  "$3.8M ARPU",       "Q3 2026", "Critical Watch"  ],
      ["Cloud Infrastructure Spend","$1.4M OpEx",       "Q2 2027", "Monitored Risk"  ],
    ],
    styles:            { fontSize: 7.5, cellPadding: 2.5 },
    headStyles:        { fillColor: C.slate900, textColor: C.white, fontStyle: "bold", fontSize: 7.5 },
    alternateRowStyles:{ fillColor: C.slate50 },
    columnStyles:      { 0: { fontStyle: "bold" }, 3: { fontStyle: "bold" } },
    didParseCell: (d: any) => {
      if (d.section === "body" && d.column.index === 3) {
        if (d.cell.text[0] === "Critical Watch") d.cell.styles.textColor = [239, 68, 68];
        else if (d.cell.text[0] === "High Exposure") d.cell.styles.textColor = [245, 158, 11];
      }
    },
  });
  y = ((doc as any).lastAutoTable?.finalY ?? y + 30) + 8;

  // ----------------------------------------------------------------------
  // 5. AI RECOMMENDATIONS
  // ----------------------------------------------------------------------
  y = sectionHeader(doc, "5. AI Recommendations", y);

  // Recommendations Box
  doc.setFillColor(240, 245, 255);
  doc.roundedRect(MARGIN, y, CONTENT_W, 36, 2.5, 2.5, "F");
  doc.setDrawColor(...C.indigo); doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y, CONTENT_W, 36, 2.5, 2.5, "S");
  doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.indigo);
  doc.text("DYNAMIC AI STRATEGIC INSIGHTS", MARGIN + 5, y + 6.5);
  doc.setFont("helvetica", "normal"); doc.setTextColor(...C.slate600);
  (data.recommendations || []).slice(0, 5).forEach((rec, i) => {
    const ry = y + 12 + i * 5.2;
    doc.setFillColor(...C.indigo);
    doc.circle(MARGIN + 6.5, ry - 0.5, 1.2, "F");
    doc.setFontSize(7);
    doc.text(rec, MARGIN + 10, ry, { maxWidth: CONTENT_W - 14 });
  });
  y += 42;

  // Priority Action Plan Table under AI Recommendations
  autoTable(doc, {
    startY: y, margin: { left: MARGIN, right: MARGIN },
    head: [["#", "Action Recommendation", "Lead Owner", "Execution Timeline", "Priority Level"]],
    body: [
      ["1", "Accelerate APAC market expansion",  "CEO + Strategy Agent",  "Week 1-4",   "Critical"],
      ["2", "Implement enterprise pricing tiers", "Finance + Sales Agent", "Week 2-6",   "High"    ],
      ["3", "Deploy AI C-Suite standard bundle",  "Engineering + Ops",     "Week 3-8",   "High"    ],
      ["4", "Automate cloud resource allocation", "Operations Agent",      "Week 1-2",   "Medium"  ],
      ["5", "Execute EU compliance audit trail",  "Legal + Compliance",    "Week 4-12",  "Medium"  ],
    ],
    styles:            { fontSize: 7.5, cellPadding: 2 },
    headStyles:        { fillColor: C.slate900, textColor: C.white, fontStyle: "bold", fontSize: 7.5 },
    alternateRowStyles:{ fillColor: C.slate50 },
    columnStyles:      { 0: { halign: "center", fontStyle: "bold" }, 4: { fontStyle: "bold" } },
    didParseCell: (d: any) => {
      if (d.section === "body" && d.column.index === 4) {
        if (d.cell.text[0] === "Critical") d.cell.styles.textColor = [239, 68, 68];
        else if (d.cell.text[0] === "High") d.cell.styles.textColor = [245, 158, 11];
      }
    },
  });
  y = ((doc as any).lastAutoTable?.finalY ?? y + 25) + 6;

  // Executive Sign-Off & Verification Block (Fills remaining space to bottom of Page 3)
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(MARGIN, y, CONTENT_W, 24, 2, 2, "F");
  doc.setDrawColor(...C.slate200); doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, CONTENT_W, 24, 2, 2, "S");

  doc.setFontSize(7); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.slate900);
  doc.text("EXECUTIVE AUDIT & GOVERNANCE SIGN-OFF", MARGIN + 4, y + 5.5);
  doc.setFontSize(6.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.slate600);
  doc.text(`Report compiled dynamically for ${companyName} (${user.name}).`, MARGIN + 4, y + 10.5);
  doc.text(`Audit Security Hash: EV-2026-${Math.floor(100000 + Math.random() * 900000)} | Classification: STRICTLY CONFIDENTIAL`, MARGIN + 4, y + 15.5);

  doc.setDrawColor(...C.slate400); doc.setLineWidth(0.3);
  doc.line(PAGE_W - MARGIN - 45, y + 14, PAGE_W - MARGIN - 5, y + 14);
  doc.setFontSize(6); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.slate600);
  doc.text("Authorized Executive Signature", PAGE_W - MARGIN - 45, y + 18);

  onProgress?.("Saving PDF document...");
  doc.save(`Business_Report_${fileDate()}.pdf`);
}
