# EduAI — React + FastAPI Application

AI-powered learning platform for Cambridge & Kaplan students.
Built by AI Scholars Society.

---

## 🗂 Project Structure

```
eduai/
├── backend/
│   ├── main.py              ← FastAPI server (all API routes)
│   └── requirements.txt     ← Python dependencies
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js       ← Dev server + /api proxy to backend
    └── src/
        ├── main.jsx         ← React entry point
        ├── App.jsx          ← Router: / | /login | /app
        ├── context/
        │   └── AuthContext.jsx   ← Auth state, JWT tokens, API client
        ├── pages/
        │   ├── Landing.jsx       ← Marketing landing page
        │   ├── Auth.jsx          ← Login / Register / Demo login
        │   ├── AppPlatform.jsx   ← Authenticated app shell + page router
        │   ├── Dashboard.jsx     ← Stats, quick actions, plan preview
        │   ├── Subjects.jsx      ← Cambridge & Kaplan subject browser
        │   ├── LearningPlan.jsx  ← Week-by-week roadmap
        │   └── TeacherLed.jsx    ← Premium plan + checkout
        └── components/
            ├── Sidebar.jsx       ← Fixed navigation sidebar
            └── CheckoutModal.jsx ← GoCardless Direct Debit modal
```

---

## 🚀 Quick Start

### 1. Backend (Python / FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 2. Frontend (React / Vite)

```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:3000

The Vite dev server proxies `/api/*` requests to `http://localhost:8000`,
so you don't need to worry about CORS during development.

---

## 🔑 Authentication

- **Register** – POST `/api/auth/register`
- **Login** – POST `/api/auth/login`
- **Demo login** – POST `/api/auth/demo-login` (no credentials needed)
- Token stored in `localStorage` as `eduai_token`
- All protected routes require `Authorization: Bearer <token>` header

---

## 💳 GoCardless Integration

The backend stub at `/api/gocardless/create-billing-request` simulates
the GoCardless API. To go live:

1. Create a GoCardless account at https://gocardless.com
2. Get your **access token** from the GoCardless dashboard
3. Replace the stub in `backend/main.py` → `create_billing_request()`:

```python
# 1. Create Billing Request
res = requests.post(
    "https://api.gocardless.com/billing_requests",
    headers={"Authorization": f"Bearer {GC_ACCESS_TOKEN}", "GoCardless-Version": "2015-07-06"},
    json={"billing_requests": {"mandate_request": {"currency": "GBP"}, "links": {"creditor": "CR_XXXX"}}}
)
br_id = res.json()["billing_requests"]["id"]

# 2. Create Billing Request Flow
flow_res = requests.post(
    "https://api.gocardless.com/billing_request_flows",
    headers={"Authorization": f"Bearer {GC_ACCESS_TOKEN}", "GoCardless-Version": "2015-07-06"},
    json={"billing_request_flows": {
        "links": {"billing_request": br_id},
        "redirect_uri": "https://yourdomain.com/app?gc_success=1",
        "exit_uri": "https://yourdomain.com/app?gc_exit=1"
    }}
)
flow_id = flow_res.json()["billing_request_flows"]["id"]
return {"billingRequestFlowId": flow_id}
```

4. In `CheckoutModal.jsx`, uncomment the GoCardless Drop-in SDK call:
```javascript
const handler = GoCardlessDropin.create({
  billingRequestFlowID: billingRequestFlowId,
  environment: "live",   // or "sandbox" for testing
  onSuccess: (br) => { ... },
  onExit: (err) => { ... }
});
handler.open();
```

5. Add the Drop-in script to `index.html`:
```html
<script src="https://pay.gocardless.com/dropin/v1/dropin.js"></script>
```

---

## 🗄 Database (Production)

The backend currently uses in-memory dicts. For production, replace with:

```bash
pip install sqlalchemy psycopg2-binary alembic
```

Recommended schema:
- `users` – id, email, password_hash, first_name, last_name, subscription_json
- `plans` – id, user_id, subject, level, syllabus, topics_json, roadmap_json, created_at
- `sessions` – token, user_id, created_at, expires_at

---

## 🌐 Deployment

**Backend** — any Python host (Railway, Render, Fly.io, AWS):
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend** — static host (Vercel, Netlify, Cloudflare Pages):
```bash
npm run build   # outputs to frontend/dist/
```

Set environment variable in production:
```
VITE_API_URL=https://your-backend.railway.app
```

And update `AuthContext.jsx`:
```javascript
const API = import.meta.env.VITE_API_URL || "/api";
```

---

## 📚 Subjects Included

| Syllabus   | Subjects                        | Levels                    |
|------------|---------------------------------|---------------------------|
| Cambridge  | Mathematics, Physics, Chemistry | IGCSE, A-Level            |
| Cambridge  | Biology, Economics              | IGCSE, A-Level            |
| Kaplan     | GMAT, GRE, LSAT                 | Foundation, Advanced      |

---

## ✅ Features Implemented

- [x] Landing page with pricing, testimonials, stats, CTA
- [x] Auth (register, login, demo login, JWT tokens)
- [x] Platform sidebar with plan-gated navigation
- [x] Dashboard with stats, quick actions, upsell banner
- [x] Subject browser (Cambridge & Kaplan)
- [x] Learning plan generator (week-by-week roadmap)
- [x] Teacher-Led premium plan page with billing toggle
- [x] GoCardless Direct Debit checkout modal (3-step flow)
- [x] Subscription activation endpoint
- [x] AI Tutor, Video Learning, Study Mode placeholders

## 🔜 Next Steps

- [ ] Wire up Claude AI API for the AI Tutor chat
- [ ] Add real database (PostgreSQL + SQLAlchemy)
- [ ] Implement GoCardless webhooks for subscription events
- [ ] Add video generation pipeline
- [ ] Build flashcard engine with spaced repetition
- [ ] Add email notifications (welcome, payment confirmed)
