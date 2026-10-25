import React from 'react';
import { BRAND } from '../brand';
import { AlertCircle, BookOpen, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAF6F0] border-t border-[#EADBCC] py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-gray-600">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-cream-100 border border-[#D9CEBE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-maroon-700 shrink-0" />
            <span className="font-medium text-gray-800">
              {BRAND.disclaimerText}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Public-Domain Literature & Original Evaluative Logic</span>
          </div>
        </div>

        {/* Instituional Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#EADBCC]/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-[#1A2B4C]">
                {BRAND.name}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-xs text-gray-500">{BRAND.institutionLocation}</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Coaching excellence across: {BRAND.examsTargeted.join(' • ')}
            </p>
          </div>

          <div className="text-left sm:text-right text-[11px] text-gray-500 space-y-0.5">
            <div>Built as an executive technology concept demonstration.</div>
            <div className="text-maroon-800 font-medium">
              Zero backend required • Runs 100% offline in browser
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
