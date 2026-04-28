import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/client";
import {
  verificationEmail,
  resetPasswordEmail,
} from "@/lib/email/templates";

export const auth = betterAuth({
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
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
  secret: process.env.BETTER_AUTH_SECRET,
});

export type Session = typeof auth.$Infer.Session;
