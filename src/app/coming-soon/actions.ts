"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type FormActionState = { error?: string } | undefined;

const PREVIEW_COOKIE = "pva_preview";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 dní

function safeRedirectTarget(raw: string | null): string {
  if (!raw) return "/";
  if (!raw.startsWith("/")) return "/";
  if (raw.startsWith("//")) return "/";
  if (raw.startsWith("/coming-soon")) return "/";
  return raw;
}

export async function unlockComingSoonAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const expected = process.env.COMING_SOON_PASSWORD;
  if (!expected) {
    // Gate je vypnutý — neměl by se volat, ale pro jistotu propustíme.
    redirect("/");
  }

  const submitted = String(formData.get("password") ?? "").trim();
  if (submitted !== expected) {
    return { error: "Heslo nesedí. Zkus to znovu." };
  }

  const from = safeRedirectTarget(String(formData.get("from") ?? "/"));

  const cookieStore = await cookies();
  cookieStore.set(PREVIEW_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });

  redirect(from);
}
