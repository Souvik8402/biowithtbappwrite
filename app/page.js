// app/page.js
// HOME PAGE — password gate → class select → chapter list → lecture list.
// Logic completely unchanged. TopBar upgraded with richer gradient + glow.

"use client";

import { useState } from "react";
import Link from "next/link";
import PasswordScreen from "@/components/PasswordScreen";
import ClassSelector from "@/components/ClassSelector";
import ChapterList from "@/components/ChapterList";
import LectureList from "@/components/LectureList";

export default function HomePage() {
  const [isLoggedIn,      setIsLoggedIn]      = useState(false);
  const [selectedClass,   setSelectedClass]   = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  if (!isLoggedIn) {
    return <PasswordScreen onSuccess={() => setIsLoggedIn(true)} />;
  }

  if (!selectedClass) {
    return (
      <main className="min-h-screen" style={{ background: "#05080f" }}>
        <TopBar />
        <ClassSelector onSelect={(cls) => setSelectedClass(cls)} />
      </main>
    );
  }

  if (!selectedChapter) {
    return (
      <main className="min-h-screen" style={{ background: "#05080f" }}>
        <TopBar />
        <ChapterList
          classId={selectedClass}
          onSelect={(chapter) => setSelectedChapter(chapter)}
          onBack={() => setSelectedClass(null)}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#05080f" }}>
      <TopBar />
      <LectureList
        classId={selectedClass}
        chapter={selectedChapter}
        onBack={() => setSelectedChapter(null)}
      />
    </main>
  );
}

// ── Top navigation bar ─────────────────────────────────────────────────
function TopBar() {
  return (
    <div
      className="px-6 py-4 flex items-center justify-between relative z-10"
      style={{
        background: "linear-gradient(180deg, #0a1020f0 0%, #05080f00 100%)",
        borderBottom: "1px solid",
        borderImage: "linear-gradient(90deg, transparent, #00d4ff22, #7c3aed22, transparent) 1",
      }}
    >
      {/* ── Brand mark ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5">
        {/* Hex icon */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{
            background: "linear-gradient(135deg, #00d4ff22, #7c3aed22)",
            border: "1px solid #00d4ff33",
            color: "#00d4ff",
            boxShadow: "0 0 10px #00d4ff22",
          }}
        >
          ⬡
        </div>
        <span
          className="font-bold text-sm tracking-widest glow-text"
          style={{ color: "#00d4ff", letterSpacing: "0.18em" }}
        >
          BIOwithTB
        </span>
      </div>

      {/* ── Admin button ─────────────────────────────────────────────── */}
      <Link
        href="/admin"
        className="text-xs tracking-widest uppercase px-4 py-1.5 rounded-full transition-all"
        style={{
          color: "#00d4ff55",
          border: "1px solid #00d4ff22",
          letterSpacing: "0.15em",
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color       = "#00d4ff";
          e.currentTarget.style.borderColor = "#00d4ff55";
          e.currentTarget.style.background  = "#00d4ff0a";
          e.currentTarget.style.boxShadow   = "0 0 16px #00d4ff22";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color       = "#00d4ff55";
          e.currentTarget.style.borderColor = "#00d4ff22";
          e.currentTarget.style.background  = "transparent";
          e.currentTarget.style.boxShadow   = "none";
        }}
      >
        Admin
      </Link>
    </div>
  );
}
