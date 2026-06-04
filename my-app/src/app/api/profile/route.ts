import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getProfile, createProfile, updateProfile } from "@/lib/db/profile";
import { profileSchema } from "@/lib/validations/profile";
import { successResponse, errorResponse } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json(
        errorResponse("Profile not found", "个人资料不存在"),
        { status: 404 }
      );
    }
    return NextResponse.json(successResponse(profile));
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      errorResponse("Internal server error", "获取个人资料失败"),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        errorResponse("Unauthorized", "请先登录"),
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      const issues = result.error.issues;
      return NextResponse.json(
        errorResponse("Validation failed", issues[0]?.message || "验证失败"),
        { status: 400 }
      );
    }

    const profile = await createProfile({
      ...result.data,
      userId: session.user.id,
    });

    return NextResponse.json(successResponse(profile, "创建成功"), {
      status: 201,
    });
  } catch (error) {
    console.error("Create profile error:", error);
    return NextResponse.json(
      errorResponse("Internal server error", "创建个人资料失败"),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        errorResponse("Unauthorized", "请先登录"),
        { status: 401 }
      );
    }

    const { id, ...data } = await request.json();
    const result = profileSchema.partial().safeParse(data);

    if (!result.success) {
      const issues = result.error.issues;
      return NextResponse.json(
        errorResponse("Validation failed", issues[0]?.message || "验证失败"),
        { status: 400 }
      );
    }

    const profile = await updateProfile(id, result.data);
    return NextResponse.json(successResponse(profile, "更新成功"));
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      errorResponse("Internal server error", "更新个人资料失败"),
      { status: 500 }
    );
  }
}
