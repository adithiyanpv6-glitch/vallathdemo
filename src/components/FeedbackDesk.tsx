import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { FEEDBACK_CATEGORIES, FeedbackCategory, FeedbackSample, FeedbackResult } from '../data/feedbackSamples';
import { analyzeSubmission } from '../utils/feedbackEngine';
import {
  FileCheck2,
  Clock,
  Send,
  Sparkles,
  HelpCircle,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Edit3,
  ThumbsUp,
  XCircle,
  Award,
  Layers,
  FileText
} from 'lucide-react';

export const FeedbackDesk: React.FC = () => {
  const {
    reviewSubmissions,
    addReviewSubmission,
    updateFacultyComment,
    approveSubmission,
    rejectSubmission,
    addToast
  } = useDemo();

  const [activeCategoryId, setActiveCategoryId] = useState<'asst-prof' | 'research-prop' | 'ielts-task2'>('asst-prof');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sample-ap-1');
  const [submissionText, setSubmissionText] = useState<string>(
    FEEDBACK_CATEGORIES[0].samples[0].submissionText
  );
  const [studentNameInput, setStudentNameInput] = useState<string>(
    FEEDBACK_CATEGORIES[0].samples[0].studentName
  );
  const [submissionTitleInput, setSubmissionTitleInput] = useState<string>(
    FEEDBACK_CATEGORIES[0].samples[0].title
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAiResult, setCurrentAiResult] = useState<FeedbackResult | null>(null);

  // Active Category Object
  const currentCategory = FEEDBACK_CATEGORIES.find(c => c.id === activeCategoryId) || FEEDBACK_CATEGORIES[0];

  const handleSelectSample = (sample: FeedbackSample) => {
    setSelectedSampleId(sample.id);
    setSubmissionText(sample.submissionText);
    setStudentNameInput(sample.studentName);
    setSubmissionTitleInput(sample.title);
    setCurrentAiResult(null);
  };

  const handleCategorySwitch = (catId: 'asst-prof' | 'research-prop' | 'ielts-task2') => {
    setActiveCategoryId(catId);
    const cat = FEEDBACK_CATEGORIES.find(c => c.id === catId) || FEEDBACK_CATEGORIES[0];
    const firstSample = cat.samples[0];
    setSelectedSampleId(firstSample.id);
    setSubmissionText(firstSample.submissionText);
    setStudentNameInput(firstSample.studentName);
    setSubmissionTitleInput(firstSample.title);
    setCurrentAiResult(null);
  };

  const handleRunAiAnalysis = () => {
    if (!submissionText.trim()) {
      alert('Please paste or write a submission first.');
      return;
    }

    setIsAnalyzing(true);
    setCurrentAiResult(null);

    // Realistic delay of 1.4s
    setTimeout(() => {
      const result = analyzeSubmission(submissionText, currentCategory);
      setCurrentAiResult(result);
      setIsAnalyzing(false);

      // Add to Teacher Review Queue
      addReviewSubmission({
        categoryLabel: currentCategory.label,
        studentName: studentNameInput || 'Student A (Aparna K.)',
        submissionTitle: submissionTitleInput || 'Untitled Submission',
        submissionText,
        aiResult: result
      });

      addToast('AI First-Pass evaluation completed in 8 sec and routed to Teacher Review Queue!', 'success');
    }, 1300);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* "What you're looking at" Caption & Hint */}
      <div className="bg-white border border-[#EADBCC] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                <FileCheck2 className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                What you're looking at
              </span>
            </div>
            <p className="text-sm text-gray-700">
              An AI-assisted faculty desk. It performs an instant first-pass rubric evaluation on descriptive essays, highlights strengths/improvements inline, and lets the teacher approve or edit in one click.
            </p>
          </div>

          {/* Time Saved Pill */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-emerald-900 shrink-0">
            <Clock className="w-4 h-4 text-emerald-600" />
            <div className="text-xs">
              <span className="font-bold">8 Sec AI Draft</span> vs 20 Min Manual (Illustrative)
            </div>
          </div>
        </div>

        {/* "Try this" Hint */}
        <div className="bg-cream-50 p-3 rounded-xl border border-cream-200 text-xs text-gray-700 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong>Try this:</strong> Choose <strong>Sample 1 (T.S. Eliot Impersonal Theory)</strong>, click <span className="font-semibold text-emerald-800">"Get AI first-pass feedback"</span>, watch the rubric scoring generate, then scroll down to the <strong>Teacher Review Queue</strong> to approve and see the final student card.
          </div>
        </div>
      </div>

      {/* Clear Flow Diagram: Student → AI Draft → Teacher Approves → Student */}
      <div className="bg-[#FAF6F0] border border-[#EADBCC] rounded-2xl p-4 shadow-sm">
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
          Feedback Lifecycle Architecture
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white p-3 rounded-xl border border-[#EADBCC] flex items-center gap-2 shadow-sm">
            <div className="w-6 h-6 rounded-full bg-cream-200 text-ink-900 font-bold flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <div className="font-bold text-gray-900">Student Submits</div>
              <div className="text-[11px] text-gray-500">Essay or proposal uploaded</div>
            </div>
          </div>

          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center gap-2 shadow-sm">
            <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <div className="font-bold text-emerald-900">AI First-Pass (8s)</div>
              <div className="text-[11px] text-emerald-700">Rubric scored & highlights</div>
            </div>
          </div>

          <div className="bg-maroon-50 p-3 rounded-xl border border-maroon-200 flex items-center gap-2 shadow-sm">
            <div className="w-6 h-6 rounded-full bg-maroon-700 text-white font-bold flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <div className="font-bold text-maroon-900">Teacher Approves</div>
              <div className="text-[11px] text-maroon-700">Faculty edits & signs off</div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#EADBCC] flex items-center gap-2 shadow-sm">
            <div className="w-6 h-6 rounded-full bg-gold-400 text-ink-900 font-bold flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <div className="font-bold text-gray-900">Student Receives</div>
              <div className="text-[11px] text-gray-500">Targeted advice & rubric</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Main Category Tabs */}
      <div className="flex border-b border-[#EADBCC] overflow-x-auto gap-2">
        {FEEDBACK_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySwitch(cat.id)}
            className={`py-3 px-4 font-serif font-bold text-sm whitespace-nowrap border-b-2 transition flex items-center gap-2 ${
              activeCategoryId === cat.id
                ? 'border-maroon-700 text-maroon-800 bg-cream-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>{cat.label}</span>
            <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-cream-200 text-gray-700">
              {cat.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Submission & AI First-Pass Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sample picker & Text Area (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#EADBCC] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          {/* Sample Selectors */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                1-Click Preloaded Submissions:
              </span>
              <span className="text-[11px] text-gray-400 font-medium">Or paste below</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentCategory.samples.map((sample, idx) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition duration-150 flex flex-col justify-between ${
                    selectedSampleId === sample.id
                      ? 'bg-maroon-50 border-maroon-300 text-maroon-900 ring-1 ring-maroon-700/20'
                      : 'bg-[#FAF6F0] hover:bg-cream-100 border-[#EADBCC] text-gray-700'
                  }`}
                >
                  <div className="font-semibold truncate">
                    Sample {idx + 1}: {sample.title}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    Student: {sample.studentName} • {sample.expectedWordCount}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submission Info Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Student Name / Candidate ID:
              </label>
              <input
                type="text"
                value={studentNameInput}
                onChange={(e) => setStudentNameInput(e.target.value)}
                className="w-full bg-cream-50 border border-[#D9CEBE] rounded-xl px-3 py-1.5 text-xs text-gray-900 font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Paper / Essay Title:
              </label>
              <input
                type="text"
                value={submissionTitleInput}
                onChange={(e) => setSubmissionTitleInput(e.target.value)}
                className="w-full bg-cream-50 border border-[#D9CEBE] rounded-xl px-3 py-1.5 text-xs text-gray-900 font-medium"
              />
            </div>
          </div>

          {/* Text Area */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1">
              <span>Candidate Submission Text:</span>
              <span className="text-gray-400 font-normal">
                {submissionText.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              rows={12}
              value={submissionText}
              onChange={(e) => {
                setSubmissionText(e.target.value);
                setSelectedSampleId('');
              }}
              placeholder="Paste candidate descriptive essay, proposal abstract, or IELTS writing..."
              className="w-full bg-cream-50/60 border border-[#D9CEBE] rounded-2xl p-4 text-xs sm:text-sm text-gray-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-maroon-700/20 font-sans"
            />
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-gray-500">
              Evaluated using Vallath's {currentCategory.rubricTemplate.length}-point criterion rubric
            </span>

            <button
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzing}
              className="px-5 py-2.5 bg-[#6B1724] hover:bg-maroon-800 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition active:scale-95 flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Evaluating Rubric & Signposts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>Get AI First-Pass Feedback (8s)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI First-Pass Evaluation & Rubric (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {currentAiResult ? (
            <div className="bg-white border-2 border-emerald-600/30 rounded-3xl p-5 shadow-sm space-y-4 animate-in fade-in">
              {/* Score Header */}
              <div className="flex items-start justify-between border-b border-[#EADBCC] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    AI Evaluator Draft
                  </span>
                  <div className="font-serif font-bold text-2xl text-[#1A2B4C] mt-1">
                    {currentAiResult.scoreBand}
                  </div>
                  <div className="text-xs text-gray-500">
                    Word Count: {currentAiResult.wordCount} words
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> First-Pass Ready
                  </span>
                </div>
              </div>

              {/* Rubric Criteria Breakdowns */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Rubric Assessment Breakdown:
                </div>
                {currentAiResult.criteria.map((c, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-cream-50 border border-cream-200 space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-900">
                      <span>{c.name}</span>
                      <span className="text-maroon-700 font-bold">
                        {c.score} / {c.maxScore}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      {c.comment}
                    </p>
                  </div>
                ))}
              </div>

              {/* Inline Highlighting Showcase */}
              <div className="space-y-2 pt-2 border-t border-[#EADBCC]">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Sample Inline Annotations:
                </div>
                <div className="space-y-1.5 text-xs">
                  {currentAiResult.inlineHighlights.map((hl, hIdx) => (
                    <div
                      key={hIdx}
                      className={`p-2 rounded-lg border leading-snug ${
                        hl.type === 'strong'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : 'bg-amber-50 border-amber-200 text-amber-950'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5">
                        {hl.type === 'strong' ? '🟢 Scholarly Strength' : '🟡 Suggestion to Improve'}
                      </div>
                      <div className="italic text-[11px] text-gray-700 mb-1">
                        "{hl.text.slice(0, 90)}..."
                      </div>
                      <div className="text-[11px] font-medium">
                        {hl.comment}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Things to Fix Next */}
              <div className="bg-maroon-50/70 border border-maroon-200 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="font-bold text-maroon-900 text-xs flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-maroon-700" />
                  3 Things to Fix Next (Prioritized):
                </div>
                <ul className="space-y-1 text-gray-800 text-[11px]">
                  {currentAiResult.thingsToFix.map((fix, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-1.5">
                      <span className="font-bold text-maroon-700">{fIdx + 1}.</span>
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#EADBCC] rounded-3xl p-8 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cream-100 border border-[#D9CEBE] text-maroon-700 mx-auto flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#1A2B4C]">
                Ready for AI First-Pass
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                Click "Get AI First-Pass Feedback" to scan word counts, thesis strength, critical citations, and produce an instant rubric score.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* TEACHER REVIEW QUEUE SECTION */}
      <div className="bg-white border border-[#EADBCC] rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADBCC] pb-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#1A2B4C] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-maroon-700" />
              Faculty Review Queue ({reviewSubmissions.length} Submissions)
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Teachers retain 100% editorial authority. Review AI draft comments, modify if desired, and click "Approve & send" to release to the student portal.
            </p>
          </div>

          <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            Average Turnaround: 2 hours vs 5 days
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {reviewSubmissions.map((sub) => {
            const isApproved = sub.status === 'Approved & Sent';
            const isRejected = sub.status === 'Needs Revision';

            return (
              <div
                key={sub.id}
                className={`p-5 rounded-3xl border transition space-y-4 ${
                  isApproved
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : isRejected
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-[#FAF6F0]/80 border-[#EADBCC]'
                }`}
              >
                {/* Item Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EADBCC] pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isRejected
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-maroon-100 text-maroon-800 border border-maroon-200'
                      }`}
                    >
                      {sub.status}
                    </span>
                    <span className="text-xs font-bold text-gray-900">{sub.studentName}</span>
                    <span className="text-xs text-gray-500">• {sub.categoryLabel}</span>
                  </div>

                  <div className="text-[11px] text-gray-500 flex items-center gap-2">
                    <span>{sub.timestamp}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{sub.timeSavedText}</span>
                  </div>
                </div>

                {/* Submission Title & Score Pill */}
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base text-[#1A2B4C]">
                    {sub.submissionTitle}
                  </h4>
                  <span className="text-xs font-bold text-maroon-800 bg-cream-100 px-3 py-1 rounded-xl border border-[#D9CEBE]">
                    AI Score: {sub.aiResult.scoreBand}
                  </span>
                </div>

                {/* Comparison Grid: AI Draft vs Teacher Final Comment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* AI Draft Box */}
                  <div className="bg-white p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                    <div className="font-bold text-gray-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                      AI First-Pass Note:
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {sub.aiResult.aiDraftNote}
                    </p>
                    <div className="text-[10px] text-gray-400 pt-1">
                      Criterion Strengths: {sub.aiResult.criteria.map(c => `${c.name} (${c.score})`).slice(0, 2).join(', ')}
                    </div>
                  </div>

                  {/* Teacher Final Comment (Editable) */}
                  <div className="bg-white p-3.5 rounded-2xl border border-maroon-200 space-y-1.5">
                    <div className="font-bold text-maroon-900 text-[11px] uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-maroon-700" />
                        Teacher Endorsement Note:
                      </span>
                      {!isApproved && (
                        <span className="text-[10px] text-gray-400 font-normal">Editable</span>
                      )}
                    </div>

                    {!isApproved ? (
                      <textarea
                        rows={3}
                        value={sub.facultyComment}
                        onChange={(e) => updateFacultyComment(sub.id, e.target.value)}
                        placeholder="Add faculty feedback or sign-off remarks..."
                        className="w-full bg-cream-50 border border-[#D9CEBE] rounded-xl p-2.5 text-xs text-gray-900 leading-relaxed focus:outline-none focus:ring-1 focus:ring-maroon-700"
                      />
                    ) : (
                      <p className="text-gray-800 leading-relaxed font-medium bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                        {sub.facultyComment}
                      </p>
                    )}
                  </div>
                </div>

                {/* Faculty Action Buttons */}
                {!isApproved ? (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => rejectSubmission(sub.id)}
                      className="px-4 py-2 border border-red-300 text-red-800 hover:bg-red-50 rounded-xl text-xs font-medium transition"
                    >
                      Request Re-draft
                    </button>

                    <button
                      onClick={() => approveSubmission(sub.id)}
                      className="px-5 py-2 bg-[#6B1724] hover:bg-maroon-800 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-gold-400" />
                      <span>Approve & Dispatch to Student</span>
                    </button>
                  </div>
                ) : (
                  /* Student View Received Card */
                  <div className="p-4 bg-emerald-100/60 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      <div>
                        <strong>Dispatched to Student Portal:</strong> {sub.studentName} has received this verified rubric score & faculty commentary.
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-emerald-800 bg-white px-3 py-1 rounded-xl border border-emerald-200 self-start sm:self-auto shrink-0">
                      Feedback Verified
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
