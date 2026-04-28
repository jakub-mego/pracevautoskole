import { ImageResponse } from "next/og";

export const alt = "Práce v autoškole — tržiště pro autoškoly a profesionály oboru";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#18181b",
          color: "#fafafa",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#a1a1aa",
            fontSize: 22,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#fafafa",
              color: "#18181b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 26,
            }}
          >
            PA
          </div>
          pracevautoskole.cz
        </div>

        <div
          style={{
            marginTop: "auto",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            display: "flex",
          }}
        >
          Práce v autoškole.
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            color: "#d4d4d8",
            lineHeight: 1.3,
            display: "flex",
            maxWidth: 900,
          }}
        >
          Tržiště pro autoškoly a profesionály oboru — instruktoři, examinátoři,
          mistři, lektoři.
        </div>
      </div>
    ),
    { ...size },
  );
}
