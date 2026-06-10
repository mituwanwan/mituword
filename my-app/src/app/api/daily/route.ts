import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/rate-limit";
import { dailyReportSchema } from "@/lib/validations/daily";
import {
  getDailyReports,
  getDailyReportByDate,
  createDailyReport,
  updateDailyReport,
  deleteDailyReport,
} from "@/lib/db/daily";

export async function GET(request: NextRequest) {
  const limitResponse = rateLimitResponse(request, { maxRequests: 60 });
  if (limitResponse) return limitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "today") {
      const report = await getDailyReportByDate(new Date());
      if (!report) {
        return NextResponse.json(
          { error: "No daily report for today" },
          { status: 404 }
        );
      }
      return NextResponse.json(report);
    }

    const dateStr = searchParams.get("date");
    const options: { status?: string; limit?: number; date?: Date } = {
      status: searchParams.get("status") || "PUBLISHED",
    };

    if (searchParams.has("limit")) {
      options.limit = parseInt(searchParams.get("limit")!, 10);
    }

    if (dateStr) {
      options.date = new Date(dateStr);
    }

    const reports = await getDailyReports(options);
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Get daily reports error:", error);
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
    const result = dailyReportSchema.safeParse(body);

    if (!result.success) {
      const issues = result.error.issues;
      return NextResponse.json(
        { error: "Validation failed", message: issues[0]?.message || "验证失败" },
        { status: 400 }
      );
    }

    const report = await createDailyReport({
      ...result.data,
      date: new Date(result.data.date),
      musicId: result.data.musicId || undefined,
      siteId: result.data.siteId || undefined,
      diaryId: result.data.diaryId || undefined,
    });
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Create daily report error:", error);
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
    const result = dailyReportSchema.partial().safeParse(data);

    if (!result.success) {
      const issues = result.error.issues;
      return NextResponse.json(
        { error: "Validation failed", message: issues[0]?.message || "验证失败" },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Daily report ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = { ...result.data };
    if (result.data.date) {
      updateData.date = new Date(result.data.date);
    }
    if (result.data.musicId === "") updateData.musicId = undefined;
    if (result.data.siteId === "") updateData.siteId = undefined;
    if (result.data.diaryId === "") updateData.diaryId = undefined;

    const report = await updateDailyReport(id, updateData);
    return NextResponse.json(report);
  } catch (error) {
    console.error("Update daily report error:", error);
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
        { error: "Daily report ID is required" },
        { status: 400 }
      );
    }

    await deleteDailyReport(id);
    return NextResponse.json({ message: "Daily report deleted successfully" });
  } catch (error) {
    console.error("Delete daily report error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
