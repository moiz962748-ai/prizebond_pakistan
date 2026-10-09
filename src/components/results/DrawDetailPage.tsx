'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, ArrowLeft, AlertTriangle } from 'lucide-react';

interface DrawDetailPageProps {
  drawId?: string; // e.g. "denom=100&date=2020-05-15&city=Lahore"
  onNavigate: (view: string, param?: string) => void;
}

export const DrawDetailPage: React.FC<DrawDetailPageProps> = ({ drawId, onNavigate }) => {
  const searchParams = new URLSearchParams(drawId || '');
  const denom = searchParams.get('denom') || '100';
  const date = searchParams.get('date') || 'N/A';
  const city = searchParams.get('city') || 'N/A';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-slate-100 min-h-screen text-slate-800">
      <button
        onClick={() => onNavigate('results')}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#006633] hover:text-[#004D26] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Results Hub</span>
      </button>

      {/* Header Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#006633] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            Rs. {denom} Prize Bond Gazette Preview
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Draw Date: {date} — City: {city}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Archive Directory: <span className="font-mono text-slate-700">prize-bond-data/{denom}</span>
          </p>
        </div>

        {!errorMessage && !isLoading && (
          <a
            href={`/api/get-bond-file?denom=${denom}&date=${encodeURIComponent(date)}`}
            download={`Gazette-Rs-${denom}-${date}.txt`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#006633] hover:text-white text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Raw TXT File</span>
          </a>
        )}
      </div>

      {/* Preview Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#006633]" />
            <span>Official Gazette Text Preview</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">UTF-8 Plain Text</span>
        </div>

        {/* Yahan background white aur text color slate-900 (black) kar diya gaya hai */}
        <div className="p-6 bg-white text-slate-900 font-mono text-xs sm:text-sm rounded-b-2xl overflow-x-auto max-h-[650px] overflow-y-auto leading-relaxed shadow-inner border border-slate-100">
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