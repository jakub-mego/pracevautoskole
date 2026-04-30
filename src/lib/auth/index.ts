import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/client";
import {
  verificationEmail,
  resetPasswordEmail,
} from "@/lib/email/templates";

const baseURL =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

function buildTrustedOrigins(): string[] {
  const origins = new Set<string>();
  for (const raw of [baseURL, process.env.NEXT_PUBLIC_APP_URL]) {
    if (!raw) continue;
    try {
      const u = new URL(raw);
      origins.add(u.origin);
      if (u.hostname === "localhost") {
        origins.add(`${u.protocol}//127.0.0.1${u.port ? `:${u.port}` : ""}`);
      } else if (u.hostname === "127.0.0.1") {
        origins.add(`${u.protocol}//localhost${u.port ? `:${u.port}` : ""}`);
      }
    } catch {}
  }
  const extra = process.env.BETTER_AUTH_TRUSTED_ORIGINS;
  if (extra) {
    for (const item of extra.split(",").map((s) => s.trim()).filter(Boolean)) {
      origins.add(item);
    }
  }
  return [...origins];
}

export const auth = betterAuth({
  baseURL,
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 10,
    sendResetPassword: async ({ user, url }) => {
      const tpl = resetPasswordEmail({ name: user.name ?? null, url });
      await sendEmail({ to: user.email, ...tpl });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const tpl = verificationEmail({ name: user.name ?? null, url });
      await sendEmail({ to: user.email, ...tpl });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: buildTrustedOrigins(),
  secret: process.env.BETTER_AUTH_SECRET,
});

export type Session = typeof auth.$Infer.Session;
