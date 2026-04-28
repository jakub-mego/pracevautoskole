import Link from "next/link";
import { listAllReports } from "@/lib/admin/queries";
import {
  REPORT_REASON_LABELS,
  REPORT_STATUS_LABELS,
} from "@/lib/reports/labels";
import { AdminReportRowActions } from "@/components/admin/admin-report-row-actions";

const STATUS_STYLES: Record<string, string> = {
  open: "bg-amber-100 text-amber-800",
  resolved: "bg-[var(--color-brand-100)] text-emerald-800",
  dismissed: "bg-[var(--color-line)] text-[var(--color-ink-muted)]",
};

export default async function AdminReportsPage() {
  const rows = await listAllReports();
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
        Reporty ({rows.length})
      </h1>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
        Otevřené reporty řeš nejdřív. Vyřešení = obsah byl skutečně závadný a
        zařídil ses (archivuj/smaž). Zamítnutí = report byl neopodstatněný.
      </p>

      {rows.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-[var(--color-line-strong)] bg-[var(--color-paper)] p-8 text-center text-[var(--color-ink-muted)]">
          Žádné reporty.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)]">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--color-line)] text-left text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
              <tr>
                <th className="px-4 py-3">Cíl</th>
                <th className="px-4 py-3">Důvod</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Reporter</th>
                <th className="px-4 py-3">Vytvořeno</th>
                <th className="px-4 py-3">Akce</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ report, reporterEmail }) => {
                const targetHref =
                  report.targetType === "listing"
                    ? `/inzeraty/${report.targetId}`
                    : null;
                return (
                  <tr
                    key={report.id}
                    className="border-b border-zinc-100 align-top last:border-0"
                  >
                    <td className="px-4 py-2">
                      <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
                        {report.targetType}
                      </p>
                      {targetHref ? (
                        <Link
                          href={targetHref}
                          className="font-mono text-xs text-[var(--color-ink)] hover:underline"
                        >
                          {report.targetId}
                        </Link>
                      ) : (
                        <span className="font-mono text-xs">
                          {report.targetId}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <p>
                        {
                          REPORT_REASON_LABELS[
                            report.reason as keyof typeof REPORT_REASON_LABELS
                          ]
                        }
                      </p>
                      {report.note ? (
                        <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                          „{report.note}"
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                          STATUS_STYLES[report.status]
                        }`}
                      >
                        {
                          REPORT_STATUS_LABELS[
                            report.status as keyof typeof REPORT_STATUS_LABELS
                          ]
                        }
                      </span>
                      {report.resolverNote ? (
                        <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                          {report.resolverNote}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-2 text-xs text-[var(--color-ink-muted)]">
                      {reporterEmail ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-xs text-[var(--color-ink-soft)]">
                      {new Date(report.createdAt).toLocaleString("cs-CZ")}
                    </td>
                    <td className="px-4 py-2">
                      {report.status === "open" ? (
                        <AdminReportRowActions reportId={report.id} />
                      ) : (
                        <span className="text-xs text-[var(--color-ink-soft)]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
