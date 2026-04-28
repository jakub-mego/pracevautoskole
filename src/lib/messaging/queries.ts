import "server-only";
import { and, asc, desc, eq, isNull, or, sql, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  conversations,
  messages,
  profiles,
  professionalProfiles,
  listings,
} from "../../../drizzle/schema";

type ProfileRow = typeof profiles.$inferSelect;

export type ConversationListItem = {
  conversation: typeof conversations.$inferSelect;
  counterpart: ProfileRow;
  counterpartAnonymousVisible: boolean;
  lastMessageBody: string | null;
  lastMessageAuthorIsViewer: boolean;
  unread: boolean;
  listingTitle: string | null;
};

/**
 * Vrací konverzace, kde je profil účastníkem. Pro každou konverzaci poslední
 * zprávu, jméno protistrany a indikátor přečtení. Anonymita: pokud je profil
 * inicátor anonymní a neodhalený, pro NĚHO přicházející konverzaci ukáže "Anonym",
 * jenže anonymita se týká profesionála vůči zaměstnavateli, ne naopak.
 */
export async function listConversationsForProfile(
  profileId: string,
): Promise<ConversationListItem[]> {
  const rows = await db
    .select({
      conversation: conversations,
      counterpart: profiles,
      counterpartAnonymous: professionalProfiles.anonymous,
      listingTitle: listings.title,
    })
    .from(conversations)
    .innerJoin(
      profiles,
      sql`${profiles.id} = CASE WHEN ${conversations.initiatorProfileId} = ${profileId} THEN ${conversations.recipientProfileId} ELSE ${conversations.initiatorProfileId} END`,
    )
    .leftJoin(
      professionalProfiles,
      eq(professionalProfiles.profileId, profiles.id),
    )
    .leftJoin(listings, eq(listings.id, conversations.listingId))
    .where(
      or(
        eq(conversations.initiatorProfileId, profileId),
        eq(conversations.recipientProfileId, profileId),
      ),
    )
    .orderBy(desc(conversations.lastMessageAt));

  if (rows.length === 0) return [];
  const conversationIds = rows.map((r) => r.conversation.id);

  const lastMessages = await db
    .select({
      conversationId: messages.conversationId,
      body: messages.body,
      authorProfileId: messages.authorProfileId,
      readByRecipientAt: messages.readByRecipientAt,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(sql`${messages.conversationId} IN (${sql.join(conversationIds.map((id) => sql`${id}`), sql`, `)})`)
    .orderBy(asc(messages.createdAt));

  const lastByConv = new Map<string, typeof lastMessages[number]>();
  const unreadByConv = new Map<string, boolean>();
  for (const m of lastMessages) {
    lastByConv.set(m.conversationId, m);
    // unread = poslední zpráva NE od viewera, bez read_at
    const isFromViewer = m.authorProfileId === profileId;
    if (!isFromViewer && !m.readByRecipientAt) {
      unreadByConv.set(m.conversationId, true);
    } else {
      unreadByConv.set(m.conversationId, false);
    }
  }

  return rows.map((r) => {
    const lastMsg = lastByConv.get(r.conversation.id);
    const isAnonymous =
      r.counterpartAnonymous === true &&
      !r.conversation.anonymityLifted &&
      // anonymita aplikuje jen pokud je profesionál ten anonymní A
      // viewer NENÍ ten anonymní profesionál (sám sebe vidí vždy plně)
      r.counterpart.id !== profileId;
    return {
      conversation: r.conversation,
      counterpart: r.counterpart,
      counterpartAnonymousVisible: isAnonymous,
      lastMessageBody: lastMsg?.body ?? null,
      lastMessageAuthorIsViewer: lastMsg?.authorProfileId === profileId,
      unread: unreadByConv.get(r.conversation.id) ?? false,
      listingTitle: r.listingTitle,
    };
  });
}

export type ThreadMessage = typeof messages.$inferSelect & {
  authorIsViewer: boolean;
};

export async function getThread(
  conversationId: string,
  viewerProfileId: string,
) {
  const conv = (
    await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1)
  )[0];
  if (!conv) return null;
  if (
    conv.initiatorProfileId !== viewerProfileId &&
    conv.recipientProfileId !== viewerProfileId
  ) {
    return null;
  }

  const counterpartId =
    conv.initiatorProfileId === viewerProfileId
      ? conv.recipientProfileId
      : conv.initiatorProfileId;

  const counterpartRows = await db
    .select({
      profile: profiles,
      anonymous: professionalProfiles.anonymous,
    })
    .from(profiles)
    .leftJoin(
      professionalProfiles,
      eq(professionalProfiles.profileId, profiles.id),
    )
    .where(eq(profiles.id, counterpartId))
    .limit(1);
  const counterpart = counterpartRows[0];
  if (!counterpart) return null;

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));

  const listingRows = conv.listingId
    ? await db
        .select({ id: listings.id, title: listings.title, status: listings.status })
        .from(listings)
        .where(eq(listings.id, conv.listingId))
        .limit(1)
    : [];

  return {
    conversation: conv,
    counterpartProfile: counterpart.profile,
    counterpartAnonymousVisible:
      counterpart.anonymous === true && !conv.anonymityLifted,
    listing: listingRows[0] ?? null,
    messages: msgs.map((m) => ({
      ...m,
      authorIsViewer: m.authorProfileId === viewerProfileId,
    })),
  };
}

export async function countUnreadForProfile(
  profileId: string,
): Promise<number> {
  const rows = await db
    .select({
      conversationId: messages.conversationId,
    })
    .from(messages)
    .innerJoin(
      conversations,
      eq(conversations.id, messages.conversationId),
    )
    .where(
      and(
        ne(messages.authorProfileId, profileId),
        isNull(messages.readByRecipientAt),
        or(
          eq(conversations.initiatorProfileId, profileId),
          eq(conversations.recipientProfileId, profileId),
        ),
      ),
    );
  const unique = new Set(rows.map((r) => r.conversationId));
  return unique.size;
}
