import { NextResponse, type NextRequest } from "next/server";

const PREVIEW_COOKIE = "pva_preview";

const BYPASS_PREFIXES = [
  "/coming-soon",
  "/_next",
  "/favicon.ico",
  "/icon.svg",
  "/robots.txt",
  "/opengraph-image",
  "/og-default",
];

function shouldBypass(pathname: string): boolean {
  for (const prefix of BYPASS_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) return true;
    if (prefix === "/opengraph-image" && pathname.startsWith(prefix)) return true;
  }
  // Statické soubory dle přípony
  if (/\.(png|jpe?g|gif|webp|avif|svg|ico|css|js|map|txt|xml|woff2?|ttf)$/i.test(pathname)) {
    return true;
  }
  return false;
}

export function proxy(request: NextRequest) {
  // Pokud není heslo nastavené, gate je vypnutý.
  if (!process.env.COMING_SOON_PASSWORD) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  const unlocked = request.cookies.get(PREVIEW_COOKIE)?.value === "1";
  if (unlocked) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/coming-soon";
  url.search = "";
  if (pathname !== "/" && pathname !== "/coming-soon") {
    url.searchParams.set("from", pathname + search);
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
