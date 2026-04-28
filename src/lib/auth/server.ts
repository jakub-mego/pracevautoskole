import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "./index";
import { db } from "@/lib/db";
import { users } from "../../../drizzle/schema";

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
}

export const getCurrentUserRole = cache(async () => {
  const session = await getSession();
  if (!session) return null;
  const rows = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  return rows[0]?.role ?? null;
});

export async function requireAdmin() {
  const session = await requireSession();
  const role = await getCurrentUserRole();
  if (role !== "admin") notFound();
  return session;
}
