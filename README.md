# Prodzy — AI Product Description Generator (Backend-Heavy)
 
Prodzy is a lightweight, demo-friendly app that generates **high-quality e-commerce product descriptions** using an LLM (OpenAI or Gemini), and runs **rule-based quality checks** (length/tone/missing fields) to help iterate quickly.
 
- Frontend: React (Vite) + minimal styling
- Backend: FastAPI (async) + Pydantic
- LLM: OpenAI (GPT-4o-mini / GPT-3.5) or Google Gemini
- API: REST + JSON
- Evaluation: rule-based (no ML)
 
## Why this project design
- Clean, interview-friendly architecture
- Backend-first (prompting, validations, retries, evaluation logic)
- No DB / No Auth (intentional to keep scope tight)
- Swagger UI available out of the box for quick demos
 
## Features
- Generate product descriptions from structured product inputs
- Switchable LLM provider (OpenAI / Gemini)
- Rule-based evaluation:
  - Length checks
  - Tone alignment checks
  - Missing/required field checks
  - Suggestions for improvements
 
## Project Structure
```
Prodzy/
  backend/              # FastAPI app (to be implemented)
  frontend/             # React (Vite) UI
  README.md
```
 
## Backend (FastAPI)
 
### 1) Create a virtual environment
From the repo root:
 
```bash
python -m venv .venv
source .venv/bin/activate
```
 
### 2) Install dependencies
Once `backend/` contains the API code and requirements file, you’ll run something like:
 
```bash
pip install -r backend/requirements.txt
```
 
### 3) Environment variables
Create `backend/.env` (or `.env` at repo root depending on implementation) with one of the provider configs below.
 
#### Option A: OpenAI
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=YOUR_KEY_HERE
OPENAI_MODEL=gpt-4o-mini
```
 
#### Option B: Gemini
```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=YOUR_KEY_HERE
GEMINI_MODEL=gemini-1.5-flash
```
 
### 4) Run the API
Typical dev command (will be finalized once backend exists):
 
```bash
uvicorn app.main:app --reload --port 8000
```
 
### API Docs
- Swagger UI: `http://localhost:8000/docs`
- OpenAPI JSON: `http://localhost:8000/openapi.json`
 
## Frontend (React)
 
### Install + run
```bash
cd frontend
npm install
npm run dev
```
 
Vite will print the local URL (usually `http://localhost:5173`).
 
### Frontend ↔ Backend
The frontend calls the FastAPI backend over REST.
 
Typical dev URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
 
If CORS is needed, it will be enabled in the FastAPI app for local dev.
 
## Planned REST API (contract)
Exact schemas will be enforced with Pydantic models.
 
### `GET /health`
Simple health check.
 
### `POST /generate`
Generates a product description using the chosen LLM provider.
 
Example request (shape):
```json
{
  "product_name": "Aurora Stainless Steel Water Bottle",
  "category": "Drinkware",
  "key_features": ["Insulated", "Leak-proof", "750ml"],
  "audience": "Gym-goers",
  "tone": "premium",
  "language": "en"
}
```
 
Example response (shape):
```json
{
  "description": "...",
  "metadata": {
    "provider": "openai",
    "model": "gpt-4o-mini"
  }
}
```
 
### `POST /evaluate`
Runs rule-based checks on a generated description.
 
Example request (shape):
```json
{
  "description": "...",
  "expected_tone": "premium",
  "required_terms": ["insulated", "leak-proof"],
  "min_length": 400,
  "max_length": 900
}
```
 
Example response (shape):
```json
{
  "score": 82,
  "checks": {
    "length": "pass",
    "tone": "warn",
    "missing_fields": "pass"
  },
  "suggestions": [
    "Make the tone more premium by reducing casual phrases.",
    "Add a short usage scenario for gym sessions."
  ]
}
```
 
## Notes / Non-Goals (intentional)
- No database
- No authentication
- No LangChain / RAG / vector DB
- Docker optional
 
## License
MIT (or company-assessment default — update if required).