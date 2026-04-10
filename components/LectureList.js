// components/LectureList.js
// Fetches lectures for a given class + chapter from Appwrite.
// Generates a direct download URL from Appwrite Storage using the saved fileId.

"use client";

import { useState, useEffect } from "react";
import { databases, storage, DATABASE_ID, LECTURES_COL, BUCKET_ID, Query } from "@/lib/appwrite";

// Props:
//   classId  — e.g. "9"
//   chapter  — { id, name }
//   onBack   — go back to chapter list
export default function LectureList({ classId, chapter, onBack }) {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    async function fetchLectures() {
      setLoading(true);
      setError("");
      try {
        // Query lectures where class = classId AND chapter = chapter.name
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

  // Build the Appwrite Storage download URL for a given fileId.
  // The URL format for Appwrite Cloud is:
  // {endpoint}/storage/buckets/{bucketId}/files/{fileId}/download?project={projectId}
  function getDownloadUrl(fileId) {
    const endpoint  = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    return `${endpoint}/storage/buckets/${BUCKET_ID}/files/${fileId}/download?project=${projectId}`;
  }

  // Format an ISO date string to a readable date
  function formatDate(isoString) {
    if (!isoString) return "Unknown date";
    return new Date(isoString).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-700 text-sm flex items-center gap-1">
          ← Back
        </button>
        <div>
          <p className="text-green-600 text-sm font-medium">Class {classId}</p>
          <h2 className="text-2xl font-bold text-slate-800">{chapter.name}</h2>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl h-20 animate-pulse border border-slate-100" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-600">{error}</div>
      )}

      {!loading && !error && lectures.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📂</div>
          <p className="text-slate-500">No lectures uploaded yet.</p>
          <p className="text-slate-400 text-sm mt-1">Check back soon!</p>
        </div>
      )}

      {!loading && !error && lectures.length > 0 && (
        <div className="space-y-3">
          {lectures.map((lecture, index) => (
            <div
              key={lecture.$id}
              className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-4"
            >
              <div className="bg-red-50 text-red-500 rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{lecture.title}</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  📅 {formatDate(lecture.createdAt)}
                </p>
              </div>

              {/* Download link — uses Appwrite Storage URL built from fileId */}
              <a
                href={getDownloadUrl(lecture.fileId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
              >
                📄 Download
              </a>
            </div>
          ))}
        </div>
      )}

      {!loading && lectures.length > 0 && (
        <p className="text-slate-400 text-sm text-center mt-6">
          {lectures.length} lecture{lectures.length !== 1 ? "s" : ""} in this chapter
        </p>
      )}
    </div>
  );
}
