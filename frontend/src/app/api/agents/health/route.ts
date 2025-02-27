import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simple health check - if this endpoint responds, the server is up
    return NextResponse.json({ 
      status: "ok",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { status: "error", message: "Health check failed" }, 
      { status: 500 }
    );
  }
}