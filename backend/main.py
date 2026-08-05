"""
EduAI FastAPI Backend
Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import uuid, hashlib, time, json

app = FastAPI(title="EduAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)

# ── In-memory "database" (replace with real DB in production) ──────────────
USERS: dict = {}
PLANS: dict = {}
SESSIONS: dict = {}

# ── Seed data ──────────────────────────────────────────────────────────────
SUBJECTS = {
    "cambridge": {
        "Mathematics": {
            "IGCSE":   ["Number & Algebra", "Geometry", "Statistics", "Trigonometry"],
            "A-Level": ["Pure Maths", "Mechanics", "Statistics", "Calculus"],
        },
        "Physics": {
            "IGCSE":   ["Motion", "Energy", "Waves", "Electricity"],
            "A-Level": ["Quantum", "Mechanics", "Thermal", "Fields"],
        },
        "Chemistry": {
            "IGCSE":   ["Atomic Structure", "Bonding", "Acids", "Organic Basics"],
            "A-Level": ["Equilibria", "Kinetics", "Electrochemistry", "Organic Synthesis"],
        },
        "Biology": {
            "IGCSE":   ["Cell Biology", "Genetics", "Ecology", "Human Biology"],
            "A-Level": ["Biochemistry", "Physiology", "Evolution", "Ecology"],
        },
        "Economics": {
            "IGCSE":   ["Supply & Demand", "Market Structures", "Macroeconomics"],
            "A-Level": ["Microeconomics", "Macroeconomics", "International Trade"],
        },
    },
    "kaplan": {
        "GMAT": {
            "Foundation": ["Quant Basics", "Verbal", "Reasoning"],
            "Advanced":   ["Data Sufficiency", "Critical Reasoning", "Integrated Reasoning"],
        },
        "GRE": {
            "Foundation": ["Vocabulary", "Math Foundations"],
            "Advanced":   ["Text Completion", "Analytical Writing", "Quantitative Reasoning"],
        },
        "LSAT": {
            "Foundation": ["Logic Games", "Reading Comprehension"],
            "Advanced":   ["Logical Reasoning", "Analytical Reasoning"],
        },
    },
}

PRICING = {
    "teacher": {"monthly": 599,  "annual": 479,  "name": "Teacher-Led"},
    "video":   {"monthly": 599,  "annual": 479,  "name": "Video Learning"},
    "ai":      {"monthly": 599,  "annual": 479,  "name": "AI-Powered"},
}


# ── Helpers ────────────────────────────────────────────────────────────────
def hash_pw(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()

def make_token(user_id: str) -> str:
    tok = str(uuid.uuid4())
    SESSIONS[tok] = {"user_id": user_id, "created": time.time()}
    return tok

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    if not creds:
        raise HTTPException(status_code=401, detail="Not authenticated")
    session = SESSIONS.get(creds.credentials)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = USERS.get(session["user_id"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ── Schemas ────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class CreatePlanRequest(BaseModel):
    syllabus: str     # "cambridge" | "kaplan"
    subject: str
    level: str

class CheckoutRequest(BaseModel):
    plan_id: str      # "teacher" | "video" | "ai"
    billing: str      # "monthly" | "annual"
    first_name: str
    last_name: str
    email: str


# ── Auth routes ────────────────────────────────────────────────────────────
@app.post("/api/auth/register")
def register(body: RegisterRequest):
    email = body.email.lower().strip()
    if any(u["email"] == email for u in USERS.values()):
        raise HTTPException(status_code=409, detail="Email already registered")
    user_id = str(uuid.uuid4())
    USERS[user_id] = {
        "id": user_id,
        "first_name": body.first_name,
        "last_name": body.last_name,
        "email": email,
        "password": hash_pw(body.password),
        "subscription": None,
        "created": time.time(),
    }
    token = make_token(user_id)
    return {"token": token, "user": _safe_user(USERS[user_id])}


@app.post("/api/auth/login")
def login(body: LoginRequest):
    email = body.email.lower().strip()
    user = next((u for u in USERS.values() if u["email"] == email), None)
    if not user or user["password"] != hash_pw(body.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = make_token(user["id"])
    return {"token": token, "user": _safe_user(user)}


@app.post("/api/auth/demo-login")
def demo_login():
    """Auto-create a demo account for quick testing."""
    demo_id = "demo-user"
    if demo_id not in USERS:
        USERS[demo_id] = {
            "id": demo_id,
            "first_name": "Alex",
            "last_name": "Demo",
            "email": "demo@eduai.com",
            "password": "",
            "subscription": None,
            "created": time.time(),
        }
    token = make_token(demo_id)
    return {"token": token, "user": _safe_user(USERS[demo_id])}


@app.get("/api/auth/me")
def me(user=Depends(get_current_user)):
    return _safe_user(user)


# ── Subjects ───────────────────────────────────────────────────────────────
@app.get("/api/subjects")
def get_subjects():
    result = []
    icons = {"Mathematics":"📐","Physics":"⚡","Chemistry":"🧪","Biology":"🌿",
             "Economics":"📊","GMAT":"📋","GRE":"✏️","LSAT":"⚖️"}
    for syllabus, subjects in SUBJECTS.items():
        for name, levels in subjects.items():
            result.append({
                "name": name,
                "syllabus": syllabus.capitalize(),
                "icon": icons.get(name, "📚"),
                "levels": list(levels.keys()),
            })
    return result


@app.get("/api/subjects/{syllabus}/{subject}/{level}/topics")
def get_topics(syllabus: str, subject: str, level: str):
    s = SUBJECTS.get(syllabus.lower(), {})
    subj = s.get(subject, {})
    topics = subj.get(level)
    if topics is None:
        raise HTTPException(status_code=404, detail="Topics not found")
    return {"topics": topics}


# ── Learning plans ─────────────────────────────────────────────────────────
@app.post("/api/plans")
def create_plan(body: CreatePlanRequest, user=Depends(get_current_user)):
    syllabus = body.syllabus.lower()
    topics_map = SUBJECTS.get(syllabus, {}).get(body.subject, {})
    topics = topics_map.get(body.level)
    if not topics:
        raise HTTPException(status_code=404, detail="Subject/level not found")
    roadmap = [
        {"week": i + 1, "topic": t, "hrs": 3 + (i % 3), "status": "current" if i == 0 else "upcoming"}
        for i, t in enumerate(topics)
    ]
    plan = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "subject": body.subject,
        "level": body.level,
        "syllabus": body.syllabus.capitalize(),
        "topics": topics,
        "roadmap": roadmap,
        "created": time.time(),
    }
    PLANS[plan["id"]] = plan
    return plan


@app.get("/api/plans")
def list_plans(user=Depends(get_current_user)):
    return [p for p in PLANS.values() if p["user_id"] == user["id"]]


@app.delete("/api/plans/{plan_id}")
def delete_plan(plan_id: str, user=Depends(get_current_user)):
    plan = PLANS.get(plan_id)
    if not plan or plan["user_id"] != user["id"]:
        raise HTTPException(status_code=404, detail="Plan not found")
    del PLANS[plan_id]
    return {"ok": True}


# ── Subscription (GoCardless stub) ─────────────────────────────────────────
@app.post("/api/gocardless/create-billing-request")
def create_billing_request(body: CheckoutRequest):
    """
    PRODUCTION: Replace with real GoCardless API calls.
    1. POST https://api.gocardless.com/billing_requests  (create mandate request)
    2. POST https://api.gocardless.com/billing_request_flows  (get drop-in flow ID)
    3. Return { billingRequestFlowId, authorisationUrl }
    """
    pricing = PRICING.get(body.plan_id)
    if not pricing:
        raise HTTPException(status_code=400, detail="Unknown plan")
    amount = pricing[body.billing]
    # Sandbox: return a fake flow ID
    fake_flow_id = f"BRF_{uuid.uuid4().hex[:16].upper()}"
    return {
        "billingRequestFlowId": fake_flow_id,
        "authorisationUrl": f"https://pay-sandbox.gocardless.com/obauth/{fake_flow_id}",
        "amount": amount,
        "currency": "GBP",
        "plan": pricing["name"],
        "billing": body.billing,
        "_sandbox": True,
        "_note": "Replace with live GoCardless credentials in production.",
    }


@app.post("/api/subscription/activate")
def activate_subscription(user=Depends(get_current_user)):
    """Called after GoCardless drop-in onSuccess callback."""
    USERS[user["id"]]["subscription"] = {"plan": "teacher", "active": True, "since": time.time()}
    return {"ok": True, "subscription": USERS[user["id"]]["subscription"]}


# ── Pricing ────────────────────────────────────────────────────────────────
@app.get("/api/pricing")
def get_pricing():
    return PRICING


# ── Helpers ────────────────────────────────────────────────────────────────
def _safe_user(u: dict) -> dict:
    return {k: v for k, v in u.items() if k != "password"}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="localhost",
        port=5000,  # Changed from 8000 to 5000
        reload=True,
        log_level="info"
    )