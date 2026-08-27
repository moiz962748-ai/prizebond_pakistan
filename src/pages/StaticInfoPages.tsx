'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  Mail,
  ShieldCheck,
  Building2,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lock,
  Scale,
  HelpCircle,
  ListTree,
  Search,
  Clock,
  ArrowRight,
  UserCheck,
  RefreshCw,
  Award,
  Sparkles,
  MessageSquare,
  Landmark,
  Layers,
  X,
  Check,
} from 'lucide-react';

interface StaticPageProps {
  pageType: 'about' | 'contact' | 'sitemap' | 'editorial-policy' | 'privacy' | 'terms' | 'disclaimer';
  onNavigate: (view: string, param?: string) => void;
}

export const StaticInfoPages: React.FC<StaticPageProps> = ({ pageType, onNavigate }) => {
  // Contact Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('General Question');
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Active Anchor for Table of Contents
  const [tocOpenMobile, setTocOpenMobile] = useState(false);

  // Sitemap Search / Filter State
  const [sitemapFilter, setSitemapFilter] = useState('');

  // Handle Contact Form Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) {
      setFormStatus('error');
      return;
    }
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      setFormName('');
      setFormEmail('');
      setFormMessage('');
    }, 600);
  };

  // Scroll to Anchor ID
  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Pre-fill "Data Correction" on Contact form
  const handleTriggerCorrection = () => {
    if (pageType !== 'contact') {
      onNavigate('contact');
    }
    setFormSubject('Data Correction');
    setTimeout(() => {
      scrollToAnchor('contact-form-section');
    }, 100);
  };

  // Shared Helper: Render Legal/Trust Compact Hero
  const renderHero = (
    title: string,
    categoryLabel: string,
    lastUpdated: string,
    introText: string,
    badgeIcon: React.ReactNode
  ) => (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="px-3 py-1 bg-emerald-100 text-[#004D26] text-xs font-black rounded-lg uppercase tracking-wider flex items-center gap-1.5">
          {badgeIcon} {categoryLabel}
        </span>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Last Updated: {lastUpdated}</span>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
        {title}
      </h1>

      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
        {introText}
      </p>

      <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 border-t border-slate-100">
        <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
          <ShieldCheck className="w-4 h-4 text-[#006633]" /> SBP & CDNS Official Gazette Compliance
        </span>
        <span className="flex items-center gap-1.5 text-slate-600">
          <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Reviewed by PrizeBond Pakistan Desk
        </span>
      </div>
    </div>
  );

  // Shared Helper: Render Table of Contents
  const renderToc = (items: { id: string; label: string }[]) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 sticky top-24">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-[#006633]" />
          <span>On This Page</span>
        </div>
        <button
          type="button"
          onClick={() => setTocOpenMobile(!tocOpenMobile)}
          className="lg:hidden text-xs font-bold text-[#006633] flex items-center gap-1 cursor-pointer"
        >
          {tocOpenMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <nav className={`space-y-1 text-xs font-bold ${tocOpenMobile ? 'block' : 'hidden lg:block'}`}>
        {items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              scrollToAnchor(item.id);
              setTocOpenMobile(false);
            }}
            className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#006633] border border-slate-100 hover:border-emerald-200 transition-all flex items-center justify-between cursor-pointer group"
          >
            <span className="truncate pr-2">
              <span className="text-[#006633] font-mono mr-1.5">{idx + 1}.</span>
              {item.label}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#006633] shrink-0" />
          </button>
        ))}
      </nav>
    </div>
  );

  // Shared Helper: Related Legal / Trust Navigation Box
  const renderRelatedLegalLinks = () => (
    <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md space-y-3 border border-slate-800">
      <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
        <Scale className="w-4 h-4" /> Legal & Trust Network
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <button
          type="button"
          onClick={() => onNavigate('about')}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-left font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
        >
          About Us
        </button>
        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-left font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
        >
          Contact Team
        </button>
        <button
          type="button"
          onClick={() => onNavigate('editorial-policy')}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-left font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
        >
          Editorial Policy
        </button>
        <button
          type="button"
          onClick={() => onNavigate('disclaimer')}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-left font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
        >
          Disclaimer
        </button>
        <button
          type="button"
          onClick={() => onNavigate('privacy')}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-left font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
        >
          Privacy Policy
        </button>
        <button
          type="button"
          onClick={() => onNavigate('terms')}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-left font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
        >
          Terms & Conditions
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* 01. BREADCRUMBS */}
      <div className="flex items-center justify-between bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
        <Breadcrumbs
          items={[
            { label: 'Home', onClick: () => onNavigate('home') },
            {
              label:
                pageType === 'editorial-policy'
                  ? 'Trust'
                  : ['privacy', 'terms', 'disclaimer'].includes(pageType)
                  ? 'Legal'
                  : 'Utility',
            },
            {
              label:
                pageType === 'about'
                  ? 'About'
                  : pageType === 'contact'
                  ? 'Contact'
                  : pageType === 'sitemap'
                  ? 'Site Map'
                  : pageType === 'editorial-policy'
                  ? 'Editorial Policy'
                  : pageType === 'privacy'
                  ? 'Privacy Policy'
                  : pageType === 'terms'
                  ? 'Terms & Conditions'
                  : 'Disclaimer',
            },
          ]}
        />
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="text-xs font-black text-[#006633] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
        >
          ← Return to Home
        </button>
      </div>

      {/* PAGE 1: ABOUT US PAGE VIEW */}
      {pageType === 'about' && (
        <div className="space-y-8">
          {renderHero(
            'About PrizeBond Pakistan',
            'Utility & Platform Index',
            '15 August 2026',
            'PrizeBond Pakistan is a dedicated digital portal providing official State Bank of Pakistan gazette results, multi-number verification engines, quarterly draw schedules, and tax guidelines for National Savings bondholders.',
            <Building2 className="w-3.5 h-3.5 text-[#006633]" />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* 1. What PrizeBond Pakistan Is */}
              <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-[#004D26] flex items-center justify-center font-mono font-black text-xs">
                    01
                  </span>
                  What PrizeBond Pakistan Is
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  PrizeBond Pakistan was established to transform dense, multi-page printed government draw gazettes into clean, instantly searchable digital tools. We serve retail investors across Pakistan, offering transparent, accurate, and free access to historical and current Prize Bond records.
                </p>
                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-[#004D26] font-bold leading-relaxed">
                  Our core objective is to eliminate manual draw checking errors and provide reliable financial guidance for holders of standard and premium Prize Bond certificates.
                </div>
              </section>

              {/* 2. What We Provide */}
              <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-[#004D26] flex items-center justify-center font-mono font-black text-xs">
                    02
                  </span>
                  What We Provide
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <Search className="w-5 h-5 text-[#006633]" />
                    <h3 className="font-extrabold text-slate-900">Bulk Bond Checker</h3>
                    <p className="text-slate-600 font-medium">
                      Search single numbers, range series, or paste up to 500 serial numbers against 10+ years of official draw records.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <FileText className="w-5 h-5 text-[#006633]" />
                    <h3 className="font-extrabold text-slate-900">Official Gazette Repositories</h3>
                    <p className="text-slate-600 font-medium">
                      Complete 1st, 2nd, and 3rd prize lists published immediately following SBP BSC draw ceremonies.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <Clock className="w-5 h-5 text-[#006633]" />
                    <h3 className="font-extrabold text-slate-900">Annual Draw Schedule</h3>
                    <p className="text-slate-600 font-medium">
                      Updated venue, date, and city details for all active denominations (Rs. 100 to Rs. 40,000 Premium).
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <Scale className="w-5 h-5 text-[#006633]" />
                    <h3 className="font-extrabold text-slate-900">Tax & Claim Guidance</h3>
                    <p className="text-slate-600 font-medium">
                      Current FBR withholding tax rates (15% Filers / 30% Non-Filers) and official claim submission steps.
                    </p>
                  </div>
                </div>
              </section>

              {/* 3. Our Principles & Trust Block */}
              <section className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800 space-y-6">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-800 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                    Our Foundation
                  </span>
                  <h2 className="text-xl font-black text-white">Our Principles</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <div className="font-black text-amber-400">1. Absolute Accuracy</div>
                    <div className="text-slate-300 font-medium">
                      Every winning number is verified against officially signed SBP gazette sheets prior to publication.
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <div className="font-black text-amber-400">2. Complete Transparency</div>
                    <div className="text-slate-300 font-medium">
                      We explicitly declare our sources, last updated dates, and editorial verification methodologies.
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <div className="font-black text-amber-400">3. User-First Privacy</div>
                    <div className="text-slate-300 font-medium">
                      Saved bond lists remain stored inside your browser&apos;s local cache — never transferred to remote databases.
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <div className="font-black text-amber-400">4. Responsible Information</div>
                    <div className="text-slate-300 font-medium">
                      No clickbait, no fake prize promises, and strict compliance with ethical financial publishing standards.
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Transparency & What We Do Not Claim */}
              <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#006633]" />
                  Transparency & Legal Boundaries
                </h2>

                <div className="space-y-3 text-xs text-slate-700 font-medium leading-relaxed">
                  <p>
                    <strong>Our Role:</strong> PrizeBond Pakistan operates purely as an independent informational directory and verification utility.
                  </p>
                  <p className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 font-bold">
                    <strong>What We Do NOT Claim:</strong> We are NOT directly affiliated with the Central Directorate of National Savings (CDNS) or the State Bank of Pakistan (SBP). We do not issue, buy, or sell physical prize bonds, nor do we predict or guarantee winning draw numbers.
                  </p>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#004D26] to-[#006633] text-white shadow-md space-y-4">
                <h3 className="text-base font-black text-white">Need Assistance?</h3>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                  Have questions or found a discrepancy in a gazette list? Contact our editorial team directly.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center"
                >
                  Contact Editorial Team →
                </button>
              </div>

              {renderRelatedLegalLinks()}
            </aside>
          </div>
        </div>
      )}

      {/* PAGE 2: CONTACT PAGE VIEW */}
      {pageType === 'contact' && (
        <div className="space-y-8">
          {renderHero(
            'Contact PrizeBond Pakistan',
            'Editorial & Technical Desk',
            '15 August 2026',
            'Have an inquiry regarding draw gazettes, technical checker issues, or data correction? Get in touch with our team using the verified form below.',
            <Mail className="w-3.5 h-3.5 text-[#006633]" />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Prominent Data Correction Box */}
              <section className="bg-gradient-to-r from-amber-500/10 via-emerald-50 to-white p-6 rounded-2xl border-2 border-amber-300 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>Report Incorrect or Outdated Information</span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Data fidelity is our top priority. If you noticed an error in a draw gazette, denomination detail, or tax calculation, submit a direct correction report below so our editors can review it against official State Bank records.
                </p>
                <button
                  type="button"
                  onClick={handleTriggerCorrection}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Report a Data Issue Below ↓</span>
                </button>
              </section>

              {/* Form Section */}
              <section id="contact-form-section" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Send Us a Message
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Please fill out all required fields. We respond to inquiries within 24–48 business hours.
                  </p>
                </div>

                {formStatus === 'success' ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-[#006633] mx-auto" />
                    <h3 className="text-base font-black text-[#004D26]">
                      Your message has been submitted successfully.
                    </h3>
                    <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
                      Thank you for contacting PrizeBond Pakistan. Our desk will review your inquiry and respond if needed.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormStatus('idle')}
                      className="px-4 py-2 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold text-xs rounded-xl cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                    {formStatus === 'error' && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>We couldn&apos;t submit your message. Please fill all required fields and try again.</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-slate-700 font-bold mb-1">
                          Full Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g. Muhammad Ali"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-[#006633] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-email" className="block text-slate-700 font-bold mb-1">
                          Email Address *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-[#006633] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="block text-slate-700 font-bold mb-1">
                        Inquiry Subject *
                      </label>
                      <select
                        id="contact-subject"
                        value={formSubject}
                        onChange={(e) => setFormSubject(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#006633] focus:bg-white cursor-pointer"
                      >
                        <option value="General Question">General Question</option>
                        <option value="Data Correction">Data Correction / Report Issue</option>
                        <option value="Technical Problem">Technical Problem with Checker</option>
                        <option value="Business Inquiry">Business / Partnership Inquiry</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-slate-700 font-bold mb-1">
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        required
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        placeholder="Please describe your query or report in detail..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-[#006633] focus:bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="px-6 py-3.5 bg-[#006633] hover:bg-[#004D26] text-white font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Submitting Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Inquiry</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </section>
            </div>

            {/* Contact Sidebar */}
            <aside className="space-y-6">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#006633]" />
                  Official Draw Inquiries
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  For official prize claim processing, bond certificate verification, or tax exemption certificate issuance, please visit nearest State Bank BSC counter or National Savings Centre:
                </p>
                <div className="space-y-2 font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>• SBP Banking Services Corporation</div>
                  <div>• Central Directorate of National Savings</div>
                  <div>• Authorized Commercial Bank Branches</div>
                </div>
              </div>

              {renderRelatedLegalLinks()}
            </aside>
          </div>
        </div>
      )}

      {/* PAGE 3: SITEMAP VIEW */}
      {pageType === 'sitemap' && (
        <div className="space-y-8">
          {renderHero(
            'PrizeBond Pakistan Site Map',
            'Hierarchical Site Index',
            '15 August 2026',
            'A structured human-readable directory of all official pages, verification utilities, draw schedules, and information guides on PrizeBond Pakistan.',
            <ListTree className="w-3.5 h-3.5 text-[#006633]" />
          )}

          {/* Quick Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={sitemapFilter}
              onChange={(e) => setSitemapFilter(e.target.value)}
              placeholder="Filter sitemap topics (e.g., '1500', 'tax', 'schedule', 'checker')..."
              className="w-full text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {sitemapFilter && (
              <button
                type="button"
                onClick={() => setSitemapFilter('')}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* GROUP 1: MAIN NAVIGATION */}
            {(!sitemapFilter || 'main home prize bonds results schedule checker'.includes(sitemapFilter.toLowerCase())) && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-sm font-black text-[#006633] uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Main Navigation
                </h2>
                <ul className="space-y-2 text-xs font-bold text-slate-800">
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('home')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Home Page
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('checker')}
                      className="text-emerald-800 hover:text-[#004D26] font-extrabold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-[#006633]" /> Bulk Prize Bond Checker
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('results')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Draw Results Hub
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('schedule')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> 2026 Draw Schedule
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('prizebonds')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Prize Bonds Directory
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* GROUP 2: PRIZE BOND DENOMINATIONS */}
            {(!sitemapFilter || 'prize bond denomination 100 200 750 1500 25000 40000 premium'.includes(sitemapFilter.toLowerCase())) && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-sm font-black text-[#006633] uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#006633]" />
                  Prize Bond Denominations
                </h2>
                <ul className="space-y-2 text-xs font-bold text-slate-800">
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('prizebonds')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> All Denominations Overview
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('denomination', '100')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Rs. 100 Prize Bond Details
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('denomination', '200')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Rs. 200 Prize Bond Details
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('denomination', '750')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Rs. 750 Prize Bond Details
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('denomination', '1500')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Rs. 1,500 Prize Bond Details
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('denomination', '25000')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Rs. 25,000 Premium Bond
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('denomination', '40000')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Rs. 40,000 Premium Bond
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* GROUP 3: INFORMATION & GUIDES */}
            {(!sitemapFilter || 'information guide faq tax claim rule buy check'.includes(sitemapFilter.toLowerCase())) && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-sm font-black text-[#006633] uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#006633]" />
                  Information & Guides
                </h2>
                <ul className="space-y-2 text-xs font-bold text-slate-800">
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('information', 'hub')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Information Hub
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('information', 'how-prize-bonds-work')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> How Prize Bonds Work
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('information', 'how-to-buy-prize-bonds')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> How to Buy Prize Bonds
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('information', 'how-to-check-prize-bonds')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> How to Check Bonds
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('information', 'prize-bond-rules')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Prize Bond Rules
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('information', 'prize-money-and-tax')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Prize Money & Tax Deduction
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('information', 'how-to-claim-a-prize')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> How to Claim Prize Money
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('faqs')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Frequently Asked Questions
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* GROUP 4: TRUST & EDITORIAL */}
            {(!sitemapFilter || 'trust editorial policy about contact verification'.includes(sitemapFilter.toLowerCase())) && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-sm font-black text-[#006633] uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#006633]" />
                  Trust & Editorial
                </h2>
                <ul className="space-y-2 text-xs font-bold text-slate-800">
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('about')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> About PrizeBond Pakistan
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('contact')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Contact Editorial Team
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('editorial-policy')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Editorial & Data Policy
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* GROUP 5: LEGAL & POLICIES */}
            {(!sitemapFilter || 'legal disclaimer privacy terms condition'.includes(sitemapFilter.toLowerCase())) && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-sm font-black text-[#006633] uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#006633]" />
                  Legal & Policies
                </h2>
                <ul className="space-y-2 text-xs font-bold text-slate-800">
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('disclaimer')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Official Disclaimer
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('privacy')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('terms')}
                      className="hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> Terms & Conditions
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAGE 4: EDITORIAL & DATA POLICY VIEW */}
      {pageType === 'editorial-policy' && (
        <div className="space-y-8">
          {renderHero(
            'Editorial & Data Policy',
            'Verification & Data Standards',
            '15 August 2026',
            'Our comprehensive methodology for sourcing, ingesting, cross-checking, and updating State Bank of Pakistan Prize Bond draw gazettes and financial guidance.',
            <ShieldCheck className="w-3.5 h-3.5 text-[#006633]" />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Prominent Data Accuracy Callout */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#004D26] to-[#006633] text-white shadow-md space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-black text-sm uppercase tracking-wider">
                  <ShieldCheck className="w-5 h-5" /> Data Accuracy Commitment
                </div>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                  We maintain zero tolerance for gazette transcription errors. All published winning serial numbers are digitized and double-checked against printed government gazettes issued by the SBP Banking Services Corporation.
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-200 font-bold">Found an issue?</span>
                  <button
                    type="button"
                    onClick={handleTriggerCorrection}
                    className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg cursor-pointer transition-colors"
                  >
                    Submit Data Correction →
                  </button>
                </div>
              </div>

              {/* Editorial Sections */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <section id="ed-1" className="space-y-3 scroll-mt-24">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">01.</span> How We Collect Information
                  </h2>
                  <p>
                    PrizeBond Pakistan ingests official draw results directly from official gazettes distributed by the Central Directorate of National Savings (CDNS) and State Bank of Pakistan field offices (Karachi, Lahore, Islamabad, Peshawar, Quetta, Multan, Faisalabad, Rawalpindi, etc.).
                  </p>
                </section>

                <section id="ed-2" className="space-y-3 scroll-mt-24 border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">02.</span> How We Verify Information
                  </h2>
                  <p>
                    Every draw list undergoes a two-step verification workflow:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 font-medium text-slate-800">
                    <li>Computerized OCR optical scanning of signed gazette pages.</li>
                    <li>Manual random sampling of 1st, 2nd, and 3rd prize numbers by our editorial verification desk.</li>
                  </ul>
                </section>

                <section id="ed-3" className="space-y-3 scroll-mt-24 border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">03.</span> How We Update Information
                  </h2>
                  <p>
                    Draw results are updated on scheduled draw dates within 15–30 minutes of official gazette signing. Annual schedule changes or venue shifts issued by CDNS are updated immediately upon announcement.
                  </p>
                </section>

                <section id="ed-4" className="space-y-3 scroll-mt-24 border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">04.</span> How We Handle Corrections
                  </h2>
                  <p>
                    In the event of a gazette typo or misprint reported by users or official SBP corrigenda notices, our team verifies the claim against original gazette PDF archives and issues a public correction flag within 2 hours.
                  </p>
                </section>

                <section id="ed-5" className="space-y-3 scroll-mt-24 border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">05.</span> Editorial Independence & Advertising
                  </h2>
                  <p>
                    PrizeBond Pakistan maintains strict separation between editorial content and third-party web advertisements. Advertisements are clearly designated and never influence gazette outputs or checking results.
                  </p>
                </section>
              </div>
            </div>

            {/* Sidebar TOC */}
            <aside className="space-y-6">
              {renderToc([
                { id: 'ed-1', label: 'Information Collection' },
                { id: 'ed-2', label: 'Verification Workflow' },
                { id: 'ed-3', label: 'Update Timelines' },
                { id: 'ed-4', label: 'Correction Process' },
                { id: 'ed-5', label: 'Editorial Independence' },
              ])}
              {renderRelatedLegalLinks()}
            </aside>
          </div>
        </div>
      )}

      {/* PAGE 5: DISCLAIMER VIEW */}
      {pageType === 'disclaimer' && (
        <div className="space-y-8">
          {renderHero(
            'Official Legal Disclaimer',
            'Statutory Notice',
            '15 August 2026',
            'Important notice regarding data accuracy, independent operation, and verification requirements for prize bondholders in Pakistan.',
            <Scale className="w-3.5 h-3.5 text-[#006633]" />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <section id="disc-1" className="space-y-3 scroll-mt-24">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">1.</span> Informational Purpose Only
                  </h2>
                  <p>
                    All content, draw results, checker tools, and tax calculators provided on PrizeBond Pakistan are for general informational and personal reference purposes only.
                  </p>
                </section>

                <section id="disc-2" className="space-y-3 scroll-mt-24 border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">2.</span> Government Affiliation Clarification
                  </h2>
                  <p className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 font-bold">
                    PrizeBond Pakistan is an independent private digital platform. We are NOT directly affiliated with, authorized by, or an official branch of the State Bank of Pakistan (SBP), State Bank Banking Services Corporation (SBP BSC), or the Central Directorate of National Savings (CDNS).
                  </p>
                </section>

                <section id="disc-3" className="space-y-3 scroll-mt-24 border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">3.</span> Counter Claim Requirement
                  </h2>
                  <p>
                    While we endeavor to keep all draw records 100% accurate, bondholders MUST verify winning bond certificates at SBP BSC counters or National Savings Centers before submitting official prize claim forms. PrizeBond Pakistan is not liable for claims submitted on unverified numbers.
                  </p>
                </section>

                <section id="disc-4" className="space-y-3 scroll-mt-24 border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">4.</span> Financial & Tax Disclaimer
                  </h2>
                  <p>
                    Tax calculation outputs (15% for Active Tax Filers and 30% for Non-Filers under Section 156 of Income Tax Ordinance 2001) are estimates. Users should consult qualified tax advisors or FBR ATL records for official tax status verification.
                  </p>
                </section>
              </div>
            </div>

            <aside className="space-y-6">
              {renderToc([
                { id: 'disc-1', label: 'Informational Purpose' },
                { id: 'disc-2', label: 'Government Affiliation' },
                { id: 'disc-3', label: 'Counter Verification' },
                { id: 'disc-4', label: 'Financial & Tax Estimates' },
              ])}
              {renderRelatedLegalLinks()}
            </aside>
          </div>
        </div>
      )}

      {/* PAGE 6: PRIVACY POLICY VIEW */}
      {pageType === 'privacy' && (
        <div className="space-y-8">
          {renderHero(
            'Privacy Policy',
            'Data Protection & Local Cache',
            '15 August 2026',
            'Learn how PrizeBond Pakistan protects user privacy, utilizes local browser caching, and complies with modern privacy standards.',
            <Lock className="w-3.5 h-3.5 text-[#006633]" />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <section id="priv-1" className="space-y-3 scroll-mt-24">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">1.</span> Client-Side Local Storage Caching
                  </h2>
                  <p className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-[#004D26] font-bold">
                    PrizeBond Pakistan prioritizes your privacy. Your saved prize bond numbers, custom tag labels, and search preferences remain stored locally in your web browser&apos;s <code>localStorage</code>. They are NEVER sent to or stored on remote servers.
                  </p>
                </section>

                <section id="priv-2" className="space-y-3 scroll-mt-24 border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">2.</span> Information Users Provide
                  </h2>
                  <p>
                    We only collect personal information (Name, Email, Message) when voluntarily submitted via our Contact Form. This data is strictly used to reply to user inquiries and is never sold to third parties.
                  </p>
                </section>

                <section id="priv-3" className="space-y-3 scroll-mt-24 border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">3.</span> Cookies & Analytics
                  </h2>
                  <p>
                    We utilize standard anonymous web traffic performance tools to monitor site health and page load speeds across Pakistan. No financial tracking or identity profiling is conducted.
                  </p>
                </section>

                <section id="priv-4" className="space-y-3 scroll-mt-24 border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">4.</span> Security Standards
                  </h2>
                  <p>
                    All connection traffic to PrizeBond Pakistan is encrypted over HTTPS (SSL/TLS).
                  </p>
                </section>
              </div>
            </div>

            <aside className="space-y-6">
              {renderToc([
                { id: 'priv-1', label: 'Local Browser Storage' },
                { id: 'priv-2', label: 'User Provided Info' },
                { id: 'priv-3', label: 'Cookies & Analytics' },
                { id: 'priv-4', label: 'HTTPS Security' },
              ])}
              {renderRelatedLegalLinks()}
            </aside>
          </div>
        </div>
      )}

      {/* PAGE 7: TERMS & CONDITIONS VIEW */}
      {pageType === 'terms' && (
        <div className="space-y-8">
          {renderHero(
            'Terms & Conditions',
            'User Agreement',
            '15 August 2026',
            'Terms governing the use of PrizeBond Pakistan services, verification utilities, and content repositories.',
            <Scale className="w-3.5 h-3.5 text-[#006633]" />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <section id="terms-1" className="space-y-3 scroll-mt-24">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">1.</span> Acceptance of Terms
                  </h2>
                  <p>
                    By accessing or using PrizeBond Pakistan, you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue using the website.
                  </p>
                </section>

                <section id="terms-2" className="space-y-3 scroll-mt-24 border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">2.</span> Acceptable Use
                  </h2>
                  <p>
                    You agree to use our checking tools solely for personal Prize Bond verification. Automated web scraping, malicious denial-of-service attempts, or reproduction of proprietary site assets without written permission is strictly prohibited.
                  </p>
                </section>

                <section id="terms-3" className="space-y-3 scroll-mt-24 border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">3.</span> Intellectual Property & Gazette Rights
                  </h2>
                  <p>
                    Government gazette numbers are public record in Pakistan. However, custom search software algorithms, website styling, UI design templates, and compiled database structures are the intellectual property of PrizeBond Pakistan.
                  </p>
                </section>

                <section id="terms-4" className="space-y-3 scroll-mt-24 border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono">4.</span> Governing Law
                  </h2>
                  <p>
                    These terms are governed by the laws of the Islamic Republic of Pakistan.
                  </p>
                </section>
              </div>
            </div>

            <aside className="space-y-6">
              {renderToc([
                { id: 'terms-1', label: 'Acceptance of Terms' },
                { id: 'terms-2', label: 'Acceptable Use' },
                { id: 'terms-3', label: 'Intellectual Property' },
                { id: 'terms-4', label: 'Governing Law' },
              ])}
              {renderRelatedLegalLinks()}
            </aside>
          </div>
        </div>
      )}
    </div>
  );
};