// app/page.js
// HOME PAGE — password gate → class select → chapter list → lecture list.
// UI: futuristic dark theme. Logic is unchanged.

"use client";

import { useState } from "react";
import Link from "next/link";
import PasswordScreen from "@/components/PasswordScreen";
import ClassSelector from "@/components/ClassSelector";
import ChapterList from "@/components/ChapterList";
import LectureList from "@/components/LectureList";

export default function HomePage() {
  const [isLoggedIn,     setIsLoggedIn]     = useState(false);
  const [selectedClass,  setSelectedClass]  = useState(null);
  const [selectedChapter,setSelectedChapter]= useState(null);

  if (!isLoggedIn) {
    return <PasswordScreen onSuccess={() => setIsLoggedIn(true)} />;
  }

  if (!selectedClass) {
    return (
      <main className="min-h-screen bg-[#080c14]">
        <TopBar />
        <ClassSelector onSelect={(cls) => setSelectedClass(cls)} />
      </main>
    );
  }

  if (!selectedChapter) {
    return (
      <main className="min-h-screen bg-[#080c14]">
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
    <main className="min-h-screen bg-[#080c14]">
      <TopBar />
      <LectureList
        classId={selectedClass}
        chapter={selectedChapter}
        onBack={() => setSelectedChapter(null)}
      />
    </main>
  );
}

// ── Top navigation bar ────────────────────────────────────────────
function TopBar() {
  return (
    <div
      className="px-5 py-3 flex items-center justify-between relative z-10"
      style={{
        background: "linear-gradient(180deg, #0d1526 0%, #080c1400 100%)",
        borderBottom: "1px solid #1a2d4a",
      }}
    >
      {/* Brand */}
      <span
        className="font-bold text-lg tracking-widest glow-text"
        style={{ color: "#00d4ff", letterSpacing: "0.15em" }}
      >
        ⬡ BIOwithTB
      </span>

      {/* Admin link */}
      <Link
        href="/admin"
        className="text-xs tracking-widest uppercase px-4 py-1.5 rounded-full transition-all"
        style={{
          color: "#00d4ff99",
          border: "1px solid #00d4ff33",
          letterSpacing: "0.12em",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#00d4ff";
          e.currentTarget.style.borderColor = "#00d4ff66";
          e.currentTarget.style.boxShadow = "0 0 12px #00d4ff33";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#00d4ff99";
          e.currentTarget.style.borderColor = "#00d4ff33";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        Admin
      </Link>
    </div>
  );
}
