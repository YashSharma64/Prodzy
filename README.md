# Prodzy — AI Product Description Generator

> **Backend-first, API-driven product description generator** with rule-based quality checks.  
> Built for demos and fast iteration — no database, no auth, just clean prompts and evaluation.

---

## 🚀 What it does

- **Generate** product descriptions from structured inputs (name, category, features, audience, tone, language)
- **Evaluate** descriptions with rule-based checks (length, tone, missing fields, CTA, readability)
- **Supports** Google Gemini (default) and OpenAI (fallback)
- **Frontend**: React + Vite + Tailwind CSS (minimal, elegant)
- **Backend**: FastAPI + Pydantic + async LLM calls

---

## 📁 Project Structure

```
Prodzy/
├─ backend/          # FastAPI app
│  ├─ app/
│  │  ├─ routes/     # API endpoints
│  │  ├─ services/    # LLM + evaluation logic
│  │  ├─ schemas/     # Pydantic models
│  │  └─ config.py    # Env + settings
│  └─ requirements.txt
├─ frontend/         # React (Vite) UI
│  ├─ src/
│  │  ├─ pages/       # Input.jsx, Result.jsx
│  │  ├─ services/    # api.js
│  │  └─ App.jsx
│  └─ package.json
└─ README.md
```

---

## ⚙️ Local Development

### Backend (FastAPI)

1. **Create virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Set environment variables**  
   Create `backend/.env`:

   ```env
   LLM_PROVIDER=gemini
   GEMINI_API_KEY=YOUR_REAL_KEY
   GEMINI_MODEL=gemini-1.5-flash
   ```

4. **Run server**
   ```bash
   python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8001
   ```

5. **Verify**
   - Open `http://127.0.0.1:8001/docs` for Swagger UI

---

### Frontend (React + Vite)

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Run dev server**
   ```bash
   npm run dev
   ```

3. **Visit**
   - Usually `http://localhost:5173`

4. **Override backend URL (optional)**
   Create `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8001
   ```

---

## 🌐 Production Deployment

### Backend (Render)

- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### Environment Variables (Render dashboard)
```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=YOUR_REAL_KEY
GEMINI_MODEL=gemini-1.5-flash
```

#### Health check
- `GET /health` → `{"status":"ok"}`

---

### Frontend (Vercel/Netlify)

- **Build**: `npm run build`
- **Output**: `dist/`
- **Environment Variable**:
   ```env
   VITE_API_BASE_URL=https://your-backend-name.onrender.com
   ```

---

## 📡 API Reference

### `POST /generate-description`

**Request**
```json
{
  "product_name": "Aurora Stainless Steel Water Bottle",
  "category": "Drinkware",
  "key_features": ["Insulated", "Leak-proof", "750ml"],
  "audience": "Gym-goers",
  "tone": "premium",
  "language": "en",
  "prompt_version": "v2"
}
```

**Response**
```json
{
  "description": "...",
  "metadata": {
    "provider": "gemini",
    "model": "gemini-1.5-flash"
  }
}
```

---

### `POST /evaluate`

**Request**
```json
{
  "description": "...",
  "expected_tone": "premium",
  "required_terms": ["insulated", "leak-proof"],
  "min_length": 120,
  "max_length": 180
}
```

**Response**
```json
{
  "score": 82,
  "checks": {
    "length": "pass",
    "tone": "warn",
    "missing_info": "pass"
  },
  "suggestions": [
    "Make tone more premium by reducing casual phrases.",
    "Add a short usage scenario for gym sessions."
  ]
}
```

---

## 🧪 Demo Flow (for company)

1. Open frontend → **welcome screen** → progress bar → **Input page**
2. Click **“Fill the Product Details Form”** → form reveals
3. Click **“Use sample”** (demo backup) → fields prefill
4. Click **“Generate Description”** → loading → **Result page**
5. Review:
   - Description
   - Quality checks (pass/warn)
   - Suggestions
   - Copy/Regenerate buttons
6. Click **“Back”** → return to Input

---

## 🛠️ Troubleshooting

- **Port already in use**
  ```bash
  lsof -ti :8001 | xargs kill -9
  ```

- **CORS errors**  
  Add your frontend URL to `allow_origins` in `backend/app/main.py`.

- **Invalid API key / quota**
  Frontend will show friendly messages. Ensure real key in backend `.env`.

---

## 📜 License

MIT (or company-assessment default — update if required).

---

## 🤝 Contributing

1. Fork
2. Feature branch
3. Keep changes minimal and focused
4. PR with clear description

---

> **Built for demos and fast iteration.**  
> **No database, no auth — just prompts, evaluation, and clean UI.**