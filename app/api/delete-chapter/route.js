// app/api/delete-chapter/route.js
// Cascading delete for a chapter:
//   1. Find all lectures belonging to this class + chapter name
//   2. Delete each lecture's PDF from Appwrite Storage
//   3. Delete each lecture document from the lectures collection
//   4. Delete the chapter document from the chapters collection

import { NextResponse } from "next/server";
import { Client, Databases, Storage, Query } from "node-appwrite";

function getAppwriteClient() {
  return new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
}

export async function POST(request) {
  try {
    const { classId, chapterDocId, chapterName } = await request.json();
    // chapterDocId  — document $id in the chapters collection
    // chapterName   — the chapter's name string (used to find matching lectures)

    if (!classId || !chapterDocId || !chapterName) {
      return NextResponse.json({ error: "classId, chapterDocId, and chapterName are required." }, { status: 400 });
    }

    const client    = getAppwriteClient();
    const databases = new Databases(client);
    const storage   = new Storage(client);

    const DB  = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const LEC = process.env.NEXT_PUBLIC_APPWRITE_LECTURES_COL_ID;
    const CHA = process.env.NEXT_PUBLIC_APPWRITE_CHAPTERS_COL_ID;
    const BKT = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

    // ── Step 1: Find all lectures for this class + chapter ──────────────────
    // Appwrite Query lets us filter documents by field values
    const lecturesResult = await databases.listDocuments(DB, LEC, [
      Query.equal("class",   classId),
      Query.equal("chapter", chapterName),
      Query.limit(500), // safety cap — increase if a chapter can have more
    ]);

    // ── Step 2: Delete each lecture's PDF and its database record ───────────
    for (const lecture of lecturesResult.documents) {
      // Delete file from Storage (ignore if already deleted)
      if (lecture.fileId) {
        try {
          await storage.deleteFile(BKT, lecture.fileId);
        } catch (e) {
          console.warn("File already deleted or missing:", e.message);
        }
      }
      // Delete the lecture document
      await databases.deleteDocument(DB, LEC, lecture.$id);
    }

    // ── Step 3: Delete the chapter document itself ───────────────────────────
    await databases.deleteDocument(DB, CHA, chapterDocId);

    return NextResponse.json({ success: true, deletedLectures: lecturesResult.documents.length });
  } catch (error) {
    console.error("Delete chapter error:", error);
    return NextResponse.json({ error: "Failed: " + error.message }, { status: 500 });
  }
}
