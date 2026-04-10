// lib/appwrite.js
// This file sets up the connection to Appwrite Cloud.
// It exports a ready-to-use client, database helper, and storage helper.
// All credentials come from environment variables — never hardcoded.

import { Client, Databases, Storage, ID, Query } from "appwrite";

// ── Create the Appwrite client ──────────────────────────────────────────────
const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)   // e.g. https://cloud.appwrite.io/v1
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID); // Your Appwrite project ID

// ── Export individual service helpers ──────────────────────────────────────
export const databases = new Databases(client);
export const storage   = new Storage(client);

// ── Export constants used throughout the app ───────────────────────────────
// These IDs come from environment variables so you only need to change them in one place
export const DATABASE_ID  = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
export const LECTURES_COL = process.env.NEXT_PUBLIC_APPWRITE_LECTURES_COL_ID;  // "lectures" collection
export const CHAPTERS_COL = process.env.NEXT_PUBLIC_APPWRITE_CHAPTERS_COL_ID;  // "chapters" collection
export const BUCKET_ID    = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;        // PDF storage bucket

// ── Re-export Appwrite helpers so other files don't need to import appwrite directly
export { ID, Query };
