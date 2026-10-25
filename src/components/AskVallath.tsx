import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useDemo } from '../context/DemoContext';
import { LiteratureSearchEngine, generateGroundedAnswer } from '../utils/search';
import { StudyNote } from '../data/knowledge/notesData';
import {
  MessageSquareQuote,
  Send,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  HelpCircle,
  GraduationCap,
  X,
  Search,
  Plus,
  Clock,
  ArrowRight,
  Globe2,
  FileText
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: { id: string; title: string; period: string }[];
  confidenceScore?: number;
  isGrounded?: boolean;
  timestamp: string;
  feedback?: 'like' | 'dislike';
  flaggedForTeacher?: boolean;
}

const SAMPLE_QUESTIONS = [
  "What is the difference between Petrarchan and Shakespearean sonnets?",
  "Explain the Romantic movement's key features",
  "Who wrote Paradise Lost and what is its theme?",
  "What is Keats's concept of Negative Capability?",
  "What are the characteristics of Victorian realism in Charles Dickens's novels?",
  "Explain New Criticism and the Intentional Fallacy",
  "What is the significance of the Lake Poets in English literature?",
  "What is the weather in Kochi?" // Refusal Guardrail Sample
];

export const AskVallath: React.FC = () => {
  const { notes, addStudyNote, teacherQueue, addQuestionToTeacherQueue, resolveTeacherQueueItem, setActiveTab, addToast } = useDemo();

  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'knowledge' | 'teacher-queue'>('chat');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ml' | 'hi'>('en');

  // Search Engine instance
  const searchEngine = useMemo(() => {
    return new LiteratureSearchEngine(notes);
  }, [notes]);

  // Initial Chat state with a welcoming message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "Namaskaram! I am your **Vallath AI Study Companion**. I answer questions strictly based on Vallath Education's verified study materials for UGC NET, SET, GATE, and CUET-PG English. Pick a sample doubt below or type your question.",
      sources: [],
      confidenceScore: 98,
      isGrounded: true,
      timestamp: '10:00 AM'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeDrawerNote, setActiveDrawerNote] = useState<StudyNote | null>(null);

  // Filter state for Knowledge tab
  const [knowledgeSearch, setKnowledgeSearch] = useState('');
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState<string>('All');

  // Add Note Modal / Form state
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newPeriod, setNewPeriod] = useState('Contemporary');
  const [newTopic, setNewTopic] = useState('Literary Theory');
  const [newContent, setNewContent] = useState('');

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    // Realistic delay of 1.2s to simulate thinking / retrieval
    setTimeout(() => {
      const searchResults = searchEngine.search(text, 3);
      const groundedResult = generateGroundedAnswer(text, searchResults, 1.8);

      const aiMessage: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: groundedResult.answer,
        sources: groundedResult.sources,
        confidenceScore: groundedResult.confidenceScore,
        isGrounded: groundedResult.isGrounded,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        flaggedForTeacher: !groundedResult.isGrounded
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // If refused, add to Teacher Queue panel automatically!
      if (!groundedResult.isGrounded) {
        addQuestionToTeacherQueue(text, 'Out of syllabus / retrieval score below 1.8 threshold.');
      }
    }, 1100);
  };

  const handleFeedback = (messageId: string, type: 'like' | 'dislike') => {
    setMessages(prev =>
      prev.map(m => (m.id === messageId ? { ...m, feedback: type } : m))
    );
    addToast(type === 'like' ? 'Thank you! Marked as helpful.' : 'Feedback recorded for review.', 'info');
  };

  const handleAskTeacher = (userQuestion: string) => {
    addQuestionToTeacherQueue(userQuestion, 'Student requested direct faculty assistance.');
  };

  const handleOpenSourceDrawer = (sourceId: string) => {
    const found = notes.find(n => n.id === sourceId);
    if (found) {
      setActiveDrawerNote(found);
    }
  };

  const handleAddNewNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please provide at least a title and content.');
      return;
    }

    addStudyNote({
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Vallath Faculty',
      period: newPeriod,
      topic: newTopic,
      content: newContent.trim()
    });

    setIsAddingNote(false);
    setNewTitle('');
    setNewAuthor('');
    setNewContent('');

    // Switch back to chat and offer to test it
    setActiveSubTab('chat');
  };

  // Filtered notes for Knowledge base tab
  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchSearch =
        knowledgeSearch === '' ||
        n.title.toLowerCase().includes(knowledgeSearch.toLowerCase()) ||
        n.content.toLowerCase().includes(knowledgeSearch.toLowerCase()) ||
        n.author.toLowerCase().includes(knowledgeSearch.toLowerCase());

      const matchPeriod =
        selectedPeriodFilter === 'All' || n.period.toLowerCase().includes(selectedPeriodFilter.toLowerCase());

      return matchSearch && matchPeriod;
    });
  }, [notes, knowledgeSearch, selectedPeriodFilter]);

  const uniquePeriods = useMemo(() => {
    const set = new Set(notes.map(n => n.period.split(' ')[0]));
    return ['All', ...Array.from(set)];
  }, [notes]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* "What you're looking at" Caption & Hint */}
      <div className="bg-white border border-[#EADBCC] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-maroon-100 text-maroon-800">
                <MessageSquareQuote className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-maroon-800">
                What you're looking at
              </span>
            </div>
            <p className="text-sm text-gray-700">
              An offline RAG (Retrieval-Augmented Generation) doubt solver. It retrieves answers <strong>strictly</strong> from your {notes.length} uploaded study notes. If an answer cannot be grounded, it refuses and routes to faculty.
            </p>
          </div>

          {/* Sub tabs */}
          <div className="flex items-center p-1 bg-cream-100 rounded-xl border border-[#D9CEBE] shrink-0">
            <button
              onClick={() => setActiveSubTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeSubTab === 'chat'
                  ? 'bg-[#6B1724] text-white shadow-sm'
                  : 'text-gray-700 hover:text-ink-900'
              }`}
            >
              Doubt Chat
            </button>
            <button
              onClick={() => setActiveSubTab('knowledge')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                activeSubTab === 'knowledge'
                  ? 'bg-[#6B1724] text-white shadow-sm'
                  : 'text-gray-700 hover:text-ink-900'
              }`}
            >
              <span>Knowledge Base</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-current">
                {notes.length}
              </span>
            </button>
            <button
              onClick={() => setActiveSubTab('teacher-queue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                activeSubTab === 'teacher-queue'
                  ? 'bg-[#6B1724] text-white shadow-sm'
                  : 'text-gray-700 hover:text-ink-900'
              }`}
            >
              <span>Teacher Queue</span>
              {teacherQueue.filter(q => q.status === 'Pending Review').length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold">
                  {teacherQueue.filter(q => q.status === 'Pending Review').length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* "Try this" Hint */}
        <div className="bg-cream-50 p-3 rounded-xl border border-cream-200 text-xs text-gray-700 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-maroon-700 shrink-0 mt-0.5" />
          <div>
            <strong>Try this:</strong> Click <button onClick={() => handleSend("What is the difference between Petrarchan and Shakespearean sonnets?")} className="text-maroon-700 font-semibold underline hover:text-maroon-800">Petrarchan Sonnets</button> to see grounded citation chips, or click <button onClick={() => handleSend("What is the weather in Kochi?")} className="text-red-700 font-semibold underline hover:text-red-800">"What is the weather in Kochi?"</button> to see the strict guardrail refuse and forward to the Teacher Queue.
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Chat Window */}
          <div className="lg:col-span-2 bg-white border border-[#EADBCC] rounded-3xl shadow-sm flex flex-col h-[650px] overflow-hidden">
            {/* Chat Header Bar */}
            <div className="p-4 border-b border-[#EADBCC] bg-[#FAF6F0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-maroon-100 border border-maroon-200 flex items-center justify-center text-maroon-800 font-bold">
                  V
                </div>
                <div>
                  <div className="font-serif font-bold text-sm text-[#1A2B4C]">
                    Vallath AI Literature Companion
                  </div>
                  <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Strict Grounding Active • Index: {notes.length} Study Notes
                  </div>
                </div>
              </div>

              {/* Language Shell Toggle */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#D9CEBE] text-xs">
                <Globe2 className="w-3.5 h-3.5 text-gray-500 ml-1" />
                <button
                  onClick={() => setSelectedLanguage('en')}
                  className={`px-2 py-0.5 rounded-md font-medium text-xs ${
                    selectedLanguage === 'en'
                      ? 'bg-maroon-700 text-white'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    setSelectedLanguage('ml');
                    addToast('Malayalam support is marked Coming Soon in this concept preview.', 'info');
                  }}
                  title="Coming soon"
                  className="px-2 py-0.5 rounded-md text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                >
                  മലയാളം <span className="text-[9px] uppercase font-bold text-amber-700">Soon</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedLanguage('hi');
                    addToast('Hinglish support is marked Coming Soon in this concept preview.', 'info');
                  }}
                  title="Coming soon"
                  className="px-2 py-0.5 rounded-md text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                >
                  Hinglish <span className="text-[9px] uppercase font-bold text-amber-700">Soon</span>
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-cream-50/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#1A2B4C] text-white rounded-br-none'
                        : msg.flaggedForTeacher
                        ? 'bg-amber-50 border border-amber-300 text-amber-950 rounded-bl-none'
                        : 'bg-white border border-[#EADBCC] text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {/* Guardrail Refusal Banner if applicable */}
                    {msg.flaggedForTeacher && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-200 text-amber-800 text-xs font-semibold">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>Grounding Guardrail Refusal</span>
                      </div>
                    )}

                    {/* Formatted Text Content */}
                    <div className="whitespace-pre-line leading-relaxed space-y-2">
                      {msg.text.split('\n\n').map((paragraph, i) => (
                        <p key={i}>
                          {paragraph.split('**').map((chunk, j) =>
                            j % 2 === 1 ? (
                              <strong key={j} className="font-semibold text-maroon-900">
                                {chunk}
                              </strong>
                            ) : (
                              chunk
                            )
                          )}
                        </p>
                      ))}
                    </div>

                    {/* Sources Used Chips */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#EADBCC] space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-gray-500">
                          <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-maroon-700" />
                            Sources Used (Verified Notes):
                          </span>
                          {msg.confidenceScore && (
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              {msg.confidenceScore}% Grounded
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src) => (
                            <button
                              key={src.id}
                              onClick={() => handleOpenSourceDrawer(src.id)}
                              className="text-xs bg-cream-100 hover:bg-cream-200 text-maroon-800 px-2.5 py-1 rounded-lg border border-[#D9CEBE] font-medium transition active:scale-95 flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3 text-maroon-700" />
                              <span>{src.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Message Actions */}
                    {msg.sender === 'ai' && (
                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFeedback(msg.id, 'like')}
                            className={`p-1 rounded hover:bg-gray-100 transition ${
                              msg.feedback === 'like' ? 'text-emerald-700 font-bold' : ''
                            }`}
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, 'dislike')}
                            className={`p-1 rounded hover:bg-gray-100 transition ${
                              msg.feedback === 'dislike' ? 'text-red-700 font-bold' : ''
                            }`}
                            title="Not helpful"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] text-gray-400">|</span>
                          <button
                            onClick={() => handleAskTeacher(msg.text)}
                            className="text-maroon-700 hover:text-maroon-900 font-medium text-[11px]"
                          >
                            Ask a teacher
                          </button>
                        </div>

                        {msg.isGrounded && (
                          <button
                            onClick={() => {
                              setActiveTab('practice-engine');
                              addToast('Navigating to Practice Engine for targeted drills.', 'info');
                            }}
                            className="text-ink-700 hover:text-ink-900 font-medium text-[11px] flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-gold-500" />
                            <span>Make a quiz from this</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 bg-white border border-[#EADBCC] p-3 rounded-2xl w-32 shadow-sm animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-maroon-700 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-maroon-700 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-maroon-700 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-gray-500 font-medium ml-1">Searching...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Field */}
            <div className="p-3 border-t border-[#EADBCC] bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask any English Literature doubt (e.g. Sonnets, Keats, Milton)..."
                  className="flex-1 bg-cream-50 border border-[#D9CEBE] rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isTyping}
                  className="p-2.5 bg-[#6B1724] hover:bg-maroon-800 disabled:opacity-50 text-white rounded-xl shadow-sm transition active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Col: 8 Clickable Sample Questions */}
          <div className="space-y-4">
            <div className="bg-white border border-[#EADBCC] rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#1A2B4C] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-maroon-700" />
                  Click to Ask (8 Samples)
                </span>
                <span className="text-[10px] font-semibold text-gray-500 bg-cream-100 px-2 py-0.5 rounded-full border border-cream-200">
                  Instant Test
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Click any pre-crafted question to evaluate grounded response speed, citations, and strict refusal handling.
              </p>

              <div className="space-y-2">
                {SAMPLE_QUESTIONS.map((q, idx) => {
                  const isOffTopic = q.includes('weather in Kochi');
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition duration-150 flex items-start gap-2 ${
                        isOffTopic
                          ? 'bg-red-50/70 border-red-200 text-red-900 hover:bg-red-100'
                          : 'bg-[#FAF6F0] hover:bg-cream-100 border-[#EADBCC] text-gray-800'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isOffTopic ? 'bg-red-200 text-red-800' : 'bg-cream-200 text-maroon-900'
                        }`}
                      >
                        {isOffTopic ? '!' : idx + 1}
                      </span>
                      <div className="flex-1 leading-snug">
                        {q}
                        {isOffTopic && (
                          <span className="block text-[10px] font-bold text-red-700 mt-0.5">
                            (Tests Out-of-Scope Refusal Guardrail)
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div className="bg-cream-50 border border-cream-200 rounded-2xl p-4 text-xs text-gray-700 space-y-2">
              <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Guaranteed Grounding Architecture
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                The browser search index compares query tokens with document TF-IDF frequencies. Only study notes with confidence scores above the threshold are cited in responses.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Knowledge Base Tab */}
      {activeSubTab === 'knowledge' && (
        <div className="bg-white border border-[#EADBCC] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADBCC] pb-4">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#1A2B4C]">
                Vallath Study Notes Repository ({notes.length} Active Notes)
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                All AI responses are built solely from these notes. Add your own custom note below to prove it learns immediately!
              </p>
            </div>

            <button
              onClick={() => setIsAddingNote(true)}
              className="px-4 py-2 bg-[#6B1724] hover:bg-maroon-800 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Study Note</span>
            </button>
          </div>

          {/* Search & Period Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={knowledgeSearch}
                onChange={(e) => setKnowledgeSearch(e.target.value)}
                placeholder="Search notes by title, author, or keywords..."
                className="w-full bg-cream-50 border border-[#D9CEBE] rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-maroon-700"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
              <span className="text-gray-500 font-medium text-[11px] whitespace-nowrap mr-1">
                Period:
              </span>
              {uniquePeriods.slice(0, 6).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriodFilter(period)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    selectedPeriodFilter === period
                      ? 'bg-maroon-700 text-white'
                      : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-2xl border border-[#EADBCC] bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] transition space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-maroon-800 bg-maroon-50 px-2 py-0.5 rounded-full border border-maroon-200 truncate">
                      {note.period}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500 truncate">
                      {note.topic}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-[#1A2B4C] leading-snug">
                    {note.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 italic">By {note.author}</p>

                  <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed">
                    {note.content.replace(/^---[\s\S]*?---\s*/, '')}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EADBCC] flex items-center justify-between text-xs">
                  <button
                    onClick={() => setActiveDrawerNote(note)}
                    className="text-maroon-700 hover:text-maroon-900 font-semibold text-xs flex items-center gap-1"
                  >
                    <span>Read Note</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab('chat');
                      handleSend(`Tell me about ${note.title}`);
                    }}
                    className="text-ink-700 hover:text-ink-900 text-[11px] font-medium"
                  >
                    Ask about this
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-sm">
              No notes found matching your search. Try resetting filters.
            </div>
          )}
        </div>
      )}

      {/* Teacher Queue Tab */}
      {activeSubTab === 'teacher-queue' && (
        <div className="bg-white border border-[#EADBCC] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-[#EADBCC] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#1A2B4C] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-maroon-700" />
                Faculty Review Queue ({teacherQueue.length} Flagged Doubts)
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Questions that fall below the RAG grounding score (or were directly escalated by students) arrive here for teacher response.
              </p>
            </div>
            <div className="text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              Zero Student Left Behind Policy
            </div>
          </div>

          <div className="space-y-3">
            {teacherQueue.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-[#EADBCC] bg-[#FAF6F0]/80 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.status === 'Answered'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-xs font-semibold text-gray-700">{item.studentName}</span>
                    <span className="text-[11px] text-gray-400">• {item.timestamp}</span>
                  </div>

                  {item.status !== 'Answered' && (
                    <button
                      onClick={() => resolveTeacherQueueItem(item.id)}
                      className="px-3 py-1 bg-[#6B1724] hover:bg-maroon-800 text-white rounded-lg text-xs font-medium transition self-start sm:self-auto"
                    >
                      Mark Answered & Send to Student
                    </button>
                  )}
                </div>

                <div className="text-sm font-medium text-gray-900 bg-white p-3 rounded-xl border border-[#EADBCC]">
                  "{item.question}"
                </div>

                <div className="text-xs text-amber-900 bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                  <strong>Trigger Reason:</strong> {item.flagReason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Study Note Modal */}
      {isAddingNote && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#EADBCC] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EADBCC] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#1A2B4C] flex items-center gap-2">
                <Plus className="w-5 h-5 text-maroon-700" />
                Add New Vallath Study Note
              </h3>
              <button
                onClick={() => setIsAddingNote(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewNote} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Note Title (e.g. "Postmodern Pastiche in Italo Calvino")
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter clear title"
                  className="w-full bg-cream-50 border border-[#D9CEBE] rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-maroon-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Author / Thinker</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Author name"
                    className="w-full bg-cream-50 border border-[#D9CEBE] rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-maroon-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Period</label>
                  <input
                    type="text"
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value)}
                    placeholder="e.g. Modernist"
                    className="w-full bg-cream-50 border border-[#D9CEBE] rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-maroon-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="e.g. Poetics"
                    className="w-full bg-cream-50 border border-[#D9CEBE] rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-maroon-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Note Content (~100 to 150 words)
                </label>
                <textarea
                  required
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste or write scholarly summary..."
                  className="w-full bg-cream-50 border border-[#D9CEBE] rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-maroon-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-4 py-2 border border-[#D9CEBE] text-gray-700 rounded-xl hover:bg-cream-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B1724] hover:bg-maroon-800 text-white font-semibold rounded-xl"
                >
                  Save & Index Immediately
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Side Drawer to inspect verified study note */}
      {activeDrawerNote && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-ink-900/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-[#EADBCC] flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-[#EADBCC] bg-[#FAF6F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-maroon-700" />
                <h3 className="font-serif font-bold text-base text-[#1A2B4C]">
                  Verified Study Note
                </h3>
              </div>
              <button
                onClick={() => setActiveDrawerNote(null)}
                className="p-1 rounded-lg hover:bg-cream-200 text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-maroon-800 bg-maroon-50 px-2 py-0.5 rounded-full border border-maroon-200">
                  {activeDrawerNote.period}
                </span>
                <h2 className="font-serif text-xl font-bold text-[#1A2B4C] mt-2">
                  {activeDrawerNote.title}
                </h2>
                <p className="text-xs text-gray-500 italic mt-0.5">
                  Author / Thinker: {activeDrawerNote.author} | Topic: {activeDrawerNote.topic}
                </p>
              </div>

              <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 text-xs text-gray-800 whitespace-pre-line leading-relaxed font-sans">
                {activeDrawerNote.content.replace(/^---[\s\S]*?---\s*/, '')}
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#EADBCC] text-[11px] text-gray-500">
                <strong>Repository Source:</strong> <code>src/data/knowledge/{activeDrawerNote.filename}</code>
              </div>
            </div>

            <div className="p-4 border-t border-[#EADBCC] bg-cream-50 flex items-center justify-between">
              <span className="text-xs text-gray-500">Indexed for in-browser RAG</span>
              <button
                onClick={() => {
                  const title = activeDrawerNote.title;
                  setActiveDrawerNote(null);
                  setActiveSubTab('chat');
                  handleSend(`Tell me about ${title}`);
                }}
                className="px-4 py-2 bg-[#6B1724] hover:bg-maroon-800 text-white rounded-xl text-xs font-semibold"
              >
                Ask a Question about this
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
