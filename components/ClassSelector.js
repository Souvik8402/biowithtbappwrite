// components/ClassSelector.js
// Class picker — rich multi-gradient dark UI.
// REMOVED: "Class 9 / 10 / 11 / 12" white text labels (looked cluttered).
// KEPT: all onSelect logic completely unchanged.

"use client";

export default function ClassSelector({ onSelect }) {
  // Each class gets its own unique gradient palette so the grid looks vivid
  const classes = [
    {
      id:   "9",
      num:  "09",
      sub:  "Foundation Biology",
      // cyan → blue
      grad:       "linear-gradient(135deg, #0a1628 0%, #0d1f3a 50%, #0a1628 100%)",
      glowTop:    "radial-gradient(ellipse at top right, #00d4ff18 0%, transparent 65%)",
      glowBottom: "radial-gradient(ellipse at bottom left, #0099bb12 0%, transparent 65%)",
      numColor:   "linear-gradient(135deg, #00d4ff, #0099ff)",
      borderHover:"#00d4ff44",
      shadowHover:"0 0 40px #00d4ff14, 0 12px 40px #00000077, inset 0 1px 0 #00d4ff11",
      accentLine: "linear-gradient(90deg, #00d4ff, #0099ff55, transparent)",
      tagColor:   "#00d4ff33",
      tagText:    "#00d4ff88",
    },
    {
      id:   "10",
      num:  "10",
      sub:  "Secondary Biology",
      // violet → pink
      grad:       "linear-gradient(135deg, #120a28 0%, #1a0d38 50%, #120a28 100%)",
      glowTop:    "radial-gradient(ellipse at top right, #7c3aed18 0%, transparent 65%)",
      glowBottom: "radial-gradient(ellipse at bottom left, #ec489912 0%, transparent 65%)",
      numColor:   "linear-gradient(135deg, #a78bfa, #7c3aed)",
      borderHover:"#7c3aed44",
      shadowHover:"0 0 40px #7c3aed14, 0 12px 40px #00000077, inset 0 1px 0 #7c3aed11",
      accentLine: "linear-gradient(90deg, #7c3aed, #a78bfa55, transparent)",
      tagColor:   "#7c3aed33",
      tagText:    "#a78bfa88",
    },
    {
      id:   "11",
      num:  "11",
      sub:  "Senior Biology",
      // emerald → cyan
      grad:       "linear-gradient(135deg, #081a14 0%, #0a2018 50%, #081a14 100%)",
      glowTop:    "radial-gradient(ellipse at top right, #10b98118 0%, transparent 65%)",
      glowBottom: "radial-gradient(ellipse at bottom left, #00d4ff12 0%, transparent 65%)",
      numColor:   "linear-gradient(135deg, #10b981, #34d399)",
      borderHover:"#10b98144",
      shadowHover:"0 0 40px #10b98114, 0 12px 40px #00000077, inset 0 1px 0 #10b98111",
      accentLine: "linear-gradient(90deg, #10b981, #34d39955, transparent)",
      tagColor:   "#10b98133",
      tagText:    "#34d39988",
    },
    {
      id:   "12",
      num:  "12",
      sub:  "Advanced Biology",
      // amber → orange
      grad:       "linear-gradient(135deg, #180e04 0%, #201206 50%, #180e04 100%)",
      glowTop:    "radial-gradient(ellipse at top right, #f59e0b18 0%, transparent 65%)",
      glowBottom: "radial-gradient(ellipse at bottom left, #ef444412 0%, transparent 65%)",
      numColor:   "linear-gradient(135deg, #f59e0b, #fbbf24)",
      borderHover:"#f59e0b44",
      shadowHover:"0 0 40px #f59e0b14, 0 12px 40px #00000077, inset 0 1px 0 #f59e0b11",
      accentLine: "linear-gradient(90deg, #f59e0b, #fbbf2455, transparent)",
      tagColor:   "#f59e0b33",
      tagText:    "#fbbf2488",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 relative z-10 animate-float">

      {/* ── Section header ─────────────────────────────────────────── */}
      <div className="mb-10">
        <p
          className="text-xs uppercase mb-2"
          style={{ color: "#00d4ff44", letterSpacing: "0.3em" }}
        >
          Step 01
        </p>
        <h2
          className="text-3xl font-bold mb-2"
          style={{
            background: "linear-gradient(135deg, #e2e8f0 30%, #94a3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Select Your Class
        </h2>
        <p className="text-sm" style={{ color: "#334a66" }}>
          Choose your class to browse chapters and lectures
        </p>
      </div>

      {/* ── 2×2 grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-5">
        {classes.map((cls) => (
          <button
            key={cls.id}
            onClick={() => onSelect(cls.id)}   // ← logic unchanged
            className="text-left rounded-2xl p-7 transition-all relative overflow-hidden"
            style={{
              background: cls.grad,
              border: "1px solid #162035",
              minHeight: "160px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = cls.borderHover;
              e.currentTarget.style.boxShadow   = cls.shadowHover;
              e.currentTarget.style.transform   = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#162035";
              e.currentTarget.style.boxShadow   = "none";
              e.currentTarget.style.transform   = "translateY(0)";
            }}
          >
            {/* ── Top-right radial glow ───────────────────────────── */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: cls.glowTop }}
            />
            {/* ── Bottom-left radial glow ─────────────────────────── */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: cls.glowBottom }}
            />

            {/* ── Corner grid dots decoration ─────────────────────── */}
            <div
              className="absolute top-3 right-3 pointer-events-none opacity-20"
              style={{
                width: 40, height: 40,
                backgroundImage: "radial-gradient(circle, #ffffff44 1px, transparent 1px)",
                backgroundSize: "8px 8px",
              }}
            />

            {/* ── Big class number ────────────────────────────────── */}
            <div
              className="text-5xl font-black mb-4 tabular-nums leading-none relative z-10"
              style={{
                background: cls.numColor,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 12px currentColor)",
              }}
            >
              {cls.num}
            </div>

            {/* ── Subject tag pill ─────────────────────────────────── */}
            <div
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium relative z-10"
              style={{
                background: cls.tagColor,
                color: cls.tagText,
                border: `1px solid ${cls.tagColor}`,
                letterSpacing: "0.04em",
              }}
            >
              {cls.sub}
            </div>

            {/* ── Bottom accent bar ────────────────────────────────── */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: cls.accentLine }}
            />

            {/* ── Right edge glow bar ──────────────────────────────── */}
            <div
              className="absolute top-4 bottom-4 right-0 w-px pointer-events-none opacity-40"
              style={{
                background: `linear-gradient(180deg, transparent, ${cls.borderHover}, transparent)`,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
