// app/api/create-chapter/route.js
// Creates a new document in the "chapters" collection in Appwrite Database.

import { NextResponse } from "next/server";
import { Client, Databases, ID } from "node-appwrite";

function getAppwriteClient() {
  return new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
}

export async function POST(request) {
  try {
    const { classId, chapterName } = await request.json();

    if (!classId || !chapterName?.trim()) {
      return NextResponse.json({ error: "classId and chapterName are required." }, { status: 400 });
    }

    const client    = getAppwriteClient();
    const databases = new Databases(client);

    const doc = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_CHAPTERS_COL_ID,
      ID.unique(),
      {
        class: classId,
        name:  chapterName.trim(),
      }
    );

    return NextResponse.json({ success: true, chapterId: doc.$id });
  } catch (error) {
    console.error("Create chapter error:", error);
    return NextResponse.json({ error: "Failed: " + error.message }, { status: 500 });
  }
}
