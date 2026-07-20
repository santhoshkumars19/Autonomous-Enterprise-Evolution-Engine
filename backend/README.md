# EvoAI Backend

Full backend implementation for the EvoAI.

## Structure

```
backend/
├── api/          # Node.js + Express + TypeScript (Port 4000)
└── ai/           # Python + FastAPI + OpenAI/Gemini/LangChain/CrewAI (Port 8000)
```

---

## 1. Node.js Express API (Port 4000)

### Setup

```bash
cd backend/api
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET in .env
npm install
npm run dev
```

### API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, receive JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/tasks` | List tasks (filterable) |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/financial/overview` | KPI summary |
| GET | `/api/financial/revenue-forecast` | Revenue chart data |
| GET | `/api/financial/cashflow` | Cashflow data |
| GET | `/api/financial/expenses` | Expense breakdown |
| GET | `/api/financial/roi` | ROI by department |
| GET | `/api/reports` | List reports |
| GET | `/api/reports/swot` | SWOT data |
| GET | `/api/reports/health` | Business health radar |
| POST | `/api/reports/generate` | Generate report |
| GET | `/api/competitor/overview` | Competitor benchmarks |
| GET | `/api/competitor/activity` | Live activity feed |
| POST | `/api/chat` | Send message to AI |
| GET | `/api/chat/history` | Chat message history |

---

## 2. Python FastAPI AI Microservice (Port 8000)

### Setup

```bash
cd backend/ai
cp .env.example .env
# Fill in OPENAI_API_KEY and GEMINI_API_KEY in .env
pip install -r requirements.txt
python main.py
```

### AI Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/ai/chat` | Chat with GPT-4o or Gemini |
| POST | `/ai/agents/run` | Run CrewAI C-Suite multi-agent |
| GET | `/ai/agents/status` | Agent crew health status |
| POST | `/ai/analysis/swot` | LangChain SWOT analysis |
| POST | `/ai/analysis/competitor` | LangChain competitor analysis |
| POST | `/ai/analysis/market` | LangChain market analysis |
| GET | `/health` | Service health check |

---

## 3. Database Setup (PostgreSQL)

```bash
# Create database
psql -U postgres -c "CREATE DATABASE aeee;"

# Run schema
psql -U postgres -d aeee -f backend/api/src/db/schema.sql
```

---

## Environment Variables

### `backend/api/.env`
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/aeee
JWT_SECRET=your_minimum_32_character_secret_key_here
AI_SERVICE_URL=http://localhost:8000
PORT=4000
```

### `backend/ai/.env`
```env
OPENAI_API_KEY=sk-your-openai-key
GEMINI_API_KEY=your-gemini-key
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/aeee
```

