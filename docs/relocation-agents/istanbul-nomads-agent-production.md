# Istanbul Nomads Agent - Production-Ready Blueprint

## 🎯 Goal
Build a high-quality Relocation Decision Agent with:
- RAG pipeline
- Structured outputs
- Scalable architecture

---

# 🧠 SYSTEM DESIGN

## 1. DATA SCHEMA

### Neighborhood Schema
{
  "name": "Kadikoy",
  "vibe": ["social", "cafes", "nomad-friendly"],
  "budget_level": "medium",
  "transport": ["metro", "ferry"],
  "internet_quality": "high",
  "notes": "popular among digital nomads"
}

---

### Cost Schema
{
  "monthly_budget_ranges": {
    "low": [700, 1000],
    "medium": [1000, 1500],
    "high": [1500, 2500]
  },
  "rent": [500, 1200],
  "coworking": [100, 250],
  "food": [200, 400],
  "transport": [20, 50]
}

---

### Setup Schema
{
  "first_week": [
    "buy SIM card",
    "get Istanbulkart",
    "book Airbnb",
    "visit neighborhoods"
  ]
}

---

# 🔍 RAG PIPELINE

## Chunking
- Size: 300–500 tokens
- Semantic grouping (NOT arbitrary)

## Metadata
{
  "type": "neighborhood",
  "tags": ["kadikoy", "social"],
  "source": "istanbulnomads.com"
}

---

## Retrieval Strategy
- Top K = 5–8 chunks
- Hybrid search (semantic + keyword)

---

# 🧠 AGENT PROMPT (FINAL)

You are an expert relocation advisor for Istanbul digital nomads.

You MUST:
- Produce structured, actionable plans
- Avoid generic advice
- Use provided knowledge only

Output sections:
1. Neighborhood Match
2. Cost Breakdown
3. Setup Plan
4. Strategy
5. Tips

Also return JSON.

---

# ⚙️ API DESIGN

POST /api/plan

Request:
{
  "budget": 1500,
  "duration": "2 months",
  "lifestyle": "social",
  "work": "remote"
}

Response:
{
  "plan_text": "...",
  "plan_json": {...}
}

---

# 🎨 UI DESIGN

## Layout
Single-page interface

## Components
- Input form
- Result cards
- Export button

---

# 🧪 DEMO FLOW

1. Input query
2. Generate plan
3. Show structured result
4. Highlight real data usage

---

# 🚀 DEPLOYMENT

- Vercel (frontend + API)
- Supabase (DB + vector)
- Edge functions optional

---

# 📈 SCALING

Phase 2:
- Listings
- Deals
- Matching engine

Phase 3:
- Marketplace
- Transactions

---

# 🧠 CORE INSIGHT

You are not building a chatbot.

You are building:
A decision engine powered by real-world city intelligence.
