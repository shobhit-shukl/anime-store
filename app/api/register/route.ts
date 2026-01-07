import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json(
    { message: "Public registration is disabled. Please contact the administrator." },
    { status: 403 }
  );
}
