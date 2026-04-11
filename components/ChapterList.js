// components/ChapterList.js
// Fetches chapters from Appwrite "chapters" collection and displays them.
// UI: futuristic dark. Logic unchanged.

"use client";

import { useState, useEffect } from "react";
import { databases, DATABASE_ID, CHAPTERS_COL, Query } from "@/lib/appwrite";

export default function ChapterList({ classId, onSelect, onBack }) {
  const [chapters, setChapters] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  // ── unchanged data-fetching logic ────────────────────────────────
  useEffect(() => {
    async function fetchChapters() {
      setLoading(true); setError("");
      try {
        const result = await databases.listDocuments(DATABASE_ID, CHAPTERS_COL, [
          Query.equal("class", classId),
          Query.orderAsc("$createdAt"),
          Query.limit(100),
        ]);
        setChapters(result.documents);
      } catch (err) {
        console.error("Error fetching chapters:", err);
        setError("Could not load chapters. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchChapters();
  }, [classId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 relative z-10 animate-float">

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <button
          onClick={onBack}
          className="mt-1 text-xs tracking-widest uppercase px-3 py-1.5 rounded-full transition-all flex-shrink-0"
          style={{ color: "#00d4ff66", border: "1px solid #1a2d4a" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#00d4ff"; e.currentTarget.style.borderColor = "#00d4ff44"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#00d4ff66"; e.currentTarget.style.borderColor = "#1a2d4a"; }}
        >
          ← Back
        </button>
        <div>
          <p
            className="text-xs tracking-widest uppercase mb-1"
            style={{ color: "#00d4ff55", letterSpacing: "0.25em" }}
          >
            Class {classId} · Step 02
          </p>
          <h2 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>
            Chapters
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "#4a6080" }}>
            Select a chapter to view lectures
          </p>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl h-16 animate-pulse"
              style={{ background: "#0d1526", border: "1px solid #1a2d4a" }}
            />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{ background: "#ff000011", border: "1px solid #ff000033", color: "#ff6b6b" }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && chapters.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4 opacity-30">📭</div>
          <p style={{ color: "#4a6080" }}>No chapters yet for Class {classId}.</p>
          <p className="text-sm mt-1" style={{ color: "#2a4060" }}>Ask your teacher to add chapters.</p>
        </div>
      )}

      {/* Chapter list */}
      {!loading && !error && chapters.length > 0 && (
        <div className="space-y-2">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.$id}
              onClick={() => onSelect({ id: chapter.$id, name: chapter.name })}
              className="w-full text-left rounded-xl px-5 py-4 flex items-center gap-4 transition-all group relative overflow-hidden"
              style={{ background: "#0d1526", border: "1px solid #1a2d4a" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#00d4ff33";
                e.currentTarget.style.boxShadow = "0 0 16px #00d4ff0a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1a2d4a";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Index badge */}
              <span
                className="text-xs font-bold w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 tabular-nums"
                style={{
                  background: "#00d4ff11",
                  border: "1px solid #00d4ff33",
                  color: "#00d4ff",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Name */}
              <span className="font-medium text-sm flex-1" style={{ color: "#94a3b8" }}>
                {chapter.name}
              </span>

              {/* Arrow */}
              <span
                className="text-xs transition-transform group-hover:translate-x-1"
                style={{ color: "#00d4ff44" }}
              >
                →
              </span>

              {/* Hover bottom bar */}
              <div
                className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                style={{ background: "linear-gradient(90deg, #00d4ff55, transparent)" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
