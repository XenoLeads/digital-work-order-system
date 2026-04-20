import withAuth, { NextRequestWithAuth } from "next-auth/middleware";
import type { NextRequest, NextFetchEvent } from "next/server";

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  return withAuth(request as unknown as NextRequestWithAuth, event);
}

export const config = {
  matcher: ["/admin/:path*"],
};