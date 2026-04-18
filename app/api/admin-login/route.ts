export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    // no maxAge = session cookie, dies when browser closes
  });

  return response;
}