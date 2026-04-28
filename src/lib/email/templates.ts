function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(title: string, body: string) {
  return `<!doctype html>
<html lang="cs"><head><meta charset="utf-8" /><title>${escapeHtml(title)}</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;background:#f4f4f5;padding:24px;color:#18181b">
<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e4e4e7;border-radius:12px;padding:32px">
${body}
<hr style="margin:32px 0;border:none;border-top:1px solid #e4e4e7" />
<p style="font-size:12px;color:#71717a">Práce v autoškole — tržiště pro autoškoly a profesionály oboru.</p>
</div></body></html>`;
}

export function verificationEmail(args: { name: string | null; url: string }) {
  const name = args.name ? escapeHtml(args.name) : "uživateli";
  const subject = "Potvrď svůj e-mail";
  const text = `Ahoj ${name},

děkujeme za registraci na pracevautoskole.cz. Pro potvrzení e-mailu klikni na odkaz:

${args.url}

Pokud jsi se neregistroval/a, tento e-mail ignoruj.`;
  const html = layout(
    subject,
    `<h1 style="font-size:20px;margin:0 0 16px">Potvrď svůj e-mail</h1>
<p>Ahoj ${name},</p>
<p>děkujeme za registraci. Pro potvrzení e-mailu klikni na tlačítko:</p>
<p style="margin:24px 0"><a href="${args.url}" style="display:inline-block;background:#18181b;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:500">Potvrdit e-mail</a></p>
<p style="font-size:12px;color:#52525b">Nebo vlož do prohlížeče: <span style="word-break:break-all">${escapeHtml(args.url)}</span></p>
<p style="font-size:12px;color:#52525b">Pokud jsi se neregistroval/a, tento e-mail ignoruj.</p>`,
  );
  return { subject, html, text };
}

export type PaymentReceiptInput = {
  name: string | null;
  receiptNumber: string;
  paidAt: Date;
  productName: string;
  amountCzk: number;
  paymentMethod: "Karta (Stripe)" | "Bankovní převod (Fio)";
  variableSymbol?: string | null;
  externalId?: string | null;
};

const OPERATOR = {
  name: "Autoškola MeGo, s.r.o.",
  ico: "23497297",
  address: "Palackého třída 924/105, 612 00 Brno",
  registry: "Krajský soud v Brně, oddíl C, vložka 146219",
  email: "info@onlymego.cz",
} as const;

export function paymentReceiptEmail(args: PaymentReceiptInput) {
  const name = args.name ? escapeHtml(args.name) : "";
  const subject = `Doklad o platbě č. ${args.receiptNumber}`;
  const datum = args.paidAt.toLocaleDateString("cs-CZ");
  const text = `Děkujeme za platbu.

Doklad o platbě č. ${args.receiptNumber}
Datum přijetí: ${datum}
Produkt: ${args.productName}
Částka: ${args.amountCzk} Kč
Způsob platby: ${args.paymentMethod}${args.variableSymbol ? `\nVariabilní symbol: ${args.variableSymbol}` : ""}${args.externalId ? `\nReference: ${args.externalId}` : ""}

Příjemce platby:
${OPERATOR.name}
IČO: ${OPERATOR.ico}
${OPERATOR.address}
${OPERATOR.registry}
${OPERATOR.email}

Není plátcem DPH.

Tento doklad slouží jako potvrzení o úhradě digitální služby na pracevautoskole.cz.`;

  const html = layout(
    subject,
    `<h1 style="font-size:20px;margin:0 0 16px">Doklad o platbě č. ${escapeHtml(args.receiptNumber)}</h1>
${name ? `<p>Ahoj ${name},</p>` : ""}
<p>děkujeme za platbu.</p>

<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
  <tr><td style="padding:6px 0;color:#71717a">Datum přijetí</td><td style="padding:6px 0;text-align:right;font-weight:500">${escapeHtml(datum)}</td></tr>
  <tr><td style="padding:6px 0;color:#71717a">Produkt</td><td style="padding:6px 0;text-align:right;font-weight:500">${escapeHtml(args.productName)}</td></tr>
  <tr><td style="padding:6px 0;color:#71717a">Částka</td><td style="padding:6px 0;text-align:right;font-weight:600;font-size:16px">${args.amountCzk} Kč</td></tr>
  <tr><td style="padding:6px 0;color:#71717a">Způsob platby</td><td style="padding:6px 0;text-align:right">${escapeHtml(args.paymentMethod)}</td></tr>
  ${args.variableSymbol ? `<tr><td style="padding:6px 0;color:#71717a">Variabilní symbol</td><td style="padding:6px 0;text-align:right;font-family:monospace">${escapeHtml(args.variableSymbol)}</td></tr>` : ""}
  ${args.externalId ? `<tr><td style="padding:6px 0;color:#71717a">Reference</td><td style="padding:6px 0;text-align:right;font-family:monospace;font-size:12px">${escapeHtml(args.externalId)}</td></tr>` : ""}
</table>

<div style="margin-top:24px;padding:16px;background:#f4f4f5;border-radius:8px;font-size:13px;color:#3f3f46">
  <p style="margin:0;font-weight:500;color:#18181b">Příjemce platby</p>
  <p style="margin:8px 0 0">
    ${OPERATOR.name}<br/>
    IČO: ${OPERATOR.ico}<br/>
    ${OPERATOR.address}<br/>
    ${OPERATOR.registry}<br/>
    <a href="mailto:${OPERATOR.email}" style="color:#18181b">${OPERATOR.email}</a>
  </p>
  <p style="margin:8px 0 0;font-size:12px;color:#71717a">Není plátcem DPH.</p>
</div>

<p style="margin-top:16px;font-size:12px;color:#71717a">
  Tento doklad slouží jako potvrzení o úhradě digitální služby na pracevautoskole.cz.
</p>`,
  );
  return { subject, html, text };
}

export function credentialsApprovedEmail(args: {
  name: string | null;
  profileUrl: string;
}) {
  const name = args.name ? escapeHtml(args.name) : "uživateli";
  const subject = "Tvůj profesní průkaz byl ověřen";
  const text = `Ahoj ${name},

profesní průkaz na pracevautoskole.cz byl ověřen. Na profilu i u tvých inzerátů se zobrazuje odznak „Ověřený profesionál“.

${args.profileUrl}

Děkujeme!`;
  const html = layout(
    subject,
    `<h1 style="font-size:20px;margin:0 0 16px">Profesní průkaz ověřen</h1>
<p>Ahoj ${name},</p>
<p>právě jsme ověřili tvůj profesní průkaz. Na profilu i u tvých inzerátů se zobrazuje odznak <strong>Ověřený profesionál</strong>.</p>
<p style="margin:24px 0"><a href="${args.profileUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:500">Zobrazit profil</a></p>`,
  );
  return { subject, html, text };
}

export function credentialsRejectedEmail(args: {
  name: string | null;
  profileUrl: string;
  reason: string;
}) {
  const name = args.name ? escapeHtml(args.name) : "uživateli";
  const subject = "Ověření profesního průkazu se nepovedlo";
  const text = `Ahoj ${name},

bohužel jsme tvůj profesní průkaz na pracevautoskole.cz nemohli ověřit.

Důvod: ${args.reason}

Můžeš nahrát novou verzi v profilu:
${args.profileUrl}`;
  const html = layout(
    subject,
    `<h1 style="font-size:20px;margin:0 0 16px">Ověření průkazu se nepovedlo</h1>
<p>Ahoj ${name},</p>
<p>bohužel jsme tvůj profesní průkaz nemohli ověřit.</p>
<p style="margin:16px 0;padding:12px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;font-size:14px">
  <strong>Důvod:</strong> ${escapeHtml(args.reason)}
</p>
<p>Můžeš nahrát novou verzi v profilu:</p>
<p style="margin:24px 0"><a href="${args.profileUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:500">Otevřít profil</a></p>`,
  );
  return { subject, html, text };
}

export function newMessageEmail(args: {
  recipientName: string | null;
  senderName: string;
  body: string;
  conversationUrl: string;
}) {
  const recipient = args.recipientName ? escapeHtml(args.recipientName) : "uživateli";
  const sender = escapeHtml(args.senderName);
  // Náhled — orámujeme dlouhý text
  const preview =
    args.body.length > 280 ? args.body.slice(0, 280) + "…" : args.body;
  const subject = `Nová zpráva od ${args.senderName}`;
  const text = `Ahoj ${recipient},

dostal/a jsi novou zprávu od ${args.senderName}:

"${preview}"

Otevři rozhovor: ${args.conversationUrl}`;
  const html = layout(
    subject,
    `<h1 style="font-size:20px;margin:0 0 16px">Nová zpráva</h1>
<p>Ahoj ${recipient},</p>
<p>dostal/a jsi novou zprávu od <strong>${sender}</strong>:</p>
<blockquote style="margin:16px 0;padding:12px 16px;background:#f4f4f5;border-left:3px solid #18181b;border-radius:0 8px 8px 0;font-size:14px;color:#27272a;white-space:pre-wrap">${escapeHtml(preview)}</blockquote>
<p style="margin:24px 0"><a href="${args.conversationUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:500">Otevřít rozhovor</a></p>
<p style="font-size:12px;color:#52525b">Odpovídej přímo na webu, nikoliv odpovědí na tento e-mail.</p>`,
  );
  return { subject, html, text };
}

export function resetPasswordEmail(args: { name: string | null; url: string }) {
  const name = args.name ? escapeHtml(args.name) : "uživateli";
  const subject = "Resetování hesla";
  const text = `Ahoj ${name},

obdrželi jsme žádost o reset hesla. Pro nastavení nového hesla klikni:

${args.url}

Pokud jsi reset nepožadoval/a, tento e-mail ignoruj. Tvůj účet je v pořádku.

Odkaz vyprší za 1 hodinu.`;
  const html = layout(
    subject,
    `<h1 style="font-size:20px;margin:0 0 16px">Resetování hesla</h1>
<p>Ahoj ${name},</p>
<p>obdrželi jsme žádost o reset hesla.</p>
<p style="margin:24px 0"><a href="${args.url}" style="display:inline-block;background:#18181b;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:500">Nastavit nové heslo</a></p>
<p style="font-size:12px;color:#52525b">Nebo vlož do prohlížeče: <span style="word-break:break-all">${escapeHtml(args.url)}</span></p>
<p style="font-size:12px;color:#52525b">Pokud jsi reset nepožadoval/a, e-mail ignoruj. Tvůj účet zůstane beze změny. Odkaz vyprší za 1 hodinu.</p>`,
  );
  return { subject, html, text };
}
