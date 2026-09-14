import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/company/switch
 * Sets the active company_id cookie for the user session
 */
export async function POST(request: Request) {
  try {
    const { company_id } = await request.json();

    if (!company_id) {
      return NextResponse.json(
        { detail: "Company ID is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("company_id", String(company_id), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return NextResponse.json({ success: true, company_id });
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || "Failed to switch company" },
      { status: 500 }
    );
  }
}
