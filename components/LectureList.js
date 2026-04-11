// components/LectureList.js
// Fetches lectures from Appwrite and renders download links.
// UI: futuristic dark. Logic unchanged.

"use client";

import { useState, useEffect } from "react";
import { databases, DATABASE_ID, LECTURES_COL, BUCKET_ID, Query } from "@/lib/appwrite";

export default function LectureList({ classId, chapter, onBack }) {
  const [lectures, setLectures] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  // ── unchanged logic ─────────────────────────────────────────────
  useEffect(() => {
    async function fetchLectures() {
      setLoading(true); setError("");
      try {
        const result = await databases.listDocuments(DATABASE_ID, LECTURES_COL, [
          Query.equal("class",   classId),
          Query.equal("chapter", chapter.name),
          Query.orderAsc("$createdAt"),
          Query.limit(200),
        ]);
        setLectures(result.documents);
      } catch (err) {
        console.error("Error fetching lectures:", err);
        setError("Could not load lectures. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchLectures();
  }, [classId, chapter.name]);

  function getDownloadUrl(fileId) {
    const endpoint  = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    return `${endpoint}/storage/buckets/${BUCKET_ID}/files/${fileId}/download?project=${projectId}`;
  }

  function formatDate(isoString) {
    if (!isoString) return "Unknown date";
    return new Date(isoString).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

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
            style={{ color: "#00d4ff55", letterSpacing: "0.2em" }}
          >
            Class {classId} · {chapter.name}
          </p>
          <h2 className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>
            Lectures
          </h2>
        </div>
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl h-20 animate-pulse"
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
      {!loading && !error && lectures.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4 opacity-30">📂</div>
          <p style={{ color: "#4a6080" }}>No lectures uploaded yet.</p>
          <p className="text-sm mt-1" style={{ color: "#2a4060" }}>Check back soon!</p>
        </div>
      )}

      {/* Lecture cards */}
      {!loading && !error && lectures.length > 0 && (
        <div className="space-y-2">
          {lectures.map((lecture, index) => (
            <div
              key={lecture.$id}
              className="rounded-xl px-5 py-4 flex items-center gap-4 group transition-all"
              style={{ background: "#0d1526", border: "1px solid #1a2d4a" }}
            >
              {/* Number */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold tabular-nums"
                style={{
                  background: "#00000033",
                  border: "1px solid #1a2d4a",
                  color: "#00d4ff88",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-medium text-sm truncate"
                  style={{ color: "#cbd5e1" }}
                >
                  {lecture.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#2a4060" }}>
                  {formatDate(lecture.createdAt)}
                </p>
              </div>

              {/* View / Download button */}
              <a
                href={getDownloadUrl(lecture.fileId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-lg transition-all"
                style={{
                  background: "#00d4ff11",
                  border: "1px solid #00d4ff33",
                  color: "#00d4ff",
                  letterSpacing: "0.12em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#00d4ff22";
                  e.currentTarget.style.boxShadow = "0 0 12px #00d4ff22";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#00d4ff11";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                View
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Lecture count */}
      {!loading && lectures.length > 0 && (
        <p
          className="text-center mt-6 text-xs tracking-widest"
          style={{ color: "#2a4060" }}
        >
          {lectures.length} lecture{lectures.length !== 1 ? "s" : ""} in this chapter
        </p>
      )}
    </div>
  );
}
