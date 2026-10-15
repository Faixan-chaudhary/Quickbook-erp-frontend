import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * GET /api/auth/session
 *
 * Verifies if the client has a valid HttpOnly access_token cookie.
 * Used for fast server and client session validation.
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { authenticated: false, message: "No active session" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    company_id: cookieStore.get("company_id")?.value || null,
  });
}
