import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
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
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const data = await request.json();

    if (action === "comment") {
      const comment = await addComment({
        ...data,
        ipAddress: request.ip,
        userAgent: request.headers.get("user-agent") || undefined,
      });
      return NextResponse.json(comment, { status: 201 });
    }

    if (action === "like") {
      const like = await addLike(data.diaryId, request.ip || "unknown");
      return NextResponse.json(like, { status: 201 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const diary = await createDiary(data);
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
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...data } = await request.json();
    const diary = await updateDiary(id, data);
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
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
