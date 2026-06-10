import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // 已登录用户检查角色权限
    if (req.nextauth.token?.role !== "ADMIN") {
      return new NextResponse("Forbidden: Admin access required", { status: 403 });
    }
  },
  {
    callbacks: {
      authorized({ token }) {
        // 未登录用户将被重定向到登录页
        return token !== null;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
