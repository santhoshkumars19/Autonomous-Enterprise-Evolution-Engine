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
export declare function generatePersonalizedAIAnalysis(input: BusinessDataInput): Promise<{
    companyName: string;
    currency: string;
    healthScore: number;
    executiveSummary: string;
    revenueAnalysis: {
        totalRevenue: number;
        formatted: string;
        growthRate: number;
    };
    expenseAnalysis: {
        totalExpenses: number;
        formatted: string;
        expenseRatio: number;
    };
    profitAnalysis: {
        netProfit: number;
        profitMargin: number;
        formatted: string;
    };
    customerAnalysis: {
        activeCustomers: number;
        churnRate: number;
        arpu: number;
        formattedArpu: string;
    };
    productPerformance: {
        inventoryValue: number;
        formattedInventory: string;
    };
    salesTrend: {
        month: string;
        revenue: number;
        expenses: number;
        netProfit: number;
    }[];
    swotAnalysis: {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
    };
    riskAssessment: {
        overallRisk: string;
        financialRiskScore: number;
        operationalRiskScore: number;
        marketRiskScore: number;
        keyRisks: {
            risk: string;
            severity: string;
            detail: string;
        }[];
    };
    marketingRecommendations: string[];
    growthStrategy: {
        phase: string;
        milestone: string;
    }[];
    financialForecast: {
        period: string;
        projectedRevenue: number;
        projectedExpenses: number;
        projectedProfit: number;
    }[];
    roiPrediction: {
        salesROI: string;
        marketingROI: string;
        productROI: string;
        operationsROI: string;
    };
}>;
//# sourceMappingURL=aiEngine.d.ts.map