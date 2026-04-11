// components/PasswordScreen.js
// Student password gate — futuristic dark UI.
// Logic is completely unchanged: POSTs to /api/verify-password.

"use client";

import { useState } from "react";

export default function PasswordScreen({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  // ── unchanged logic ──────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/verify-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ password, role: "student" }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError("Incorrect password. Please try again.");
        setPassword("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#080c14" }}
    >
      {/* ── Ambient glow blobs ───────────────────────────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, #00d4ff0a 0%, transparent 70%)",
          top: "50%", left: "50%",
          transform: "translate(-50%, -60%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 300, height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, #7c3aed0a 0%, transparent 70%)",
          bottom: "10%", right: "10%",
        }}
      />

      {/* ── Card ────────────────────────────────────────────────── */}
      <div className="w-full max-w-sm relative z-10 animate-float">

        {/* Logo */}
        <div className="text-center mb-10">
          {/* Hexagon icon */}
          <div className="flex justify-center mb-5">
            <div
              className="w-16 h-16 flex items-center justify-center text-3xl"
              style={{
                background: "linear-gradient(135deg, #00d4ff22, #7c3aed22)",
                border: "1px solid #00d4ff44",
                borderRadius: "16px",
                boxShadow: "0 0 24px #00d4ff22, inset 0 1px 0 #00d4ff33",
              }}
            >
              🧬
            </div>
          </div>
          <h1
            className="text-4xl font-bold tracking-widest glow-text"
            style={{ color: "#00d4ff", letterSpacing: "0.2em" }}
          >
            BIOwithTB
          </h1>
          <p
            className="mt-2 text-xs tracking-widest uppercase"
            style={{ color: "#00d4ff66", letterSpacing: "0.25em" }}
          >
            Biology Lecture Notes
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "linear-gradient(135deg, #0d1526, #111c30)",
            border: "1px solid #1a2d4a",
            boxShadow: "0 0 40px #00000066, inset 0 1px 0 #ffffff08",
          }}
        >
          {/* Top accent line */}
          <div
            className="w-12 h-0.5 mb-6"
            style={{ background: "linear-gradient(90deg, #00d4ff, transparent)" }}
          />

          <h2
            className="text-base font-semibold mb-1 tracking-wide"
            style={{ color: "#cbd5e1" }}
          >
            Access Required
          </h2>
          <p className="text-xs mb-6" style={{ color: "#4a6080" }}>
            Enter your class password to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              required
              className="w-full px-4 py-3 rounded-xl text-sm transition-all"
              style={{
                background: "#060a12",
                border: "1px solid #1a2d4a",
                color: "#e2e8f0",
                letterSpacing: "0.05em",
              }}
            />

            {/* Error */}
            {error && (
              <div
                className="rounded-lg px-4 py-2.5 text-xs"
                style={{
                  background: "#ff000011",
                  border: "1px solid #ff000033",
                  color: "#ff6b6b",
                }}
              >
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl text-sm font-semibold tracking-widest uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #00d4ff22, #0099bb22)",
                border: "1px solid #00d4ff55",
                color: "#00d4ff",
                letterSpacing: "0.2em",
                boxShadow: loading ? "none" : "0 0 20px #00d4ff22",
              }}
            >
              {loading ? "Verifying..." : "Enter"}
            </button>
          </form>
        </div>

        {/* ── "Made with love" footer ─────────────────────────── */}
        <p
          className="text-center mt-8 text-xs"
          style={{ color: "#2a4060", letterSpacing: "0.08em" }}
        >
          Made with{" "}
          <span style={{ color: "#ff4d6d" }}>♥</span>
          {" "}by{" "}
          <span style={{ color: "#00d4ff55" }}>Panther</span>
        </p>
      </div>
    </main>
  );
}
