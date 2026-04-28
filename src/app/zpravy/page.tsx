import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { listConversationsForProfile } from "@/lib/messaging/queries";

export const metadata = {
  title: "Zprávy",
};

export const dynamic = "force-dynamic";

export default async function ConversationsListPage() {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/onboarding");

  const items = await listConversationsForProfile(profile.id);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="display-md text-2xl text-[var(--color-ink)] sm:text-3xl">
        Zprávy
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">
        Tvoje rozhovory s autoškolami a profesionály.
      </p>

      {items.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-[var(--color-line-strong)] bg-[var(--color-paper)] p-6 text-sm text-[var(--color-ink-muted)]">
          Zatím nemáš žádný rozhovor. Zkus napsat z některého inzerátu nebo profilu.
          {" "}
          <Link href="/inzeraty" className="font-medium text-[var(--color-ink)] underline">
            Procházet inzeráty
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {items.map((item) => {
            const counterpartName = item.counterpartAnonymousVisible
              ? "Anonymní profesionál"
              : item.counterpart.displayName;
            const preview = item.lastMessageBody
              ? (item.lastMessageAuthorIsViewer ? "Ty: " : "") +
                (item.lastMessageBody.length > 120
                  ? item.lastMessageBody.slice(0, 120) + "…"
                  : item.lastMessageBody)
              : "Bez zpráv";
            return (
              <li
                key={item.conversation.id}
                className={
                  "rounded-xl border bg-[var(--color-paper)] p-4 transition hover:border-[var(--color-brand-700)] " +
                  (item.unread ? "border-zinc-900" : "border-[var(--color-line)]")
                }
              >
                <Link
                  href={`/zpravy/${item.conversation.id}`}
                  className="flex flex-col gap-1"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-[var(--color-ink)]">
                      {counterpartName}
                      {item.unread ? (
                        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[var(--color-brand-500)] align-middle" />
                      ) : null}
                    </p>
                    {item.conversation.lastMessageAt ? (
                      <span className="text-xs text-[var(--color-ink-soft)]">
                        {new Date(item.conversation.lastMessageAt).toLocaleString(
                          "cs-CZ",
                          { dateStyle: "short", timeStyle: "short" },
                        )}
                      </span>
                    ) : null}
                  </div>
                  {item.listingTitle ? (
                    <p className="text-xs text-[var(--color-ink-soft)]">
                      K inzerátu: {item.listingTitle}
                    </p>
                  ) : null}
                  <p className="line-clamp-1 text-sm text-[var(--color-ink-muted)]">{preview}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
