import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminPasswordValid } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!isAdminPasswordValid(String(password || ""))) {
    return NextResponse.json({ ok: false, message: "Mot de passe incorrect." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "authenticated", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
