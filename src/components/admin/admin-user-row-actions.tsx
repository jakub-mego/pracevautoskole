"use client";

import { useTransition } from "react";
import {
  adminDeleteUserAction,
  adminPromoteToAdminAction,
  adminDemoteUserAction,
} from "@/app/admin/actions";

export function AdminUserRowActions({
  userId,
  role,
}: {
  userId: string;
  role: string;
}) {
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-wrap gap-1.5">
      {role === "admin" ? (
        <button
          type="button"
          onClick={() => start(() => adminDemoteUserAction(userId).then(() => {}))}
          disabled={pending}
          className="rounded border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-2 py-0.5 text-xs hover:bg-[var(--color-canvas-muted)]"
        >
          Demote
        </button>
      ) : (
        <button
          type="button"
          onClick={() => start(() => adminPromoteToAdminAction(userId))}
          disabled={pending}
          className="rounded border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-2 py-0.5 text-xs hover:bg-[var(--color-canvas-muted)]"
        >
          Promote → admin
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          if (
            confirm(
              "Smazat uživatele? Smaže profil, inzeráty a sessiony. Platební záznamy zůstanou (anonymizované).",
            )
          ) {
            start(() => adminDeleteUserAction(userId).then(() => {}));
          }
        }}
        disabled={pending}
        className="rounded border border-red-300 bg-[var(--color-paper)] px-2 py-0.5 text-xs text-red-700 hover:bg-red-50"
      >
        Smazat
      </button>
    </div>
  );
}
