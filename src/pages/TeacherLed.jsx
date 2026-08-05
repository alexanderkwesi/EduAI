import { useAuth } from "../context/AuthContext";
import CheckoutModal from "../components/CheckoutModal";
import { useState } from "react";

const FEATURES = [
  "Live 1-on-1 tutor sessions",
  "Cambridge & Kaplan certified tutors",
  "AI lecture-to-audio conversion",
  "Auto video generator & transcriber",
  "Priority AI tutor (Claude)",
  "Unlimited flashcard packs",
  "Exam-focused practice papers",
  "Progress analytics dashboard",
];

export default function TeacherLed() {
  const { user } = useAuth();
  const isSubscribed = !!user?.subscription;
  const [checkout, setCheckout] = useState(null);
  const [billing, setBilling] = useState("monthly");

  return (
    <div>
      {/* Hero card */}
      <div style={{ background: "linear-gradient(135deg,#fff 0%,#fefeff 100%)", borderRadius: 32, border: "1px solid #e2edf7", boxShadow: "0 20px 35px -12px rgba(0,0,0,0.08)", overflow: "hidden", marginBottom: 32 }}>
        <div style={{ background: "#1e3a8a", color: "#fff", fontSize: 12, fontWeight: 700, padding: "6px 20px", display: "inline-block", borderRadius: "0 0 14px 0", letterSpacing: 0.3 }}>
          ⭐ PREMIUM PLAN
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 32, padding: "32px 36px" }}>
          <div style={{ flex: 2, minWidth: 240 }}>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, letterSpacing: -0.5, color: "#0c1b33" }}>Teacher-Led Premium</div>
            <div style={{ fontSize: 15, color: "#4b5e7c", marginBottom: 24 }}>Cambridge & Kaplan certified. Live sessions + full AI toolkit.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 18 }}>
              {FEATURES.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#1e2a44", fontWeight: 500 }}>
                  <span style={{ width: 22, height: 22, background: "#eef3ff", borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#2563eb", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>
            <div style={{ background: "linear-gradient(95deg,#eef2ff,#fff)", borderLeft: "3px solid #3b82f6", padding: "12px 14px", borderRadius: 16 }}>
              <span style={{ fontWeight: 700, color: "#1e40af" }}>🤖 Powered by Claude AI</span>
              <span style={{ color: "#374151", fontSize: 14 }}> — context-aware tutoring aligned to your syllabus and exam board.</span>
            </div>
          </div>

          <div style={{ flex: "1.2", minWidth: 220, background: "#f8fafd", borderRadius: 28, padding: "24px 28px", border: "1px solid #eef2f8" }}>
            {/* Billing toggle */}
            <div style={{ display: "flex", background: "#e9edf2", borderRadius: 10, padding: 3, gap: 3, marginBottom: 20 }}>
              {["monthly", "annual"].map(b => (
                <button key={b} onClick={() => setBilling(b)} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "none", background: billing === b ? "#fff" : "transparent", color: billing === b ? "#0f172a" : "#6b7280", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "'Sora',sans-serif", boxShadow: billing === b ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
                  {b === "monthly" ? "Monthly" : "Annual"}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 42, fontWeight: 800, color: "#0f172a", letterSpacing: -1, lineHeight: 1 }}>
              £{billing === "annual" ? "4.79" : "5.99"}
              <span style={{ fontSize: 15, fontWeight: 500, color: "#5b6e8c" }}>/month</span>
            </div>
            {billing === "annual" && (
              <div style={{ display: "inline-block", background: "#e6f7ec", color: "#15803d", padding: "4px 12px", borderRadius: 40, fontSize: 12, fontWeight: 700, marginTop: 8 }}>
                Save 20% — £57.48/year
              </div>
            )}

            {isSubscribed ? (
              <button disabled style={{ background: "#2b3b5c", border: "none", padding: "14px 20px", borderRadius: 40, color: "#fff", fontWeight: 700, fontSize: 16, width: "100%", marginTop: 24, fontFamily: "'Sora',sans-serif", opacity: 0.8 }}>
                ✅ Active — Manage Subscription
              </button>
            ) : (
              <button onClick={() => setCheckout(true)} style={{ background: "linear-gradient(95deg,#1e293b,#0f172a)", border: "none", padding: "14px 20px", borderRadius: 40, color: "#fff", fontWeight: 700, fontSize: 16, width: "100%", marginTop: 24, cursor: "pointer", fontFamily: "'Sora',sans-serif", boxShadow: "0 8px 18px -6px rgba(0,0,0,0.15)" }}>
                ⚡ Upgrade to Teacher-Led →
              </button>
            )}
            <div style={{ fontSize: 11, color: "#8ba0bc", textAlign: "center", marginTop: 14 }}>
              Direct Debit via GoCardless · Cancel anytime
            </div>
          </div>
        </div>
      </div>

      {checkout && (
        <CheckoutModal
          planId="teacher"
          billingCycle={billing}
          onClose={() => setCheckout(null)}
          onSuccess={() => setCheckout(null)}
        />
      )}
    </div>
  );
}
