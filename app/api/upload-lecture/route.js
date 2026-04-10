// app/api/upload-lecture/route.js
// Handles PDF upload to Appwrite Storage and saves metadata to the "lectures" collection.
// Uses the Appwrite Node.js SDK (server-side — safe for API routes).

import { NextResponse } from "next/server";
import { Client, Databases, Storage, ID } from "node-appwrite";

// Build a server-side Appwrite client using the same env variables
function getAppwriteClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
  return client;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file        = formData.get("file");         // The PDF File object
    const classId     = formData.get("classId");      // "9" / "10" / "11" / "12"
    const chapterName = formData.get("chapterName");  // Chapter name string
    const title       = formData.get("title");        // Lecture title

    // Basic validation
    if (!file || !classId || !chapterName || !title) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const client    = getAppwriteClient();
    const storage   = new Storage(client);
    const databases = new Databases(client);

    // ── Step 1: Upload the PDF to Appwrite Storage ──────────────────────────
    // Convert the File/Blob to a Node.js Buffer, then wrap in an InputFile
    const arrayBuffer = await file.arrayBuffer();
    const buffer      = Buffer.from(arrayBuffer);

    // Appwrite SDK expects an InputFile — we create it from the buffer
    const { InputFile } = await import("node-appwrite/file");
    const inputFile = InputFile.fromBuffer(buffer, file.name);

    const uploadedFile = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
      ID.unique(), // Let Appwrite generate a unique file ID
      inputFile
    );

    const fileId = uploadedFile.$id; // Save this to retrieve the file later

    // ── Step 2: Save lecture metadata in the "lectures" collection ───────────
    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_LECTURES_COL_ID,
      ID.unique(),
      {
        class:     classId,
        chapter:   chapterName,
        title:     title.trim(),
        fileId:    fileId,
        createdAt: new Date().toISOString(),
      }
    );

    return NextResponse.json({ success: true, fileId });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
  }
}
