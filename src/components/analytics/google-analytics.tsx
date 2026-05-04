import { cookies } from "next/headers";
import Script from "next/script";
import { CONSENT_COOKIE, parseConsent } from "@/lib/cookies/consent";

/**
 * GA4 se vykreslí jen když:
 * - je nastavená env proměnná NEXT_PUBLIC_GA_ID
 * - uživatel udělil analytický souhlas v cookie banneru
 *
 * Bez souhlasu se script vůbec nenahraje — žádné network calls na google-analytics.
 */
export async function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  const store = await cookies();
  const consent = parseConsent(store.get(CONSENT_COOKIE)?.value);
  if (!consent?.analytics) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            anonymize_ip: true,
          });
        `}
      </Script>
    </>
  );
}
