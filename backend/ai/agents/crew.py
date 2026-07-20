from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
from config.settings import get_settings

settings = get_settings()

# ─── Shared LLM ──────────────────────────────────────────────────────────────
llm = ChatOpenAI(
    model=settings.OPENAI_MODEL,
    api_key=settings.OPENAI_API_KEY,
    temperature=0.6,
)

# ─── C-Suite AI Agents ───────────────────────────────────────────────────────

ceo_agent = Agent(
    role="Chief Executive Officer (AI)",
    goal="Synthesize strategic insights from all departments and make high-level decisions that drive business growth and competitive advantage.",
    backstory="""You are an autonomous AI CEO with 20+ years of enterprise leadership experience. 
    You excel at synthesizing market intelligence, financial data, and operational metrics 
    into clear strategic directives. You think long-term and balance risk with opportunity.""",
    llm=llm,
    verbose=False,
    allow_delegation=True,
)

cfo_agent = Agent(
    role="Chief Financial Officer (AI)",
    goal="Analyze financial data, forecast revenue, identify cost optimization opportunities, and ensure financial health and runway sustainability.",
    backstory="""You are an AI CFO specialized in SaaS financial modeling, burn rate optimization, 
    and investor-grade reporting. You provide data-driven financial guidance with precision 
    and clearly communicate financial risks and opportunities.""",
    llm=llm,
    verbose=False,
    allow_delegation=False,
)

cmo_agent = Agent(
    role="Chief Marketing Officer (AI)",
    goal="Develop data-driven marketing strategies, analyze campaign performance, optimize ad spend, and grow brand awareness and pipeline.",
    backstory="""You are an AI CMO with expertise in B2B SaaS marketing, demand generation, 
    content strategy, and performance marketing. You balance brand building with 
    measurable pipeline growth and CAC optimization.""",
    llm=llm,
    verbose=False,
    allow_delegation=False,
)

sales_agent = Agent(
    role="VP of Sales (AI)",
    goal="Identify sales opportunities, optimize the pipeline, develop winning sales strategies, and maximize revenue attainment.",
    backstory="""You are an AI VP of Sales with deep experience in enterprise SaaS sales cycles, 
    deal qualification, objection handling, and revenue forecasting. You drive urgency 
    and build systematic approaches to pipeline management.""",
    llm=llm,
    verbose=False,
    allow_delegation=False,
)


def create_strategy_crew(business_context: str) -> Crew:
    """Create a full C-Suite crew for a strategic analysis session."""

    financial_task = Task(
        description=f"""Analyze the following business context and provide a financial assessment:
        {business_context}
        
        Include: Revenue health, burn rate concerns, ROI recommendations, and 3-month financial forecast.""",
        expected_output="A structured financial analysis with specific numbers and 3 actionable recommendations.",
        agent=cfo_agent,
    )

    marketing_task = Task(
        description=f"""Based on this business context, develop a marketing strategy:
        {business_context}
        
        Include: Campaign priorities, budget allocation recommendation, top channels, and KPIs to track.""",
        expected_output="A marketing action plan with budget splits, channels, and 30-day quick wins.",
        agent=cmo_agent,
    )

    sales_task = Task(
        description=f"""Analyze the sales opportunity in this context:
        {business_context}
        
        Include: Pipeline assessment, top 3 sales priorities, deal velocity improvements, and revenue targets.""",
        expected_output="A sales acceleration plan with specific pipeline actions and revenue targets.",
        agent=sales_agent,
    )

    ceo_synthesis_task = Task(
        description="""Synthesize the financial, marketing, and sales analyses into a coherent 
        executive strategy. Prioritize the top 5 actions across all departments and 
        identify the single biggest risk and opportunity for the business.""",
        expected_output="An executive summary with top 5 strategic actions, #1 risk, and #1 opportunity.",
        agent=ceo_agent,
        context=[financial_task, marketing_task, sales_task],
    )

    crew = Crew(
        agents=[cfo_agent, cmo_agent, sales_agent, ceo_agent],
        tasks=[financial_task, marketing_task, sales_task, ceo_synthesis_task],
        process=Process.sequential,
        verbose=False,
    )

    return crew
