import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * GET /api/company/[company_id]/preferences
 * Proxies fetching company preferences from FastAPI backend:
 * GET /v3/company/{company_id}/preferences
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ company_id: string }> }
) {
  try {
    const { company_id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }

    let effectiveCompanyId =
      company_id && company_id !== "undefined" && company_id !== "me"
        ? company_id
        : cookieStore.get("company_id")?.value;

    // Auto-resolve company ID from user companies API if needed
    if (!effectiveCompanyId) {
      try {
        const resCompanies = await fetch(
          `${BACKEND_URL}/v3/company/user/companies`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );
        if (resCompanies.ok) {
          const companies = await resCompanies.json();
          if (Array.isArray(companies) && companies.length > 0) {
            effectiveCompanyId = companies[0].id;
          }
        }
      } catch {
        // Fallback
      }
    }

    if (!effectiveCompanyId) {
      return NextResponse.json(
        { detail: "Company ID could not be determined. Please re-login." },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${BACKEND_URL}/v3/company/${encodeURIComponent(effectiveCompanyId)}/preferences`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { detail: data.detail || "Failed to fetch company preferences" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to fetch company preferences" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/company/[company_id]/preferences
 * Proxies updating company preferences to FastAPI backend:
 * POST /v3/company/{company_id}/preferences
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ company_id: string }> }
) {
  try {
    const { company_id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }

    let effectiveCompanyId =
      company_id && company_id !== "undefined" && company_id !== "me"
        ? company_id
        : cookieStore.get("company_id")?.value;

    // Auto-resolve company ID from user companies API if needed
    if (!effectiveCompanyId) {
      try {
        const resCompanies = await fetch(
          `${BACKEND_URL}/v3/company/user/companies`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );
        if (resCompanies.ok) {
          const companies = await resCompanies.json();
          if (Array.isArray(companies) && companies.length > 0) {
            effectiveCompanyId = companies[0].id;
          }
        }
      } catch {
        // Fallback
      }
    }

    if (!effectiveCompanyId) {
      return NextResponse.json(
        { detail: "Company ID could not be determined. Please re-login." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const res = await fetch(
      `${BACKEND_URL}/v3/company/${encodeURIComponent(effectiveCompanyId)}/preferences`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { detail: data.detail || "Failed to update company preferences" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to update company preferences" },
      { status: 500 }
    );
  }
}
