// components/ChapterList.js
// Fetches chapters for a given class from the Appwrite "chapters" collection
// and displays them as a clickable list.

"use client";

import { useState, useEffect } from "react";
import { databases, DATABASE_ID, CHAPTERS_COL, Query } from "@/lib/appwrite";

// Props:
//   classId   — selected class string e.g. "9"
//   onSelect  — called with { id, name } when a chapter is clicked
//   onBack    — called when the student clicks Back
export default function ChapterList({ classId, onSelect, onBack }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    async function fetchChapters() {
      setLoading(true);
      setError("");
      try {
        // Query Appwrite: get all chapters where the "class" field matches classId
        const result = await databases.listDocuments(DATABASE_ID, CHAPTERS_COL, [
          Query.equal("class", classId),
          Query.orderAsc("$createdAt"), // oldest first
          Query.limit(100),
        ]);
        setChapters(result.documents); // each document has $id, name, class, etc.
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
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-700 text-sm flex items-center gap-1">
          ← Back
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Class {classId} Chapters</h2>
          <p className="text-slate-500 text-sm mt-0.5">Select a chapter to view lectures</p>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl h-16 animate-pulse border border-slate-100" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-600">{error}</div>
      )}

      {!loading && !error && chapters.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-slate-500">No chapters yet for Class {classId}.</p>
          <p className="text-slate-400 text-sm mt-1">Ask your teacher to add chapters.</p>
        </div>
      )}

      {!loading && !error && chapters.length > 0 && (
        <div className="space-y-3">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.$id}
              // Pass both the Appwrite document ID and the chapter name to the parent
              onClick={() => onSelect({ id: chapter.$id, name: chapter.name })}
              className="w-full bg-white border border-slate-200 hover:border-green-400 hover:shadow-sm rounded-xl px-5 py-4 text-left flex items-center gap-4 transition-all group"
            >
              <span className="bg-green-100 text-green-700 text-sm font-semibold w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 group-hover:text-white transition-colors">
                {index + 1}
              </span>
              <span className="font-medium text-slate-800 group-hover:text-green-700 transition-colors">
                {chapter.name}
              </span>
              <span className="ml-auto text-slate-300 group-hover:text-green-400">→</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
