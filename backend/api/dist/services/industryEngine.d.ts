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
export declare function getCompanyContext(userId: string): Promise<CompanyContext>;
/**
 * 1. Competitors Module Adaptation
 */
export declare function getIndustryCompetitors(ctx: CompanyContext): {
    competitors: {
        name: string;
        score: number;
        growth: string;
        share: string;
        tag: string;
        highlight: boolean;
        pricing: number;
    }[];
    feed: {
        time: string;
        event: string;
        severity: string;
    }[];
};
/**
 * 2. Market Trends Module Adaptation
 */
export declare function getIndustryTrends(ctx: CompanyContext): {
    metrics: {
        label: string;
        value: string;
        growth: string;
    }[];
    topics: string[];
};
/**
 * 3. Marketing Studio Module Adaptation
 */
export declare function getIndustryMarketing(ctx: CompanyContext): {
    title: string;
    type: string;
    status: string;
    budget: string;
    spent: string;
    roi: string;
    reach: string;
    usedPercent: number;
}[];
/**
 * 4. Financial Analytics Module Adaptation
 */
export declare function getIndustryFinancialKPIs(ctx: CompanyContext): {
    kpi1: {
        label: string;
        value: string;
        change: string;
    };
    kpi2: {
        label: string;
        value: string;
        change: string;
    };
    kpi3: {
        label: string;
        value: string;
        change: string;
    };
    kpi4: {
        label: string;
        value: string;
        change: string;
    };
    expenseBreakdown: {
        name: string;
        value: number;
        color: string;
    }[];
};
/**
 * 5. CEO Recommendations Adaptation
 */
export declare function getIndustryCEORecommendations(ctx: CompanyContext): string[];
/**
 * 6. AI Task Planner Initial Tasks Adaptation
 * Generates industry and business-type specific tasks with distributed dates across the month.
 */
export declare function getIndustryTasks(ctx: CompanyContext): {
    title: string;
    description: string;
    priority: string;
    status: string;
    assignee: string;
    due_date: string;
    ai_score: number;
    category: string;
}[];
/**
 * 7. Reports Center List Adaptation
 */
export declare function getIndustryReports(ctx: CompanyContext): {
    id: string;
    title: string;
    type: string;
    period: string;
    score: number;
}[];
/**
 * 8. AI System Prompt Adaptation
 */
export declare function getIndustrySystemPrompt(ctx: CompanyContext): string;
/**
 * 9. Industry-Aware Suggested Questions
 */
export declare function getIndustrySuggestedQuestions(ctx: CompanyContext): string[];
//# sourceMappingURL=industryEngine.d.ts.map