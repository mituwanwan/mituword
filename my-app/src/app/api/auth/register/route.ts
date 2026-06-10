import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limitResponse = rateLimitResponse(request, { maxRequests: 5, windowMs: 60 * 60 * 1000 });
  if (limitResponse) return limitResponse;
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);
    if (!result.success) {
      const issues = result.error.issues;
      return NextResponse.json(
        errorResponse("Validation failed", issues[0]?.message || "验证失败"),
        { status: 400 }
      );
    }

    const { email, password, name } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        errorResponse("User already exists", "该邮箱已被注册"),
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      successResponse(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        "User created successfully"
      ),
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      errorResponse("Internal server error", "注册失败，请重试"),
      { status: 500 }
    );
  }
}
