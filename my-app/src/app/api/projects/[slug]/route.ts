import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug, incrementProjectViews } from "@/lib/db/project";
import { successResponse, errorResponse } from "@/lib/utils/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        errorResponse("Invalid request", "项目标识不能为空"),
        { status: 400 }
      );
    }

    const project = await getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json(
        errorResponse("Project not found", "项目不存在"),
        { status: 404 }
      );
    }

    await incrementProjectViews(project.id);

    return NextResponse.json(successResponse(project));
  } catch (error) {
    console.error("Get project detail error:", error);
    return NextResponse.json(
      errorResponse("Internal server error", "获取项目详情失败"),
      { status: 500 }
    );
  }
}
