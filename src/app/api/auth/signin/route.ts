import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * POST /api/auth/signin
 *
 * Authenticates user via FastAPI backend:
 * POST https://quick-book-erp-backend.vercel.app/api/v1/auth/signin/email
 *
 * Security:
 * Stores access_token & refresh_token exclusively in secure, HttpOnly cookies.
 * Prevents client-side XSS token theft (no localStorage used).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { detail: "Email and password are required." },
        { status: 400 }
      );
    }

    // 2. Call FastAPI backend signin endpoint
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/v1/auth/signin/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      }
    );

    const data = await backendResponse.json();

    // 3. Handle errors from backend (e.g. 401 Invalid credentials, 422 Validation Error)
    if (!backendResponse.ok) {
      const errorMessage =
        data.detail && typeof data.detail === "string"
          ? data.detail
          : Array.isArray(data.detail)
          ? data.detail.map((err: { msg?: string }) => err.msg || "Invalid input").join(", ")
          : "Invalid email or password";

      return NextResponse.json(
        { detail: errorMessage },
        { status: backendResponse.status }
      );
    }

    // 4. Securely store tokens in HttpOnly Cookies
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    // Access token cookie (7 days)
    cookieStore.set("access_token", data.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // Refresh token cookie (30 days)
    if (data.refresh_token) {
      cookieStore.set("refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }

    // Optional user metadata cookie (non-sensitive)
    if (data.company_id) {
      cookieStore.set("company_id", data.company_id, {
        httpOnly: false,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }

    // 5. Return success response without exposing tokens to JavaScript localStorage
    return NextResponse.json({
      success: true,
      message: "Signed in successfully",
      company_id: data.company_id,
      user_id: data.user_id,
      token_type: data.token_type || "bearer",
    });
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to communicate with authentication server" },
      { status: 500 }
    );
  }
}
