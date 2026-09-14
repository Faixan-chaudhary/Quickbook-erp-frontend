import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * GET /api/company/me
 *
 * Resolves current user company profile with automatic multi-endpoint fallback:
 * 1. GET /v3/company/me
 * 2. GET /v3/company/user/companies (All user companies API)
 * 3. GET /v3/company/{company_id}
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const cookieCompanyId = cookieStore.get("company_id")?.value;

    if (!token) {
      return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }

    let company: any = null;

    // 1. If active company_id cookie is present, resolve that company first
    if (cookieCompanyId) {
      // Check backend user companies
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
            if (Array.isArray(companies)) {
              const matched = companies.find((c: any) => c.id === cookieCompanyId);
              if (matched) company = matched;
            }
          }
        } catch {
          // Ignore
        }

      // Check direct backend company by ID
      if (!company) {
        try {
          const resById = await fetch(
            `${BACKEND_URL}/v3/company/${encodeURIComponent(cookieCompanyId)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              cache: "no-store",
            }
          );
          if (resById.ok) {
            const byIdData = await resById.json();
            if (byIdData && byIdData.id) {
              company = byIdData;
            }
          }
        } catch {
          // Ignore
        }
      }
    }

    // 2. If no specific company was requested or found, try default GET /v3/company/me
    if (!company) {
      try {
        const resMe = await fetch(`${BACKEND_URL}/v3/company/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (resMe.ok) {
          const data = await resMe.json();
          if (data && data.id) {
            company = data;
          }
        }
      } catch {
        // Fall through
      }
    }

    // 3. Fallback to first available company in user companies if still not found
    if (!company) {
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
            company = companies[0];
          }
        }
      } catch {
        // Fall through
      }
    }

    // 4. Fallback to /v3/company/{company_id} if cookie exists
    if (!company && cookieCompanyId) {
      try {
        const resById = await fetch(
          `${BACKEND_URL}/v3/company/${encodeURIComponent(cookieCompanyId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        if (resById.ok) {
          company = await resById.json();
        }
      } catch {
        // Ignore
      }
    }

    if (!company) {
      return NextResponse.json(
        { detail: "No company found for current user" },
        { status: 404 }
      );
    }

    // Ensure company_id cookie is saved for subsequent requests
    if (company.id) {
      cookieStore.set("company_id", company.id, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return NextResponse.json(company);
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to fetch company profile" },
      { status: 500 }
    );
  }
}
