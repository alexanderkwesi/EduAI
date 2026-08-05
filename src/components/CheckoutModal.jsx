import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const PLAN_NAMES = {
  teacher: "👩‍🏫 Teacher-Led",
  video:   "🎬 Video Learning",
  ai:      "🤖 AI-Powered",
};

export default function CheckoutModal({ planId, billingCycle = "monthly", onClose, onSuccess }) {
  const { apiFetch, setUser } = useAuth();
  const [step, setStep] = useState("details"); // details | processing | success
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "" });
  const [error, setError] = useState("");

  const price = billingCycle === "annual" ? "£4.79/month (billed annually)" : "£5.99/month";
  const planName = PLAN_NAMES[planId] || planId;

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.first_name || !form.last_name) { setError("Please enter your full name."); return; }
    if (!form.email.includes("@")) { setError("Please enter a valid email address."); return; }
    setError("");
    setStep("processing");

    try {
      // Call backend to create GoCardless billing request
      await apiFetch("/gocardless/create-billing-request", {
        method: "POST",
        body: JSON.stringify({ plan_id: planId, billing: billingCycle, ...form }),
      });

      // PRODUCTION: Use GoCardlessDropin.create({ billingRequestFlowID, ... })
      // For demo: simulate success after 1.8s
      await new Promise(r => setTimeout(r, 1800));

      // Activate subscription on backend
      const data = await apiFetch("/subscription/activate", { method: "POST" });
      setUser(u => ({ ...u, subscription: data.subscription }));
      setStep("success");
      setTimeout(onSuccess, 2500);
    } catch (e) {
      setError(e.message || "Payment setup failed. Please try again.");
      setStep("details");
    }
  };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "'Sora',sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 22, width: "100%", maxWidth: 500, boxShadow: "0 32px 100px rgba(0,0,0,0.2)", overflow: "hidden", animation: "gcSlideUp 0.3s ease" }}>
        {/* Header */}
        <div style={{ padding: "24px 26px 20px", background: "linear-gradient(135deg,#5046e5,#9333ea)", color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>E</div>
              EduAI
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 3 }}>{planName}</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>{price} · Direct Debit via GoCardless</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 26 }}>
          {/* Step indicator */}
          {step !== "success" && (
            <>
              <StepBar step={step} />
            </>
          )}

          {step === "details" && (
            <>
              {error && <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#ef4444", marginBottom: 14 }}>{error}</div>}
              <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 13, letterSpacing: "0.04em", textTransform: "uppercase" }}>Your details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <GCField label="First name" value={form.first_name} onChange={set("first_name")} />
                <GCField label="Last name" value={form.last_name} onChange={set("last_name")} />
              </div>
              <GCField label="Email address" type="email" value={form.email} onChange={set("email")} />
              <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", margin: "16px 0" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 18 }}>
                {[["🔒", "Secure"], ["🏦", "FCA Regulated"], ["↩", "Cancel anytime"]].map(([icon, txt]) => (
                  <div key={txt} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#9ca3af", fontWeight: 500 }}><span>{icon}</span>{txt}</div>
                ))}
              </div>
              <button onClick={submit} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#5046e5,#9333ea)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(80,70,229,0.3)", fontFamily: "'Sora',sans-serif" }}>
                🔒 Set up Direct Debit — {billingCycle === "annual" ? "£4.79/mo" : "£5.99/mo"}
              </button>
              <div style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 11, lineHeight: 1.6 }}>
                By continuing, you authorise a recurring Direct Debit. Powered by <a href="https://gocardless.com" style={{ color: "#5046e5" }}>GoCardless</a>.
              </div>
            </>
          )}

          {step === "processing" && (
            <div style={{ textAlign: "center", padding: "28px 16px" }}>
              <div style={{ width: 50, height: 50, border: "3px solid #e5e7eb", borderTopColor: "#5046e5", borderRadius: "50%", animation: "spin 0.9s linear infinite", margin: "0 auto 18px" }} />
              <div style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 7, fontFamily: "'Playfair Display',serif" }}>Connecting to GoCardless…</div>
              <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7 }}>You'll be asked to authorise your Direct Debit.<br />Please don't close this window.</div>
            </div>
          )}

          {step === "success" && (
            <div style={{ textAlign: "center", padding: "28px 16px" }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>🎉</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 7 }}>You're all set!</div>
              <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7 }}>Your Direct Debit is authorised. Welcome to EduAI!<br />Check your email for your account details.</div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes gcSlideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

function StepBar({ step }) {
  const steps = ["details", "processing", "confirm"];
  const labels = ["Your details", "Direct Debit", "Confirmed"];
  const idx = steps.indexOf(step);
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {steps.map((s, i) => (
          <span key={s} style={{ display: "contents" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, background: i < idx ? "#10b981" : i === idx ? "#5046e5" : "#e5e7eb", color: i <= idx ? "#fff" : "#9ca3af" }}>
              {i < idx ? "✓" : i + 1}
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < idx ? "#10b981" : "#e5e7eb" }} />}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        {labels.map((l, i) => <span key={l} style={{ fontSize: 10, color: i === idx ? "#5046e5" : "#9ca3af", fontWeight: 600 }}>{l}</span>)}
      </div>
    </div>
  );
}

function GCField({ label, type = "text", value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>{label}</label>
      <input type={type} value={value} onChange={onChange} style={{ padding: "10px 13px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 14, color: "#111827", fontFamily: "'Sora',sans-serif", outline: "none", background: "#fafafa" }} />
    </div>
  );
}
