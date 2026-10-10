'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  AlertTriangle, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Award, 
  CheckCircle2,
  FileDown
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface DrawDetailPageProps {
  drawId?: string; // e.g. "denom=1500&date=2026-11-16&city=Rawalpindi&drawNo=104"
  onNavigate: (view: string, param?: string) => void;
}

export const DrawDetailPage: React.FC<DrawDetailPageProps> = ({ drawId, onNavigate }) => {
  const searchParams = new URLSearchParams(drawId || '');
  const denom = searchParams.get('denom') || '1500';
  const date = searchParams.get('date') || 'N/A';
  const city = searchParams.get('city') || 'Rawalpindi';
  const drawNo = searchParams.get('drawNo') || '104';

  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGazette() {
      if (!date || date === 'N/A') {
        setErrorMessage('No valid draw date specified.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const res = await fetch(`/api/get-bond-file?denom=${denom}&date=${encodeURIComponent(date)}`);

        if (res.ok) {
          const text = await res.text();
          setFileContent(text);
        } else {
          const errText = await res.text();
          setErrorMessage(errText || 'Gazette file could not be loaded.');
        }
      } catch (err) {
        setErrorMessage('Network error occurred while fetching the gazette text.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchGazette();
  }, [denom, date]);

  // Client-side PDF Generator function from TXT content
  const handleDownloadPDF = () => {
    if (!fileContent) return;

    const doc = new jsPDF();
    
    // Header Branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 102, 51); // #006633 Green color
    doc.text(`Official National Savings Gazette - Rs. ${denom} Prize Bond`, 14, 15);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Draw Date: ${date} | City: ${city} | Draw #{${drawNo}}`, 14, 22);
    doc.line(14, 25, 196, 25); // Divider line

    // Gazette Content Text
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);

    const splitText = doc.splitTextToSize(fileContent, 180);
    
    // Add pages dynamically if text is long
    let y = 32;
    for (let i = 0; i < splitText.length; i++) {
      if (y > 280) { // Page limit check
        doc.addPage();
        y = 20;
      }
      doc.text(splitText[i], 14, y);
      y += 4.5;
    }

    // Save PDF
    doc.save(`Prize-Bond-Gazette-Rs-${denom}-${date}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-slate-100 min-h-screen text-slate-800">
      <button
        onClick={() => onNavigate('results')}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#006633] hover:text-[#004D26] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Results Hub</span>
      </button>

      {/* --- PROFESSIONAL HEADER HERO CARD WITH PDF BUTTON --- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#004D26] via-[#006633] to-[#003B1D]"></div>
        
        <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#006633]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>State Bank Verified Gazette</span>
              </span>
              <span className="inline-flex items-center gap-1 text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{city}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{date}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-slate-600 font-mono">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                <span>Draw #{drawNo}</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Rs. {Number(denom).toLocaleString()} Prize Bond Draw Result #{drawNo} — {city} ({date})
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Official gazette dispatch certified by the State Bank of Pakistan Banking Services Corporation and Directorate of National Savings.
            </p>

            {/* Footer Meta Tags */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] font-semibold text-slate-500 border-t border-slate-100">
              <span className="inline-flex items-center gap-1 text-[#006633]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Sovereign Guarantee
              </span>
              <span>•</span>
              <span>Valid for Claim Until 2032</span>
              <span>•</span>
              <span className="text-amber-700">15% Filer / 30% Non-Filer WHT</span>
            </div>
          </div>

          {/* Action Buttons Right Side (PDF Download, TXT Download, Checker) */}
          <div className="shrink-0 flex flex-col gap-2.5 w-full lg:w-72">
            {!errorMessage && !isLoading && (
              <>
                {/* PDF Download Button */}
                <button
                  onClick={handleDownloadPDF}
                  className="w-full py-3 bg-[#006633] hover:bg-[#004D26] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download Official PDF Gazette</span>
                </button>

                {/* TXT Download Button */}
                <a
                  href={`/api/get-bond-file?denom=${denom}&date=${encodeURIComponent(date)}`}
                  download={`Gazette-Rs-${denom}-${date}.txt`}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Download TXT File</span>
                </a>
              </>
            )}

            <button
              onClick={() => onNavigate('checker')}
              className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-[#006633] border border-emerald-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify Serial in Online Checker</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- PREVIEW BOX (White Background & Full Complete List without scroll) --- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#006633]" />
            <span>Official Gazette Text Preview</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">UTF-8 Plain Text</span>
        </div>

        <div className="p-6 bg-white text-slate-900 font-mono text-xs sm:text-sm rounded-b-2xl overflow-x-auto leading-relaxed shadow-inner border border-slate-100">
          {isLoading ? (
            <div className="text-slate-400 animate-pulse py-16 text-center">Loading official text record from archive...</div>
          ) : errorMessage ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-red-700 font-bold text-sm">{errorMessage}</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Could not find matching TXT file inside <span className="font-mono text-slate-700">prize-bond-data/{denom}</span> for date <span className="font-mono text-slate-700">{date}</span>.
              </p>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-mono">{fileContent}</pre>
          )}
        </div>
      </div>
    </div>
  );
};