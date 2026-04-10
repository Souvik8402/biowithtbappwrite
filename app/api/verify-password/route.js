// app/api/verify-password/route.js
// SERVER-SIDE route — passwords live only in environment variables.
// The browser sends the typed password here; we check it and return success/fail.
// No Appwrite needed here — just plain environment variable comparison.

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { password, role } = await request.json();

    if (role === "student" && password === process.env.STUDENT_PASSWORD) {
      return NextResponse.json({ success: true });
    }
    if (role === "admin" && password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
