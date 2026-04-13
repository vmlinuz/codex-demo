import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function buildContentSecurityPolicy({
  allowUpgradeInsecureRequests,
  nonce,
}: Readonly<{
  allowUpgradeInsecureRequests: boolean;
  nonce: string;
}>) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const upgradeInsecureRequestsDirective =
    !isDevelopment && allowUpgradeInsecureRequests ? "upgrade-insecure-requests;" : "";

  return `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ""};
    style-src 'self' ${isDevelopment ? "'unsafe-inline'" : `'nonce-${nonce}'`};
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${upgradeInsecureRequestsDirective}
  `
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const contentSecurityPolicy = buildContentSecurityPolicy({
    allowUpgradeInsecureRequests: request.nextUrl.protocol === "https:",
    nonce,
  });
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", contentSecurityPolicy);

  return response;
}

export const config = {
  matcher: [
    {
      missing: [
        { key: "next-router-prefetch", type: "header" },
        { key: "purpose", type: "header", value: "prefetch" },
      ],
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
    },
  ],
};
