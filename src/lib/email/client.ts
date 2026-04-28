import "server-only";
import { Resend } from "resend";

let cached: Resend | null = null;
function client() {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

const FROM =
  process.env.EMAIL_FROM ?? "Práce v autoškole <noreply@pracevautoskole.cz>";

export async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const resend = client();
  if (!resend) {
    console.log("[email:dev]", {
      from: FROM,
      to: args.to,
      subject: args.subject,
      text: args.text,
    });
    return { ok: true as const, dev: true as const };
  }
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
  });
  if (error) {
    console.error("[email] resend error", error);
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const, id: data?.id };
}
