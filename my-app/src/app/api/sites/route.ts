import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/rate-limit";
import { siteShareSchema } from "@/lib/validations/site";
import {
  getSiteShares,
  getSiteShareCategories,
  createSiteShare,
  updateSiteShare,
  deleteSiteShare,
} from "@/lib/db/site";

export async function GET(request: NextRequest) {
  const limitResponse = rateLimitResponse(request, { maxRequests: 60 });
  if (limitResponse) return limitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "categories") {
      const categories = await getSiteShareCategories();
      return NextResponse.json(categories);
    }

    const category = searchParams.get("category") || undefined;
    const sites = await getSiteShares(category);
    return NextResponse.json(sites);
  } catch (error) {
    console.error("Get sites error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const limitResponse = rateLimitResponse(request, { maxRequests: 30 });
  if (limitResponse) return limitResponse;

  const adminCheck = await requireAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const body = await request.json();
    const result = siteShareSchema.safeParse(body);

    if (!result.success) {
      const issues = result.error.issues;
      return NextResponse.json(
        { error: "Validation failed", message: issues[0]?.message || "验证失败" },
        { status: 400 }
      );
    }

    const site = await createSiteShare(result.data);
    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    console.error("Create site error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const limitResponse = rateLimitResponse(request, { maxRequests: 30 });
  if (limitResponse) return limitResponse;

  const adminCheck = await requireAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { id, ...data } = await request.json();
    const result = siteShareSchema.partial().safeParse(data);

    if (!result.success) {
      const issues = result.error.issues;
      return NextResponse.json(
        { error: "Validation failed", message: issues[0]?.message || "验证失败" },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Site ID is required" },
        { status: 400 }
      );
    }

    const site = await updateSiteShare(id, result.data);
    return NextResponse.json(site);
  } catch (error) {
    console.error("Update site error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const limitResponse = rateLimitResponse(request, { maxRequests: 30 });
  if (limitResponse) return limitResponse;

  const adminCheck = await requireAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Site ID is required" },
        { status: 400 }
      );
    }

    await deleteSiteShare(id);
    return NextResponse.json({ message: "Site deleted successfully" });
  } catch (error) {
    console.error("Delete site error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
