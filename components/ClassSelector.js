// components/ClassSelector.js
// Class picker — toned-down numbers (solid colour, no glow filter), cards keep gradients.
// Logic completely unchanged.

"use client";

export default function ClassSelector({ onSelect }) {
  const classes = [
    {
      id:   "9",
      num:  "09",
      sub:  "Foundation Biology",
      grad:        "linear-gradient(135deg, #0a1628 0%, #0d1f3a 50%, #0a1628 100%)",
      glowTop:     "radial-gradient(ellipse at top right, #00d4ff14 0%, transparent 65%)",
      glowBottom:  "radial-gradient(ellipse at bottom left, #0099bb0e 0%, transparent 65%)",
      numColor:    "#00d4ff",          // solid — easy to read
      borderHover: "#00d4ff44",
      shadowHover: "0 0 30px #00d4ff0d, 0 10px 30px #00000066, inset 0 1px 0 #00d4ff0a",
      accentLine:  "linear-gradient(90deg, #00d4ff88, #00d4ff22, transparent)",
      tagBg:       "#00d4ff18",
      tagBorder:   "#00d4ff30",
      tagText:     "#00d4ffaa",
    },
    {
      id:   "10",
      num:  "10",
      sub:  "Secondary Biology",
      grad:        "linear-gradient(135deg, #120a28 0%, #1a0d38 50%, #120a28 100%)",
      glowTop:     "radial-gradient(ellipse at top right, #7c3aed14 0%, transparent 65%)",
      glowBottom:  "radial-gradient(ellipse at bottom left, #ec48990e 0%, transparent 65%)",
      numColor:    "#a78bfa",          // solid lavender — easy to read
      borderHover: "#7c3aed44",
      shadowHover: "0 0 30px #7c3aed0d, 0 10px 30px #00000066, inset 0 1px 0 #7c3aed0a",
      accentLine:  "linear-gradient(90deg, #7c3aed88, #7c3aed22, transparent)",
      tagBg:       "#7c3aed18",
      tagBorder:   "#7c3aed30",
      tagText:     "#a78bfaaa",
    },
    {
      id:   "11",
      num:  "11",
      sub:  "Senior Biology",
      grad:        "linear-gradient(135deg, #081a14 0%, #0a2018 50%, #081a14 100%)",
      glowTop:     "radial-gradient(ellipse at top right, #10b98114 0%, transparent 65%)",
      glowBottom:  "radial-gradient(ellipse at bottom left, #00d4ff0e 0%, transparent 65%)",
      numColor:    "#34d399",          // solid emerald — easy to read
      borderHover: "#10b98144",
      shadowHover: "0 0 30px #10b9810d, 0 10px 30px #00000066, inset 0 1px 0 #10b9810a",
      accentLine:  "linear-gradient(90deg, #10b98188, #10b98122, transparent)",
      tagBg:       "#10b98118",
      tagBorder:   "#10b98130",
      tagText:     "#34d399aa",
    },
    {
      id:   "12",
      num:  "12",
      sub:  "Advanced Biology",
      grad:        "linear-gradient(135deg, #180e04 0%, #201206 50%, #180e04 100%)",
      glowTop:     "radial-gradient(ellipse at top right, #f59e0b14 0%, transparent 65%)",
      glowBottom:  "radial-gradient(ellipse at bottom left, #ef44440e 0%, transparent 65%)",
      numColor:    "#fbbf24",          // solid amber — easy to read
      borderHover: "#f59e0b44",
      shadowHover: "0 0 30px #f59e0b0d, 0 10px 30px #00000066, inset 0 1px 0 #f59e0b0a",
      accentLine:  "linear-gradient(90deg, #f59e0b88, #f59e0b22, transparent)",
      tagBg:       "#f59e0b18",
      tagBorder:   "#f59e0b30",
      tagText:     "#fbbf24aa",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 relative z-10 animate-float">

      {/* Section header */}
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

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 gap-5">
        {classes.map((cls) => (
          <button
            key={cls.id}
            onClick={() => onSelect(cls.id)}
            className="text-left rounded-2xl p-7 transition-all relative overflow-hidden"
            style={{
              background: cls.grad,
              border: "1px solid #162035",
              minHeight: "155px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = cls.borderHover;
              e.currentTarget.style.boxShadow   = cls.shadowHover;
              e.currentTarget.style.transform   = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#162035";
              e.currentTarget.style.boxShadow   = "none";
              e.currentTarget.style.transform   = "translateY(0)";
            }}
          >
            {/* Radial glows — decorative background only */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: cls.glowTop }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: cls.glowBottom }} />

            {/* Subtle dot-grid corner */}
            <div
              className="absolute top-3 right-3 pointer-events-none opacity-10"
              style={{
                width: 36, height: 36,
                backgroundImage: "radial-gradient(circle, #ffffff55 1px, transparent 1px)",
                backgroundSize: "7px 7px",
              }}
            />

            {/* Class number — solid colour, no filter, clearly readable */}
            <div
              className="text-5xl font-black mb-4 tabular-nums leading-none relative z-10"
              style={{ color: cls.numColor }}
            >
              {cls.num}
            </div>

            {/* Subject tag pill */}
            <div
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium relative z-10"
              style={{
                background: cls.tagBg,
                color:      cls.tagText,
                border:     `1px solid ${cls.tagBorder}`,
                letterSpacing: "0.03em",
              }}
            >
              {cls.sub}
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: cls.accentLine }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
