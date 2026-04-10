// app/api/delete-lecture/route.js
// Deletes a single lecture:
//   1. Removes the PDF from Appwrite Storage
//   2. Deletes the document from the "lectures" collection

import { NextResponse } from "next/server";
import { Client, Databases, Storage } from "node-appwrite";

function getAppwriteClient() {
  return new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
}

export async function POST(request) {
  try {
    const { lectureDocId, fileId } = await request.json();
    // lectureDocId — the Appwrite document $id in the lectures collection
    // fileId       — the Appwrite storage file $id

    if (!lectureDocId || !fileId) {
      return NextResponse.json({ error: "lectureDocId and fileId are required." }, { status: 400 });
    }

    const client    = getAppwriteClient();
    const storage   = new Storage(client);
    const databases = new Databases(client);

    // ── Delete the PDF from Storage ─────────────────────────────────────────
    try {
      await storage.deleteFile(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, fileId);
    } catch (storageErr) {
      // If the file is already gone, keep going and still delete the DB record
      console.warn("Storage delete warning:", storageErr.message);
    }

    // ── Delete the document from the lectures collection ────────────────────
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_LECTURES_COL_ID,
      lectureDocId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete lecture error:", error);
    return NextResponse.json({ error: "Delete failed: " + error.message }, { status: 500 });
  }
}
