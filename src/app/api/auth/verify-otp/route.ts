import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * POST /api/auth/verify-otp
 *
 * Verifies the 6-digit TOTP / OTP code via FastAPI backend:
 * POST https://quick-book-erp-backend.vercel.app/api/v1/auth/verify-otp
 *
 * Automatically sets the HttpOnly auth cookies so the user is logged in immediately.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { detail: "Email and verification code are required." },
        { status: 400 }
      );
    }

    // Call FastAPI backend to verify the code
    const backendResponse = await fetch(`${BACKEND_URL}/api/v1/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        otp: otp.trim(),
      }),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      const errorMessage =
        data.detail && typeof data.detail === "string"
          ? data.detail
          : Array.isArray(data.detail)
          ? data.detail.map((err: { msg?: string }) => err.msg || "Invalid code").join(", ")
          : "Invalid verification code";

      return NextResponse.json(
        { detail: errorMessage },
        { status: backendResponse.status }
      );
    }

    // Set secure HttpOnly Cookies with the returned access_token & refresh_token
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    if (data.access_token) {
      cookieStore.set("access_token", data.access_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }

    if (data.refresh_token) {
      cookieStore.set("refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }

    if (data.company_id) {
      cookieStore.set("company_id", data.company_id, {
        httpOnly: false,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: "Verified successfully",
      company_id: data.company_id,
      user_id: data.user_id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to communicate with authentication server" },
      { status: 500 }
    );
  }
}
