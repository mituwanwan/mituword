import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/rate-limit";
import { projectSchema } from "@/lib/validations/project";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/db/project";

export async function GET(request: NextRequest) {
  const limitResponse = rateLimitResponse(request, { maxRequests: 60 });
  if (limitResponse) return limitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const options = {
      category: searchParams.get("category") || undefined,
      tag: searchParams.get("tag") || undefined,
      status: searchParams.get("status") || undefined,
      featured: searchParams.has("featured")
        ? searchParams.get("featured") === "true"
        : undefined,
      search: searchParams.get("search") || undefined,
    };

    const projects = await getProjects(options);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
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
    const result = projectSchema.safeParse(body);

    if (!result.success) {
      const issues = result.error.issues;
      return NextResponse.json(
        { error: "Validation failed", message: issues[0]?.message || "验证失败" },
        { status: 400 }
      );
    }

    const projectData = {
      ...result.data,
      startDate: result.data.startDate ? new Date(result.data.startDate) : undefined,
      endDate: result.data.endDate ? new Date(result.data.endDate) : undefined,
    };

    const project = await createProject(projectData);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
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
    const result = projectSchema.partial().safeParse(data);

    if (!result.success) {
      const issues = result.error.issues;
      return NextResponse.json(
        { error: "Validation failed", message: issues[0]?.message || "验证失败" },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = { ...result.data };
    if (result.data.startDate) updateData.startDate = new Date(result.data.startDate);
    if (result.data.endDate) updateData.endDate = new Date(result.data.endDate);

    const project = await updateProject(id, updateData);
    return NextResponse.json(project);
  } catch (error) {
    console.error("Update project error:", error);
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
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    await deleteProject(id);
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
