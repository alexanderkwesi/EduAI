import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Subjects({ onPlanCreated, onNavigate }) {
  const { apiFetch } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    apiFetch("/subjects").then(setSubjects).catch(console.error);
  }, [apiFetch]);

  const filtered = subjects.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || s.syllabus.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const createPlan = async () => {
    if (!selected || !selectedLevel) return;
    setCreating(true);
    try {
      const plan = await apiFetch("/plans", {
        method: "POST",
        body: JSON.stringify({ syllabus: selected.syllabus.toLowerCase(), subject: selected.name, level: selectedLevel }),
      });
      onPlanCreated(plan);
      showToast(`✅ Plan created: ${selected.name} ${selectedLevel} (${selected.syllabus}) — ${plan.topics.length} topics ready!`);
      setSelected(null);
      onNavigate("plan");
    } catch (e) {
      showToast(`❌ ${e.message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Find Your Subject</h2>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Browse Cambridge &amp; Kaplan syllabi to generate your personalised learning plan.</p>
      </div>

      {/* Search & filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 14 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subjects…" style={{ width: "100%", padding: "11px 14px 11px 38px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 11, color: "#111827", fontSize: 13, outline: "none", fontFamily: "'Sora',sans-serif" }} />
        </div>
        {["all", "cambridge", "kaplan"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "11px 18px", borderRadius: 11, border: "1px solid #e5e7eb", background: filter === f ? "#6366f1" : "#fff", color: filter === f ? "#fff" : "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", fontFamily: "'Sora',sans-serif" }}>
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 340px" : "1fr", gap: 18 }}>
        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 12, alignContent: "start" }}>
          {filtered.map(s => (
            <button key={s.name} onClick={() => { setSelected(s); setSelectedLevel(s.levels[0]); }}
              style={{ padding: 18, cursor: "pointer", textAlign: "left", border: `1px solid ${selected?.name === s.name ? "rgba(99,102,241,0.4)" : "#e5e7eb"}`, borderRadius: 14, background: selected?.name === s.name ? "rgba(99,102,241,0.05)" : "#fff", width: "100%", fontFamily: "'Sora',sans-serif", transition: "all 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 600, background: s.syllabus === "Cambridge" ? "rgba(99,102,241,0.1)" : "rgba(168,85,247,0.1)", color: s.syllabus === "Cambridge" ? "#6366f1" : "#a855f7" }}>{s.syllabus}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.levels.join(" · ")}</div>
            </button>
          ))}
          {filtered.length === 0 && <div style={{ color: "#9ca3af", fontSize: 14, padding: 20 }}>No subjects found.</div>}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, position: "sticky", top: 24, alignSelf: "start" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{selected.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>{selected.syllabus} syllabus</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 18 }}>×</button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#374151", marginBottom: 8 }}>Choose level</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {selected.levels.map(l => (
                  <button key={l} onClick={() => setSelectedLevel(l)} style={{ padding: "7px 16px", borderRadius: 8, border: `1.5px solid ${selectedLevel === l ? "#6366f1" : "#e5e7eb"}`, background: selectedLevel === l ? "rgba(99,102,241,0.08)" : "transparent", color: selectedLevel === l ? "#6366f1" : "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>{l}</button>
                ))}
              </div>
            </div>

            <button onClick={createPlan} disabled={creating} style={{ width: "100%", padding: "12px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: creating ? 0.6 : 1, fontFamily: "'Sora',sans-serif" }}>
              {creating ? "Creating plan…" : "🚀 Generate Learning Plan"}
            </button>
            <div style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 10 }}>Creates a personalised week-by-week roadmap</div>
          </div>
        )}
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#111827", color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, zIndex: 1000, animation: "fadeUp 0.3s ease" }}>
          {toast}
        </div>
      )}
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
    </div>
  );
}
