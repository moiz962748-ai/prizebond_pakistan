'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchModal } from '@/components/common/SearchModal';

import { HomePage } from '@/views/HomePage';
import { ResultsPage } from '@/views/ResultsPage';
import { CheckerPage } from '@/views/CheckerPage';
import { SchedulePage } from '@/views/SchedulePage';
import { DenominationPage } from '@/views/DenominationPage';
import { PrizeBondsPage } from '@/views/PrizeBondsPage';
import { InformationPage } from '@/views/InformationPage';
import { FaqPage } from '@/views/FaqPage';
import { LatestDrawPage } from '@/views/LatestDrawPage';
import { DrawDetailPage } from '@/views/DrawDetailPage';
import { StaticInfoPages } from '@/views/StaticInfoPages';
import { supabase } from '@/lib/supabase'; // Supabase client import

export default function Page() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // CMS Content State for Dynamic Texts & Admin Check
  const [cmsContent, setCmsContent] = useState<Record<string, string>>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Fetch CMS content and check admin status on load
  useEffect(() => {
    const checkAdminAndFetch = async () => {
      // 1. Check if user is logged in as Admin
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAdmin(true);
      }

      // 2. Fetch dynamic contents from Supabase
      const { data, error } = await supabase
        .from('site_contents')
        .select('section_key, content_value')
        .eq('page_name', 'home');

      if (!error && data) {
        const map: Record<string, string> = {};
        data.forEach((item) => {
          map[item.section_key] = item.content_value;
        });
        setCmsContent(map);
      }
    };

    checkAdminAndFetch();
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setViewParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      {/* Search Modal Dialog */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Main Navbar */}
      <Navbar
        activeView={currentView}
        activeParam={viewParam}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Dynamic View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage 
            onNavigate={handleNavigate} 
            cmsContent={cmsContent} 
            isAdmin={isAdmin} 
          />
        )}

        {currentView === 'results' && (
          <ResultsPage initialDenomination={viewParam} onNavigate={handleNavigate} />
        )}

        {currentView === 'checker' && (
          <CheckerPage initialNumber={viewParam} onNavigate={handleNavigate} />
        )}

        {currentView === 'schedule' && (
          <SchedulePage initialFilter={viewParam} onNavigate={handleNavigate} />
        )}

        {(currentView === 'denomination' || currentView === 'prizebond') && (
          <DenominationPage denomination={viewParam || '1500'} onNavigate={handleNavigate} />
        )}

        {(currentView === 'prizebonds' || currentView === 'prize-bonds') && (
          <PrizeBondsPage onNavigate={handleNavigate} />
        )}

        {currentView === 'information' && (
          <InformationPage slug={viewParam || 'hub'} onNavigate={handleNavigate} />
        )}

        {currentView === 'faqs' && (
          <FaqPage onNavigate={handleNavigate} />
        )}

        {currentView === 'latest-draw' && (
          <LatestDrawPage onNavigate={handleNavigate} />
        )}

        {currentView === 'draw-detail' && (
          <DrawDetailPage drawId={viewParam || 'sch-21'} onNavigate={handleNavigate} />
        )}

        {[
          'about',
          'contact',
          'sitemap',
          'editorial-policy',
          'privacy',
          'terms',
          'disclaimer',
        ].includes(currentView) && (
          <StaticInfoPages
            pageType={
              currentView as
                | 'about'
                | 'contact'
                | 'sitemap'
                | 'editorial-policy'
                | 'privacy'
                | 'terms'
                | 'disclaimer'
            }
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}