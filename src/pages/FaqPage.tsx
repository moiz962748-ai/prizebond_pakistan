'use client';

import React, { useState } from 'react';
import { HelpCircle, Search, ChevronRight } from 'lucide-react';
import { FAQS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdSensePlaceholder } from '../components/common/AdSensePlaceholder';

interface FaqPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const categories = ['All', 'Checking', 'Claiming', 'Taxes', 'Rules', 'Schedules'];

  const filteredFaqs = FAQS.filter((f) => {
    if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !f.question.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Information', onClick: () => onNavigate('information', 'how-prize-bonds-work') },
          { label: 'Frequently Asked Questions' },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl text-center space-y-3">
        <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-md inline-block">
          Official Knowledge Base
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
          PrizeBond Pakistan FAQs
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto">
          Clear, authoritative answers to common questions about Prize Bond draw schedules, checking tools, withholding taxes, and claim procedures.
        </p>

        {/* Search */}
        <div className="pt-2 max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search FAQs (e.g. tax rate, 6-year limit)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none shadow-md"
          />
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-emerald-50 text-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full text-left p-5 text-sm font-extrabold text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>{faq.question}</span>
                </div>
                <span className="text-emerald-800 font-mono text-xl font-bold">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-emerald-50/20 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AdSensePlaceholder slot="banner" />
    </div>
  );
};