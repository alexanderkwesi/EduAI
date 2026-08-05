export default function LearningPlan({ plans, onDeletePlan, onNavigate }) {
  const activePlan = plans?.[0] || null;

  if (!activePlan) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>No Learning Plan Yet</h2>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>Use "Find Subject" to generate your personalised roadmap.</p>
        <button onClick={() => onNavigate("subjects")} style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
          Find a Subject →
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Your Learning Roadmap</h2>
          <p style={{ color: "#6b7280", fontSize: 14 }}>{activePlan.subject} · {activePlan.level} · {activePlan.syllabus}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onNavigate("subjects")} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
            Change subject
          </button>
          <button onClick={() => onDeletePlan(activePlan.id)} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
            Remove plan
          </button>
        </div>
      </div>

      {/* Roadmap */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {activePlan.roadmap.map((week, i) => (
          <div key={week.week} style={{ background: "#fff", border: `1px solid ${week.status === "current" ? "rgba(99,102,241,0.4)" : "#e5e7eb"}`, borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: week.status === "current" ? "linear-gradient(135deg,#6366f1,#a855f7)" : week.status === "done" ? "#10b981" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: week.status === "upcoming" ? "#9ca3af" : "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
              W{week.week}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{week.topic}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>~{week.hrs} hours estimated</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: week.status === "current" ? "rgba(99,102,241,0.1)" : week.status === "done" ? "rgba(16,185,129,0.1)" : "#f3f4f6", color: week.status === "current" ? "#6366f1" : week.status === "done" ? "#059669" : "#9ca3af" }}>
                {week.status === "current" ? "📍 Current" : week.status === "done" ? "✓ Done" : "Upcoming"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, background: "linear-gradient(95deg,#eef2ff,#fff)", borderLeft: "3px solid #3b82f6", padding: "14px 18px", borderRadius: 16 }}>
        <span style={{ fontWeight: 700, color: "#1e40af" }}>💡 AI Tip:</span>
        <span style={{ color: "#374151", fontSize: 14 }}> Upgrade to Teacher-Led for AI video summaries, live tutoring, and exam prep sessions for each topic.</span>
      </div>
    </div>
  );
}
