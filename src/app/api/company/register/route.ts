import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * POST /api/company/register
 * Calls FastAPI backend: POST /v3/company
 * Registers a new company directly in the database for the current authenticated user.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();

    const companyName = (body.company_name || body.name || "").trim();
    if (!companyName) {
      return NextResponse.json(
        { detail: "Company Name is required" },
        { status: 400 }
      );
    }

    const payload = {
      name: companyName,
      company_name: companyName,
      legal_name: (body.legal_name || companyName).trim(),
      country: body.country || "US",
      currency: body.currency || "USD",
      plan: body.plan || "Simple Start",
      phone: body.phone ? String(body.phone).trim() : null,
      email: body.email ? String(body.email).trim() : null,
      website: body.website ? String(body.website).trim() : null,
      tax_id: body.tax_id ? String(body.tax_id).trim() : null,
      fiscal_year_start_month: body.fiscal_year_start_month || "January",
      line1: body.line1 ? String(body.line1).trim() : null,
      city: body.city ? String(body.city).trim() : null,
      state: body.state ? String(body.state).trim() : null,
      postal_code: body.postal_code ? String(body.postal_code).trim() : null,
    };

    const res = await fetch(`${BACKEND_URL}/v3/company`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { detail: data.detail || "Failed to register company in database" },
        { status: res.status }
      );
    }

    // Set the newly created database company as active company in cookie
    if (data && data.id) {
      cookieStore.set("company_id", String(data.id), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to register company in database" },
      { status: 500 }
    );
  }
}

