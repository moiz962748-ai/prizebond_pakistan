export interface ArticleFrontmatter {
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  primary_keyword: string;
  secondary_keywords: string[];
  search_intent: string;
  category: string;
  author_label: string;
  reviewed_label: string;
  published: string;
  updated: string;
  last_verified: string;
  reading_time_min: number;
  hero_image: string;
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface ArticleSource {
  title: string;
  publisher: string;
  url?: string;
  note?: string;
}

export interface ArticleSection {
  id: string;
  heading: string;
  subheading?: string;
  paragraphs: string[];
  callout?: {
    type: 'note' | 'warning' | 'tip' | 'info';
    title?: string;
    text: string;
  };
  table?: {
    caption?: string;
    headers: string[];
    rows: (string | number)[][];
  };
  bulletPoints?: string[];
  actionLink?: {
    label: string;
    href: string;
    description?: string;
  };
}

export interface DetailedGuideArticle {
  frontmatter: ArticleFrontmatter;
  metaText: string;
  aiOverview: string;
  disclaimer: string;
  tableOfContents: { label: string; href: string }[];
  keyTakeaways: string[];
  sections: ArticleSection[];
  faqs: ArticleFaq[];
  conclusion: string[];
  sources: ArticleSource[];
}

export const GUIDE_ARTICLES: DetailedGuideArticle[] = [
  {
    frontmatter: {
      title: "Prize Bond Basics in Pakistan: A Complete Beginner's Guide",
      slug: "prize-bond-basics-pakistan",
      meta_title: "Prize Bond Basics in Pakistan: Beginner's Guide",
      meta_description: "Learn prize bond basics in Pakistan: how draws work, tax on prizes, claim rules and how to check results. A simple beginner's guide.",
      primary_keyword: "prize bond basics",
      secondary_keywords: [
        "how prize bonds work",
        "prize bond tax Pakistan",
        "prize bond claim",
        "national savings prize bonds",
        "state bank of pakistan prize bonds"
      ],
      search_intent: "informational",
      category: "Guides",
      author_label: "Research & Financial Policy Editorial Team",
      reviewed_label: "Based on published CDNS, SBP and FBR guidelines",
      published: "2026-01-15",
      updated: "2026-09-18",
      last_verified: "2026-10-01",
      reading_time_min: 7,
      hero_image: "/images/prize-bond-basics-pakistan-hero.webp",
    },
    metaText:
      "Written by Research & Financial Policy Editorial Team | Based on published CDNS, SBP and FBR guidelines | Updated: 2026-09-18 | Reading time: 7 min",
    aiOverview:
      "Prize bond basics: a prize bond is a government-issued savings certificate in Pakistan that pays no interest. Instead, holders can win cash prizes in periodic draws, and the bond itself can be redeemed at face value. Prizes are subject to withholding tax under Section 156, and claims must be made within the official validity period.",
    disclaimer:
      "This is an independent educational website. It is not affiliated with the Central Directorate of National Savings (CDNS) or the State Bank of Pakistan (SBP). Content is for general information only and is not financial or legal advice. Always confirm details with official sources.",
    tableOfContents: [
      { label: "Key Takeaways", href: "#key-takeaways" },
      { label: "Prize Bond Basics: What Is a Prize Bond?", href: "#what-is-a-prize-bond" },
      { label: "How Do Prize Bond Draws Work?", href: "#how-draws-work" },
      { label: "Which Prize Bond Denominations Are Available?", href: "#denominations" },
      { label: "How Much Tax Is Deducted From Prize Money?", href: "#prize-tax" },
      { label: "How Long Do You Have to Claim a Prize?", href: "#claim-validity" },
      { label: "How to Check Prize Bond Results", href: "#check-results" },
      { label: "Where Can You Buy and Redeem Prize Bonds?", href: "#buy-and-redeem" },
      { label: "Frequently Asked Questions", href: "#faq" },
      { label: "Conclusion", href: "#conclusion" },
      { label: "Sources", href: "#sources" },
    ],
    keyTakeaways: [
      "A prize bond pays no interest (zero usury/Riba). The primary financial benefit is eligibility to enter periodic randomized draws for substantial cash rewards.",
      "100% Capital Protection: Your original investment is sovereign-backed by the Government of Pakistan and can be redeemed at full face value at any time.",
      "Bearer vs Registered formats: Standard denominations (Rs. 100 to Rs. 1,500) are bearer instruments; Premium bonds (Rs. 25,000 & Rs. 40,000) are registered to your CNIC and pay regular bi-annual profit.",
      "Withholding Tax Rates under Section 156: 15% for Active Tax Filers (ATL) and 30% for Non-Filers deducted automatically at source upon prize disbursement.",
      "6-Year Claim Window: You have exactly six calendar years from the draw date to submit an official claim form at State Bank BSC counters before prizes lapse.",
      "Universal Verification: Winning numbers are published across official government gazettes, searchable instantly via automated online checker tools.",
    ],
    sections: [
      {
        id: "what-is-a-prize-bond",
        heading: "Prize Bond Basics: What Is a Prize Bond?",
        subheading: "A sovereign, capital-guaranteed national savings certificate without recurring interest",
        paragraphs: [
          "A prize bond in Pakistan is a public debt security issued by the Central Directorate of National Savings (CDNS) under the administrative control of the Ministry of Finance, and operated through the State Bank of Pakistan (SBP). Unlike conventional treasury bills, corporate debentures, or fixed deposit accounts, prize bonds do not offer a fixed periodic interest rate or compound return.",
          "Instead, prize bonds function as a randomized reward scheme. When you buy a prize bond, your principal money is deposited with the Government of Pakistan. In return, the serial number of your bond is entered into quarterly prize draws for large cash sums ranging from Rs. 1,000 up to Rs. 80,000,000 depending on the denomination.",
          "Crucially, prize bonds are not lottery tickets. In a commercial lottery or speculative raffle, the ticket purchase cost is forfeited win or lose. With a Pakistani prize bond, your principal capital remains completely intact. You can encash the bond at 100% face value at any State Bank of Pakistan Banking Services Corporation (SBP BSC) counter or designated commercial bank branch whenever you choose.",
        ],
        callout: {
          type: "tip",
          title: "Sovereign Backing",
          text: "Every prize bond represents a direct financial obligation of the Government of Pakistan. There is zero credit risk or principal loss risk regardless of market fluctuations.",
        },
      },
      {
        id: "how-draws-work",
        heading: "How Do Prize Bond Draws Work?",
        subheading: "Computerized and hand-operated mechanical balloting overseen by public committees",
        paragraphs: [
          "Prize bond draws are scheduled four times a year (quarterly) for each active denomination, following an official annual schedule announced in advance by the Central Directorate of National Savings. Draws take place on fixed dates (e.g. the 15th of the month, or the next working day if a weekend or public holiday intervenes).",
          "Draw events rotate systematically across major field offices of the State Bank of Pakistan Banking Services Corporation, including Karachi, Lahore, Rawalpindi, Peshawar, Multan, Faisalabad, Quetta, Hyderabad, and Muzaffarabad. This geographic rotation ensures transparency and regional accessibility.",
          "The draw procedure utilizes special mechanical draw machinery (known as 'Handomatic' draw machines) operated in full public view. A dedicated Draw Committee comprising respected civic representatives, retired judges, business leaders, and attending members of the general public oversees each event. The machine selects digits individually to form the winning 6-digit serial number.",
        ],
        bulletPoints: [
          "Draw Eligibility Threshold: Newly issued bearer bonds must generally be held for at least 60 days before the draw date to be eligible for balloting.",
          "Series Duplication: Every series of 1,000,000 bonds (e.g., Series A, Series B, Series AA) contains serial numbers from 000001 to 999999. In standard draws, each winning number applies across all qualifying issued series.",
          "Immediate Gazette Publication: Within hours of draw completion, the State Bank compiles and validates the official draw gazette, making it accessible nationwide.",
        ],
        actionLink: {
          label: "View 2026 National Draw Calendar",
          href: "/schedule",
          description: "Check exact draw dates, days, and host cities for all denominations.",
        },
      },
      {
        id: "denominations",
        heading: "Which Prize Bond Denominations Are Available?",
        subheading: "Current circulating denominations across Bearer and Premium Registered categories",
        paragraphs: [
          "The State Bank of Pakistan currently administers six official prize bond denominations divided into two main categories: Regular Bearer Prize Bonds and Premium Registered Prize Bonds. Older denominations such as Rs. 7,500, Rs. 15,000, and standard bearer Rs. 25,000 and Rs. 40,000 were discontinued by the Federal Government to document financial transactions and combat illicit hoarding.",
          "The table below provides a comprehensive comparison of all actively circulating prize bonds in Pakistan, including their ownership model, top prize amounts, and profit structure.",
        ],
        table: {
          caption: "Active Pakistani Prize Bond Denominations & Prize Matrix",
          headers: ["Denomination", "Instrument Category", "1st Prize Amount", "Total Winners / Draw", "Regular Profit", "Eligibility"],
          rows: [
            ["Rs. 100", "Regular Bearer", "Rs. 700,000", "1,203 winners", "None (Prizes only)", "Any citizen"],
            ["Rs. 200", "Regular Bearer", "Rs. 750,000", "2,400 winners", "None (Prizes only)", "Any citizen"],
            ["Rs. 750", "Regular Bearer", "Rs. 1,500,000", "1,700 winners", "None (Prizes only)", "Any citizen"],
            ["Rs. 1,500", "Regular Bearer", "Rs. 3,000,000", "1,700 winners", "None (Prizes only)", "Any citizen"],
            ["Rs. 25,000", "Premium Registered", "Rs. 30,000,000 (x2)", "707 winners", "Bi-Annual Profit Payout", "Registered (CNIC/IBAN)"],
            ["Rs. 40,000", "Premium Registered", "Rs. 80,000,000", "664 winners", "Bi-Annual Profit Payout", "Registered (CNIC/IBAN)"],
          ],
        },
        callout: {
          type: "note",
          title: "Bearer vs Premium Registered Differences",
          text: "Bearer bonds are transferable from hand to hand; whoever physically holds the bond is legally deemed the owner. Premium bonds are linked directly to your National Identity Card (CNIC) and bank account, eliminating risk of loss or theft.",
        },
      },
      {
        id: "prize-tax",
        heading: "How Much Tax Is Deducted From Prize Money?",
        subheading: "Statutory withholding tax deductions under Section 156 of the Income Tax Ordinance 2001",
        paragraphs: [
          "Prize money won on Pakistani prize bonds is subject to federal withholding tax at source before the net prize is disbursed to the winner. Tax rates are governed by Section 156 of the Income Tax Ordinance, 2001, enforced by the Federal Board of Revenue (FBR).",
          "The applicable tax rate depends strictly on your status on the FBR Active Taxpayers List (ATL) at the time of claim verification:",
        ],
        table: {
          caption: "FBR Withholding Tax Rates on Prize Bond Winnings (Section 156)",
          headers: ["Winner Tax Category", "Statutory Tax Rate", "Rs. 100 Bond (1st Prize Rs. 700k)", "Rs. 1,500 Bond (1st Prize Rs. 3M)", "Rs. 40,000 (1st Prize Rs. 80M)"],
          rows: [
            ["Filer (Active Taxpayers List)", "15% Withholding", "Rs. 105,000 Tax → Net Rs. 595,000", "Rs. 450,000 Tax → Net Rs. 2,550,000", "Rs. 12,000,000 Tax → Net Rs. 68,000,000"],
            ["Non-Filer (Inactive / Non-ATL)", "30% Withholding", "Rs. 210,000 Tax → Net Rs. 490,000", "Rs. 900,000 Tax → Net Rs. 2,100,000", "Rs. 24,000,000 Tax → Net Rs. 56,000,000"],
            ["Net Difference / Savings", "15% Extra Savings", "Rs. 105,000 saved by Filing", "Rs. 450,000 saved by Filing", "Rs. 12,000,000 saved by Filing"],
          ],
        },
        callout: {
          type: "warning",
          title: "Important Tax Filing Note",
          text: "Being an Active Filer literally cuts your prize tax in half (15% instead of 30%). For a Rs. 1,500 bond first prize, being a tax filer puts an extra Rs. 450,000 cash in your pocket. The withholding tax certificate issued by SBP serves as proof of adjustable advance tax.",
        },
      },
      {
        id: "claim-validity",
        heading: "How Long Do You Have to Claim a Prize?",
        subheading: "The 6-year claim validity window and claim submission guidelines",
        paragraphs: [
          "One of the most frequently asked questions is whether prizes must be claimed immediately. Under official Central Directorate of National Savings regulations, prize bond winners have exactly six (6) years from the official draw date to claim their prize money.",
          "If a winning prize is not claimed within the 6-year statutory period, the claim lapses permanently, and the unclaimed funds are surrendered to the federal government treasury as unencumbered public revenue.",
        ],
        bulletPoints: [
          "Small Prize Claims (Up to Rs. 18,500): Can be processed and paid across the counter at SBP BSC field offices or designated commercial banks upon physical bond surrender and CNIC presentation.",
          "High Prize Claims (Above Rs. 18,500): Require submission of Form PB-1 along with original bond, CNIC copies, and your 24-digit IBAN bank account details. Disbursement is executed through cross-cheque or direct bank account transfer.",
          "Verification Clearance: Processing high-value claims usually takes between 10 to 15 working days while the State Bank security desk authenticates the bond against counterfeit serials.",
        ],
        actionLink: {
          label: "Read Detailed Prize Claim Step-by-Step Guide",
          href: "/information?slug=how-to-claim-a-prize",
          description: "Download Form PB-1 checklist and required documentation.",
        },
      },
      {
        id: "check-results",
        heading: "How to Check Prize Bond Results",
        subheading: "Fast, accurate verification methods to ensure no winning number is missed",
        paragraphs: [
          "Historically, prize bond holders had to purchase printed newspaper supplements or multi-page paper gazettes from roadside vendors and manually scan tens of thousands of serial numbers. This tedious process frequently led to human error and overlooked prizes.",
          "Today, several reliable methods exist to check your bond serial numbers accurately:",
        ],
        bulletPoints: [
          "Automated Online Checker: Enter your 6-digit serial number, upload bulk lists, or specify a series range (e.g. 100001 to 100100) to search 10+ years of official State Bank gazette records in under a second.",
          "Denomination Results Hubs: Browse complete quarterly draw results and historical winning archives organized by denomination and draw number.",
          "Official PDF Gazette Download: Download complete raw gazette text and PDF records directly issued by the State Bank for offline review.",
        ],
        actionLink: {
          label: "Open Prize Bond Online Checker Tool",
          href: "/checker",
          description: "Search single numbers, serial series, or bulk comma-separated lists instantly.",
        },
      },
      {
        id: "buy-and-redeem",
        heading: "Where Can You Buy and Redeem Prize Bonds?",
        subheading: "Official counters and commercial banking partners nationwide",
        paragraphs: [
          "To safeguard against forged certificates, never buy prize bonds from unauthorized street vendors or speculative dealers selling bonds at marked-up prices. Prize bonds are always sold at exact face value without any commission or fee.",
          "You can purchase authentic prize bonds directly from the following official institutions across Pakistan:",
        ],
        bulletPoints: [
          "State Bank of Pakistan Banking Services Corporation (SBP BSC) field offices in 16 major cities.",
          "National Savings Centers (CDNS branches nationwide).",
          "Authorized branches of commercial banks including National Bank of Pakistan (NBP), Habib Bank Limited (HBL), United Bank Limited (UBL), MCB Bank, Allied Bank (ABL), and Bank Alfalah.",
          "Post Offices: Designated General Post Offices (GPOs) carry regular bearer denominations.",
        ],
        callout: {
          type: "info",
          title: "Full Value Encashment",
          text: "When you want your money back, simply present the bond at any of the authorized counters listed above. You will receive 100% of your face value in cash or direct deposit with zero exit fees.",
        },
      },
    ],
    faqs: [
      {
        question: "Are prize bonds considered Halal in Pakistan?",
        answer:
          "Opinions among Islamic scholars vary. Because prize bonds do not offer fixed guaranteed interest (Riba) and the principal capital is fully protected, some institutions consider them permissible government certificates, while other scholars view the draw mechanism as resembling speculative luck. Many scholars consider Premium Registered Prize Bonds compliant as they distribute documented operational profit alongside awards. Consult your trusted religious scholar for personal guidance.",
      },
      {
        question: "What happens if a bearer prize bond is lost or damaged?",
        answer:
          "Because regular prize bonds (Rs. 100 to Rs. 1,500) are bearer instruments, losing a physical bond is equivalent to losing cash currency. However, if a bond is physically mutilated or slightly damaged (burnt, washed, or torn) but the serial numbers and watermark remain identifiable, you can submit it to the SBP BSC Claims Counter for inspection and replacement under SBP Defaced Bond Rules.",
      },
      {
        question: "Can an overseas Pakistani or foreign national purchase Pakistani prize bonds?",
        answer:
          "Yes. Non-resident Pakistanis (NRPs) holding a valid National Identity Card for Overseas Pakistanis (NICOP) or Pakistan Origin Card (POC) can purchase and claim prize bonds. For Premium Registered Bonds, overseas Pakistanis can invest directly through designated foreign currency and Roshan Digital Accounts (RDA).",
      },
      {
        question: "How is prize money paid to joint bondholders?",
        answer:
          "Bearer bonds are paid to the individual presenter holding the physical certificate. Premium Registered bonds can be registered jointly, in which case prize money and bi-annual profits are credited to the primary joint bank account designated on the registration mandate.",
      },
      {
        question: "Can I claim prize money if my bond was bought just a few days before the draw?",
        answer:
          "To be officially eligible for an upcoming draw, newly purchased bearer bonds must generally have been in circulation for at least 60 days before the draw date. If bought within the 60-day lockout window, the bond enters the subsequent quarterly draw cycle.",
      },
    ],
    conclusion: [
      "Prize bonds continue to represent one of the safest and most popular capital-preserving savings instruments in Pakistan. With full sovereign backing from the Government of Pakistan, zero credit default risk, and quarterly chances to win life-changing cash prizes, they offer a secure alternative to speculative investments.",
      "To maximize your benefits, always maintain an Active Taxpayer status on the FBR list to save 15% on withholding taxes, verify your serial numbers systematically using automated checker tools after every draw, and remember the strict 6-year statutory claim window.",
    ],
    sources: [
      {
        title: "National Prize Bonds Scheme Rules & Schedules",
        publisher: "Central Directorate of National Savings (CDNS), Government of Pakistan",
        url: "https://savings.gov.pk",
        note: "Official regulatory repository for draw dates, rules, and gazette schedules.",
      },
      {
        title: "Prize Bond Draw Operations & SBP BSC Field Office Guidelines",
        publisher: "State Bank of Pakistan Banking Services Corporation (SBP BSC)",
        url: "https://www.sbp.org.pk",
        note: "Supervising central bank authority for mechanical draw balloting and claim disbursements.",
      },
      {
        title: "Section 156: Withholding Tax on Prize Money and Winnings",
        publisher: "Federal Board of Revenue (FBR), Income Tax Ordinance 2001",
        url: "https://fbr.gov.pk",
        note: "Statutory tax code governing 15% filer and 30% non-filer deduction rates.",
      },
    ],
  },
];
