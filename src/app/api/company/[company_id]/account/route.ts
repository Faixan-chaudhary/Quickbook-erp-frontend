import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Helper to resolve the active access token and company ID from session/cookies
 */
async function getAuthContext(company_id?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return { error: "Not authenticated", status: 401 };
  }

  let effectiveCompanyId =
    company_id && company_id !== "undefined" && company_id !== "me"
      ? company_id
      : cookieStore.get("company_id")?.value;

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
    return {
      error: "Company ID could not be determined. Please select or register a company.",
      status: 400,
    };
  }

  return { token, companyId: effectiveCompanyId };
}

/**
 * GET /api/company/[company_id]/account
 * Proxies listing accounts from FastAPI backend:
 * GET /v3/company/{company_id}/account
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ company_id: string }> }
) {
  try {
    const { company_id } = await params;
    const auth = await getAuthContext(company_id);

    if ("error" in auth) {
      return NextResponse.json({ detail: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const backendUrl = new URL(
      `${BACKEND_URL}/v3/company/${encodeURIComponent(auth.companyId)}/account`
    );

    searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value);
    });

    const res = await fetch(backendUrl.toString(), {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { detail: data.detail || "Failed to fetch accounts" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/company/[company_id]/account
 * Proxies creating or updating an account to FastAPI backend:
 * POST /v3/company/{company_id}/account
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ company_id: string }> }
) {
  try {
    const { company_id } = await params;
    const auth = await getAuthContext(company_id);

    if ("error" in auth) {
      return NextResponse.json({ detail: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { searchParams } = new URL(request.url);

    const backendUrl = new URL(
      `${BACKEND_URL}/v3/company/${encodeURIComponent(auth.companyId)}/account`
    );

    searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value);
    });

    const res = await fetch(backendUrl.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { detail: data.detail || "Failed to save account" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to save account" },
      { status: 500 }
    );
  }
}
