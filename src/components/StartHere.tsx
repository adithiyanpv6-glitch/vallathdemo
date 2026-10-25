import React, { useState } from 'react';
import { BRAND } from '../brand';
import { useDemo } from '../context/DemoContext';
import { SummaryModal } from './SummaryModal';
import {
  Compass,
  MessageSquareQuote,
  BrainCircuit,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Zap,
  Printer,
  ChevronRight,
  HelpCircle,
  BarChart3,
  Award
} from 'lucide-react';

export const StartHere: React.FC = () => {
  const { setActiveTab, checklist, toggleChecklistItem } = useDemo();
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  const completedCount = checklist.filter(c => c.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const moduleCards = [
    {
      id: 'ask-vallath',
      title: '1. Ask Vallath',
      badge: 'AI Study Companion',
      tagline: '24/7 grounded doubt resolution strictly from Vallath study material with zero hallucinations.',
      colorClass: 'text-maroon-700 bg-maroon-50 border-maroon-200',
      icon: MessageSquareQuote,
      steps: [
        'Click any of the 8 sample questions (e.g. Petrarchan Sonnets or Keats Negative Capability).',
        'Inspect the "Sources used" chip and confidence rating showing grounded retrieval.',
        'Click the refusal test question ("What is the weather in Kochi?") to see it auto-flag for a teacher.'
      ],
      buttonLabel: 'Try Ask Vallath'
    },
    {
      id: 'practice-engine',
      title: '2. Practice Engine',
      badge: 'Adaptive MCQs & Analytics',
      tagline: 'Smart practice that diagnoses weak periods and delivers WhatsApp-ready micro-drills.',
      colorClass: 'text-ink-700 bg-ink-50 border-ink-200',
      icon: BrainCircuit,
      steps: [
        'Switch between Student A, B, and C to compare radar charts across literature periods.',
        'Run a 10-question adaptive set that weights questions toward that student’s weak tags.',
        'Toggle between WhatsApp and Telegram skins in the Daily Practice phone mock.'
      ],
      buttonLabel: 'Try Practice Engine'
    },
    {
      id: 'feedback-desk',
      title: '3. Feedback Desk',
      badge: 'AI First-Pass + Teacher Sign-off',
      tagline: 'Evaluates descriptive answers in 8 seconds, providing rubric scores and inline notes for teacher approval.',
      colorClass: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      icon: FileCheck2,
      steps: [
        'Select an Assistant Professor, Research Proposal, or IELTS sample submission.',
        'Click "Get AI first-pass feedback" to view inline green/amber highlights and rubric score.',
        'Switch to Faculty Review Queue to edit the feedback note and click "Approve & send".'
      ],
      buttonLabel: 'Try Feedback Desk'
    },
    {
      id: 'content-studio',
      title: '4. Content Studio',
      badge: 'Lecture Repurposing Studio',
      tagline: 'Turns one 45-minute faculty lecture into clean transcripts, viral clips, quizzes, and 7-day social content.',
      colorClass: 'text-purple-800 bg-purple-50 border-purple-200',
      icon: Sparkles,
      steps: [
        'Select a sample lecture transcript (Romanticism, Postcolonial Theory, or Modernism).',
        'Click "Repurpose this lecture" to trigger automatic extraction.',
        'Review the 6 generated outputs (Reel clips, MCQs, SEO blog, newsletter) and 7-day Content Calendar.'
      ],
      buttonLabel: 'Try Content Studio'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* "What you're looking at" Caption & Hint */}
      <div className="bg-white border border-[#EADBCC] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-maroon-100 text-maroon-800">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-maroon-800">
              What you're looking at
            </span>
          </div>
          <p className="text-sm text-gray-700">
            A comprehensive, zero-setup executive demonstration showcasing four custom AI systems purpose-built for English literature coaching and operations.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSummaryModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-ink-900 bg-cream-100 hover:bg-cream-200 border border-[#D9CEBE] rounded-xl shadow-sm transition active:scale-95"
          >
            <Printer className="w-4 h-4 text-maroon-700" />
            <span>Print / Export demo summary</span>
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A2B4C] via-[#121F38] to-[#52101A] text-white p-6 sm:p-10 shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 rounded-full bg-maroon-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-gold-300 font-medium tracking-wide">
            <Award className="w-3.5 h-3.5 text-gold-400" />
            <span>Designed for Vallath Education • Trivandrum</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-[#FAF6F0]">
            Vallath AI Studio
          </h1>

          <p className="text-base sm:text-xl text-cream-100 font-serif italic leading-relaxed">
            "{BRAND.heroSentence}"
          </p>

          <p className="text-xs sm:text-sm text-cream-200/80 max-w-2xl leading-relaxed">
            Welcome, Dr. Kalyani Vallath and team. This working concept showcases how artificial intelligence can amplify your institute's scholarly reputation across India while dramatically lowering faculty workload.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('ask-vallath')}
              className="px-5 py-2.5 bg-[#6B1724] hover:bg-maroon-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-maroon-900/30 transition flex items-center gap-2 border border-maroon-400/30"
            >
              <span>Begin Guided Tour</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('presenter-checklist');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-cream-100 rounded-xl text-xs sm:text-sm font-medium transition border border-white/15"
            >
              View 12-Point Checklist ({completedCount}/12 done)
            </button>
          </div>
        </div>
      </div>

      {/* Business Impact Strip (Illustrative Estimates) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Estimated Institutional Impact
          </span>
          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            *Illustrative estimates based on typical 300-student batches
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#EADBCC] rounded-2xl p-5 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-maroon-50 text-maroon-700 shrink-0 border border-maroon-200">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-[#1A2B4C]">
                24+ hrs
              </div>
              <div className="text-xs font-semibold text-gray-800 mt-0.5">
                Faculty Hours Saved / Week
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                Automating initial essay feedback drafts and lecture social repurposing.
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EADBCC] rounded-2xl p-5 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-ink-50 text-ink-700 shrink-0 border border-ink-200">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-[#1A2B4C]">
                180+
              </div>
              <div className="text-xs font-semibold text-gray-800 mt-0.5">
                After-Hours Doubts Answered
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                Midnight and weekend queries handled instantly with strict grounding.
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EADBCC] rounded-2xl p-5 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 shrink-0 border border-emerald-200">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-[#1A2B4C]">
                2 Hours
              </div>
              <div className="text-xs font-semibold text-gray-800 mt-0.5">
                Essay Turnaround Time
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                Down from 5–7 days previously; 1-click teacher review and student dispatch.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Large Module Cards */}
      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A2B4C]">
            Explore the Four Systems
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Each module is fully interactive, pre-loaded with verified literature data, and runnable offline with zero setup.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {moduleCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white border border-[#EADBCC] rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${card.colorClass}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-lg text-[#1A2B4C]">
                          {card.title}
                        </h3>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                          {card.badge}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab(card.id)}
                      className="px-3.5 py-1.5 bg-[#6B1724] hover:bg-maroon-800 text-white rounded-xl text-xs font-semibold shadow-sm transition shrink-0 active:scale-95 flex items-center gap-1.5"
                    >
                      <span>{card.buttonLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-700 leading-snug">
                    {card.tagline}
                  </p>

                  {/* 3 Steps To Click */}
                  <div className="bg-cream-50 p-4 rounded-xl border border-cream-200 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-maroon-800 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      What to click: 3 steps
                    </div>
                    <ol className="space-y-1.5 text-xs text-gray-700">
                      {card.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-cream-200 text-maroon-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Presenter Checklist */}
      <div id="presenter-checklist" className="bg-white border border-[#EADBCC] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADBCC] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-gold-100 text-gold-700">
                <CheckCircle2 className="w-5 h-5 text-gold-600" />
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1A2B4C]">
                Presenter Demonstration Checklist
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Tick off these 12 milestones as you present the software to the director and operations leadership. Progress is saved automatically in your browser.
            </p>
          </div>

          <div className="text-right sm:shrink-0 bg-cream-50 p-3 rounded-2xl border border-cream-200">
            <div className="text-xs text-gray-500 font-medium">Demonstration Progress</div>
            <div className="text-2xl font-serif font-bold text-maroon-700">
              {completedCount} / {checklist.length}
            </div>
            <div className="w-36 h-2 bg-cream-200 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-maroon-700 to-emerald-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklist.map((item) => (
            <label
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition cursor-pointer select-none ${
                item.completed
                  ? 'bg-emerald-50/50 border-emerald-200 text-gray-800'
                  : 'bg-white hover:bg-cream-50 border-[#EADBCC] text-gray-700'
              }`}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => {}} // handled by parent onClick
                className="mt-1 h-4 w-4 rounded text-maroon-700 focus:ring-maroon-700 border-gray-300"
              />
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      item.completed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-cream-200 text-gray-700'
                    }`}
                  >
                    {item.module}
                  </span>
                  {item.completed && (
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  )}
                </div>
                <div className={`text-xs font-semibold ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {item.task}
                </div>
                <div className="text-[11px] text-gray-500">
                  {item.hint}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Summary Modal */}
      <SummaryModal
        isOpen={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
      />
    </div>
  );
};
