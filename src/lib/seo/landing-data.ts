import type { ProfessionalRole } from "@/lib/matching/score";

/**
 * Top česká města (~30 největších) pro programatic SEO landing pages.
 * Slug je bez diakritiky a malými písmeny — ekvivalent v hlavní DB by měl
 * být normalizován stejně.
 */
export type SeoCity = {
  slug: string;
  name: string;
  region: string;
  /** Krátký kontext pracovního trhu (1–2 věty). */
  marketNote?: string;
};

export const SEO_CITIES: SeoCity[] = [
  {
    slug: "praha",
    name: "Praha",
    region: "Praha",
    marketNote:
      "Největší koncentrace autoškol v ČR — okolo 250 provozoven. Vyšší poptávka po lektorech § 48 i soudních tlumočnících (cizojazyčné zkoušky).",
  },
  {
    slug: "brno",
    name: "Brno",
    region: "Jihomoravský kraj",
    marketNote:
      "Druhý největší autoškolský trh v ČR. Silná poptávka po učitelích kategorie B i C/D, hlavně mimo centrum.",
  },
  {
    slug: "ostrava",
    name: "Ostrava",
    region: "Moravskoslezský kraj",
    marketNote:
      "Průmyslová oblast s velkou poptávkou po skupinách C, CE, T pro nákladní dopravu a lesnictví.",
  },
  {
    slug: "plzen",
    name: "Plzeň",
    region: "Plzeňský kraj",
    marketNote:
      "Stabilní trh okolo Škodovky a logistických center. Časté kombinace ŘP B + lektor § 48.",
  },
  { slug: "liberec", name: "Liberec", region: "Liberecký kraj" },
  { slug: "olomouc", name: "Olomouc", region: "Olomoucký kraj" },
  {
    slug: "ceske-budejovice",
    name: "České Budějovice",
    region: "Jihočeský kraj",
  },
  { slug: "hradec-kralove", name: "Hradec Králové", region: "Královéhradecký kraj" },
  { slug: "usti-nad-labem", name: "Ústí nad Labem", region: "Ústecký kraj" },
  { slug: "pardubice", name: "Pardubice", region: "Pardubický kraj" },
  { slug: "zlin", name: "Zlín", region: "Zlínský kraj" },
  { slug: "havirov", name: "Havířov", region: "Moravskoslezský kraj" },
  { slug: "kladno", name: "Kladno", region: "Středočeský kraj" },
  { slug: "most", name: "Most", region: "Ústecký kraj" },
  { slug: "karvina", name: "Karviná", region: "Moravskoslezský kraj" },
  { slug: "opava", name: "Opava", region: "Moravskoslezský kraj" },
  { slug: "frydek-mistek", name: "Frýdek-Místek", region: "Moravskoslezský kraj" },
  { slug: "decin", name: "Děčín", region: "Ústecký kraj" },
  { slug: "karlovy-vary", name: "Karlovy Vary", region: "Karlovarský kraj" },
  { slug: "jihlava", name: "Jihlava", region: "Vysočina" },
  { slug: "teplice", name: "Teplice", region: "Ústecký kraj" },
  { slug: "chomutov", name: "Chomutov", region: "Ústecký kraj" },
  { slug: "trinec", name: "Třinec", region: "Moravskoslezský kraj" },
  { slug: "trebic", name: "Třebíč", region: "Vysočina" },
  { slug: "prostejov", name: "Prostějov", region: "Olomoucký kraj" },
  { slug: "tabor", name: "Tábor", region: "Jihočeský kraj" },
  { slug: "cheb", name: "Cheb", region: "Karlovarský kraj" },
  { slug: "mlada-boleslav", name: "Mladá Boleslav", region: "Středočeský kraj" },
  { slug: "prerov", name: "Přerov", region: "Olomoucký kraj" },
  { slug: "pribram", name: "Příbram", region: "Středočeský kraj" },
];

/**
 * Role, které dávají smysl mít jako samostatnou landing page s long-form
 * content. Operator_admin a manager nemají samostatnou keyword poptávku
 * a "other" je catch-all bez vlastního SEO use-case.
 */
export type SeoRole = {
  slug: string;
  role: ProfessionalRole;
  /** Singular název. */
  name: string;
  /** "učitelů autoškoly" — pro typu "Aktuální nabídky učitelů autoškoly". */
  namePlural: string;
  /** Krátká věta — meta description fallback. */
  shortIntro: string;
  /** ~3 odstavce, hlavní úvod stránky (ne raw HTML, jen text — v page.tsx se obalí <p>). */
  longIntro: string[];
  /** Kvalifikace / požadavky — bullet list. */
  qualifications: string[];
  /** ~2 odstavce o tom, co práce obnáší v praxi. */
  typicalDay: string[];
  /** Orientační odměna v ČR. */
  salary: {
    minMonthlyCzk?: number;
    maxMonthlyCzk?: number;
    minHourlyCzk?: number;
    maxHourlyCzk?: number;
    note: string;
  };
  /** Jak se pozicí stát — kroky, kurzy, zkoušky. */
  howToBecome: string[];
  /** FAQ pro structured data (FAQPage schema.org). */
  faq: { q: string; a: string }[];
  /** Související interní landing pages. */
  related?: string[];
};

export const SEO_ROLES: SeoRole[] = [
  {
    slug: "ucitel-autoskoly",
    role: "instructor",
    name: "Učitel autoškoly",
    namePlural: "učitelů autoškoly",
    shortIntro:
      "Učitel autoškoly vyučuje teorii pravidel silničního provozu a praktickou jízdu žadatelům o řidičské oprávnění.",
    longIntro: [
      "Učitel autoškoly je klíčová profese českého oboru autoškol. Vyučuje teorii pravidel silničního provozu, vede praktický výcvik za volantem a připravuje žadatele na závěrečnou zkoušku z odborné způsobilosti. Zákon č. 247/2000 Sb. stanovuje minimální věk 24 let, profesní průkaz učitele a alespoň 3 roky držení řidičského oprávnění v dané kategorii.",
      "Pracovní trh v ČR čítá více než 2 500 autoškol napříč všemi kraji. Poptávka po učitelích — zejména v kategoriích B, BE, C, CE — dlouhodobě převyšuje nabídku, hlavně v menších městech a ve specializacích na profesionální řidiče. Učitelé s ŘP skupin C/D a praxí v oblasti profesního školení mají na trhu výrazně silnou pozici.",
      "Forma spolupráce s autoškolou bývá různá: hlavní pracovní poměr, externí spolupráce na DPP/DPČ, nebo spolupráce na živnostenský list (OSVČ). Sazby se liší podle regionu a kategorie — od ~250 Kč/h za teoretickou výuku v menším městě po ~600 Kč/h za profesionální výcvik s nákladními vozidly v Praze a Brně.",
    ],
    qualifications: [
      "Minimální věk 24 let (zák. 247/2000 Sb., § 21).",
      "Platný profesní průkaz učitele autoškoly (PPU).",
      "Řidičské oprávnění v kategorii, kterou bude učit, držené minimálně 3 roky.",
      "Zdravotní způsobilost k řízení vozidla a k výkonu profese.",
      "Trestní bezúhonnost (potvrzeno výpisem z rejstříku trestů).",
      "Pravidelné přezkoušení odborné způsobilosti každých 5 let.",
    ],
    typicalDay: [
      "Den učitele autoškoly se obvykle dělí mezi teoretickou výuku ve třídě (pravidla provozu, mechanika vozidel, první pomoc, dopravní zdravotní příprava) a praktický výcvik za volantem. Ve větších autoškolách připadá na učitele 4–8 jízdních lekcí denně, každá v délce 45–90 minut. Mezi lekcemi se administruje studijní průkaz žadatele a zaznamenává postup výuky.",
      "Kromě výuky učitel připravuje žadatele na závěrečnou zkoušku — testy z teorie (40 otázek, 50 minut) a praktickou jízdu před zkušebním komisařem obecního úřadu. Spolupracuje s provozním pracovníkem na rozvrhu, eviduje docházku a komunikuje s žadateli o sazbách a termínech.",
    ],
    salary: {
      minMonthlyCzk: 35000,
      maxMonthlyCzk: 60000,
      minHourlyCzk: 250,
      maxHourlyCzk: 600,
      note: "Plat se výrazně liší podle regionu, kategorií ŘP a formy spolupráce. OSVČ se zkušeností a vyššími skupinami (C, D) má nejvyšší výdělek.",
    },
    howToBecome: [
      "Získat řidičské oprávnění v kategorii, kterou chcete učit, a držet je nejméně 3 roky.",
      "Absolvovat odbornou přípravu v akreditovaném vzdělávacím středisku (typicky 80–120 hodin).",
      "Složit zkoušku odborné způsobilosti učitele autoškoly před komisí Krajského úřadu.",
      "Získat profesní průkaz učitele autoškoly (PPU) — vydává krajský úřad.",
      "Začít pracovat v autoškole jako zaměstnanec nebo OSVČ.",
      "Každých 5 let absolvovat přezkoušení odborné způsobilosti pro obnovení PPU.",
    ],
    faq: [
      {
        q: "Kolik vydělá učitel autoškoly v ČR?",
        a: "Měsíčně typicky 35 000 – 60 000 Kč hrubého v hlavním pracovním poměru. OSVČ s vlastními sazbami a vyššími skupinami ŘP (C, CE, D) může přesáhnout 70 000 Kč. Hodinovka pro externí spolupráci je 250–600 Kč podle kategorie a regionu.",
      },
      {
        q: "Jak dlouho trvá stát se učitelem autoškoly?",
        a: "Po splnění podmínky 3 let držení ŘP je odborná příprava dlouhá 80–120 hodin (1–3 měsíce při běžném tempu) plus zkouška před komisí krajského úřadu. Celkový proces od rozhodnutí po první den za volantem ve výuce vychází typicky na 4–6 měsíců.",
      },
      {
        q: "Můžu učit, když mám jen ŘP skupiny B?",
        a: "Ano, učitel s ŘP B vyučuje skupinu B (osobní automobily). Pro kategorie C/CE (nákladní), D/DE (autobusy) nebo T (traktory) je nutné mít odpovídající ŘP a 3 roky praxe v dané kategorii.",
      },
      {
        q: "Co je profesní průkaz učitele (PPU)?",
        a: "PPU je doklad vydávaný krajským úřadem, který opravňuje k výuce v autoškole. Získává se po složení zkoušky odborné způsobilosti a obnovuje se každých 5 let přezkoušením.",
      },
    ],
    related: ["lektor-skoleni-ridicu", "zkusebni-komisar"],
  },
  {
    slug: "lektor-skoleni-ridicu",
    role: "lecturer_48",
    name: "Lektor pravidelného školení řidičů (§ 48)",
    namePlural: "lektorů pravidelného školení řidičů",
    shortIntro:
      "Lektor § 48 vede pravidelná školení profesionálních řidičů ve smyslu zákona č. 247/2000 Sb. — 35 hodin za 5 let.",
    longIntro: [
      'Lektor pravidelného školení řidičů, často zkráceně „lektor § 48", vede zákonem stanovené kurzy profesní způsobilosti pro řidiče skupin C, C+E, D a D+E. Podle § 48 zákona č. 247/2000 Sb. musí každý profesionální řidič absolvovat 35 hodin pravidelného školení během každých 5 let — 7 hodin ročně. Lektor je tím, kdo tato školení uskutečňuje.',
      "Profese je atraktivní pro učitele autoškoly, kteří chtějí rozšířit činnost mimo přípravu žadatelů. Školení probíhá v učebně, formou prezentace, diskuze a případových studií — bez praktického výcviku za volantem. Cílovkou jsou hotoví řidiči (často sami zkušení), takže forma výuky je odlišná od přípravy začátečníků.",
      "Lektor § 48 může pracovat pro autoškolu, vzdělávací středisko nebo dopravní firmu jako interní školitel. Sazby za 7hodinový den školení se pohybují od 3 000 do 7 000 Kč v závislosti na regionu, počtu účastníků a tom, zda materiály a místnost dodává objednatel.",
    ],
    qualifications: [
      "Minimální věk 24 let.",
      "Středoškolské vzdělání ukončené maturitou nebo vyšší.",
      "Praxe v oblasti silniční dopravy nebo výuky autoškoly minimálně 5 let.",
      "Absolvované odborné školení pro lektory § 48 (akreditované Ministerstvem dopravy).",
      "Trestní bezúhonnost.",
      "Aktualizace odborných znalostí — sledování změn zákona č. 247/2000 Sb. a navazujících předpisů.",
    ],
    typicalDay: [
      "Lektor § 48 typicky pracuje na bázi externí spolupráce. Den školení je 7 hodin výuky (např. 8:00–15:00), obvykle pro skupinu 8–20 řidičů. Témata jsou stanovena vyhláškou — pravidla silničního provozu, doprava nebezpečných věcí, AETR, technický stav vozidla, ekonomický styl jízdy, první pomoc, sociální a pracovněprávní aspekty profese řidiče.",
      "Před školením lektor připraví prezentaci (mnozí používají typové materiály od vzdělávacích středisek), zajistí prezenční listinu, evidenci a po skončení vystaví osvědčení o absolvování. Mimo přímou výuku se věnuje administrativě — fakturace, evidence pro účely kontroly KÚ, aktualizace materiálů podle nové legislativy.",
    ],
    salary: {
      minHourlyCzk: 400,
      maxHourlyCzk: 1000,
      note: "Sazba za 7hodinový den školení typicky 3 000 – 7 000 Kč. Korporátní zakázky pro velké dopravní firmy bývají na horní hranici, malé skupiny v menších městech na spodní.",
    },
    howToBecome: [
      "Mít minimálně 5 let praxe v silniční dopravě nebo jako učitel autoškoly.",
      "Absolvovat akreditované školení pro lektory § 48 (typicky 40–80 hodin).",
      "Získat osvědčení k vedení pravidelného školení vystavené Ministerstvem dopravy nebo akreditovaným střediskem.",
      "Navázat spolupráci s autoškolou nebo vzdělávacím střediskem (případně samostatně získat akreditaci).",
      "Pravidelně sledovat změny v zákoně 247/2000 Sb. a aktualizovat výukové materiály.",
    ],
    faq: [
      {
        q: "Můžu být lektor § 48, pokud nejsem učitel autoškoly?",
        a: "Ano. Pro lektory § 48 je rozhodující 5 let praxe v silniční dopravě (řidič kategorie C/D, dispečer, vedoucí dopravy, atd.) a absolvované odborné školení. Není podmínkou mít profesní průkaz učitele autoškoly.",
      },
      {
        q: "Kolik hodin musí řidič odučit?",
        a: "Profesionální řidič kategorií C, C+E, D, D+E musí absolvovat 35 hodin pravidelného školení během 5 let — typicky 7 hodin ročně. Pro vstup do profese je navíc nutné absolvovat vstupní školení (140 nebo 280 hodin podle věku a kategorie).",
      },
      {
        q: "Můžu vést školení online?",
        a: "Online forma je za přesných podmínek možná pro některé okruhy, ale česká úprava nadále preferuje prezenční výuku. Vždy si ověřte aktuální výklad u Ministerstva dopravy a vyhlášky.",
      },
      {
        q: "Kolik si vydělám jako lektor § 48?",
        a: "Při pravidelné spolupráci 1–2 dny v týdnu (2 školení) můžete dosáhnout 25 000 – 60 000 Kč měsíčně jako OSVČ. Plný úvazek (5 školení týdně) je vzácnější, ale dosažitelný v letní sezóně, kdy si firmy plní povinné hodiny.",
      },
    ],
    related: ["ucitel-autoskoly", "zkusebni-komisar"],
  },
  {
    slug: "soudni-tlumocnik-autoskola",
    role: "court_interpreter",
    name: "Soudní tlumočník v autoškole",
    namePlural: "soudních tlumočníků v autoškole",
    shortIntro:
      "Soudní tlumočník překládá u zkoušky z odborné způsobilosti pro žadatele, kteří neovládají český jazyk.",
    longIntro: [
      "Soudní tlumočník je nezbytný pro žadatele o řidičské oprávnění, kteří plně neovládají český jazyk — zákon č. 247/2000 Sb. umožňuje skládat zkoušku v cizím jazyce s přítomností soudního tlumočníka jmenovaného Ministerstvem spravedlnosti dle zákona č. 354/2019 Sb. o soudních tlumočnících. V praxi nejčastěji jde o ukrajinštinu, ruštinu, vietnamštinu, mongolštinu, angličtinu a němčinu.",
      "Tlumočník se účastní jak teoretické zkoušky (testy z pravidel silničního provozu, 40 otázek), tak praktické zkoušky za volantem ve voze. U teoretické zkoušky překládá obsah otázek a možností; u praktické tlumočí pokyny zkušebního komisaře jeho směrem k žadateli a komentáře žadatele zpět ke komisaři.",
      "Trh je v ČR velmi specifický a poptávka roste s počtem cizinců usilujících o ŘP — zejména v Praze, Brně, Ostravě, Plzni a okolních krajích. Tlumočník typicky spolupracuje s několika autoškolami a krajskými úřady na principu jednorázových zakázek za zkoušku.",
    ],
    qualifications: [
      "Jmenování soudním tlumočníkem dle zákona č. 354/2019 Sb. — Ministerstvo spravedlnosti.",
      "Zápis v evidenci soudních tlumočníků pro daný jazyk.",
      "Plnoletost a plná svéprávnost.",
      "Trestní bezúhonnost (potvrzeno výpisem z rejstříku trestů).",
      "Vysokoškolské vzdělání nebo prokázaná odpovídající kvalifikace v daném jazyce.",
      "Znalost terminologie silničního provozu, autoškolské výuky a zkušebního procesu.",
    ],
    typicalDay: [
      "Tlumočník zákazník typicky neoslovuje sám — zájem přichází od autoškol nebo přímo od žadatelů, kteří potřebují absolvovat zkoušku v cizím jazyce. Po dohodě tlumočník přijede ke zkoušce na pobočku obecního úřadu (ORP) a doprovází žadatele celou zkouškou.",
      "Zkouška obsahuje teoretický test (~50 minut) a praktickou jízdu (~30 minut). Tlumočník překládá v reálném čase, zachovává neutralitu vůči žadateli i komisaři a po skončení vystaví doklad o tlumočení podle zákona o soudních tlumočnících.",
    ],
    salary: {
      minHourlyCzk: 600,
      maxHourlyCzk: 1500,
      note: "Sazba za jednu zkoušku se obvykle pohybuje 700–2 000 Kč podle jazyka a délky. Tlumočníci pro vzácnější jazyky (mongolština, vietnamština) mají vyšší ceny díky omezené nabídce.",
    },
    howToBecome: [
      "Splnit podmínky zákona č. 354/2019 Sb. — vzdělání nebo zkouška v daném jazyce.",
      "Absolvovat odbornou zkoušku tlumočníka (organizuje Ministerstvo spravedlnosti).",
      "Zaslat žádost o jmenování soudním tlumočníkem na MSp ČR — proces typicky trvá 6–12 měsíců.",
      "Po jmenování zápis v evidenci soudních tlumočníků pro daný jazyk.",
      "Zorientovat se v terminologii silničního provozu (zkrácené nahlédnutí do testů, vyhlášky 167/2002 Sb.).",
      "Navázat spolupráci s autoškolami v regionu — typicky přes profesní portál nebo přímo.",
    ],
    faq: [
      {
        q: "Musím být soudní tlumočník, abych tlumočil u zkoušky?",
        a: "Pro zkoušku z odborné způsobilosti řidiče je dle zákona č. 247/2000 Sb. vyžadován soudní tlumočník jmenovaný Ministerstvem spravedlnosti. Běžný překladatel ani komerční tlumočník toto oprávnění nemá.",
      },
      {
        q: "Které jazyky jsou v ČR nejvíce poptávané?",
        a: "Dlouhodobě ukrajinština, ruština a vietnamština. Roste poptávka po angličtině a němčině pro pracovníky z EU. Vzácnější (mongolština, kazaština, mandarinština) mají méně tlumočníků a vyšší sazby.",
      },
      {
        q: "Kolik si vydělám jako soudní tlumočník v autoškolách?",
        a: "Při pravidelné spolupráci s 5–10 autoškolami v regionu lze dosáhnout 15 000 – 50 000 Kč měsíčně jako OSVČ. Plný úvazek pouze v autoškolách je vzácný — typicky se kombinuje s tlumočením na úřadech, soudech, ve zdravotnictví.",
      },
      {
        q: "Jak dlouho trvá jmenování soudním tlumočníkem?",
        a: "Od podání žádosti na Ministerstvu spravedlnosti po jmenování typicky 6–12 měsíců. Záleží na době mezi termíny odborných zkoušek a aktuální vytíženosti komise.",
      },
    ],
    related: ["ucitel-autoskoly"],
  },
  {
    slug: "zkusebni-komisar",
    role: "examiner",
    name: "Zkušební komisař autoškoly",
    namePlural: "zkušebních komisařů autoškoly",
    shortIntro:
      "Zkušební komisař provádí závěrečnou zkoušku odborné způsobilosti — testy z teorie a praktickou jízdu žadatelů o ŘP.",
    longIntro: [
      "Zkušební komisař je úředník obecního úřadu obce s rozšířenou působností (ORP), který provádí závěrečné zkoušky odborné způsobilosti k řízení motorových vozidel. Práci upravuje zákon č. 247/2000 Sb. a vyhláška č. 167/2002 Sb. Komisař zkouší teoretickou část (test pravidel silničního provozu) i praktickou jízdu před odjezdem žadatele do silničního provozu.",
      "Pozice je státně regulovaná — komisaře jmenuje krajský úřad, působí výhradně pro daný ORP. Většina komisařů začíná svou kariéru jako učitelé autoškoly s mnohaletou praxí, kteří se rozhodnou přejít z výuky do hodnocení.",
      "Práce má pevnou pracovní dobu (úřední hodiny ORP), stálý plat dle platových tříd státní správy, a na rozdíl od učitelů autoškoly bez závislosti na sezónním kolísání poptávky. Pro autoškoly samotné je komisař partnerem, na jehož standardech závisí úspěšnost jejich absolventů.",
    ],
    qualifications: [
      "Minimální věk 25 let.",
      "Středoškolské vzdělání ukončené maturitou.",
      "Praxe učitele autoškoly minimálně 3 roky.",
      "Řidičské oprávnění ve všech kategoriích, které bude zkoušet (typicky AM, A, B, C, D, T).",
      "Absolvování školení pro zkušební komisaře u Ministerstva dopravy.",
      "Jmenování krajským úřadem na základě úspěšné zkoušky.",
      "Trestní bezúhonnost a zdravotní způsobilost.",
    ],
    typicalDay: [
      "Den komisaře je dělen mezi teoretické zkoušení v učebně ORP (testy na PC, dohled, vyhodnocení) a praktickou jízdu se žadatelem ve voze autoškoly. Typicky vykoná 6–12 zkoušek za den, každá v délce 30–60 minut. Po zkoušce vystavuje protokol s výsledkem.",
      "Mimo zkoušky se komisař věnuje administrativě — vedení evidence, komunikace s autoškolami z ORP, kontrola zkušebních vozidel, účast na metodických poradách. V některých ORP komisař také schvaluje nové instruktorské oprávnění pro učitele.",
    ],
    salary: {
      minMonthlyCzk: 35000,
      maxMonthlyCzk: 55000,
      note: "Plat dle platové tabulky státní správy (typicky 9.–11. platová třída) plus osobní příplatek a odměny. Stabilita a benefity státního zaměstnance.",
    },
    howToBecome: [
      "Působit minimálně 3 roky jako učitel autoškoly s aktivním PPU.",
      "Získat ŘP ve všech kategoriích, které budete zkoušet.",
      "Přihlásit se na školení pro zkušební komisaře (Ministerstvo dopravy, akreditované středisko).",
      "Úspěšně složit závěrečnou zkoušku pro komisaře.",
      "Být jmenován krajským úřadem (probíhá výběrové řízení v jednotlivých ORP).",
      "Nastoupit na uvolněnou pozici na ORP.",
    ],
    faq: [
      {
        q: "Můžu být zkušební komisař a zároveň učitel autoškoly?",
        a: "Ne, je to neslučitelné. Komisař musí být nezávislý na autoškolách v jeho ORP. V některých případech může komisař přiucovávat v jiném kraji jako učitel, ale je to spíše výjimka a vyžaduje to souhlas zaměstnavatele.",
      },
      {
        q: "Kolik vydělá zkušební komisař?",
        a: "35 000 – 55 000 Kč hrubého měsíčně podle platové třídy a praxe. K platu se připočítává osobní příplatek a roční odměny. Příplatky za praxi a vedení rostou s lety služby.",
      },
      {
        q: "Jak dlouho trvá stát se komisařem?",
        a: "Minimálně 3 roky praxe učitele autoškoly + školení (~80 hodin) + zkouška + výběrové řízení. Reálně se proces od rozhodnutí po nástup pohybuje v řádu 1–2 let.",
      },
      {
        q: "Je práce komisaře sezónní?",
        a: "Ne. Na rozdíl od učitele autoškoly, který má vrcholy na jaře a podzim, má komisař rovnoměrně rozloženou práci celý rok. Letní měsíce mohou být lehce klidnější (dovolené žadatelů), ale rozdíly nejsou velké.",
      },
    ],
    related: ["ucitel-autoskoly", "lektor-skoleni-ridicu"],
  },
  {
    slug: "lektor-zdravotni-pripravy",
    role: "medic",
    name: "Lektor zdravotní přípravy řidičů",
    namePlural: "lektorů zdravotní přípravy řidičů",
    shortIntro:
      "Lektor zdravotní přípravy vyučuje žadatele o ŘP první pomoc a chování při dopravní nehodě.",
    longIntro: [
      'Lektor zdravotní přípravy řidičů (často nazývaný „zdravotník v autoškole") vede povinnou část výuky o první pomoci a chování při dopravní nehodě. Tato část je součástí teoretické výuky každého žadatele o řidičské oprávnění a její minimální rozsah stanovuje vyhláška č. 167/2002 Sb. (typicky 4 hodiny pro skupiny B/A, více pro profesionální skupiny).',
      "Profese je vhodná pro zdravotníky — záchranáře, sestry, lékaře — kteří chtějí mít externí příjem mimo hlavní zaměstnání. Většina autoškol nemá vlastního zdravotníka a najímá externí lektory podle potřeby (jednou za 2–4 týdny u běžné autoškoly, častěji u větších provozů).",
      "Lektor zdravotní přípravy nemusí být zaměstnán přímo v autoškole — typicky funguje jako OSVČ a obstará si zakázky u více škol v regionu. Sazba se liší 400–800 Kč/h, plus dotace na resuscitační figuríny a lékárnu, kterou lektor obvykle přiváží.",
    ],
    qualifications: [
      "Zdravotnické vzdělání nebo praxe — typicky zdravotnický záchranář, sestra, lékař nebo absolvent kurzů ČČK.",
      "Aktuální certifikát BLS (Basic Life Support) nebo ekvivalent.",
      "Praxe ve zdravotnictví minimálně 2 roky doporučená.",
      "Komunikační dovednosti pro práci s laickou veřejností.",
      "Vlastní výukové materiály a pomůcky (resuscitační figurína Anne / Mini-Anne, AED-trenažér, obvazový materiál).",
    ],
    typicalDay: [
      "Lektor přijíždí do autoškoly podle domluveného rozvrhu — obvykle 1–2× měsíčně, vždy na 1 vyučovací blok (4 hodiny) pro skupinu 5–15 žadatelů. Výuka kombinuje teorii (signály bezvědomí, krvácení, šok, dopravní nehoda — co dělat jako první) s praktickým nácvikem na figuríně.",
      "Mimo přímou výuku lektor udržuje certifikace (každoroční BLS update), aktualizuje materiály podle Guidelines ERC (vždy ~5 let velký update) a komunikuje s autoškolami o termínech.",
    ],
    salary: {
      minHourlyCzk: 400,
      maxHourlyCzk: 800,
      note: "Sazba za blok 4 hodin obvykle 1 500 – 3 200 Kč. Při pravidelné spolupráci s 3–5 autoškolami lze dosáhnout 8 000 – 25 000 Kč měsíčně jako vedlejší příjem.",
    },
    howToBecome: [
      "Mít zdravotnické vzdělání nebo absolvovat kurz instruktora první pomoci u ČČK.",
      "Udržovat aktuální BLS certifikát.",
      "Pořídit si základní vybavení — resuscitační figurína, obvazový materiál, AED-trenažér (~10 000 – 25 000 Kč).",
      "Připravit prezentaci podle aktuálních Guidelines ERC pro laickou první pomoc.",
      "Oslovit autoškoly v regionu, kde žádný lektor nepůsobí, nebo nastoupit do existující sítě.",
    ],
    faq: [
      {
        q: "Musím být lékař nebo záchranář, abych mohl být lektor v autoškole?",
        a: "Není to zákonem požadováno, ale prakticky vždy ano. Autoškoly chtějí lektory s reálnou zdravotnickou praxí — sestra, záchranář, lékař. Absolvent samotného kurzu ČČK bez praxe se prosadí obtížně.",
      },
      {
        q: "Kolik si vydělám lektorováním v autoškolách?",
        a: "Jako vedlejší příjem ke zdravotnické práci 8 000 – 25 000 Kč měsíčně při 3–5 autoškolách v regionu. Plný úvazek pouze v autoškolách je vzácný — typicky se kombinuje s prací v záchranné službě nebo nemocnici.",
      },
      {
        q: "Kolik hodin musí každý žadatel absolvovat?",
        a: "Pro skupiny B/A typicky 4 hodiny zdravotní přípravy, pro profesionální skupiny C/D více. Přesný rozsah upravuje vyhláška č. 167/2002 Sb.",
      },
    ],
    related: ["ucitel-autoskoly"],
  },
];

export function getCityBySlug(slug: string) {
  return SEO_CITIES.find((c) => c.slug === slug);
}

export function getRoleBySlug(slug: string) {
  return SEO_ROLES.find((r) => r.slug === slug);
}

export function listAllLandingPaths(): {
  cities: { slug: string }[];
  roles: { slug: string }[];
  combos: { roleSlug: string; mestoSlug: string }[];
} {
  const combos: { roleSlug: string; mestoSlug: string }[] = [];
  for (const role of SEO_ROLES) {
    for (const city of SEO_CITIES) {
      combos.push({ roleSlug: role.slug, mestoSlug: city.slug });
    }
  }
  return {
    cities: SEO_CITIES.map((c) => ({ slug: c.slug })),
    roles: SEO_ROLES.map((r) => ({ slug: r.slug })),
    combos,
  };
}
