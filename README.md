# Startup Sim Agent

**"Turn an idea into a stress-tested startup plan with autonomous agents."**

A hackathon-ready monorepo that takes a startup idea and produces a comprehensive analysis using multi-agent orchestration with CrewAI, market intelligence, knowledge graphs, and financial modeling.

## Features

- 🤖 **10 Specialized AI Agents** orchestrated with CrewAI
- 🔍 **Live Market Research** with Tavily API + citations
- 🕸️ **Knowledge Graph** in Neo4j for competitor mapping
- 💰 **Financial Modeling** with unit economics
- 🎯 **Investor Debate** (Bull vs Skeptic + synthesis)
- 📊 **GO/NO-GO Scorecard** with next experiments
- 🔄 **Real-time Streaming** progress updates via SSE
- 📦 **Production-Ready** with AWS (DynamoDB, S3, Lambda)

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: FastAPI + Python 3.11
- **Agents**: CrewAI + OpenAI GPT-4
- **Search**: Tavily API
- **Database**: Neo4j (graph) + DynamoDB (state) + SQLite (local)
- **Storage**: S3 (prod) + filesystem (local)
- **Optional**: Yutori, Senso, Modulate, Numeric (with adapters)
- **Deploy**: Render + AWS CDK

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Make

### 1. Clone and Setup

```bash
git clone <repo>
cd startup-sim-agent
cp .env.example .env
# Edit .env with your API keys
```

### 2. Install Dependencies

```bash
make install
```

### 3. Start Local Development

```bash
make dev
```

This starts:
- Frontend: http://localhost:5173
- API: http://localhost:8000
- Neo4j: http://localhost:7474

### 4. Run a Simulation

1. Open http://localhost:5173
2. Enter a startup idea: "AI-powered meal planning for busy parents"
3. Click "Run Simulation"
4. Watch live progress as agents work
5. Download the final report

## Environment Variables

See `.env.example` for all required keys:

**Required:**
- `OPENAI_API_KEY` - GPT-4 access
- `TAVILY_API_KEY` - Market research

**Optional (with stubs):**
- `YUTORI_API_KEY` - Deep web extraction
- `SENSO_API_KEY` - RAG knowledge base
- `MODULATE_API_KEY` - Content moderation
- `NUMERIC_API_KEY` - Financial templates
- `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`

## API Endpoints

- `POST /api/runs` - Start new simulation
- `GET /api/runs/{run_id}/events` - SSE stream
- `GET /api/runs/{run_id}` - Get dossier JSON
- `GET /api/runs/{run_id}/artifact/report.md` - Download markdown
- `GET /api/runs/{run_id}/artifact/report.pdf` - Download PDF
- `POST /api/runs/{run_id}/ask` - RAG Q&A (if Senso enabled)

## Agent Workflow

1. **ClarifierAgent** - Structure the raw idea
2. **MarketResearchAgent** - Find competitors + citations
3. **PositioningAgent** - Define ICP + differentiation
4. **MVPPlannerAgent** - 4-week roadmap
5. **LandingCopyAgent** - Marketing copy + pricing
6. **BullInvestorAgent** - Argue upside
7. **SkepticInvestorAgent** - Attack weaknesses
8. **ModeratorAgent** - Synthesize debate
9. **FinanceAgent** - Unit economics
10. **FinalizerAgent** - GO/NO-GO + experiments

## Development Commands

```bash
make install      # Install all dependencies
make dev          # Start dev environment
make test         # Run tests
make lint         # Lint code
make format       # Format code
make clean        # Clean artifacts
```

## Deployment

### Render (Frontend + API)

```bash
# Connect your repo to Render
# It will auto-detect render.yaml
```

### AWS (Storage + Lambda)

```bash
cd infra/aws
npm install
npx cdk deploy
```

## Demo Script (for Judges)

1. **Show the problem**: "I have a startup idea but don't know if it's viable"
2. **Enter idea**: "AI-powered legal document analyzer for small businesses"
3. **Live progress**: Point out each agent step streaming in real-time
4. **Market graph**: Show Neo4j browser with competitor relationships
5. **Debate**: Highlight bull vs skeptic arguments
6. **Scorecard**: Show GO/NO-GO recommendation with reasoning
7. **Download**: Export full report as PDF
8. **Previous runs**: Show run history and persistence

## Architecture Highlights

- **Stateful workflow**: Single `StartupDossier` JSON updated by each agent
- **Streaming**: SSE for real-time progress updates
- **Citations**: Every market claim links to source URLs
- **Graph DB**: Neo4j stores competitive landscape relationships
- **Modular integrations**: Stub adapters for optional services
- **Production-ready**: AWS infrastructure with DynamoDB + S3

## License

MIT
