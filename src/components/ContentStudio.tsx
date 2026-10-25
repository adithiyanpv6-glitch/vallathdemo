import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { SAMPLE_TRANSCRIPTS, LectureTranscript } from '../data/transcripts';
import { repurposeTranscript, RepurposedOutput } from '../utils/repurposeEngine';
import {
  Sparkles,
  Copy,
  Download,
  Calendar,
  Clock,
  Video,
  FileText,
  Mail,
  Share2,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  Hash,
  Send,
  Layers,
  Check
} from 'lucide-react';

export const ContentStudio: React.FC = () => {
  const { addToast } = useDemo();

  const [selectedTranscriptId, setSelectedTranscriptId] = useState<string>('lecture-romanticism');
  const [customText, setCustomText] = useState<string>(SAMPLE_TRANSCRIPTS[0].rawText);
  const [customTitle, setCustomTitle] = useState<string>(SAMPLE_TRANSCRIPTS[0].title);

  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState<RepurposedOutput | null>(() => {
    return repurposeTranscript(SAMPLE_TRANSCRIPTS[0].rawText, SAMPLE_TRANSCRIPTS[0].title);
  });

  const [activeOutputTab, setActiveOutputTab] = useState<
    'chapters' | 'clips' | 'quiz' | 'newsletter' | 'seo-blog' | 'social' | 'calendar'
  >('clips');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSelectSample = (transcript: LectureTranscript) => {
    setSelectedTranscriptId(transcript.id);
    setCustomText(transcript.rawText);
    setCustomTitle(transcript.title);
  };

  const handleRunRepurposing = () => {
    if (!customText.trim()) {
      alert('Please provide or paste a lecture transcript.');
      return;
    }

    setIsProcessing(true);

    // Realistic delay of 1.4s
    setTimeout(() => {
      const generated = repurposeTranscript(customText, customTitle);
      setOutput(generated);
      setIsProcessing(false);
      addToast('Lecture successfully repurposed into 6 multi-channel assets & 7-day calendar!', 'success');
    }, 1300);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    addToast(`${label} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addToast(`Downloaded ${filename}`, 'success');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* "What you're looking at" Caption & Hint */}
      <div className="bg-white border border-[#EADBCC] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-purple-100 text-purple-800">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
                What you're looking at
              </span>
            </div>
            <p className="text-sm text-gray-700">
              An automated content engine for coaching institutes. It takes a raw 45-minute audio/video lecture transcript and transforms it into <strong>6 ready-to-publish assets</strong> and a <strong>7-day publishing calendar</strong>.
            </p>
          </div>

          <div className="text-xs text-purple-900 bg-purple-50 px-3.5 py-1.5 rounded-xl border border-purple-200 shrink-0 font-medium">
            Multiplies 1 Faculty Lecture into 7 Days of Marketing
          </div>
        </div>

        {/* "Try this" Hint */}
        <div className="bg-cream-50 p-3 rounded-xl border border-cream-200 text-xs text-gray-700 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
          <div>
            <strong>Try this:</strong> Choose any of the 3 lecture transcripts (e.g. <em>Romanticism</em>, <em>Postcolonial Theory</em>, or <em>Modernism</em>), click <span className="font-semibold text-purple-800">"Repurpose this lecture"</span>, and switch between the <strong>Reels/Shorts clips</strong>, <strong>MCQ Quiz</strong>, and <strong>7-Day Calendar</strong> tabs.
          </div>
        </div>
      </div>

      {/* Input Section: 3 Preloaded Transcripts or Paste Own */}
      <div className="bg-white border border-[#EADBCC] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADBCC] pb-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1A2B4C]">
              Lecture Transcript Input
            </h3>
            <p className="text-xs text-gray-500">
              Select one of Dr. Kalyani Vallath's masterclass transcripts or paste a new classroom recording.
            </p>
          </div>

          <button
            onClick={handleRunRepurposing}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-[#6B1724] hover:bg-maroon-800 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition active:scale-95 flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Extracting Concepts & Assets...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>Repurpose this Lecture (1-Click)</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Preloaded Lecture Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_TRANSCRIPTS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelectSample(t)}
              className={`p-3 rounded-2xl border text-left text-xs transition duration-150 flex flex-col justify-between ${
                selectedTranscriptId === t.id
                  ? 'bg-purple-50/80 border-purple-300 text-purple-950 ring-1 ring-purple-600/20'
                  : 'bg-[#FAF6F0] hover:bg-cream-100 border-[#EADBCC] text-gray-700'
              }`}
            >
              <div className="font-semibold text-xs leading-snug line-clamp-2">
                {t.title}
              </div>
              <div className="text-[10px] text-gray-500 mt-2 flex items-center justify-between">
                <span>{t.topic}</span>
                <span className="font-bold text-maroon-700">{t.duration}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Editable Transcript Text Area */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
            <span>Raw Transcript (with timestamps):</span>
            <span className="text-gray-400 font-normal">
              {customText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            rows={6}
            value={customText}
            onChange={(e) => {
              setCustomText(e.target.value);
              setSelectedTranscriptId('');
            }}
            placeholder="Paste audio transcript with timestamps like [00:15:30]..."
            className="w-full bg-cream-50/60 border border-[#D9CEBE] rounded-2xl p-3.5 text-xs text-gray-900 leading-relaxed font-mono focus:outline-none focus:ring-1 focus:ring-purple-700"
          />
        </div>
      </div>

      {/* Generated Outputs Showcase */}
      {output && (
        <div className="bg-white border border-[#EADBCC] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADBCC] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                AI Generation Complete
              </span>
              <h3 className="font-serif font-bold text-xl text-[#1A2B4C] mt-1">
                Repurposed Content Suite: {output.seoBlog.title}
              </h3>
            </div>

            <div className="text-xs text-gray-500">
              Generated in <strong>1.4 seconds</strong> • 6 formats ready
            </div>
          </div>

          {/* 7 Output Tabs */}
          <div className="flex border-b border-[#EADBCC] overflow-x-auto gap-2">
            {[
              { id: 'clips', label: '5 Reel / Shorts Hooks', icon: Video },
              { id: 'quiz', label: '5-Question MCQ Quiz', icon: HelpCircle },
              { id: 'newsletter', label: '80-Word Newsletter', icon: Mail },
              { id: 'seo-blog', label: 'SEO Blog Draft', icon: FileText },
              { id: 'social', label: 'Social & WhatsApp Broadcast', icon: Share2 },
              { id: 'chapters', label: 'Clean Chapters', icon: Layers },
              { id: 'calendar', label: '7-Day Content Calendar', icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveOutputTab(tab.id as any)}
                  className={`py-2.5 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition flex items-center gap-1.5 ${
                    activeOutputTab === tab.id
                      ? 'border-purple-700 text-purple-900 bg-purple-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-purple-700" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: 5 SHORT CLIPS */}
          {activeOutputTab === 'clips' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  5 High-Retention Short Clips (Reels / Shorts / TikTok)
                </span>
                <button
                  onClick={() =>
                    handleCopyText(
                      output.clips
                        .map(
                          (c) =>
                            `[${c.timestamp}] ${c.hookTitle}\nTarget: ${c.targetPlatform}\nCaption: ${c.caption}\n`
                        )
                        .join('\n---\n'),
                      'All Clip Hooks'
                    )
                  }
                  className="flex items-center gap-1 text-xs text-purple-800 hover:text-purple-900 font-semibold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All Clips</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {output.clips.map((clip) => (
                  <div
                    key={clip.clipNumber}
                    className="p-4 rounded-2xl border border-[#EADBCC] bg-[#FAF6F0] space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
                          Clip #{clip.clipNumber} • {clip.targetPlatform}
                        </span>
                        <span className="text-gray-500 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {clip.timestamp}
                        </span>
                      </div>

                      <div className="font-serif font-bold text-sm text-gray-900 leading-snug">
                        {clip.hookTitle}
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed bg-white p-2.5 rounded-xl border border-[#EADBCC]">
                        "{clip.caption}"
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleCopyText(
                          `Hook: ${clip.hookTitle}\nTime: ${clip.timestamp}\nCaption: ${clip.caption}`,
                          `Clip #${clip.clipNumber}`
                        )
                      }
                      className="w-full py-1.5 bg-white hover:bg-cream-100 text-gray-800 text-xs font-medium rounded-lg border border-[#D9CEBE] transition flex items-center justify-center gap-1"
                    >
                      <Copy className="w-3 h-3 text-purple-700" />
                      <span>Copy Clip Script</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: QUIZ OF 5 MCQS */}
          {activeOutputTab === 'quiz' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  5-Question Lecture Comprehension Quiz
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleCopyText(JSON.stringify(output.quiz, null, 2), 'Quiz JSON')
                    }
                    className="flex items-center gap-1 text-xs text-purple-800 hover:text-purple-900 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadFile(
                        'lecture-quiz.txt',
                        output.quiz
                          .map(
                            (q, i) =>
                              `Q${i + 1}: ${q.question}\n` +
                              q.options.map((o, oi) => `  ${String.fromCharCode(65 + oi)}) ${o}`).join('\n') +
                              `\nCorrect: ${String.fromCharCode(65 + q.correctIndex)}\nExplanation: ${q.explanation}\n`
                          )
                          .join('\n')
                      )
                    }
                    className="flex items-center gap-1 text-xs text-ink-800 hover:text-ink-900 font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .txt</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {output.quiz.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-[#EADBCC] bg-[#FAF6F0] space-y-2 text-xs"
                  >
                    <div className="font-serif font-bold text-sm text-gray-900 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-maroon-700 text-white text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{q.question}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-xl border text-[11px] font-medium ${
                            oIdx === q.correctIndex
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                              : 'bg-white border-gray-200 text-gray-700'
                          }`}
                        >
                          <span className="font-bold mr-1.5">
                            {String.fromCharCode(65 + oIdx)})
                          </span>
                          {opt}
                        </div>
                      ))}
                    </div>

                    <div className="pl-7 pt-1 text-[11px] text-gray-600">
                      <strong>Answer Note:</strong> {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 80-WORD NEWSLETTER */}
          {activeOutputTab === 'newsletter' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Email Newsletter ({output.newsletter.wordCount} words)
                </span>
                <button
                  onClick={() =>
                    handleCopyText(
                      `Subject: ${output.newsletter.subjectLine}\n\n${output.newsletter.body}`,
                      'Newsletter'
                    )
                  }
                  className="flex items-center gap-1 text-xs text-purple-800 hover:text-purple-900 font-semibold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Email Text</span>
                </button>
              </div>

              <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#EADBCC] space-y-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                    Subject Line:
                  </div>
                  <div className="font-serif font-bold text-base text-[#1A2B4C]">
                    {output.newsletter.subjectLine}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#EADBCC] text-xs text-gray-800 whitespace-pre-line leading-relaxed font-sans">
                  {output.newsletter.body}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEO BLOG DRAFT (400-500 words) */}
          {activeOutputTab === 'seo-blog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    SEO Article Draft ({output.seoBlog.readingTime})
                  </span>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Meta Description: {output.seoBlog.metaDescription}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleCopyText(output.seoBlog.body, 'SEO Blog Markdown')
                    }
                    className="flex items-center gap-1 text-xs text-purple-800 hover:text-purple-900 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Markdown</span>
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadFile(
                        `${output.seoBlog.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`,
                        output.seoBlog.body
                      )
                    }
                    className="flex items-center gap-1 text-xs text-ink-800 hover:text-ink-900 font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .md</span>
                  </button>
                </div>
              </div>

              {/* Keywords Tag Pill */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-xs font-semibold text-gray-600 mr-1">
                  Target Keywords:
                </span>
                {output.seoBlog.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-purple-50 text-purple-900 px-2 py-0.5 rounded-full border border-purple-200 font-medium"
                  >
                    #{kw}
                  </span>
                ))}
              </div>

              <div className="bg-[#FAF6F0] p-6 rounded-3xl border border-[#EADBCC] text-xs sm:text-sm text-gray-800 whitespace-pre-line leading-relaxed font-sans max-h-[500px] overflow-y-auto">
                {output.seoBlog.body}
              </div>
            </div>
          )}

          {/* TAB 5: SOCIAL POSTS (Instagram, Twitter 4-post thread, WhatsApp) */}
          {activeOutputTab === 'social' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Instagram Caption */}
              <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#EADBCC] space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                    <span className="flex items-center gap-1 text-pink-700">
                      <Share2 className="w-4 h-4" /> Instagram Caption
                    </span>
                    <button
                      onClick={() =>
                        handleCopyText(output.socialPosts.instagram.caption, 'Instagram Caption')
                      }
                      className="text-gray-500 hover:text-gray-800"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#EADBCC] text-xs text-gray-800 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto">
                    {output.socialPosts.instagram.caption}
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleCopyText(output.socialPosts.instagram.caption, 'Instagram Caption')
                  }
                  className="w-full py-2 bg-white hover:bg-cream-100 text-gray-800 text-xs font-medium rounded-xl border border-[#D9CEBE] transition flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3 h-3 text-pink-700" />
                  <span>Copy Caption</span>
                </button>
              </div>

              {/* Twitter / X Thread (4 tweets) */}
              <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#EADBCC] space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                    <span className="flex items-center gap-1 text-sky-700">
                      <Hash className="w-4 h-4" /> X (Twitter) 4-Tweet Thread
                    </span>
                    <button
                      onClick={() =>
                        handleCopyText(
                          output.socialPosts.twitterThread.map((t) => t.text).join('\n\n'),
                          'Twitter Thread'
                        )
                      }
                      className="text-gray-500 hover:text-gray-800"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {output.socialPosts.twitterThread.map((tweet) => (
                      <div
                        key={tweet.tweetNumber}
                        className="bg-white p-2.5 rounded-xl border border-[#EADBCC] text-xs text-gray-800"
                      >
                        {tweet.text}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleCopyText(
                      output.socialPosts.twitterThread.map((t) => t.text).join('\n\n'),
                      'Twitter Thread'
                    )
                  }
                  className="w-full py-2 bg-white hover:bg-cream-100 text-gray-800 text-xs font-medium rounded-xl border border-[#D9CEBE] transition flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3 h-3 text-sky-700" />
                  <span>Copy All 4 Tweets</span>
                </button>
              </div>

              {/* WhatsApp Broadcast Text */}
              <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#EADBCC] space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <MessageCircle className="w-4 h-4" /> WhatsApp Broadcast
                    </span>
                    <button
                      onClick={() =>
                        handleCopyText(
                          output.socialPosts.whatsappBroadcast,
                          'WhatsApp Broadcast'
                        )
                      }
                      className="text-gray-500 hover:text-gray-800"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#EADBCC] text-xs text-gray-800 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto">
                    {output.socialPosts.whatsappBroadcast}
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleCopyText(
                      output.socialPosts.whatsappBroadcast,
                      'WhatsApp Broadcast'
                    )
                  }
                  className="w-full py-2 bg-white hover:bg-cream-100 text-gray-800 text-xs font-medium rounded-xl border border-[#D9CEBE] transition flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3 h-3 text-emerald-700" />
                  <span>Copy Broadcast Message</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: CLEAN TRANSCRIPT WITH CHAPTERS */}
          {activeOutputTab === 'chapters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Clean Transcribed Chapters with Timestamps
                </span>
                <button
                  onClick={() =>
                    handleCopyText(
                      output.cleanTranscript.chapters
                        .map((c) => `[${c.time}] ${c.title}\n${c.text}\n`)
                        .join('\n'),
                      'Clean Chapters'
                    )
                  }
                  className="flex items-center gap-1 text-xs text-purple-800 hover:text-purple-900 font-semibold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All Chapters</span>
                </button>
              </div>

              <div className="space-y-3">
                {output.cleanTranscript.chapters.map((ch, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-[#EADBCC] bg-[#FAF6F0] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-[#1A2B4C]">
                        {ch.title}
                      </h4>
                      <span className="text-[11px] font-mono text-maroon-700 font-bold bg-cream-100 px-2 py-0.5 rounded border border-[#D9CEBE]">
                        {ch.time}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-[#EADBCC]">
                      {ch.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: 7-DAY CONTENT CALENDAR */}
          {activeOutputTab === 'calendar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    Automated 7-Day Editorial Distribution Calendar
                  </span>
                  <div className="text-[11px] text-gray-500">
                    Staggers the repurposed lecture across social, messaging, and search channels.
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleCopyText(
                      output.calendar
                        .map((c) => `${c.day} (${c.channel}): ${c.action}`)
                        .join('\n'),
                      'Content Calendar'
                    )
                  }
                  className="flex items-center gap-1 text-xs text-purple-800 hover:text-purple-900 font-semibold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Calendar Plan</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-[#EADBCC] rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-[#FAF6F0] text-gray-700 text-[11px] font-bold uppercase tracking-wider border-b border-[#EADBCC]">
                      <th className="py-2.5 px-3">Publish Day</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Channel</th>
                      <th className="py-2.5 px-3">Repurposed Content Action</th>
                      <th className="py-2.5 px-3 text-right">Format</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EADBCC]">
                    {output.calendar.map((row, idx) => (
                      <tr key={idx} className="hover:bg-cream-50">
                        <td className="py-3 px-3 font-semibold text-gray-900">
                          {row.day}
                        </td>
                        <td className="py-3 px-3 text-gray-500">
                          {row.dateFormatted}
                        </td>
                        <td className="py-3 px-3 font-medium text-purple-900">
                          {row.channel}
                        </td>
                        <td className="py-3 px-3 text-gray-700">
                          {row.action}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cream-200 text-gray-800">
                            {row.contentType}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
