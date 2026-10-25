import React from 'react';
import { BRAND } from '../brand';
import { useDemo } from '../context/DemoContext';
import { RotateCcw, Sparkles, BookOpen, AlertCircle, Menu, X } from 'lucide-react';
import { IS_DEMO_MODE } from '../utils/gemini';

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { resetAllDemoData } = useDemo();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#EADBCC]">
      {/* Concept Disclaimer Bar */}
      <div className="bg-[#6B1724] text-[#FAF6F0] text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-[#E5C268] shrink-0" />
        <span>
          <strong>Concept demo</strong> prepared for {BRAND.name}, not an official product. Sample data only.
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-ink-700 hover:bg-cream-200 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6B1724] shadow-sm flex items-center justify-center border border-[#8C2434]/40 shrink-0 overflow-hidden">
              <img
                src={BRAND.logoPath}
                alt={BRAND.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback icon if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <BookOpen className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg sm:text-xl text-[#1A2B4C] tracking-tight leading-none">
                  {BRAND.shortName}
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#1A2B4C]/10 text-[#1A2B4C] border border-[#1A2B4C]/20">
                  Concept
                </span>
              </div>
              <p className="text-xs text-gray-500 font-normal truncate max-w-[200px] sm:max-w-md hidden xs:block">
                {BRAND.tagline} • <span className="text-[#6B1724] font-medium">{BRAND.institutionLocation}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Mode Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">
              {IS_DEMO_MODE ? 'Demo Mode: sample data' : 'Connected: Gemini Live'}
            </span>
            <span className="sm:hidden">Demo Mode</span>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo state, checklists, and queues to default sample data?')) {
                resetAllDemoData();
              }
            }}
            title="Reset demo data to initial state"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-cream-100 hover:text-maroon-700 border border-[#D9CEBE] rounded-lg shadow-sm transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-maroon-700" />
            <span className="hidden md:inline">Reset demo data</span>
            <span className="md:hidden">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
