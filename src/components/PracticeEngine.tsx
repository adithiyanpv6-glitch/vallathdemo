import React, { useState, useMemo } from 'react';
import { useDemo } from '../context/DemoContext';
import questionsData from '../data/questions.json';
import { CLASS_HEATMAP_DATA } from '../data/studentProfiles';
import {
  BrainCircuit,
  GraduationCap,
  Calendar,
  Sparkles,
  HelpCircle,
  Smartphone,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Layers,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Send,
  Users
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  author: string;
  period: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  exam: 'NET' | 'SET' | 'GATE' | 'CUET';
}

const ALL_QUESTIONS: MCQQuestion[] = questionsData as MCQQuestion[];

export const PracticeEngine: React.FC = () => {
  const {
    students,
    currentStudentId,
    setCurrentStudentId,
    updateStudentMastery,
    addToast
  } = useDemo();

  const [viewMode, setViewMode] = useState<'student' | 'teacher'>('student');
  const [chatSkin, setChatSkin] = useState<'whatsapp' | 'telegram'>('whatsapp');

  // Active quiz session state
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<MCQQuestion[] | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Phone Mock State
  const [phoneAnswered, setPhoneAnswered] = useState<number | null>(null);
  const [phoneShowExplanation, setPhoneShowExplanation] = useState(false);

  const currentStudent = useMemo(() => {
    return students.find(s => s.id === currentStudentId) || students[0];
  }, [students, currentStudentId]);

  // Format data for Radar Chart (Period Mastery)
  const radarData = useMemo(() => {
    return currentStudent.periodMastery.map(p => ({
      period: p.period,
      mastery: p.mastery,
      fullMark: 100
    }));
  }, [currentStudent]);

  // Format data for Bar Chart (Topic Mastery)
  const barData = useMemo(() => {
    return currentStudent.topicMastery.map(t => ({
      name: t.topic.length > 15 ? t.topic.slice(0, 14) + '...' : t.topic,
      fullName: t.topic,
      mastery: t.mastery
    }));
  }, [currentStudent]);

  // Start 10-Question Adaptive Set (weighted by weak tags)
  const handleStartAdaptiveSet = (targetTag?: string) => {
    const weakTags = targetTag
      ? [targetTag.toLowerCase()]
      : currentStudent.weakAreas.map(w => w.tag.toLowerCase());

    // Score and sort questions: questions matching weak tags get higher priority
    const weighted = [...ALL_QUESTIONS].sort((a, b) => {
      const aMatch = weakTags.some(t => a.period.toLowerCase().includes(t) || a.topic.toLowerCase().includes(t));
      const bMatch = weakTags.some(t => b.period.toLowerCase().includes(t) || b.topic.toLowerCase().includes(t));
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0.5 - Math.random();
    });

    const setSize = targetTag ? 5 : 10;
    setActiveQuizQuestions(weighted.slice(0, setSize));
    setQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);

    addToast(
      targetTag
        ? `Targeted 5-question drill on "${targetTag}" launched!`
        : `10-question adaptive set launched for ${currentStudent.name}!`,
      'info'
    );
  };

  const handleQuizAnswerSubmit = () => {
    if (selectedAnswer === null || !activeQuizQuestions) return;
    const currentQ = activeQuizQuestions[quizIndex];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }

    setIsAnswerSubmitted(true);

    // Update student mastery in context / localStorage
    updateStudentMastery(currentStudent.id, currentQ.period, isCorrect);
    updateStudentMastery(currentStudent.id, currentQ.topic, isCorrect);
  };

  const handleNextQuizQuestion = () => {
    if (!activeQuizQuestions) return;
    if (quizIndex + 1 < activeQuizQuestions.length) {
      setQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Completed!
      addToast(`Set completed! You scored ${quizScore + (selectedAnswer === activeQuizQuestions[quizIndex].correctAnswer ? 1 : 0)} / ${activeQuizQuestions.length}. Mastery updated!`, 'success');
    }
  };

  const currentQ = activeQuizQuestions ? activeQuizQuestions[quizIndex] : null;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* "What you're looking at" Caption & Hint */}
      <div className="bg-white border border-[#EADBCC] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-ink-100 text-ink-800">
                <BrainCircuit className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-ink-800">
                What you're looking at
              </span>
            </div>
            <p className="text-sm text-gray-700">
              An adaptive MCQ engine pre-seeded with <strong>60 original UGC NET / SET questions</strong>. It dynamically calculates period & topic mastery, generates WhatsApp daily practice broadcasts, and pinpoints class-wide weak spots.
            </p>
          </div>

          {/* View Toggle: Student vs Teacher */}
          <div className="flex items-center p-1 bg-cream-100 rounded-xl border border-[#D9CEBE] shrink-0">
            <button
              onClick={() => setViewMode('student')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'student'
                  ? 'bg-[#1A2B4C] text-white shadow-sm'
                  : 'text-gray-700 hover:text-ink-900'
              }`}
            >
              Student View
            </button>
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'teacher'
                  ? 'bg-[#1A2B4C] text-white shadow-sm'
                  : 'text-gray-700 hover:text-ink-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Teacher Batch View</span>
            </button>
          </div>
        </div>

        {/* "Try this" Hint */}
        <div className="bg-cream-50 p-3 rounded-xl border border-cream-200 text-xs text-gray-700 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-ink-700 shrink-0 mt-0.5" />
          <div>
            <strong>Try this:</strong> Pick <strong>Student A (Aparna)</strong> or <strong>Student B (Rahul)</strong> from the profile dropdown. Notice how their weak areas change the Radar Chart. Then click <strong>"Start 10-question adaptive set"</strong> to see mastery tags update in real-time.
          </div>
        </div>
      </div>

      {/* STUDENT VIEW */}
      {viewMode === 'student' && (
        <div className="space-y-6">
          {/* Student Profile Selector Bar */}
          <div className="bg-white border border-[#EADBCC] rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1A2B4C] text-gold-400 font-serif font-bold text-lg flex items-center justify-center border border-ink-500 shrink-0">
                {currentStudent.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-lg text-[#1A2B4C]">
                    {currentStudent.name}
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active Aspirant
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Target: <strong className="text-maroon-700">{currentStudent.targetExam}</strong> • {currentStudent.batch}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs font-semibold text-gray-600">
                Switch Student Profile:
              </label>
              <select
                value={currentStudentId}
                onChange={(e) => {
                  setCurrentStudentId(e.target.value);
                  setActiveQuizQuestions(null);
                }}
                className="bg-cream-50 border border-[#D9CEBE] rounded-xl px-3 py-1.5 text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-ink-500"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} — {st.targetExam} ({st.overallMastery}% Mastery)
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleStartAdaptiveSet()}
                className="px-4 py-2 bg-[#6B1724] hover:bg-maroon-800 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Start 10-Question Adaptive Set</span>
              </button>
            </div>
          </div>

          {/* ACTIVE ADAPTIVE QUIZ MODAL / DRAWER IF RUNNING */}
          {activeQuizQuestions && (
            <div className="bg-white border-2 border-maroon-700/40 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#EADBCC] pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-maroon-100 text-maroon-800 text-xs font-bold uppercase tracking-wider">
                    Adaptive Drill
                  </span>
                  <span className="text-xs font-medium text-gray-600">
                    Question {quizIndex + 1} of {activeQuizQuestions.length}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    Score: <strong className="text-maroon-700">{quizScore}</strong>
                  </span>
                  <button
                    onClick={() => setActiveQuizQuestions(null)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                  >
                    Exit Drill
                  </button>
                </div>
              </div>

              {currentQ && (
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
                    <span className="bg-ink-50 text-ink-800 px-2 py-0.5 rounded border border-ink-200">
                      Period: {currentQ.period}
                    </span>
                    <span className="bg-cream-100 text-gray-800 px-2 py-0.5 rounded border border-[#EADBCC]">
                      Topic: {currentQ.topic}
                    </span>
                    <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                      Exam: {currentQ.exam}
                    </span>
                    <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                      Difficulty: {currentQ.difficulty}
                    </span>
                  </div>

                  {/* Question Title */}
                  <div className="font-serif text-base sm:text-lg font-bold text-gray-900 leading-snug">
                    {currentQ.question}
                  </div>

                  {/* 4 Options */}
                  <div className="space-y-2">
                    {currentQ.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswer === oIdx;
                      const isCorrect = oIdx === currentQ.correctAnswer;

                      let style = 'bg-[#FAF6F0] hover:bg-cream-100 border-[#EADBCC] text-gray-800';
                      if (isAnswerSubmitted) {
                        if (isCorrect) {
                          style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                        } else if (isSelected && !isCorrect) {
                          style = 'bg-red-50 border-red-500 text-red-900 line-through';
                        }
                      } else if (isSelected) {
                        style = 'bg-maroon-50 border-maroon-700 text-maroon-900 font-medium ring-2 ring-maroon-700/20';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswerSubmitted}
                          onClick={() => setSelectedAnswer(oIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${style}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-white border border-[#D9CEBE] text-gray-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>

                          {isAnswerSubmitted && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isAnswerSubmitted && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation banner if submitted */}
                  {isAnswerSubmitted && (
                    <div className="p-3.5 bg-cream-50 border border-cream-200 rounded-xl space-y-1 text-xs">
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Explanation & Faculty Note:
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {currentQ.explanation}
                      </p>
                      <div className="text-[11px] text-maroon-700 font-medium pt-1">
                        Mastery updated for <strong>{currentQ.period}</strong> and <strong>{currentQ.topic}</strong>.
                      </div>
                    </div>
                  )}

                  {/* Bottom Action buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleQuizAnswerSubmit}
                        disabled={selectedAnswer === null}
                        className="px-5 py-2 bg-[#6B1724] hover:bg-maroon-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuizQuestion}
                        className="px-5 py-2 bg-[#1A2B4C] hover:bg-ink-800 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95 flex items-center gap-1.5"
                      >
                        <span>
                          {quizIndex + 1 < activeQuizQuestions.length
                            ? 'Next Question'
                            : 'View Updated Mastery'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gold-400" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Top 3 Weak Areas Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-[#1A2B4C] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Top 3 Weak Areas for {currentStudent.name}
              </h4>
              <span className="text-xs text-gray-500">
                AI Diagnostic Engine Recommendation
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentStudent.weakAreas.map((weak, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#EADBCC] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        Score: {weak.currentScore}%
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">
                        Tag: {weak.category}
                      </span>
                    </div>

                    <h5 className="font-serif font-bold text-base text-gray-900">
                      {weak.tag}
                    </h5>

                    <p className="text-xs text-gray-600 leading-snug">
                      {weak.recommendedReason}
                    </p>
                  </div>

                  <button
                    onClick={() => handleStartAdaptiveSet(weak.tag)}
                    className="w-full py-2 bg-cream-100 hover:bg-cream-200 text-maroon-800 rounded-xl text-xs font-semibold border border-[#D9CEBE] transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                    <span>Practice this topic (5 MCQs)</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Grid: Radar Chart + Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Period Mastery Radar Chart */}
            <div className="bg-white border border-[#EADBCC] rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#EADBCC] pb-3">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#1A2B4C]">
                    Literary Period Mastery Radar
                  </h4>
                  <p className="text-xs text-gray-500">
                    Benchmark across major UGC NET historical epochs
                  </p>
                </div>
                <span className="text-xs font-bold text-maroon-700 bg-maroon-50 px-2.5 py-1 rounded-lg border border-maroon-200">
                  {currentStudent.overallMastery}% Overall
                </span>
              </div>

              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#EADBCC" />
                    <PolarAngleAxis
                      dataKey="period"
                      tick={{ fill: '#1A2B4C', fontSize: 11, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#C29B38" />
                    <Radar
                      name="Student Mastery"
                      dataKey="mastery"
                      stroke="#6B1724"
                      fill="#6B1724"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Topic Mastery Bar Chart */}
            <div className="bg-white border border-[#EADBCC] rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#EADBCC] pb-3">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#1A2B4C]">
                    Sub-Topic Performance
                  </h4>
                  <p className="text-xs text-gray-500">
                    Accuracy rates across high-frequency syllabus tags
                  </p>
                </div>
                <span className="text-xs font-bold text-ink-700 bg-ink-50 px-2.5 py-1 rounded-lg border border-ink-200">
                  {currentStudent.questionsSolved} Questions Solved
                </span>
              </div>

              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#FAF6F0" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#334155' }} width={80} />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Mastery Score']}
                      labelFormatter={(label) => `Topic: ${label}`}
                    />
                    <Bar dataKey="mastery" fill="#1A2B4C" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 14-Day Streak Calendar */}
          <div className="bg-white border border-[#EADBCC] rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-maroon-700" />
                <h4 className="font-serif font-bold text-base text-[#1A2B4C]">
                  14-Day Practice Consistency Streak
                </h4>
              </div>
              <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                🔥 {currentStudent.streakDays}-Day Continuous Streak
              </div>
            </div>

            <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
              {currentStudent.streakCalendar.map((day) => (
                <div
                  key={day.day}
                  className={`p-2.5 rounded-xl border text-center space-y-1 transition ${
                    day.completed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase">{day.dateStr}</div>
                  <div className="text-sm font-bold">
                    {day.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </div>
                  <div className="text-[9px] text-gray-500 font-medium">
                    {day.completed ? `${day.questionsCount} Qs` : 'Missed'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spaced-Repetition Reminders */}
          <div className="bg-white border border-[#EADBCC] rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#EADBCC] pb-3">
              <div>
                <h4 className="font-serif font-bold text-base text-[#1A2B4C] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-maroon-700" />
                  Spaced-Repetition Schedule for Weak Tags
                </h4>
                <p className="text-xs text-gray-500">
                  Calculated intervals (Day 1, 3, 7, 14, 30) preventing the Ebbinghaus forgetting curve
                </p>
              </div>

              <button
                onClick={() => addToast('Revision milestones synced to Google Calendar / iCal.', 'success')}
                className="px-3.5 py-1.5 bg-cream-100 hover:bg-cream-200 text-ink-900 rounded-xl text-xs font-semibold border border-[#D9CEBE] transition shadow-sm"
              >
                Add All to Calendar
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EADBCC] text-gray-500 text-[11px] uppercase tracking-wider">
                    <th className="py-2 px-3">Interval Cycle</th>
                    <th className="py-2 px-3">Target Topic</th>
                    <th className="py-2 px-3">Scheduled Date</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF6F0]">
                  {currentStudent.spacedRepetition.map((item, idx) => (
                    <tr key={idx} className="hover:bg-cream-50/50">
                      <td className="py-3 px-3 font-semibold text-gray-900">{item.interval}</td>
                      <td className="py-3 px-3 font-medium text-maroon-800">{item.topic}</td>
                      <td className="py-3 px-3 text-gray-600">{item.scheduledDate}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Due Today'
                              ? 'bg-red-100 text-red-800'
                              : item.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-cream-200 text-gray-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleStartAdaptiveSet(item.topic)}
                          className="text-maroon-700 hover:text-maroon-900 font-semibold text-xs"
                        >
                          Launch Drill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily Practice Preview: Phone Mock (WhatsApp vs Telegram skin) */}
          <div className="bg-white border border-[#EADBCC] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADBCC] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-serif font-bold text-lg text-[#1A2B4C]">
                    Daily Practice Micro-Drill Delivery Preview
                  </h4>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Simulates the 5-question daily practice message delivered straight to students' messaging apps.
                </p>
              </div>

              {/* Skin toggle: WhatsApp vs Telegram */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Skin:</span>
                <div className="flex items-center p-1 bg-cream-100 rounded-xl border border-[#D9CEBE]">
                  <button
                    onClick={() => setChatSkin('whatsapp')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      chatSkin === 'whatsapp'
                        ? 'bg-[#25D366] text-white shadow-sm'
                        : 'text-gray-700 hover:text-black'
                    }`}
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setChatSkin('telegram')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      chatSkin === 'telegram'
                        ? 'bg-[#0088cc] text-white shadow-sm'
                        : 'text-gray-700 hover:text-black'
                    }`}
                  >
                    Telegram
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <span>
                <strong>Notice for Leadership:</strong> Preview of what students receive. Real sending needs the WhatsApp Business API or Telegram Bot token.
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                API Ready
              </span>
            </div>

            {/* Phone Wrapper */}
            <div className="flex justify-center py-4">
              <div
                className={`w-full max-w-sm rounded-[36px] border-4 p-3 shadow-2xl overflow-hidden transition-all ${
                  chatSkin === 'whatsapp'
                    ? 'border-gray-800 bg-[#EFEAE2]'
                    : 'border-slate-800 bg-[#D4E2EE]'
                }`}
              >
                {/* Phone Header */}
                <div
                  className={`p-3 rounded-2xl flex items-center justify-between text-white ${
                    chatSkin === 'whatsapp' ? 'bg-[#075E54]' : 'bg-[#2481cc]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                      V
                    </div>
                    <div>
                      <div className="font-bold text-xs">Vallath Education Daily</div>
                      <div className="text-[10px] text-white/80">Active now • Verified Bot</div>
                    </div>
                  </div>
                  <MessageCircle className="w-4 h-4 text-white/80" />
                </div>

                {/* Phone Message Body */}
                <div className="p-3 space-y-3 min-h-[360px] text-xs">
                  {/* Broadcast Message */}
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm space-y-2 border border-black/5">
                    <div className="font-bold text-gray-900 text-xs flex items-center justify-between">
                      <span>📚 Today's 5-Question Daily Drill</span>
                      <span className="text-[9px] text-gray-400">08:00 AM</span>
                    </div>
                    <p className="text-[11px] text-gray-700 leading-snug">
                      Good morning, {currentStudent.name}! Here is Question 1/5 mapped to your weak tag <strong>(Literary Theory)</strong>:
                    </p>
                    <div className="bg-cream-50 p-2.5 rounded-xl border border-cream-200 font-semibold text-gray-900 text-[11px]">
                      "Who coined the concept of 'defamiliarization' (ostranenie) in Russian Formalism?"
                    </div>

                    {/* Tappable Options */}
                    <div className="space-y-1.5 pt-1">
                      {[
                        { text: 'A) Roman Jakobson', correct: false },
                        { text: 'B) Viktor Shklovsky', correct: true },
                        { text: 'C) Boris Eikhenbaum', correct: false },
                        { text: 'D) Vladimir Propp', correct: false },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setPhoneAnswered(idx);
                            setPhoneShowExplanation(true);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg border text-[11px] font-medium transition ${
                            phoneAnswered === idx
                              ? item.correct
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                                : 'bg-red-100 border-red-400 text-red-900'
                              : 'bg-white hover:bg-cream-100 border-gray-200 text-gray-800'
                          }`}
                        >
                          {item.text}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Immediate Automated Reply */}
                  {phoneShowExplanation && (
                    <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-2xl rounded-tr-none shadow-sm space-y-1 text-emerald-950 animate-in fade-in">
                      <div className="font-bold text-[11px] flex items-center justify-between">
                        <span>{phoneAnswered === 1 ? '✅ Correct! (+4 Marks)' : '❌ Incorrect! (Try again)'}</span>
                        <span className="text-[9px] text-gray-400">Just now</span>
                      </div>
                      <p className="text-[10px] leading-snug">
                        <strong>Explanation:</strong> Viktor Shklovsky introduced ostranenie in his 1917 essay 'Art as Technique' to describe making the familiar strange.
                      </p>
                      <div className="text-[9px] text-emerald-700 pt-1 font-semibold">
                        Streak updated: 12 days! Tap below to proceed to Question 2.
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone Bottom Input Bar */}
                <div className="bg-white p-2 rounded-2xl flex items-center gap-2 border border-black/5">
                  <div className="flex-1 bg-gray-100 rounded-full px-3 py-1 text-[11px] text-gray-400">
                    Type a message or select an option...
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${
                      chatSkin === 'whatsapp' ? 'bg-[#128C7E]' : 'bg-[#2481cc]'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEACHER VIEW: Class-Level Heatmap (7 tags x 20 invented students) */}
      {viewMode === 'teacher' && (
        <div className="bg-white border border-[#EADBCC] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADBCC] pb-4">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#1A2B4C] flex items-center gap-2">
                <Users className="w-5 h-5 text-maroon-700" />
                Batch Diagnostic Heatmap (20 Students × 7 Core Areas)
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Displays cohort-wide strengths and vulnerabilities. Green denotes mastery above 75%; Amber 60–74%; Red below 60%.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-red-100 border border-red-300" /> &lt;60% (Weak)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" /> 60-74% (Moderate)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" /> &ge;75% (Strong)
              </span>
            </div>
          </div>

          {/* Batch Summary Alert */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Batch-Wide Insight for Operations:</strong> 14 out of 20 students in the Morning Batch are scoring below 60% in <strong>Literary Theory</strong> and <strong>Neoclassical Satire</strong>. Recommended action: schedule a special 2-hour weekend revision masterclass on Dryden and New Criticism.
            </div>
          </div>

          {/* Interactive Heatmap Table */}
          <div className="overflow-x-auto border border-[#EADBCC] rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#FAF6F0] text-gray-700 text-[11px] font-bold uppercase tracking-wider border-b border-[#EADBCC]">
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-2 text-center">Medieval</th>
                  <th className="py-2.5 px-2 text-center">Renaissance</th>
                  <th className="py-2.5 px-2 text-center">Neoclassical</th>
                  <th className="py-2.5 px-2 text-center">Romantic</th>
                  <th className="py-2.5 px-2 text-center">Victorian</th>
                  <th className="py-2.5 px-2 text-center">Modernist</th>
                  <th className="py-2.5 px-2 text-center">Theory</th>
                  <th className="py-2.5 px-2 text-center">Batch Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADBCC]">
                {CLASS_HEATMAP_DATA.map((row, idx) => {
                  const getCellColor = (val: number) => {
                    if (val >= 75) return 'bg-emerald-50 text-emerald-800 font-semibold';
                    if (val >= 60) return 'bg-amber-50 text-amber-800 font-semibold';
                    return 'bg-red-50 text-red-900 font-bold';
                  };

                  const avg = Math.round(
                    (row.Medieval + row.Renaissance + row.Neoclassical + row.Romantic + row.Victorian + row.Modernist + row.Theory) / 7
                  );

                  return (
                    <tr key={idx} className="hover:bg-cream-50/80">
                      <td className="py-2 px-3 font-semibold text-gray-900 whitespace-nowrap">
                        {row.student}
                      </td>
                      <td className={`py-2 px-2 text-center ${getCellColor(row.Medieval)}`}>
                        {row.Medieval}%
                      </td>
                      <td className={`py-2 px-2 text-center ${getCellColor(row.Renaissance)}`}>
                        {row.Renaissance}%
                      </td>
                      <td className={`py-2 px-2 text-center ${getCellColor(row.Neoclassical)}`}>
                        {row.Neoclassical}%
                      </td>
                      <td className={`py-2 px-2 text-center ${getCellColor(row.Romantic)}`}>
                        {row.Romantic}%
                      </td>
                      <td className={`py-2 px-2 text-center ${getCellColor(row.Victorian)}`}>
                        {row.Victorian}%
                      </td>
                      <td className={`py-2 px-2 text-center ${getCellColor(row.Modernist)}`}>
                        {row.Modernist}%
                      </td>
                      <td className={`py-2 px-2 text-center ${getCellColor(row.Theory)}`}>
                        {row.Theory}%
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-gray-700">
                        {avg}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
