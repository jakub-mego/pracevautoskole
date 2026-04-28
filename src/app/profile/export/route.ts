import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/server";
import { getFullProfileByUserId } from "@/lib/profiles/queries";
import {
  listings,
  listingRoles,
  listingLicenses,
} from "../../../../drizzle/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireSession();
  const profileData = await getFullProfileByUserId(session.user.id);

  let listingsExport: unknown[] = [];
  if (profileData) {
    const myListings = await db
      .select()
      .from(listings)
      .where(eq(listings.profileId, profileData.profile.id));
    listingsExport = await Promise.all(
      myListings.map(async (l) => {
        const [roles, lic] = await Promise.all([
          db
            .select({ role: listingRoles.role })
            .from(listingRoles)
            .where(eq(listingRoles.listingId, l.id)),
          db
            .select({ category: listingLicenses.category })
            .from(listingLicenses)
            .where(eq(listingLicenses.listingId, l.id)),
        ]);
        return {
          ...l,
          roles: roles.map((r) => r.role),
          licenses: lic.map((x) => x.category),
        };
      }),
    );
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      emailVerified: session.user.emailVerified,
      createdAt: session.user.createdAt,
    },
    profile: profileData,
    listings: listingsExport,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="pracevautoskole-export-${session.user.id}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
