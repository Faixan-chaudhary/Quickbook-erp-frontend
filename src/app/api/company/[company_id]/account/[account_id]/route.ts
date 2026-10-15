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
 * GET /api/company/[company_id]/account/[account_id]
 * Proxies reading a specific account by ID:
 * GET /v3/company/{company_id}/account/{account_id}
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ company_id: string; account_id: string }> }
) {
  try {
    const { company_id, account_id } = await params;
    const auth = await getAuthContext(company_id);

    if ("error" in auth) {
      return NextResponse.json({ detail: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const backendUrl = new URL(
      `${BACKEND_URL}/v3/company/${encodeURIComponent(auth.companyId)}/account/${encodeURIComponent(account_id)}`
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
        { detail: data.detail || "Account not found" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to fetch account" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/company/[company_id]/account/[account_id]
 * Proxies soft-deleting an account (Set Active = False):
 * DELETE /v3/company/{company_id}/account/{account_id}
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ company_id: string; account_id: string }> }
) {
  try {
    const { company_id, account_id } = await params;
    const auth = await getAuthContext(company_id);

    if ("error" in auth) {
      return NextResponse.json({ detail: auth.error }, { status: auth.status });
    }

    const backendUrl = `${BACKEND_URL}/v3/company/${encodeURIComponent(auth.companyId)}/account/${encodeURIComponent(account_id)}`;

    const res = await fetch(backendUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { detail: data.detail || "Failed to delete account" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to delete account" },
      { status: 500 }
    );
  }
}
