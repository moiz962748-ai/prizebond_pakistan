'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, FileText, Calendar, Award, Sparkles, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { DENOMINATIONS, SCHEDULE_2026, ARTICLES } from '../../data/mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yprybofxbbqqulmpydtq.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_FCgPg24cKrKlBGLMfiS-Tw_nmpMywQG';
const supabase = createClient(supabaseUrl, supabaseKey);

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, param?: string) => void;
}

interface BondSearchResult {
  id: string;
  bond_number: string;
  prize_type: string;
  draws: {
    denomination: number;
    draw_number: number;
    draw_date: string;
  } | null;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [dbResults, setDbResults] = useState<BondSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setDbResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const cleanQuery = query.trim();
    if (cleanQuery.length >= 3) {
      const fetchBondResults = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('prize_bonds')
          .select(`
            id,
            bond_number,
            prize_type,
            draws (
              denomination,
              draw_number,
              draw_date
            )
          `)
          .ilike('bond_number', `%${cleanQuery}%`)
          .limit(10);

        if (!error && data) {
          const formattedData: BondSearchResult[] = data.map((item: any) => ({
            id: item.id,
            bond_number: item.bond_number,
            prize_type: item.prize_type,
            draws: Array.isArray(item.draws) ? item.draws[0] : item.draws
          }));
          setDbResults(formattedData);
        } else {
          setDbResults([]);
        }
        setLoading(false);
      };

      const timer = setTimeout(fetchBondResults, 300);
      return () => clearTimeout(timer);
    } else {
      setDbResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  const matchedDenominations = DENOMINATIONS.filter(
    (d) =>
      d.value.includes(cleanQuery) ||
      d.label.toLowerCase().includes(cleanQuery) ||
      d.description.toLowerCase().includes(cleanQuery)
  );

  const matchedSchedule = SCHEDULE_2026.filter(
    (s) =>
      s.denomination.includes(cleanQuery) ||
      s.city.toLowerCase().includes(cleanQuery) ||
      s.date.includes(cleanQuery)
  ).slice(0, 4);

  const matchedArticles = ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(cleanQuery) ||
      a.shortSummary.toLowerCase().includes(cleanQuery)
  );

  const isNumericBondSearch = /^\d{3,6}$/.test(cleanQuery);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-emerald-700 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bond number (e.g. 452819), denomination (1500), city or guide..."
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-emerald-600 animate-spin mr-2 shrink-0" />}
          {query && !loading && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg mr-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-500 bg-slate-200/80 hover:bg-slate-300 rounded-md transition-colors cursor-pointer"
          >
            ESC
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-5">
          {isNumericBondSearch && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Instant Checker Match
                </span>
                <p className="text-sm font-semibold text-slate-800">
                  Check Bond No. <span className="font-mono text-emerald-700 text-base font-bold">{cleanQuery}</span> in official database
                </p>
              </div>
              <button
                onClick={() => {
                  onNavigate('checker', cleanQuery);
                  onClose();
                }}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Check Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {!cleanQuery ? (
            <div className="text-center py-8 text-slate-500">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Search PrizeBond Pakistan</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Type any 6-digit Prize Bond number, denomination like &quot;1500&quot;, city like &quot;Lahore&quot;, or topic like &quot;Tax&quot;
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {['Rs. 1500 Results', 'Check Bond 452819', '2026 Draw Schedule', 'Filer Tax Rate'].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(chip.replace('Rs. ', '').replace('Check Bond ', ''))}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 text-xs rounded-full border border-slate-200 transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {dbResults.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-600" /> Database Winning Matches ({dbResults.length})
                  </h3>
                  <div className="space-y-1.5">
                    {dbResults.map((item) => (
                      <div
                        key={item.id}
                        className="w-full text-left p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                            <span>Bond: <span className="font-mono text-emerald-800 text-sm">{item.bond_number}</span></span>
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-700 text-white rounded uppercase">
                              {item.prize_type} Prize
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-1">
                            Rs. {item.draws?.denomination} Denomination • Draw #{item.draws?.draw_number} • Date: {item.draws?.draw_date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedDenominations.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-600" /> Prize Bond Denominations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedDenominations.map((denom) => (
                      <button
                        key={denom.value}
                        onClick={() => {
                          onNavigate('denomination', denom.value);
                          onClose();
                        }}
                        className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">
                            {denom.label}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            1st Prize: {denom.firstPrize}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedArticles.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" /> Guides & Information
                  </h3>
                  <div className="space-y-1.5">
                    {matchedArticles.map((art) => (
                      <button
                        key={art.slug}
                        onClick={() => {
                          onNavigate('information', art.slug);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800">{art.title}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{art.shortSummary}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedSchedule.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Schedule Entries
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedSchedule.map((sch) => (
                      <button
                        key={sch.id}
                        onClick={() => {
                          onNavigate('schedule');
                          onClose();
                        }}
                        className="text-left p-2 rounded-lg border border-slate-200 text-xs hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors cursor-pointer"
                      >
                        <span className="font-bold text-slate-800">Rs. {sch.denomination}</span> — {sch.date} ({sch.city})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};