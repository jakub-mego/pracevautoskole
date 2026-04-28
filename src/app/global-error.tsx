"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="cs">
      <body
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "#fafafa",
          color: "#18181b",
          margin: 0,
          padding: "5rem 1.5rem",
        }}
      >
        <main style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: 14, color: "#dc2626", fontWeight: 600 }}>
            Kritická chyba
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 600, marginTop: 8 }}>
            Aplikace spadla.
          </h1>
          <p style={{ marginTop: 12, color: "#52525b" }}>
            Tahle chyba je tak zásadní, že nemůžeme zobrazit ani normální
            chybovou stránku. Zkus načíst znovu.
          </p>
          {error.digest ? (
            <p style={{ marginTop: 8, fontSize: 12, color: "#a1a1aa" }}>
              Ref: <code>{error.digest}</code>
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 32,
              background: "#18181b",
              color: "#fff",
              border: 0,
              padding: "10px 20px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Zkusit znovu
          </button>
        </main>
      </body>
    </html>
  );
}
