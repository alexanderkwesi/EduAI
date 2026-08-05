import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutModal from "../components/CheckoutModal";

const PLANS = [
  {
    id: "teacher",
    icon: "👩‍🏫",
    name: "Teacher-Led",
    tagline: "Live expert sessions",
    features: ["1-on-1 live tutoring", "Cambridge & Kaplan tutors", "AI lecture-to-audio", "Video generator"],
    badge: "Most popular",
    badgeColor: "#5046e5",
  },
  {
    id: "video",
    icon: "🎬",
    name: "Video Learning",
    tagline: "Auto-generated video lessons",
    features: ["AI video lessons", "Cambridge syllabus", "Kaplan prep videos", "Flashcard packs"],
    badge: null,
    badgeColor: null,
  },
  {
    id: "ai",
    icon: "🤖",
    name: "AI-Powered",
    tagline: "Powered by Claude AI",
    features: ["Unlimited AI chat", "24/7 AI tutor", "Adaptive quizzes", "Progress analytics"],
    badge: null,
    badgeColor: null,
  },
];

const HOW_STEPS = [
  { num: "01", icon: "🔍", title: "Choose your subject", desc: "Browse Cambridge & Kaplan syllabi — from IGCSEs to professional exams." },
  { num: "02", icon: "🗺️", title: "Get a personalised roadmap", desc: "AI generates a week-by-week study plan tailored to your goals and exam date." },
  { num: "03", icon: "🚀", title: "Learn with AI + tutors", desc: "Combine live sessions, AI chat, auto-generated videos, and smart flashcards." },
];

const TESTIMONIALS = [
  { quote: "Went from a C to an A in A-Level Physics in just 6 weeks. The AI study plan was a game-changer.", name: "Maya T.", role: "A-Level student", initials: "MT", color: "#5046e5" },
  { quote: "As a working professional, having Kaplan GMAT prep with 24/7 AI access was exactly what I needed.", name: "James O.", role: "MBA candidate", initials: "JO", color: "#9333ea" },
  { quote: "The Cambridge IGCSE Maths videos are incredibly clear. My daughter improved massively.", name: "Sarah K.", role: "Parent", initials: "SK", color: "#2563eb" },
];

export default function Landing() {
  const navigate = useNavigate();
  const [checkout, setCheckout] = useState(null);
  const [billing, setBilling] = useState("monthly");

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fafafa", color: "#0d0f14", overflowX: "hidden" }}>
      {/* Partner strip */}
      <div style={{ background: "#ede9fe", borderBottom: "1px solid rgba(80,70,229,0.15)", padding: "10px 5%", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#5046e5" }}>In partnership with</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#5046e5" }}>🎓 AI Scholars Society</span>
        <span style={{ color: "#5046e5" }}>·</span>
        <a href="https://www.aischolarsociety.org" target="_blank" rel="noreferrer" style={{ fontSize: 13, fontWeight: 700, color: "#5046e5", textDecoration: "underline" }}>Learn more →</a>
      </div>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid #e8eaed", padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "linear-gradient(135deg,#5046e5,#9333ea)", borderRadius: 8, padding: "5px 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14 }}>🎓</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>AIScholars</span>
          </div>
          <div style={{ width: 1, height: 28, background: "#e8eaed" }} />
          <span style={{ fontSize: 15, fontWeight: 700 }}>Edu<span style={{ color: "#5046e5" }}>AI</span></span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["How it works", "Pricing", "Features", "Reviews"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} style={{ fontSize: 14, fontWeight: 500, color: "#6b7280", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/login")} style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid #e8eaed", background: "transparent", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Sign in</button>
          <button onClick={() => navigate("/app")} style={{ padding: "10px 22px", borderRadius: 8, border: "none", background: "#5046e5", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Get started →</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "100px 5% 80px", position: "relative", background: "#fff" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(80,70,229,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(80,70,229,0.04) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: 900, height: 600, background: "radial-gradient(ellipse,rgba(80,70,229,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 820 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "#ede9fe", border: "1px solid rgba(80,70,229,0.2)", fontSize: 12, fontWeight: 600, color: "#5046e5", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5046e5", animation: "blink 1.5s infinite" }} />
            Official Partner of AI Scholars Society
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(44px,7vw,80px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, marginBottom: 22 }}>
            Learn Smarter with{" "}
            <em style={{ fontStyle: "normal", color: "#5046e5", position: "relative" }}>AI-Powered</em>{" "}
            Tutoring
          </h1>
          <p style={{ fontSize: 18, color: "#6b7280", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 36px" }}>
            Cambridge &amp; Kaplan certified learning paths. Live tutors, AI chat, and auto-generated video lessons — all from £5.99/month.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 48, flexWrap: "wrap" }}>
            <button onClick={() => setCheckout({ planId: "video", billing: "monthly" })} style={{ padding: "15px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#5046e5,#9333ea)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 24px rgba(80,70,229,0.35)" }}>
              Start learning today →
            </button>
            <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "14px 32px", borderRadius: 12, border: "2px solid #e8eaed", background: "transparent", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              See how it works
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            {[["🏛️", "Cambridge Certified"], ["📋", "Kaplan Approved"], ["🤖", "Powered by Claude AI"], ["🔒", "Cancel anytime"]].map(([icon, txt]) => (
              <div key={txt} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
                <span>{icon}</span>{txt}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: "96px 5%", background: "#fff" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5046e5", marginBottom: 14 }}>HOW IT WORKS</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: -1.5, marginBottom: 16 }}>From zero to exam-ready in weeks</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 32, maxWidth: 1080, margin: "0 auto" }}>
          {HOW_STEPS.map(s => (
            <div key={s.num} style={{ padding: "32px 28px", background: "#fafafa", border: "1px solid #e8eaed", borderRadius: 18, position: "relative" }}>
              <span style={{ position: "absolute", top: 28, right: 28, fontFamily: "'Playfair Display',serif", fontSize: 64, fontWeight: 900, color: "rgba(80,70,229,0.06)", lineHeight: 1 }}>{s.num}</span>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "96px 5%", background: "#fafafa" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5046e5", marginBottom: 14 }}>PRICING</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: -1.5, marginBottom: 24 }}>One affordable price, three learning modes</h2>
          {/* Toggle */}
          <div style={{ display: "inline-flex", background: "#f3f4f6", borderRadius: 10, padding: 3, gap: 4 }}>
            {["monthly", "annual"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: billing === b ? "#5046e5" : "transparent", color: billing === b ? "#fff" : "#6b7280", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                {b === "monthly" ? "Monthly" : "Annual (save 20%)"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 22, maxWidth: 1000, margin: "0 auto" }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{ background: "#fff", border: `2px solid ${plan.badge ? "#5046e5" : "#e8eaed"}`, borderRadius: 22, padding: "30px 26px", display: "flex", flexDirection: "column", position: "relative", boxShadow: plan.badge ? "0 8px 40px rgba(80,70,229,0.12)" : "none" }}>
              {plan.badge && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#5046e5", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 100 }}>{plan.badge}</div>
              )}
              <div style={{ fontSize: 32, marginBottom: 10 }}>{plan.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>{plan.tagline}</div>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 900, letterSpacing: -1 }}>
                  £{billing === "annual" ? "4.79" : "5.99"}
                </span>
                <span style={{ fontSize: 14, color: "#6b7280" }}>/month</span>
                {billing === "annual" && <div style={{ fontSize: 12, color: "#059669", fontWeight: 600, marginTop: 4 }}>Billed £57.48/year</div>}
              </div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 28, flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#374151", marginBottom: 10 }}>
                    <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => setCheckout({ planId: plan.id, billing })} style={{ padding: "14px", borderRadius: 12, border: "none", background: plan.badge ? "linear-gradient(135deg,#5046e5,#9333ea)" : "#0d0f14", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Get started →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" style={{ padding: "96px 5%", background: "#fff" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5046e5", marginBottom: 14 }}>REVIEWS</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: -1.5 }}>Loved by students worldwide</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 22, maxWidth: 1000, margin: "0 auto" }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{ background: "#fafafa", border: "1px solid #e8eaed", borderRadius: 18, padding: 28 }}>
              <div style={{ color: "#f59e0b", fontSize: 14, letterSpacing: 2, marginBottom: 14 }}>★★★★★</div>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "#374151", marginBottom: 18 }}>{t.quote}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{t.initials}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats band */}
      <section style={{ background: "#0d0f14", padding: "72px 5%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 32, textAlign: "center", maxWidth: 1000, margin: "0 auto" }}>
          {[["12,000+", "Students taught"], ["94%", "Pass rate improvement"], ["Cambridge & Kaplan", "Certified content"], ["£5.99/mo", "Starting from"]].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 900, letterSpacing: -2, color: "#fff", marginBottom: 8 }}>{num}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg,#5046e5,#9333ea)", padding: "96px 5%", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 900, letterSpacing: -1.5, color: "#fff", marginBottom: 16 }}>Ready to ace your exams?</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 36px" }}>Join thousands of students reaching their academic potential with EduAI.</p>
          <button onClick={() => navigate("/app")} style={{ padding: "15px 36px", borderRadius: 12, border: "none", background: "#fff", color: "#5046e5", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
            Start for free today
          </button>
          <div style={{ marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.55)" }}>No credit card required · Cancel anytime</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0d0f14", padding: "56px 5% 32px", color: "rgba(255,255,255,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 40 }}>
          <div style={{ maxWidth: 260 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Edu<span style={{ color: "#5046e5" }}>AI</span></div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.4)" }}>AI-powered learning for Cambridge & Kaplan students. Built by AI Scholars Society.</p>
          </div>
          {[["Product", ["Features", "Pricing", "How it works"]], ["Company", ["About", "Blog", "Careers"]], ["Legal", ["Privacy", "Terms", "Cookies"]]].map(([title, links]) => (
            <div key={title}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>{title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map(l => <a key={l} href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 12 }}>© 2025 EduAI · AI Scholars Society. All rights reserved.</span>
          <span style={{ fontSize: 12 }}>Payments via GoCardless · Direct Debit</span>
        </div>
      </footer>

      {checkout && (
        <CheckoutModal
          planId={checkout.planId}
          billingCycle={checkout.billing}
          onClose={() => setCheckout(null)}
          onSuccess={() => { setCheckout(null); window.location.href = "/app"; }}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        * { box-sizing: border-box; }
        a { text-decoration: none; color: inherit; }
      `}</style>
    </div>
  );
}
