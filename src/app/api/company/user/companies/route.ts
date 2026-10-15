import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * GET /api/company/user/companies
 *
 * Proxies FastAPI backend endpoint:
 * GET /v3/company/user/companies
 * Lists all companies accessible by the current user.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/v3/company/user/companies`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    let companiesList: any[] = [];
    if (res.ok) {
      try {
        const data = await res.json();
        companiesList = Array.isArray(data) ? data : [];
      } catch {
        companiesList = [];
      }
    }

    return NextResponse.json(companiesList);

  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to fetch user companies from database" },
      { status: 500 }
    );
  }
}
