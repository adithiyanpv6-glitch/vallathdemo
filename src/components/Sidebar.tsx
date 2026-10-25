import React from 'react';
import { useDemo } from '../context/DemoContext';
import { 
  Compass, 
  MessageSquareQuote, 
  BrainCircuit, 
  FileCheck2, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { activeTab, setActiveTab, checklist, teacherQueue, reviewSubmissions } = useDemo();

  const completedCount = checklist.filter(c => c.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const pendingTeacherDoubts = teacherQueue.filter(q => q.status === 'Pending Review').length;
  const pendingReviewSubmissions = reviewSubmissions.filter(r => r.status === 'Draft Ready').length;

  const navItems = [
    {
      id: 'start-here',
      label: 'Start Here',
      subtitle: 'Guided tour & checklist',
      icon: Compass,
      badge: `${completedCount}/${checklist.length}`,
      badgeColor: completedCount === checklist.length ? 'bg-emerald-100 text-emerald-800' : 'bg-cream-200 text-maroon-800',
    },
    {
      id: 'ask-vallath',
      label: 'Ask Vallath',
      subtitle: 'AI study companion',
      icon: MessageSquareQuote,
      badge: pendingTeacherDoubts > 0 ? `${pendingTeacherDoubts} Qs` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'practice-engine',
      label: 'Practice Engine',
      subtitle: 'Adaptive practice & analytics',
      icon: BrainCircuit,
      badge: '60 MCQs',
      badgeColor: 'bg-ink-100 text-ink-800',
    },
    {
      id: 'feedback-desk',
      label: 'Feedback Desk',
      subtitle: 'AI first-pass + faculty review',
      icon: FileCheck2,
      badge: pendingReviewSubmissions > 0 ? `${pendingReviewSubmissions} pending` : undefined,
      badgeColor: 'bg-maroon-100 text-maroon-800',
    },
    {
      id: 'content-studio',
      label: 'Content Studio',
      subtitle: 'Lecture repurposing studio',
      icon: Sparkles,
      badge: '6 outputs',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 left-0 bottom-0 z-30 w-72 bg-[#FAF6F0] border-r border-[#EADBCC] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ height: 'calc(100vh - 4rem)' }}
      >
        {/* Navigation list */}
        <div className="p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Navigation Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-150 group ${
                  isActive
                    ? 'bg-[#6B1724] text-white shadow-md shadow-maroon-900/10'
                    : 'text-gray-700 hover:bg-white hover:text-ink-900 border border-transparent hover:border-[#EADBCC]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg shrink-0 transition ${
                      isActive
                        ? 'bg-white/15 text-gold-400'
                        : 'bg-white text-maroon-700 group-hover:text-maroon-800 border border-[#EADBCC]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <div className="font-medium text-sm leading-tight truncate">
                      {item.label}
                    </div>
                    <div
                      className={`text-xs truncate ${
                        isActive ? 'text-cream-200' : 'text-gray-500'
                      }`}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-gold-400 translate-x-0.5' : 'text-gray-400 group-hover:translate-x-0.5'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Presenter Checklist Progress Card */}
        <div className="p-4 border-t border-[#EADBCC] bg-white/60 m-3 rounded-2xl border">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-800 mb-1.5">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-maroon-700" />
              Presenter Tour
            </span>
            <span className="text-maroon-700 font-bold">{progressPercent}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-maroon-700 to-gold-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-gray-500 leading-snug">
            {completedCount} of {checklist.length} demonstration milestones checked.
          </p>

          <button
            onClick={() => handleSelectTab('start-here')}
            className="mt-2 w-full text-center py-1.5 text-xs font-medium text-maroon-700 hover:text-maroon-800 bg-cream-50 hover:bg-cream-100 rounded-lg border border-cream-300 transition"
          >
            Open Presenter Checklist
          </button>
        </div>
      </aside>
    </>
  );
};
