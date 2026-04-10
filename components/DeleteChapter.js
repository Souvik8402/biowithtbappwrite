// components/DeleteChapter.js
// Admin tab: delete an entire chapter and ALL its lectures + PDFs.
// Passes chapterDocId, chapterName, and classId to the API route.

"use client";

import { useState, useEffect } from "react";
import { databases, DATABASE_ID, CHAPTERS_COL, LECTURES_COL, Query } from "@/lib/appwrite";

export default function DeleteChapter() {
  const [classId,    setClassId]    = useState("");
  const [chapterDoc, setChapterDoc] = useState(null);
  const [chapters,   setChapters]   = useState([]);
  const [lectureCount, setLectureCount] = useState(0);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [confirm,    setConfirm]    = useState(false);
  const [success,    setSuccess]    = useState("");
  const [error,      setError]      = useState("");

  const classes = ["9", "10", "11", "12"];

  // Fetch chapters on class change
  useEffect(() => {
    if (!classId) { setChapters([]); setChapterDoc(null); return; }
    setLoadingChapters(true);
    databases.listDocuments(DATABASE_ID, CHAPTERS_COL, [
      Query.equal("class", classId), Query.orderAsc("$createdAt"), Query.limit(100),
    ])
      .then((r) => setChapters(r.documents))
      .catch(console.error)
      .finally(() => setLoadingChapters(false));
  }, [classId]);

  // Count lectures when chapter is selected (so we can warn the admin)
  useEffect(() => {
    if (!classId || !chapterDoc) { setLectureCount(0); setConfirm(false); return; }
    databases.listDocuments(DATABASE_ID, LECTURES_COL, [
      Query.equal("class",   classId),
      Query.equal("chapter", chapterDoc.name),
      Query.limit(500),
    ])
      .then((r) => setLectureCount(r.total))
      .catch(() => setLectureCount(0));
  }, [classId, chapterDoc]);

  async function handleDelete() {
    if (!chapterDoc) return;
    setDeleting(true); setError(""); setSuccess("");

    try {
      const res  = await fetch("/api/delete-chapter", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          classId,
          chapterDocId:  chapterDoc.$id,
          chapterName:   chapterDoc.name,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(`✅ "${chapterDoc.name}" and ${data.deletedLectures} lecture(s) deleted.`);
        setChapters((prev) => prev.filter((c) => c.$id !== chapterDoc.$id));
        setChapterDoc(null); setConfirm(false); setLectureCount(0);
      } else {
        setError(data.error || "Delete failed.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-1">Delete Chapter</h2>
      <p className="text-slate-400 text-sm mb-6">Deletes the chapter AND all its lectures and PDF files permanently.</p>

      <div className="space-y-4">
        {/* Class */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Class</label>
          <select value={classId}
            onChange={(e) => { setClassId(e.target.value); setChapterDoc(null); setSuccess(""); setError(""); }}
            className="w-full bg-slate-700 text-white border border-slate-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500"
          >
            <option value="">— Select class —</option>
            {classes.map((c) => <option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>

        {/* Chapter */}
        {classId && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Chapter to Delete</label>
            {loadingChapters ? <p className="text-slate-400 text-sm">Loading...</p> : chapters.length === 0 ? (
              <p className="text-yellow-400 text-sm">No chapters for Class {classId}.</p>
            ) : (
              <select value={chapterDoc?.$id || ""}
                onChange={(e) => { setChapterDoc(chapters.find((c) => c.$id === e.target.value) || null); setConfirm(false); }}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500"
              >
                <option value="">— Select chapter —</option>
                {chapters.map((ch) => <option key={ch.$id} value={ch.$id}>{ch.name}</option>)}
              </select>
            )}
          </div>
        )}

        {/* Warning */}
        {chapterDoc && !confirm && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl px-4 py-4">
            <p className="text-red-300 font-medium mb-1">⚠️ This cannot be undone!</p>
            <p className="text-red-300 text-sm mb-1">Chapter: <strong className="text-red-200">{chapterDoc.name}</strong></p>
            <p className="text-red-300 text-sm mb-3">
              Will permanently delete <strong className="text-red-200">{lectureCount} lecture(s)</strong> and all their PDFs.
            </p>
            <button onClick={() => setConfirm(true)} className="bg-red-600 hover:bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg">
              I understand, delete this chapter
            </button>
          </div>
        )}

        {confirm && (
          <button onClick={handleDelete} disabled={deleting}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {deleting ? "Deleting everything..." : "🗑️ Permanently Delete Chapter"}
          </button>
        )}

        {success && <div className="bg-green-900/50 border border-green-700 text-green-400 rounded-xl px-4 py-3 text-sm">{success}</div>}
        {error   && <div className="bg-red-900/50 border border-red-700 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>}
      </div>
    </div>
  );
}
