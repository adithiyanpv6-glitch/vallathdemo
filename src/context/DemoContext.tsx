import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudyNote, INITIAL_STUDY_NOTES } from '../data/knowledge/notesData';
import { StudentProfile, INITIAL_STUDENT_PROFILES } from '../data/studentProfiles';
import { FEEDBACK_CATEGORIES, FeedbackResult, FeedbackSample } from '../data/feedbackSamples';
import { analyzeSubmission } from '../utils/feedbackEngine';

export interface PresenterChecklistItem {
  id: string;
  module: 'Start Here' | 'Ask Vallath' | 'Practice Engine' | 'Feedback Desk' | 'Content Studio';
  task: string;
  completed: boolean;
  hint: string;
}

export interface TeacherQueueItem {
  id: string;
  question: string;
  studentName: string;
  timestamp: string;
  status: 'Pending Review' | 'Answered' | 'Assigned to Faculty';
  source?: string;
  flagReason: string;
}

export interface ReviewQueueSubmission {
  id: string;
  categoryLabel: string;
  studentName: string;
  submissionTitle: string;
  submissionText: string;
  aiResult: FeedbackResult;
  facultyComment: string;
  status: 'Draft Ready' | 'Approved & Sent' | 'Needs Revision';
  timestamp: string;
  timeSavedText: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
}

interface DemoContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  checklist: PresenterChecklistItem[];
  toggleChecklistItem: (id: string) => void;
  resetAllDemoData: () => void;
  
  // Knowledge Base & Doubts
  notes: StudyNote[];
  addStudyNote: (note: { title: string; author: string; period: string; topic: string; content: string }) => void;
  teacherQueue: TeacherQueueItem[];
  addQuestionToTeacherQueue: (question: string, reason?: string) => void;
  resolveTeacherQueueItem: (id: string) => void;

  // Practice Engine
  students: StudentProfile[];
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  updateStudentMastery: (studentId: string, tag: string, correct: boolean) => void;

  // Feedback Desk
  reviewSubmissions: ReviewQueueSubmission[];
  addReviewSubmission: (submission: {
    categoryLabel: string;
    studentName: string;
    submissionTitle: string;
    submissionText: string;
    aiResult: FeedbackResult;
  }) => void;
  updateFacultyComment: (id: string, comment: string) => void;
  approveSubmission: (id: string) => void;
  rejectSubmission: (id: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const INITIAL_CHECKLIST: PresenterChecklistItem[] = [
  { id: 'c1', module: 'Start Here', task: 'Review the 4 core module capabilities and the executive impact strip', completed: true, hint: 'Explore the 4 hero feature cards and impact numbers.' },
  { id: 'c2', module: 'Start Here', task: 'Open the one-page Print/Export demo summary for leadership review', completed: false, hint: 'Click the "Print/Export demo summary" button at top right.' },
  { id: 'c3', module: 'Ask Vallath', task: 'Click a sample question to test grounded retrieval from study notes', completed: false, hint: 'Ask about Petrarchan sonnets or Keats Negative Capability.' },
  { id: 'c4', module: 'Ask Vallath', task: 'Test the strict guardrail by clicking the off-topic Kochi question', completed: false, hint: 'Click "What is the weather in Kochi?" and see it route to Teacher Queue.' },
  { id: 'c5', module: 'Ask Vallath', task: 'Add a custom study note and verify the AI immediately answers from it', completed: false, hint: 'Switch to the Knowledge Base tab and click "Add Study Note".' },
  { id: 'c6', module: 'Practice Engine', task: 'Switch between Student A, B, and C to inspect personalized radar charts', completed: false, hint: 'Select different student profiles in the header selector.' },
  { id: 'c7', module: 'Practice Engine', task: 'Solve a 10-question adaptive set and observe mastery tag updates', completed: false, hint: 'Click "Start 10-question adaptive set" and complete the quiz.' },
  { id: 'c8', module: 'Practice Engine', task: 'Toggle WhatsApp / Telegram skin to preview daily micro-drills', completed: false, hint: 'Scroll to the Daily Practice Preview phone mock.' },
  { id: 'c9', module: 'Practice Engine', task: 'Inspect the 20-student Batch Heatmap in Teacher View', completed: false, hint: 'Switch the toggle from Student View to Teacher View.' },
  { id: 'c10', module: 'Feedback Desk', task: 'Run AI first-pass feedback on an Assistant Professor answer', completed: false, hint: 'Choose Sample 1 and click "Get AI first-pass feedback".' },
  { id: 'c11', module: 'Feedback Desk', task: 'Review, edit, and approve the AI draft in the Teacher Review Queue', completed: false, hint: 'Scroll to Teacher Review Queue, edit the feedback, and click "Approve & send".' },
  { id: 'c12', module: 'Content Studio', task: 'Repurpose a 45-min lecture into clips, quiz, newsletter, blog, and social', completed: false, hint: 'Select the Romanticism lecture and click "Repurpose this lecture".' },
];

const INITIAL_TEACHER_QUEUE: TeacherQueueItem[] = [
  {
    id: 'tq-1',
    question: 'Can you compare Jacques Lacan’s mirror stage with Julia Kristeva’s semiotic chora for Kerala PSC?',
    studentName: 'Student A (Aparna K.)',
    timestamp: 'Today, 09:14 AM',
    status: 'Pending Review',
    flagReason: 'Specialized 20th-century French psychoanalytic theory requested.'
  },
  {
    id: 'tq-2',
    question: 'What is the syllabus weightage of Indian Writing in Translation in the new 2026 NET syllabus?',
    studentName: 'Student B (Rahul M.)',
    timestamp: 'Yesterday, 08:30 PM',
    status: 'Assigned to Faculty',
    flagReason: 'Syllabus policy question flagged for academic director.'
  }
];

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('vallath_active_tab') || 'start-here';
  });

  const [checklist, setChecklist] = useState<PresenterChecklistItem[]>(() => {
    const saved = localStorage.getItem('vallath_checklist');
    return saved ? JSON.parse(saved) : INITIAL_CHECKLIST;
  });

  const [notes, setNotes] = useState<StudyNote[]>(() => {
    const saved = localStorage.getItem('vallath_study_notes');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_NOTES;
  });

  const [teacherQueue, setTeacherQueue] = useState<TeacherQueueItem[]>(() => {
    const saved = localStorage.getItem('vallath_teacher_queue');
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_QUEUE;
  });

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('vallath_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILES;
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>('student-1');

  // Pre-seed a sample in teacher review queue for immediate demonstration
  const [reviewSubmissions, setReviewSubmissions] = useState<ReviewQueueSubmission[]>(() => {
    const saved = localStorage.getItem('vallath_review_submissions');
    if (saved) return JSON.parse(saved);

    const initialSample = FEEDBACK_CATEGORIES[0].samples[0];
    const initialAiResult = analyzeSubmission(initialSample.submissionText, FEEDBACK_CATEGORIES[0]);

    return [
      {
        id: 'rev-init-1',
        categoryLabel: FEEDBACK_CATEGORIES[0].label,
        studentName: initialSample.studentName,
        submissionTitle: initialSample.title,
        submissionText: initialSample.submissionText,
        aiResult: initialAiResult,
        facultyComment: 'Excellent theoretical synthesis. Ensure the distinction between biographical emotion and artistic emotion is explicitly reiterated in the final paragraph for the university board.',
        status: 'Draft Ready',
        timestamp: '15 mins ago',
        timeSavedText: 'AI draft generated in 8 sec (typical manual time: 20 min)'
      }
    ];
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem('vallath_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('vallath_checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('vallath_study_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('vallath_teacher_queue', JSON.stringify(teacherQueue));
  }, [teacherQueue]);

  useEffect(() => {
    localStorage.setItem('vallath_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('vallath_review_submissions', JSON.stringify(reviewSubmissions));
  }, [reviewSubmissions]);

  const addToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addStudyNote = (newNoteData: { title: string; author: string; period: string; topic: string; content: string }) => {
    const id = 'note-' + Date.now();
    const filename = `${id}.md`;
    const newNote: StudyNote = {
      id,
      filename,
      ...newNoteData,
      content: `---\ntitle: ${newNoteData.title}\nauthor: ${newNoteData.author}\nperiod: ${newNoteData.period}\ntopic: ${newNoteData.topic}\n---\n\n${newNoteData.content}`
    };

    setNotes(prev => [newNote, ...prev]);
    addToast(`"${newNoteData.title}" indexed into knowledge base! You can now ask questions about it.`, 'success');
  };

  const addQuestionToTeacherQueue = (question: string, reason?: string) => {
    const newItem: TeacherQueueItem = {
      id: 'tq-' + Date.now(),
      question,
      studentName: 'Student A (Aparna K.)',
      timestamp: 'Just now',
      status: 'Pending Review',
      flagReason: reason || 'Question fell below grounding confidence threshold in study material.'
    };
    setTeacherQueue(prev => [newItem, ...prev]);
    addToast('Question flagged and forwarded to Faculty Review Queue.', 'info');
  };

  const resolveTeacherQueueItem = (id: string) => {
    setTeacherQueue(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'Answered' } : item
      )
    );
    addToast('Faculty response sent to student portal.', 'success');
  };

  const updateStudentMastery = (studentId: string, tag: string, correct: boolean) => {
    setStudents(prev =>
      prev.map(st => {
        if (st.id !== studentId) return st;

        const delta = correct ? 4 : -3;
        const updatedPeriods = st.periodMastery.map(p =>
          p.period === tag
            ? { ...p, mastery: Math.min(99, Math.max(25, p.mastery + delta)), questionsAttempted: p.questionsAttempted + 1 }
            : p
        );

        const updatedTopics = st.topicMastery.map(t =>
          t.topic === tag
            ? { ...t, mastery: Math.min(99, Math.max(25, t.mastery + delta)), questionsAttempted: t.questionsAttempted + 1 }
            : t
        );

        const newOverall = Math.round(
          (updatedPeriods.reduce((s, p) => s + p.mastery, 0) + updatedTopics.reduce((s, t) => s + t.mastery, 0)) /
          (updatedPeriods.length + updatedTopics.length)
        );

        return {
          ...st,
          overallMastery: newOverall,
          questionsSolved: st.questionsSolved + 1,
          accuracyRate: correct ? Math.min(96, st.accuracyRate + 1) : Math.max(50, st.accuracyRate - 1),
          periodMastery: updatedPeriods,
          topicMastery: updatedTopics,
        };
      })
    );
  };

  const addReviewSubmission = (sub: {
    categoryLabel: string;
    studentName: string;
    submissionTitle: string;
    submissionText: string;
    aiResult: FeedbackResult;
  }) => {
    const newItem: ReviewQueueSubmission = {
      id: 'rev-' + Date.now(),
      categoryLabel: sub.categoryLabel,
      studentName: sub.studentName,
      submissionTitle: sub.submissionTitle,
      submissionText: sub.submissionText,
      aiResult: sub.aiResult,
      facultyComment: sub.aiResult.thingsToFix[0] ? `Approved with note: ${sub.aiResult.thingsToFix[0]}` : 'Approved by Academic Reviewer.',
      status: 'Draft Ready',
      timestamp: 'Just now',
      timeSavedText: 'AI draft generated in 8 sec (typical manual time: 20 min)'
    };
    setReviewSubmissions(prev => [newItem, ...prev]);
    addToast('Submission analyzed and added to Faculty Review Queue.', 'success');
  };

  const updateFacultyComment = (id: string, comment: string) => {
    setReviewSubmissions(prev =>
      prev.map(sub => (sub.id === id ? { ...sub, facultyComment: comment } : sub))
    );
  };

  const approveSubmission = (id: string) => {
    setReviewSubmissions(prev =>
      prev.map(sub => (sub.id === id ? { ...sub, status: 'Approved & Sent' } : sub))
    );
    addToast('Feedback approved and dispatched to student portal!', 'success');
  };

  const rejectSubmission = (id: string) => {
    setReviewSubmissions(prev =>
      prev.map(sub => (sub.id === id ? { ...sub, status: 'Needs Revision' } : sub))
    );
    addToast('Submission marked for student revision.', 'warning');
  };

  const resetAllDemoData = () => {
    localStorage.removeItem('vallath_checklist');
    localStorage.removeItem('vallath_study_notes');
    localStorage.removeItem('vallath_teacher_queue');
    localStorage.removeItem('vallath_students');
    localStorage.removeItem('vallath_review_submissions');
    localStorage.removeItem('vallath_active_tab');

    setChecklist(INITIAL_CHECKLIST);
    setNotes(INITIAL_STUDY_NOTES);
    setTeacherQueue(INITIAL_TEACHER_QUEUE);
    setStudents(INITIAL_STUDENT_PROFILES);
    setCurrentStudentId('student-1');

    const initialSample = FEEDBACK_CATEGORIES[0].samples[0];
    const initialAiResult = analyzeSubmission(initialSample.submissionText, FEEDBACK_CATEGORIES[0]);
    setReviewSubmissions([
      {
        id: 'rev-init-1',
        categoryLabel: FEEDBACK_CATEGORIES[0].label,
        studentName: initialSample.studentName,
        submissionTitle: initialSample.title,
        submissionText: initialSample.submissionText,
        aiResult: initialAiResult,
        facultyComment: 'Excellent theoretical synthesis. Ensure the distinction between biographical emotion and artistic emotion is explicitly reiterated in the final paragraph for the university board.',
        status: 'Draft Ready',
        timestamp: '15 mins ago',
        timeSavedText: 'AI draft generated in 8 sec (typical manual time: 20 min)'
      }
    ]);

    setActiveTab('start-here');
    addToast('Demo data reset to clean factory defaults.', 'info');
  };

  return (
    <DemoContext.Provider
      value={{
        activeTab,
        setActiveTab,
        checklist,
        toggleChecklistItem,
        resetAllDemoData,
        notes,
        addStudyNote,
        teacherQueue,
        addQuestionToTeacherQueue,
        resolveTeacherQueueItem,
        students,
        currentStudentId,
        setCurrentStudentId,
        updateStudentMastery,
        reviewSubmissions,
        addReviewSubmission,
        updateFacultyComment,
        approveSubmission,
        rejectSubmission,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
