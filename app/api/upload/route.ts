import { NextResponse } from 'next/server';

// This route is deprecated - EdgeStore now handles uploads directly via /api/edgestore
// Kept for backward compatibility or direct server-side uploads if needed

export async function POST() {
  return NextResponse.json(
    { error: 'Direct uploads deprecated. Use EdgeStore client upload instead.' },
    { status: 410 }
  );
}