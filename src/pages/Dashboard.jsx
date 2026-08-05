import { useAuth } from "../context/AuthContext";

export default function Dashboard({ plans, onNavigate, onUpgrade }) {
  const { user } = useAuth();
  const activePlan = plans?.[0] || null;
  const isSubscribed = !!user?.subscription;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const stats = [
    { icon: "📘", value: activePlan ? activePlan.topics.length : 0, label: "Active Topics" },
    { icon: "🃏", value: activePlan ? activePlan.topics.length * 4 : 0, label: "Flashcards" },
    { icon: "🗓️", value: activePlan ? "Active roadmap" : "—", label: "Plan Status" },
    { icon: "💎", value: isSubscribed ? "Teacher-Led" : "Free", label: "Subscription" },
  ];

  const actions = [
    { id: "subjects", icon: "🔍", title: "Find Subject", desc: "Cambridge & Kaplan syllabi", disabled: false },
    { id: "plan", icon: "🗺️", title: "Learning Plan", desc: "Your personalised roadmap", disabled: !activePlan },
    { id: "ai", icon: "🤖", title: "AI Tutor", desc: "Chat with Claude AI", disabled: false },
    { id: "study", icon: "⚡", title: "Study Mode", desc: "Flashcards & quizzes", disabled: !activePlan },
  ];

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.3, background: "linear-gradient(135deg,#1e293b,#2d3a5e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6 }}>
          {greeting()}, {user?.first_name} 👋
        </h1>
        <p style={{ color: "#5b6e8c", fontSize: 15 }}>
          {isSubscribed ? "Teacher-Led plan · All features unlocked" : "Free plan · Ready to unlock your full potential"}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 36 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 24, padding: "20px 22px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #e9edf2" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: -0.5 }}>{s.value}</div>
            <div style={{ color: "#6c7a91", fontSize: 13, marginTop: 5, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 40 }}>
        {actions.map(a => (
          <button key={a.id} onClick={() => !a.disabled && onNavigate(a.id)} title={a.disabled ? "Create a learning plan first" : ""}
            style={{ background: "#fff", borderRadius: 20, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #eef2f6", cursor: a.disabled ? "not-allowed" : "pointer", opacity: a.disabled ? 0.5 : 1, boxShadow: "0 2px 6px rgba(0,0,0,0.02)", textAlign: "left", fontFamily: "'Sora',sans-serif", transition: "all 0.2s" }}>
            <div style={{ width: 48, height: 48, background: "linear-gradient(145deg,#f0f4fe,#fff)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: "1px solid #e2e8f0", flexShrink: 0 }}>{a.icon}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{a.title}</div>
              <div style={{ fontSize: 12, color: "#6c7a91", marginTop: 3 }}>{a.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Upsell / active plan card */}
      {!isSubscribed ? (
        <div style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.07),rgba(168,85,247,0.07))", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 14, padding: "18px 22px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3, color: "#111827" }}>Unlock Teacher-Led Premium ✨</div>
            <div style={{ color: "#6b7280", fontSize: 13 }}>Live 1-on-1 tutoring, AI video generator, and Cambridge certified tutors from £5.99/month.</div>
          </div>
          <button onClick={onUpgrade} style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Sora',sans-serif" }}>
            Upgrade →
          </button>
        </div>
      ) : (
        <div style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.07),rgba(5,150,105,0.07))", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 14, padding: "18px 22px", marginBottom: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#065f46" }}>🎉 You're on Teacher-Led plan — enjoy unlimited tutoring & AI tools!</div>
        </div>
      )}

      {/* Learning plan preview */}
      <div style={{ background: "#fff", borderRadius: 24, padding: "24px 28px", border: "1px solid #eef2f8" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Your Learning Plan</div>
            <div style={{ fontSize: 13, color: "#4b5e7c" }}>
              {activePlan ? `${activePlan.subject} · ${activePlan.level} (${activePlan.syllabus} syllabus)` : "No active plan — find a subject to generate your personalised roadmap"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ background: activePlan ? "#e6f7ec" : "#f1f3f8", color: activePlan ? "#15803d" : "#6c7a91", padding: "6px 14px", borderRadius: 30, fontSize: 12, fontWeight: 700 }}>
              {activePlan ? "In Progress" : "Not started"}
            </span>
            <button onClick={() => activePlan && onNavigate("plan")} disabled={!activePlan} style={{ background: "none", border: "1px solid #cbd5e1", padding: "6px 14px", borderRadius: 30, fontWeight: 600, fontSize: 12, cursor: activePlan ? "pointer" : "not-allowed", opacity: activePlan ? 1 : 0.5, fontFamily: "'Sora',sans-serif" }}>
              View roadmap
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {activePlan ? (
            activePlan.topics.slice(0, 7).map((t, i) => (
              <span key={t} style={{ background: "#f1f5f9", padding: "6px 14px", borderRadius: 30, fontSize: 13, fontWeight: 500, color: "#1e293b" }}>{t}</span>
            ))
          ) : (
            <span style={{ background: "#f1f5f9", padding: "6px 14px", borderRadius: 30, fontSize: 13, fontWeight: 500, color: "#1e293b" }}>🔍 Use "Find Subject" to pick a course</span>
          )}
          {activePlan && activePlan.topics.length > 7 && (
            <span style={{ background: "#f1f5f9", padding: "6px 14px", borderRadius: 30, fontSize: 13, color: "#6b7280" }}>+{activePlan.topics.length - 7} more</span>
          )}
        </div>
      </div>
    </div>
  );
}
