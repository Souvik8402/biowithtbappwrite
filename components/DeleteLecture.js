// components/DeleteLecture.js
// Admin tab: cascading selectors → Class → Chapter → Lecture → confirm delete.
// Passes the Appwrite document $id and fileId to the API route for deletion.

"use client";

import { useState, useEffect } from "react";
import { databases, DATABASE_ID, CHAPTERS_COL, LECTURES_COL, Query } from "@/lib/appwrite";

export default function DeleteLecture() {
  const [classId,   setClassId]   = useState("");
  const [chapterDoc, setChapterDoc] = useState(null); // full Appwrite doc
  const [lectureDoc, setLectureDoc] = useState(null); // full Appwrite doc

  const [chapters, setChapters] = useState([]);
  const [lectures, setLectures] = useState([]);

  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingLectures, setLoadingLectures] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirm,  setConfirm]  = useState(false);
  const [success,  setSuccess]  = useState("");
  const [error,    setError]    = useState("");

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

  // Fetch lectures on chapter change
  useEffect(() => {
    if (!classId || !chapterDoc) { setLectures([]); setLectureDoc(null); return; }
    setLoadingLectures(true);
    databases.listDocuments(DATABASE_ID, LECTURES_COL, [
      Query.equal("class",   classId),
      Query.equal("chapter", chapterDoc.name),
      Query.orderAsc("$createdAt"),
      Query.limit(200),
    ])
      .then((r) => setLectures(r.documents))
      .catch(console.error)
      .finally(() => setLoadingLectures(false));
  }, [classId, chapterDoc]);

  async function handleDelete() {
    if (!lectureDoc) return;
    setDeleting(true); setError(""); setSuccess("");

    try {
      const res  = await fetch("/api/delete-lecture", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        // Send the Appwrite document ID and the storage file ID
        body:    JSON.stringify({ lectureDocId: lectureDoc.$id, fileId: lectureDoc.fileId }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(`✅ "${lectureDoc.title}" deleted.`);
        setLectures((prev) => prev.filter((l) => l.$id !== lectureDoc.$id));
        setLectureDoc(null); setConfirm(false);
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
      <h2 className="text-lg font-semibold text-white mb-1">Delete Lecture</h2>
      <p className="text-slate-400 text-sm mb-6">Removes the PDF from Storage and the record from the database.</p>

      <div className="space-y-4">
        {/* Class */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Class</label>
          <select value={classId}
            onChange={(e) => { setClassId(e.target.value); setChapterDoc(null); setLectureDoc(null); setSuccess(""); setError(""); }}
            className="w-full bg-slate-700 text-white border border-slate-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500"
          >
            <option value="">— Select class —</option>
            {classes.map((c) => <option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>

        {/* Chapter */}
        {classId && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Chapter</label>
            {loadingChapters ? <p className="text-slate-400 text-sm">Loading...</p> : (
              <select value={chapterDoc?.$id || ""}
                onChange={(e) => { setChapterDoc(chapters.find((c) => c.$id === e.target.value) || null); setLectureDoc(null); setConfirm(false); }}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500"
              >
                <option value="">— Select chapter —</option>
                {chapters.map((ch) => <option key={ch.$id} value={ch.$id}>{ch.name}</option>)}
              </select>
            )}
          </div>
        )}

        {/* Lecture */}
        {chapterDoc && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Lecture</label>
            {loadingLectures ? <p className="text-slate-400 text-sm">Loading...</p> : lectures.length === 0 ? (
              <p className="text-yellow-400 text-sm">No lectures in this chapter.</p>
            ) : (
              <select value={lectureDoc?.$id || ""}
                onChange={(e) => { setLectureDoc(lectures.find((l) => l.$id === e.target.value) || null); setConfirm(false); }}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500"
              >
                <option value="">— Select lecture —</option>
                {lectures.map((l) => <option key={l.$id} value={l.$id}>{l.title}</option>)}
              </select>
            )}
          </div>
        )}

        {/* Confirm step */}
        {lectureDoc && !confirm && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl px-4 py-3">
            <p className="text-red-300 text-sm mb-3">
              ⚠️ Delete: <strong className="text-red-200">{lectureDoc.title}</strong>? This cannot be undone.
            </p>
            <button onClick={() => setConfirm(true)} className="bg-red-600 hover:bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg">
              Yes, Delete
            </button>
          </div>
        )}

        {confirm && (
          <button onClick={handleDelete} disabled={deleting}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {deleting ? "Deleting..." : "🗑️ Confirm Delete"}
          </button>
        )}

        {success && <div className="bg-green-900/50 border border-green-700 text-green-400 rounded-xl px-4 py-3 text-sm">{success}</div>}
        {error   && <div className="bg-red-900/50 border border-red-700 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>}
      </div>
    </div>
  );
}
