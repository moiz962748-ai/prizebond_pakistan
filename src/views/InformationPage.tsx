'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  FileText,
  Calculator,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Award,
  Calendar,
  Search,
  Sparkles,
  Layers,
  Banknote,
  Info,
  Clock,
  Compass,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
  MessageSquare,
  UserCheck,
  Share2,
  Printer,
  X,
  Check,
  Copy,
  ArrowLeft,
} from 'lucide-react';
import { ARTICLES, FAQS, DENOMINATIONS } from '../data/mockData';
import { GUIDE_ARTICLES } from '../data/articleGuidesData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LastUpdatedBadge } from '../components/common/LastUpdatedBadge';
import { AdSensePlaceholder } from '../components/common/AdSensePlaceholder';
import { VideoGuideWidget } from '../components/common/VideoGuideWidget';

interface InformationPageProps {
  slug?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const InformationPage: React.FC<InformationPageProps> = ({
  slug,
  onNavigate,
}) => {
  const isHubView = !slug || slug === 'hub' || slug === 'index';
  
  // Find detailed article based on slug from GUIDE_ARTICLES
  const detailedArticle = GUIDE_ARTICLES.find(
    (g) => g.frontmatter.slug === slug
  ) || GUIDE_ARTICLES[0];

  const currentArticle = ARTICLES.find((a) => a.slug === slug) || ARTICLES[0];

  const [tocOpenMobile, setTocOpenMobile] = useState<boolean>(true);
  const [showCorrectionModal, setShowCorrectionModal] = useState<boolean>(false);
  const [correctionNote, setCorrectionNote] = useState<string>('');
  const [correctionSubmitted, setCorrectionSubmitted] = useState<boolean>(false);

  const [miniDenom, setMiniDenom] = useState<string>('1500');
  const [miniBondNo, setMiniBondNo] = useState<string>('748291');
  const [miniCheckResult, setMiniCheckResult] = useState<{
    searched: boolean;
    isWinner: boolean;
    prizeDetails?: string;
  }>({ searched: false, isWinner: false });

  const handleMiniCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!miniBondNo.trim()) return;
    const num = parseInt(miniBondNo, 10);
    const won = num % 7 === 0 || num === 748291;
    setMiniCheckResult({
      searched: true,
      isWinner: won,
      prizeDetails: won
        ? `1st Prize Winner! Rs. 3,000,000 in Draw #102 (${miniDenom} Denomination)`
        : 'No winnings found for this number in recent draws.',
    });
  };

  const aeoAnswers = [
    {
      q: 'What are Prize Bonds in Pakistan?',
      a: 'Prize Bonds are capital-guaranteed financial security certificates issued by the Central Directorate of National Savings (CDNS) and State Bank of Pakistan (SBP). The principal money never depreciates, and bondholders participate in quarterly lucky draw events for cash prizes.',
      link: 'prizebonds',
      linkLabel: 'Explore Denominations',
    },
    {
      q: 'How do Prize Bond draws work?',
      a: 'Draws are conducted every 3 months for each active denomination at State Bank field offices on a rotating schedule across major cities. Winning numbers are drawn using computerized randomized machinery under supervision of an independent committee.',
      link: 'schedule',
      linkLabel: 'View Draw Schedule',
    },
    {
      q: 'How can I check a Prize Bond?',
      a: 'You can check your Prize Bond by entering your 6-digit serial number, pasting bulk lists, or entering series ranges on our automated online checker tool, which instantly searches 10+ years of official SBP gazette records.',
      link: 'checker',
      linkLabel: 'Open Prize Bond Checker',
    },
    {
      q: 'Where can I find Prize Bond results?',
      a: 'Official winning numbers are published in government gazettes immediately after each draw. You can view, search, or download complete gazette lists directly on our Results Hub.',
      link: 'results',
      linkLabel: 'View Results Hub',
    },
  ];

  const [calcWinnings, setCalcWinnings] = useState<number>(3000000);
  const [isFiler, setIsFiler] = useState<boolean>(true);

  const taxRate = isFiler ? 0.15 : 0.3;
  const taxAmount = calcWinnings * taxRate;
  const netAmount = calcWinnings - taxAmount;

  const [openFaqId, setOpenFaqId] = useState<string | null>('art-faq-0');

  const currentIndex = ARTICLES.findIndex((a) => a.slug === currentArticle?.slug);
  const prevArticle = currentIndex > 0 ? ARTICLES[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < ARTICLES.length - 1 ? ARTICLES[currentIndex + 1] : null;

  const relatedArticles = ARTICLES.filter((a) => a.slug !== currentArticle?.slug).slice(0, 3);

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // IF USER IS VIEWING A SPECIFIC GUIDE ARTICLE
  if (!isHubView && slug) {
    const frontmatter = detailedArticle.frontmatter;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <Breadcrumbs
            items={[
              { label: 'Home', onClick: () => onNavigate('home') },
              { label: 'Information', onClick: () => onNavigate('information', 'hub') },
              { label: frontmatter.category, onClick: () => onNavigate('information', 'hub') },
              { label: frontmatter.title },
            ]}
          />
          <button
            type="button"
            onClick={() => onNavigate('information', 'hub')}
            className="text-xs font-black text-[#006633] hover:underline flex items-center gap-1 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            ← Back to Information Hub
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <header className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-[#004D26] text-xs font-black rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#006633]" /> {frontmatter.category}
                </span>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {frontmatter.reading_time_min} min read
                  </span>
                  <LastUpdatedBadge date={frontmatter.updated} />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                {frontmatter.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                {frontmatter.meta_description}
              </p>
            </header>

            {/* AI Overview Section */}
            <aside aria-label="AI Overview Summary" className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white border-2 border-emerald-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#006633] text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Overview</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                {detailedArticle.aiOverview}
              </p>
            </aside>

            {/* Detailed Article Sections */}
            <article className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-10 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {detailedArticle.sections.map((sec, idx) => (
                <section
                  key={idx}
                  id={sec.id}
                  className="space-y-4 scroll-mt-24 border-b border-slate-100 pb-8 last:border-0 last:pb-0"
                >
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono text-base font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      #{idx + 1}
                    </span>
                    {sec.heading}
                  </h2>

                  {sec.subheading && (
                    <p className="text-xs sm:text-sm font-semibold text-emerald-800 -mt-2">
                      {sec.subheading}
                    </p>
                  )}

                  <div className="space-y-3">
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-slate-700 leading-relaxed font-normal">{p}</p>
                    ))}
                  </div>

                  {sec.bulletPoints && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 my-4">
                      {sec.bulletPoints.map((bp, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-[#006633] shrink-0 mt-0.5" />
                          <span className="font-medium">{bp}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.table && (
                    <div className="my-5 overflow-hidden border border-slate-200 rounded-2xl shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-900 text-white font-extrabold">
                              {sec.table.headers.map((h, hIdx) => (
                                <th key={hIdx} className="p-3.5 border-b border-slate-800">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium bg-white">
                            {sec.table.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-emerald-50/40 transition-colors">
                                {row.map((c, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`p-3.5 ${
                                      cIdx === 0
                                        ? 'font-bold text-slate-900 bg-slate-50/50'
                                        : 'text-slate-700'
                                    }`}
                                  >
                                    {c}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Interactive Tax Calculator on Tax Section */}
                  {sec.id === 'prize-tax' && (
                    <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4 my-4">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                        <Calculator className="w-4 h-4 text-amber-400" />
                        <h4 className="text-sm font-black text-white">Live Prize Tax Withholding Calculator</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Prize Amount (PKR)</label>
                          <input
                            type="number"
                            value={calcWinnings}
                            onChange={(e) => setCalcWinnings(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm"
                          />
                        </div>
                        <div className="p-3 bg-slate-800 rounded-xl">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Tax Deduction</div>
                          <div className="text-base font-black text-rose-400 font-mono mt-0.5">- Rs. {taxAmount.toLocaleString('en-PK')}</div>
                        </div>
                        <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800">
                          <div className="text-[10px] text-emerald-400 uppercase font-bold">Net Payout</div>
                          <div className="text-base font-black text-emerald-300 font-mono mt-0.5">Rs. {netAmount.toLocaleString('en-PK')}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </article>

            {/* FAQs for Guide */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-[#006633]" />
                <span>Frequently Asked Questions</span>
              </div>
              <div className="space-y-3">
                {detailedArticle.faqs.map((f, fIdx) => (
                  <div key={fIdx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-4 bg-slate-50 font-extrabold text-xs text-slate-900">{f.question}</div>
                    <div className="p-4 bg-white text-xs text-slate-600 border-t border-slate-100">{f.answer}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* PREVIOUS / NEXT NAVIGATION */}
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {prevArticle ? (
                <button
                  type="button"
                  onClick={() => onNavigate('information', prevArticle.slug)}
                  className="p-4 bg-white hover:bg-emerald-50/50 rounded-2xl border border-slate-200 hover:border-emerald-300 text-left transition-all space-y-1 group cursor-pointer"
                >
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">← Previous Guide</div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#006633] truncate">{prevArticle.title}</div>
                </button>
              ) : <div />}

              {nextArticle ? (
                <button
                  type="button"
                  onClick={() => onNavigate('information', nextArticle.slug)}
                  className="p-4 bg-white hover:bg-emerald-50/50 rounded-2xl border border-slate-200 hover:border-emerald-300 text-right transition-all space-y-1 group cursor-pointer"
                >
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Next Guide →</div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#006633] truncate">{nextArticle.title}</div>
                </button>
              ) : <div />}
            </nav>
          </div>

          <aside className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md border border-slate-800">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> Useful Tools & Pages
              </h3>
              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => onNavigate('checker')}
                  className="w-full p-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-left flex items-center justify-between cursor-pointer shadow-xs"
                >
                  <span>Prize Bond Checker</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('results')}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 text-left flex items-center justify-between cursor-pointer"
                >
                  <span>Draw Results Hub</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // MASTER INFORMATION HUB VIEW (Overview Page)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('home') },
          { label: 'Information Hub' },
        ]}
      />

      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-xs relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -z-0 pointer-events-none transform translate-x-20 -translate-y-20 opacity-80" />
        <div className="relative z-10 space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#004D26] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 w-max">
            <BookOpen className="w-3.5 h-3.5 text-[#006633]" /> Official Knowledge & Information Directory
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Information Hub Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
            Understand Prize Bond denominations, prizes, draws, results and how to check your Prize Bond using clear, verified government facts and interactive tools.
          </p>
        </div>
      </section>

      {/* FEATURED GUIDES */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
              Knowledge Base
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Featured Prize Bond Guides
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Showing {ARTICLES.length} Educational Guides
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((art) => (
            <div
              key={art.slug}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-[#004D26] font-black uppercase">
                    {art.category}
                  </span>
                  <span className="text-slate-500 font-medium">{art.readTime}</span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-[#006633] transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                    {art.shortSummary}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 font-medium">
                  Updated: {art.lastUpdated}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('information', art.slug)}
                  className="font-black text-[#006633] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
              Direct Answers & Knowledge
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('faqs')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-colors cursor-pointer w-max"
          >
            View All FAQs →
          </button>
        </div>

        <div className="space-y-3 pt-2">
          {FAQS.slice(0, 5).map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100/80 font-extrabold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};