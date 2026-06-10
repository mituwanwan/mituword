import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/rate-limit";
import { diarySchema, commentSchema } from "@/lib/validations/diary";
import {
  getDiaries,
  getDiaryBySlug,
  createDiary,
  updateDiary,
  deleteDiary,
  incrementDiaryViews,
  addComment,
  addLike,
} from "@/lib/db/diary";

export async function GET(request: NextRequest) {
  const limitResponse = rateLimitResponse(request, { maxRequests: 60 });
  if (limitResponse) return limitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const action = searchParams.get("action");

    if (slug) {
      const diary = await getDiaryBySlug(slug);
      if (!diary) {
        return NextResponse.json(
          { error: "Diary not found" },
          { status: 404 }
        );
      }

      if (action === "increment-view") {
        await incrementDiaryViews(diary.id);
      }

      return NextResponse.json(diary);
    }

    const options = {
      category: searchParams.get("category") || undefined,
      tag: searchParams.get("tag") || undefined,
      status: searchParams.get("status") || "PUBLISHED",
      search: searchParams.get("search") || undefined,
      pinned: searchParams.has("pinned")
        ? searchParams.get("pinned") === "true"
        : undefined,
      limit: searchParams.has("limit")
        ? parseInt(searchParams.get("limit")!, 10)
        : undefined,
    };

    const diaries = await getDiaries(options);
    return NextResponse.json(diaries);
  } catch (error) {
    console.error("Get diaries error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "comment" || action === "like") {
    const limitResponse = rateLimitResponse(request, { maxRequests: 10, identifier: "diary-interaction" });
    if (limitResponse) return limitResponse;
  } else {
    const limitResponse = rateLimitResponse(request, { maxRequests: 30 });
    if (limitResponse) return limitResponse;
  }

  try {
    const data = await request.json();

    if (action === "comment") {
      const result = commentSchema.safeParse(data);
      if (!result.success) {
        const issues = result.error.issues;
        return NextResponse.json(
          { error: "Validation failed", message: issues[0]?.message || "验证失败" },
          { status: 400 }
        );
      }
      const comment = await addComment({
        ...result.data,
        ipAddress: request.ip,
        userAgent: request.headers.get("user-agent") || undefined,
      });
      return NextResponse.json(comment, { status: 201 });
    }

    if (action === "like") {
      if (!data.diaryId) {
        return NextResponse.json(
          { error: "Diary ID is required" },
          { status: 400 }
        );
      }
      const like = await addLike(data.diaryId, request.ip || "unknown");
      return NextResponse.json(like, { status: 201 });
    }

    const adminCheck = await requireAdmin(request);
    if (adminCheck) return adminCheck;

    const result = diarySchema.safeParse(data);
    if (!result.success) {
      const issues = result.error.issues;
      return NextResponse.json(
        { error: "Validation failed", message: issues[0]?.message || "验证失败" },
        { status: 400 }
      );
    }

    const diaryData = {
      ...result.data,
      publishedAt: result.data.publishedAt ? new Date(result.data.publishedAt) : undefined,
    };

    const diary = await createDiary(diaryData);
    return NextResponse.json(diary, { status: 201 });
  } catch (error) {
    console.error("Create diary error:", error);
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
    const result = diarySchema.partial().safeParse(data);

    if (!result.success) {
      const issues = result.error.issues;
      return NextResponse.json(
        { error: "Validation failed", message: issues[0]?.message || "验证失败" },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Diary ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = { ...result.data };
    if (result.data.publishedAt) {
      updateData.publishedAt = new Date(result.data.publishedAt);
    }

    const diary = await updateDiary(id, updateData);
    return NextResponse.json(diary);
  } catch (error) {
    console.error("Update diary error:", error);
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
        { error: "Diary ID is required" },
        { status: 400 }
      );
    }

    await deleteDiary(id);
    return NextResponse.json({ message: "Diary deleted successfully" });
  } catch (error) {
    console.error("Delete diary error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
