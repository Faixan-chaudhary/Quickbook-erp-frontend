import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * POST /api/auth/logout
 *
 * Clears HttpOnly authentication cookies from the client browser
 * and notifies the FastAPI backend.
 */
export async function POST() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("access_token")?.value;

    // 1. Inform FastAPI backend of logout (POST /api/v1/auth/logout)
    try {
      await fetch(`${BACKEND_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch {
      // Backend logout network failure should not prevent local cookie cleanup
    }

    // 2. Clear authentication cookies
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("company_id");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to logout" },
      { status: 500 }
    );
  }
}
