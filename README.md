# 🚀 Fileflow (Smart File Organizer)

## AI-Powered, Content-Aware File Intelligence System

Fileflow is a production-grade File Intelligence Platform. It combines real-time file monitoring, AI-driven content classification, semantic search, and a pristine Apple-style interface.

### Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS v4, shadcn/ui, Google Stitch MCP generated Apple-style designs.
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, pgvector.
- **AI/ML**: sentence-transformers, scikit-learn.

### Getting Started

1. Set up Docker for PostgreSQL and Redis:
   ```bash
   docker-compose up -d
   ```
2. Start the backend:
   ```bash
   cd apps/api
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn src.main:app --reload
   ```
3. Start the frontend:
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

### UI Designs
UI mockups and dashboards generated via Google Stitch MCP are documented in the architecture folder.
