// components/UploadLecture.js
// Admin panel tab: select class, chapter, enter title, pick PDF — then POST to API.
// The actual upload to Appwrite Storage happens in the API route (server-side).

"use client";

import { useState, useEffect } from "react";
import { databases, DATABASE_ID, CHAPTERS_COL, Query } from "@/lib/appwrite";

export default function UploadLecture() {
  const [classId,     setClassId]     = useState("");
  const [chapterDoc,  setChapterDoc]  = useState(null); // { $id, name }
  const [title,       setTitle]       = useState("");
  const [file,        setFile]        = useState(null);
  const [chapters,    setChapters]    = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const [success,     setSuccess]     = useState("");
  const [error,       setError]       = useState("");

  const classes = ["9", "10", "11", "12"];

  // Fetch chapters from Appwrite when class changes
  useEffect(() => {
    if (!classId) { setChapters([]); setChapterDoc(null); return; }
    setLoadingChapters(true);
    databases
      .listDocuments(DATABASE_ID, CHAPTERS_COL, [
        Query.equal("class", classId),
        Query.orderAsc("$createdAt"),
        Query.limit(100),
      ])
      .then((r) => setChapters(r.documents))
      .catch(console.error)
      .finally(() => setLoadingChapters(false));
  }, [classId]);

  async function handleUpload(e) {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!file || !classId || !chapterDoc || !title.trim()) {
      setError("Please fill in all fields and select a PDF."); return;
    }
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed."); return;
    }

    setUploading(true);
    try {
      // Build FormData — the API route receives this and uploads to Appwrite
      const formData = new FormData();
      formData.append("file",        file);
      formData.append("classId",     classId);
      formData.append("chapterName", chapterDoc.name);
      formData.append("title",       title.trim());

      const res  = await fetch("/api/upload-lecture", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        setSuccess("✅ Lecture uploaded successfully!");
        setTitle(""); setFile(null);
        document.getElementById("pdf-input").value = "";
      } else {
        setError(data.error || "Upload failed.");
      }
    } catch (err) {
      setError("Something went wrong: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-1">Upload Lecture PDF</h2>
      <p className="text-slate-400 text-sm mb-6">Upload a PDF to Appwrite Storage and tag it to a chapter</p>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Class */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Class</label>
          <select
            value={classId}
            onChange={(e) => { setClassId(e.target.value); setChapterDoc(null); }}
            className="w-full bg-slate-700 text-white border border-slate-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500"
            required
          >
            <option value="">— Select class —</option>
            {classes.map((c) => <option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>

        {/* Chapter */}
        {classId && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Chapter</label>
            {loadingChapters ? (
              <p className="text-slate-400 text-sm">Loading chapters...</p>
            ) : chapters.length === 0 ? (
              <p className="text-yellow-400 text-sm">No chapters yet — create one first.</p>
            ) : (
              <select
                value={chapterDoc?.$id || ""}
                onChange={(e) => {
                  const found = chapters.find((c) => c.$id === e.target.value);
                  setChapterDoc(found || null);
                }}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500"
                required
              >
                <option value="">— Select chapter —</option>
                {chapters.map((ch) => <option key={ch.$id} value={ch.$id}>{ch.name}</option>)}
              </select>
            )}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Lecture Title</label>
          <input
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Lecture 1 — Cell Structure"
            className="w-full bg-slate-700 text-white placeholder-slate-500 border border-slate-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500"
            required
          />
        </div>

        {/* File picker */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">PDF File</label>
          <input
            id="pdf-input" type="file" accept=".pdf,application/pdf"
            onChange={(e) => setFile(e.target.files[0] || null)}
            className="w-full bg-slate-700 text-slate-300 border border-slate-600 rounded-xl px-4 py-2.5 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-green-600 file:text-white file:text-sm file:cursor-pointer"
            required
          />
          {file && (
            <p className="text-slate-400 text-xs mt-1.5">
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {success && <div className="bg-green-900/50 border border-green-700 text-green-400 rounded-xl px-4 py-3 text-sm">{success}</div>}
        {error   && <div className="bg-red-900/50 border border-red-700 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>}

        <button
          type="submit" disabled={uploading}
          className="w-full bg-green-600 hover:bg-green-500 disabled:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {uploading ? "Uploading... please wait" : "Upload Lecture"}
        </button>
      </form>
    </div>
  );
}
