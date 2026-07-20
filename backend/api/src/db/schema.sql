-- ============================================================
-- EvoAI Platform — Multi-Tenant PostgreSQL Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. Companies ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS companies (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(255) NOT NULL,
  industry    VARCHAR(255) DEFAULT 'Technology SaaS',
  tier        VARCHAR(50) DEFAULT 'Enterprise',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 2. Users ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    UUID REFERENCES companies(id) ON DELETE SET NULL,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  company       VARCHAR(255),
  role          VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'enterprise')),
  avatar_url    TEXT,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN DEFAULT FALSE;

ALTER TABLE companies ADD COLUMN IF NOT EXISTS business_type VARCHAR(100) DEFAULT 'General Enterprise';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS company_size VARCHAR(50) DEFAULT '11-50';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS num_employees INTEGER DEFAULT 25;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'United States';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS state VARCHAR(100) DEFAULT 'California';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT 'San Francisco';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS products_services TEXT DEFAULT 'Enterprise AI Software';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);

-- ─── Business Operations Data ────────────────────────────────
CREATE TABLE IF NOT EXISTS business_operations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id    UUID REFERENCES companies(id) ON DELETE CASCADE,
  business_type VARCHAR(100) NOT NULL,
  entry_date    DATE DEFAULT CURRENT_DATE,
  metrics_data  JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ops_user_id ON business_operations(user_id);
CREATE INDEX IF NOT EXISTS idx_ops_company_id ON business_operations(company_id);

-- ─── 3. Business Metrics ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS business_metrics (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id        UUID REFERENCES companies(id) ON DELETE CASCADE,
  revenue           NUMERIC(15, 2) NOT NULL DEFAULT 0,
  expenses          NUMERIC(15, 2) NOT NULL DEFAULT 0,
  inventory_value   NUMERIC(15, 2) NOT NULL DEFAULT 0,
  active_customers  INTEGER DEFAULT 0,
  churn_rate        NUMERIC(5, 2) DEFAULT 0,
  growth_rate       NUMERIC(5, 2) DEFAULT 15.0,
  currency          VARCHAR(10) DEFAULT 'USD',
  period            VARCHAR(50) DEFAULT 'Q4 2026',
  recorded_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_metrics_user_id ON business_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_metrics_company_id ON business_metrics(company_id);

-- ─── 4. Customers ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id    UUID REFERENCES companies(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  segment       VARCHAR(100) DEFAULT 'Enterprise',
  total_spent   NUMERIC(15, 2) DEFAULT 0,
  health_score  NUMERIC(5, 2) DEFAULT 90,
  status        VARCHAR(50) DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);

-- ─── 5. Products ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id    UUID REFERENCES companies(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  category      VARCHAR(100) DEFAULT 'AI Core',
  sales_volume  INTEGER DEFAULT 0,
  unit_price    NUMERIC(10, 2) DEFAULT 0,
  unit_cost     NUMERIC(10, 2) DEFAULT 0,
  margin        NUMERIC(5, 2) DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);

-- ─── 6. Competitors ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS competitors (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id    UUID REFERENCES companies(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  score         NUMERIC(5, 2) DEFAULT 75,
  growth        VARCHAR(50) DEFAULT '+10%',
  market_share  VARCHAR(50) DEFAULT '20%',
  pricing_usd   NUMERIC(10, 2) DEFAULT 1000,
  last_updated  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitors_user_id ON competitors(user_id);

-- ─── 7. AI Analysis (Personalized per company/user) ───────────
CREATE TABLE IF NOT EXISTS ai_analysis (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id                UUID REFERENCES companies(id) ON DELETE CASCADE,
  analysis_date             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  health_score              INTEGER NOT NULL DEFAULT 85,
  executive_summary         TEXT NOT NULL,
  revenue_analysis          JSONB DEFAULT '{}',
  expense_analysis          JSONB DEFAULT '{}',
  profit_analysis           JSONB DEFAULT '{}',
  customer_analysis         JSONB DEFAULT '{}',
  product_performance       JSONB DEFAULT '{}',
  sales_trend               JSONB DEFAULT '[]',
  inventory_analysis        JSONB DEFAULT '{}',
  swot_analysis             JSONB DEFAULT '{}',
  competitor_analysis       JSONB DEFAULT '{}',
  risk_assessment           JSONB DEFAULT '{}',
  opportunity_analysis      JSONB DEFAULT '{}',
  marketing_recommendations JSONB DEFAULT '[]',
  growth_strategy           JSONB DEFAULT '[]',
  financial_forecast        JSONB DEFAULT '[]',
  roi_prediction            JSONB DEFAULT '{}',
  analysis_result           JSONB DEFAULT '{}',
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analysis_user_id ON ai_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_company_id ON ai_analysis(company_id);

-- ─── 8. Reports ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id  UUID REFERENCES companies(id) ON DELETE CASCADE,
  title       VARCHAR(500) NOT NULL,
  type        VARCHAR(100) NOT NULL,
  period      VARCHAR(100) DEFAULT 'Q4 2026',
  status      VARCHAR(50) NOT NULL DEFAULT 'ready',
  file_url    TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);

-- ─── 9. Tasks (AI Task Planner) ────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id  UUID REFERENCES companies(id) ON DELETE CASCADE,
  title       VARCHAR(500) NOT NULL,
  description TEXT,
  status      VARCHAR(50) NOT NULL DEFAULT 'todo',
  priority    VARCHAR(50) NOT NULL DEFAULT 'medium',
  assignee    VARCHAR(255),
  due_date    DATE,
  ai_score    NUMERIC(5, 2),
  tags        JSONB DEFAULT '[]',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- ─── 10. Chat Sessions ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content     TEXT NOT NULL,
  provider    VARCHAR(50) DEFAULT 'openai',
  tokens_used INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_user_id ON chat_sessions(user_id);

-- ─── Updated At Triggers ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trigger_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trigger_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trigger_analysis_updated_at
  BEFORE UPDATE ON ai_analysis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
