// components/ClassSelector.js
// Class picker — futuristic dark UI. Logic unchanged.

"use client";

export default function ClassSelector({ onSelect }) {
  const classes = [
    { id: "9",  label: "Class 9",  sub: "Foundation Biology",  icon: "09" },
    { id: "10", label: "Class 10", sub: "Secondary Biology",   icon: "10" },
    { id: "11", label: "Class 11", sub: "Senior Biology",      icon: "11" },
    { id: "12", label: "Class 12", sub: "Advanced Biology",    icon: "12" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 relative z-10 animate-float">
      {/* Section header */}
      <div className="mb-8">
        <p
          className="text-xs tracking-widest uppercase mb-2"
          style={{ color: "#00d4ff55", letterSpacing: "0.25em" }}
        >
          Step 01
        </p>
        <h2 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>
          Select Your Class
        </h2>
        <p className="text-sm mt-1" style={{ color: "#4a6080" }}>
          Choose your class to browse chapters and lectures
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {classes.map((cls) => (
          <button
            key={cls.id}
            onClick={() => onSelect(cls.id)}
            className="text-left rounded-2xl p-6 transition-all group relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0d1526, #111c30)",
              border: "1px solid #1a2d4a",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = "1px solid #00d4ff44";
              e.currentTarget.style.boxShadow = "0 0 24px #00d4ff11, inset 0 1px 0 #00d4ff11";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = "1px solid #1a2d4a";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Corner accent */}
            <div
              className="absolute top-0 right-0 w-16 h-16 opacity-30 group-hover:opacity-60 transition-opacity"
              style={{
                background: "radial-gradient(circle at top right, #00d4ff22, transparent 70%)",
              }}
            />

            {/* Class number badge */}
            <div
              className="text-2xl font-bold mb-3 tabular-nums"
              style={{
                color: "#00d4ff",
                fontVariantNumeric: "tabular-nums",
                textShadow: "0 0 12px #00d4ff44",
              }}
            >
              {cls.icon}
            </div>

            <div
              className="font-semibold text-base mb-1"
              style={{ color: "#cbd5e1" }}
            >
              {cls.label}
            </div>
            <div className="text-xs" style={{ color: "#4a6080" }}>
              {cls.sub}
            </div>

            {/* Bottom accent line on hover */}
            <div
              className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
              style={{ background: "linear-gradient(90deg, #00d4ff, transparent)" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
