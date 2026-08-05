import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const { login, register, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      if (tab === "login") {
        await login(form.email, form.password);
      } else {
        if (!form.first_name || !form.last_name) { setError("Please enter your full name."); setLoading(false); return; }
        await register(form.first_name, form.last_name, form.email, form.password);
      }
      navigate("/app");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const demo = async () => {
    setLoading(true);
    try { await demoLogin(); navigate("/app"); } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#f8f9ff,#f0f4ff)", fontFamily: "'Sora',sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%,rgba(99,102,241,0.08),transparent)", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 420, padding: "0 24px", position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 18 }}>E</div>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: "#111827" }}>EduAI</span>
          </div>
          <div style={{ color: "#9ca3af", fontSize: 14 }}>Cambridge &amp; Kaplan Learning Platform</div>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: "32px 28px", boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 10, padding: 3, gap: 4, marginBottom: 24 }}>
            {["login", "register"].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(""); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: tab === t ? "#6366f1" : "transparent", color: tab === t ? "#fff" : "#9ca3af", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
                {t === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          {error && <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#ef4444", marginBottom: 14 }}>{error}</div>}

          {tab === "register" && (
            <div style={{ display: "grid", gridTemplateColumns: "2fr", gap: 10 }}>
              {[["first_name", "First name"], ["last_name", "Last name"]].map(([k, lbl]) => (
                <Field key={k} label={lbl} value={form[k]} onChange={set(k)} />
              ))}
            </div>
          )}
          <Field label="Email address" type="email" value={form.email} onChange={set("email")} />
          <Field label="Password" type="password" value={form.password} onChange={set("password")} onEnter={submit} />

          <button onClick={submit} disabled={loading} style={{ width: "100%", marginTop: 22, padding: "12px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.3)", opacity: loading ? 0.6 : 1, fontFamily: "'Sora',sans-serif" }}>
            {loading ? "Please wait…" : tab === "login" ? "Sign in →" : "Create account →"}
          </button>

          <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "#9ca3af" }}>
            By continuing, you agree to our <a href="#" style={{ color: "#6366f1" }}>Terms</a> and <a href="#" style={{ color: "#6366f1" }}>Privacy Policy</a>.
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#9ca3af" }}>
          Want to explore first?{" "}
          <span onClick={demo} style={{ color: "#6366f1", cursor: "pointer", textDecoration: "underline" }}>
            {loading ? "Loading…" : "Login with demo credentials to try it out!"}
          </span>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; }`}</style>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, onEnter }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
      <label style={{ color: "#4b5563", fontSize: 13, fontWeight: 500 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onEnter ? (e) => e.key === "Enter" && onEnter() : undefined}
        style={{ padding: "11px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, color: "#111827", fontSize: 14, outline: "none", fontFamily: "'Sora',sans-serif" }}
      />
    </div>
  );
}
