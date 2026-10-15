import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * POST /api/auth/refresh
 *
 * Refreshes the access token using the stored refresh_token cookie
 * Calls FastAPI backend: POST /api/v1/auth/refresh
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { detail: "No refresh token available" },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      // Refresh token is also expired or invalid: clear session cookies
      cookieStore.delete("access_token");
      cookieStore.delete("refresh_token");
      return NextResponse.json(
        { detail: data.detail || "Session expired. Please sign in again." },
        { status: 401 }
      );
    }

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax" as const,
      path: "/",
    };

    if (data.access_token) {
      cookieStore.set("access_token", data.access_token, cookieOptions);
    }
    if (data.refresh_token) {
      cookieStore.set("refresh_token", data.refresh_token, cookieOptions);
    }
    if (data.company_id) {
      cookieStore.set("company_id", data.company_id, {
        ...cookieOptions,
        httpOnly: false,
      });
    }

    return NextResponse.json({
      success: true,
      access_token: data.access_token,
      company_id: data.company_id,
      user_id: data.user_id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to refresh authentication token" },
      { status: 500 }
    );
  }
}
