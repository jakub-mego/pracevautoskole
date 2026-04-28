import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/server";
import { getProfileByUserId } from "@/lib/profiles/queries";
import { getThread } from "@/lib/messaging/queries";
import { MessageComposer } from "@/components/messaging/message-composer";
import { MarkReadOnMount } from "@/components/messaging/mark-read-on-mount";

export const metadata = {
  title: "Rozhovor",
};

export const dynamic = "force-dynamic";

export default async function ConversationThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);
  if (!profile) redirect("/onboarding");

  const thread = await getThread(id, profile.id);
  if (!thread) notFound();

  const counterpartName = thread.counterpartAnonymousVisible
    ? "Anonymní profesionál"
    : thread.counterpartProfile.displayName;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-8">
      <MarkReadOnMount conversationId={thread.conversation.id} />

      <Link
        href="/zpravy"
        className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
      >
        ← Zpět na zprávy
      </Link>

      <header className="mt-3 border-b border-[var(--color-line)] pb-4">
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">Rozhovor s</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
          {thread.counterpartAnonymousVisible ? (
            counterpartName
          ) : (
            <Link
              href={`/p/${thread.counterpartProfile.slug}`}
              className="hover:underline"
            >
              {counterpartName}
            </Link>
          )}
        </h1>
        {thread.listing ? (
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            K inzerátu:{" "}
            <Link
              href={`/inzeraty/${thread.listing.id}`}
              className="font-medium text-[var(--color-ink-muted)] underline hover:text-[var(--color-ink)]"
            >
              {thread.listing.title}
            </Link>
            {thread.listing.status !== "active" ? (
              <span className="ml-2 text-xs text-[var(--color-ink-soft)]">
                (inzerát už není aktivní)
              </span>
            ) : null}
          </p>
        ) : null}
      </header>

      <ol className="my-6 flex flex-1 flex-col gap-3">
        {thread.messages.map((m) => (
          <li
            key={m.id}
            className={
              "max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap " +
              (m.authorIsViewer
                ? "self-end bg-[var(--color-ink)] text-white"
                : "self-start bg-[var(--color-canvas-muted)] text-[var(--color-ink)]")
            }
          >
            <p>{m.body}</p>
            <p
              className={
                "mt-1 text-xs " +
                (m.authorIsViewer ? "text-[var(--color-line-strong)]" : "text-[var(--color-ink-soft)]")
              }
            >
              {new Date(m.createdAt).toLocaleString("cs-CZ", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          </li>
        ))}
      </ol>

      <div className="sticky bottom-0 -mx-6 border-t border-[var(--color-line)] bg-[var(--color-paper)] px-6 py-4">
        <MessageComposer conversationId={thread.conversation.id} />
      </div>
    </main>
  );
}
