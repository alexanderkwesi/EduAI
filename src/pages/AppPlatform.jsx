import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
import Subjects from "./Subjects";
import LearningPlan from "./LearningPlan";
import TeacherLed from "./TeacherLed";
import CheckoutModal from "../components/CheckoutModal";

function AITutor({ activePlan }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🤖</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>AI Tutor — Powered by Claude</h2>
      <p style={{ color: "#6b7280", maxWidth: 400, margin: "0 auto 24px" }}>
        {activePlan ? `Your tutor is ready to help with ${activePlan.subject} (${activePlan.level}).` : "Create a learning plan first to get context-aware AI tutoring."}
      </p>
      <div style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 14, padding: 20, maxWidth: 500, margin: "0 auto", fontSize: 13, color: "#374151" }}>
        💡 Full AI chat interface available in Teacher-Led & AI-Powered plans.
      </div>
    </div>
  );
}

function StudyMode({ activePlan }) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Study Mode</h2>
      {activePlan ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14, marginTop: 20 }}>
          {activePlan.topics.map((t, i) => (
            <div key={t} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "20px 18px", cursor: "pointer" }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>🃏</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Week {i+1}: {t}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>4 flashcards · 1 quiz</div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#6b7280" }}>Create a learning plan first to unlock study mode.</p>
      )}
    </div>
  );
}

function VideoLearning() {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🎬</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Video Learning</h2>
      <p style={{ color: "#6b7280", maxWidth: 400, margin: "0 auto" }}>Auto-generated video lessons from your syllabus content. Available on Video Learning & Teacher-Led plans.</p>
    </div>
  );
}

function Settings() {
  const { user, logout } = useAuth();
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Settings</h2>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, maxWidth: 480 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: 10 }}>Account</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{user?.first_name} {user?.last_name}</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>{user?.email}</div>
        </div>
        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: 10 }}>Subscription</div>
          <div style={{ fontSize: 14, color: user?.subscription ? "#059669" : "#6b7280" }}>{user?.subscription ? "✅ Teacher-Led — Active" : "Free plan"}</div>
        </div>
        <button onClick={logout} style={{ marginTop: 24, padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading, apiFetch } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState("dashboard");
  const [plans, setPlans] = useState([]);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      apiFetch("/plans").then(setPlans).catch(console.error);
    }
  }, [user, apiFetch]);

  if (loading || !user) return null;

  const activePlan = plans[0] || null;

  const addPlan = (plan) => setPlans(prev => [plan, ...prev.filter(p => p.id !== plan.id)]);

  const deletePlan = async (id) => {
    await apiFetch(`/plans/${id}`, { method: "DELETE" });
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard plans={plans} onNavigate={setPage} onUpgrade={() => setUpgradeOpen(true)} />;
      case "subjects":  return <Subjects onPlanCreated={addPlan} onNavigate={setPage} />;
      case "plan":      return <LearningPlan plans={plans} onDeletePlan={deletePlan} onNavigate={setPage} />;
      case "teacher":   return <TeacherLed />;
      case "video":     return <VideoLearning />;
      case "ai":        return <AITutor activePlan={activePlan} />;
      case "study":     return <StudyMode activePlan={activePlan} />;
      case "settings":  return <Settings />;
      default:          return <Dashboard plans={plans} onNavigate={setPage} onUpgrade={() => setUpgradeOpen(true)} />;
    }
  };

  return (
    <div style={{ fontFamily: "'Sora',sans-serif", background: "#f5f6fa", minHeight: "100vh" }}>
      <Sidebar activePage={page} onNavigate={setPage} hasActivePlan={!!activePlan} />
      <div style={{ marginLeft: 216, padding: "36px 44px", minHeight: "100vh" }}>
        {renderPage()}
      </div>
      {upgradeOpen && (
        <CheckoutModal planId="teacher" billingCycle="monthly" onClose={() => setUpgradeOpen(false)} onSuccess={() => setUpgradeOpen(false)} />
      )}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;}`}</style>
    </div>
  );
}
