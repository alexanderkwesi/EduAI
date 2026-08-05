import { useAuth } from "../context/AuthContext";

const NAV = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "subjects",  icon: "📚", label: "Subjects" },
  { id: "plan",      icon: "🗺️", label: "Learning Plan", requiresPlan: true },
  { id: "teacher",   icon: "👩‍🏫", label: "Teacher-Led", premium: true },
  { id: "video",     icon: "🎬", label: "Video Learning" },
  { id: "ai",        icon: "🤖", label: "AI Tutor" },
  { id: "study",     icon: "⚡", label: "Study Mode", requiresPlan: true },
  { id: "settings",  icon: "⚙️", label: "Settings" },
];

export default function Sidebar({ activePage, onNavigate, hasActivePlan }) {
  const { user, logout } = useAuth();
  const initials = user ? (user.first_name[0] + user.last_name[0]).toUpperCase() : "??";

  return (
    <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 216, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", zIndex: 100, boxShadow: "2px 0 12px rgba(0,0,0,0.04)" }}>
      {/* Logo */}
      <div style={{ padding: "20px 18px 18px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 15 }}>E</div>
        <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3, color: "#111827" }}>EduAI</span>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 3, overflowY: "auto" }}>
        {NAV.map(item => {
          const disabled = (item.requiresPlan && !hasActivePlan);
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => !disabled && onNavigate(item.id)}
              title={disabled ? "Create a learning plan first" : ""}
              style={{
                display: "flex", alignItems: "center", gap: 9, padding: "9px 10px",
                borderRadius: 8, border: "none",
                background: active ? "rgba(99,102,241,0.1)" : "transparent",
                color: active ? "#6366f1" : disabled ? "#d1d5db" : "#6b7280",
                fontSize: 13, fontWeight: active ? 600 : 500,
                width: "100%", textAlign: "left",
                cursor: disabled ? "not-allowed" : "pointer",
                fontFamily: "'Sora',sans-serif",
                opacity: disabled ? 0.45 : 1,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {item.label}
              {item.premium && (
                <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, background: "rgba(99,102,241,0.1)", color: "#6366f1", padding: "2px 6px", borderRadius: 4 }}>PRO</span>
              )}
              {active && !item.premium && (
                <span style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: "#6366f1" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* User */}
      <div style={{ padding: "14px 10px", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{initials}</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 130 }}>{user?.first_name} {user?.last_name}</div>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>{user?.subscription ? "Teacher-Led" : "Free plan"}</div>
          </div>
        </div>
        <button onClick={logout} style={{ width: "100%", padding: "7px 0", borderRadius: 7, border: "1px solid #e5e7eb", background: "transparent", color: "#9ca3af", fontSize: 11, cursor: "pointer", fontFamily: "'Sora',sans-serif", transition: "all 0.15s" }}>
          Sign out
        </button>
      </div>
    </div>
  );
}
