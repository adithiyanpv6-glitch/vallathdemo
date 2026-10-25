import React from 'react';
import { BRAND } from '../brand';
import { Printer, X, Download, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#EADBCC] rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="bg-[#6B1724] text-white p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <BookOpen className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl leading-tight">
                {BRAND.shortName} — Executive Summary
              </h3>
              <p className="text-xs text-cream-200">
                Prepared for Dr. Kalyani Vallath & Operations Directorate • Concept Overview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition"
            >
              <Printer className="w-4 h-4 text-gold-400" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 space-y-6 text-gray-800 text-sm max-h-[80vh] overflow-y-auto print:max-h-none print:p-0">
          {/* Header */}
          <div className="border-b border-[#EADBCC] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1A2B4C]">
                {BRAND.name} AI Enablement Architecture
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Location: {BRAND.institutionLocation} | Primary Programs: {BRAND.examsTargeted.join(', ')}
              </p>
            </div>
            <div className="text-right text-xs text-maroon-700 font-semibold uppercase tracking-wider bg-cream-100 px-3 py-1 rounded-lg border border-[#EADBCC] inline-block self-start sm:self-auto">
              Confidential Concept
            </div>
          </div>

          {/* Core Vision Quote */}
          <blockquote className="border-l-4 border-[#6B1724] bg-cream-50 p-4 rounded-r-xl italic font-serif text-gray-700 text-base">
            "{BRAND.heroSentence}"
          </blockquote>

          {/* 4 Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Ask Vallath */}
            <div className="p-4 rounded-xl border border-[#EADBCC] bg-[#FAF6F0]/60 space-y-2">
              <div className="flex items-center gap-2 text-maroon-700 font-bold font-serif text-base">
                <span className="w-6 h-6 rounded-full bg-maroon-700 text-white text-xs flex items-center justify-center font-sans">
                  1
                </span>
                Ask Vallath (24/7 Study Companion)
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Instant, grounded answers strictly derived from Vallath study material. Built-in refusal guardrail prevents hallucinations by auto-flagging out-of-syllabus doubts to the Teacher Queue.
              </p>
              <div className="text-[11px] text-gray-500 bg-white p-2 rounded border border-[#EADBCC]">
                <strong>Business Value:</strong> 150+ midnight queries answered weekly without faculty burnout.
              </div>
            </div>

            {/* 2. Practice Engine */}
            <div className="p-4 rounded-xl border border-[#EADBCC] bg-[#FAF6F0]/60 space-y-2">
              <div className="flex items-center gap-2 text-ink-700 font-bold font-serif text-base">
                <span className="w-6 h-6 rounded-full bg-ink-700 text-white text-xs flex items-center justify-center font-sans">
                  2
                </span>
                Practice Engine (Adaptive Drills & Analytics)
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                60 curated MCQs mapped to NTA NET/SET periods and theory tags. Automatically weights questions towards student weak areas. Spaced-repetition schedule + WhatsApp daily micro-drill preview.
              </p>
              <div className="text-[11px] text-gray-500 bg-white p-2 rounded border border-[#EADBCC]">
                <strong>Business Value:</strong> Student retention increases; batch heatmap reveals class-wide blindspots.
              </div>
            </div>

            {/* 3. Feedback Desk */}
            <div className="p-4 rounded-xl border border-[#EADBCC] bg-[#FAF6F0]/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold font-serif text-base">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center font-sans">
                  3
                </span>
                Feedback Desk (AI First-Pass + Faculty Approval)
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Evaluates descriptive answers, research proposals, and IELTS tasks against rubrics. Highlights text in green/amber and drafts constructive notes in 8 seconds for one-click teacher sign-off.
              </p>
              <div className="text-[11px] text-gray-500 bg-white p-2 rounded border border-[#EADBCC]">
                <strong>Business Value:</strong> Cuts evaluation turnaround from 5 days to 2 hours; saves 18 faculty hrs/week.
              </div>
            </div>

            {/* 4. Content Studio */}
            <div className="p-4 rounded-xl border border-[#EADBCC] bg-[#FAF6F0]/60 space-y-2">
              <div className="flex items-center gap-2 text-purple-900 font-bold font-serif text-base">
                <span className="w-6 h-6 rounded-full bg-purple-900 text-white text-xs flex items-center justify-center font-sans">
                  4
                </span>
                Content Studio (Lecture Repurposing)
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Transforms one 45-minute faculty lecture into clean transcripts, 5 viral Reel/Short hooks, a 5-MCQ quiz, an 80-word newsletter, an SEO blog draft, and 7 days of social broadcasts.
              </p>
              <div className="text-[11px] text-gray-500 bg-white p-2 rounded border border-[#EADBCC]">
                <strong>Business Value:</strong> Replaces dedicated marketing agency retainers; multi-channel distribution.
              </div>
            </div>
          </div>

          {/* Implementation Roadmap */}
          <div className="bg-cream-100 p-4 rounded-xl border border-[#EADBCC] space-y-2">
            <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-maroon-700" />
              Production Deployment Blueprint (Next Steps)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-700">
              <div className="bg-white p-2.5 rounded border border-[#EADBCC]">
                <div className="font-bold text-ink-900">Phase 1: Knowledge Ingestion</div>
                <div className="text-gray-500 mt-1">Upload Vallath printed notes, PDFs & syllabus guides into secure vector database.</div>
              </div>
              <div className="bg-white p-2.5 rounded border border-[#EADBCC]">
                <div className="font-bold text-ink-900">Phase 2: WhatsApp Gateway</div>
                <div className="text-gray-500 mt-1">Connect Meta Cloud API to broadcast daily 5-question micro-drills to students.</div>
              </div>
              <div className="bg-white p-2.5 rounded border border-[#EADBCC]">
                <div className="font-bold text-ink-900">Phase 3: Faculty Workflow</div>
                <div className="text-gray-500 mt-1">Train evaluators on the 1-click AI Draft Review & Approval dashboard.</div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-[11px] text-gray-400 text-center pt-2 border-t border-[#EADBCC]">
            {BRAND.disclaimerText} • Generated for internal discussion purposes only.
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-cream-100 p-4 border-t border-[#EADBCC] flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-cream-50 border border-[#D9CEBE] rounded-lg transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#6B1724] hover:bg-maroon-800 rounded-lg shadow-sm transition"
          >
            <Printer className="w-4 h-4 text-gold-400" />
            <span>Print Executive Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
};
