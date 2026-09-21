import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

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
 * GET /api/company/[company_id]/query
 * Proxies QuickBooks Query Endpoint via GET (e.g. ?query=Select * from Account)
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
      `${BACKEND_URL}/v3/company/${encodeURIComponent(auth.companyId)}/query`
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
        { detail: data.detail || "Query execution failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Query execution failed" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/company/[company_id]/query
 * Proxies QuickBooks Query Endpoint via POST
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

    const { searchParams } = new URL(request.url);
    let bodyText = "";
    try {
      bodyText = await request.text();
    } catch {
      // empty body
    }

    const backendUrl = new URL(
      `${BACKEND_URL}/v3/company/${encodeURIComponent(auth.companyId)}/query`
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
      body: bodyText || undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { detail: data.detail || "Query execution failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Query execution failed" },
      { status: 500 }
    );
  }
}
