export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  targetExam: string;
  batch: string;
  enrolledDate: string;
  overallMastery: number; // percentage
  streakDays: number;
  questionsSolved: number;
  accuracyRate: number;
  periodMastery: {
    period: string;
    mastery: number; // 0 - 100
    questionsAttempted: number;
  }[];
  topicMastery: {
    topic: string;
    mastery: number; // 0 - 100
    questionsAttempted: number;
  }[];
  weakAreas: {
    tag: string;
    category: 'period' | 'topic';
    currentScore: number;
    recommendedReason: string;
  }[];
  streakCalendar: {
    day: number;
    dateStr: string;
    completed: boolean;
    questionsCount: number;
  }[];
  spacedRepetition: {
    interval: string;
    topic: string;
    scheduledDate: string;
    status: 'Due Today' | 'Upcoming' | 'Completed';
    notesCount: number;
  }[];
}

export const INITIAL_STUDENT_PROFILES: StudentProfile[] = [
  {
    id: 'student-1',
    name: 'Student A (Aparna K.)',
    avatar: 'AK',
    targetExam: 'UGC NET / JRF English',
    batch: 'Morning Comprehensive Batch 2026',
    enrolledDate: '12 Jan 2026',
    overallMastery: 74,
    streakDays: 11,
    questionsSolved: 342,
    accuracyRate: 76,
    periodMastery: [
      { period: 'Medieval', mastery: 85, questionsAttempted: 42 },
      { period: 'Renaissance', mastery: 78, questionsAttempted: 70 },
      { period: 'Neoclassical', mastery: 62, questionsAttempted: 55 },
      { period: 'Romantic', mastery: 88, questionsAttempted: 64 },
      { period: 'Victorian', mastery: 75, questionsAttempted: 48 },
      { period: 'Modernist', mastery: 72, questionsAttempted: 40 },
      { period: 'Literary Theory', mastery: 58, questionsAttempted: 23 },
    ],
    topicMastery: [
      { topic: 'Poetic Forms', mastery: 82, questionsAttempted: 60 },
      { topic: 'Epic Poetry', mastery: 80, questionsAttempted: 45 },
      { topic: 'Metaphysical Poetry', mastery: 75, questionsAttempted: 35 },
      { topic: 'Early Modern Drama', mastery: 78, questionsAttempted: 52 },
      { topic: 'Novel and Social Critique', mastery: 70, questionsAttempted: 48 },
      { topic: 'Literary Criticism', mastery: 64, questionsAttempted: 38 },
      { topic: 'Literary Theory', mastery: 54, questionsAttempted: 32 },
      { topic: 'Postcolonial Studies', mastery: 60, questionsAttempted: 32 },
    ],
    weakAreas: [
      { tag: 'Literary Theory', category: 'period', currentScore: 58, recommendedReason: 'Frequent confusion between Wimsatt-Beardsley and Russian Formalism' },
      { tag: 'Postcolonial Studies', category: 'topic', currentScore: 60, recommendedReason: 'Said vs Bhabha distinction needs systematic revision' },
      { tag: 'Neoclassical', category: 'period', currentScore: 62, recommendedReason: 'Scriblerus club & Augustan mock-epic conventions missed in last 2 mock tests' },
    ],
    streakCalendar: Array.from({ length: 14 }, (_, i) => ({
      day: i + 1,
      dateStr: `Oct ${12 + i}`,
      completed: i !== 3 && i !== 8,
      questionsCount: i === 3 || i === 8 ? 0 : Math.floor(10 + (i * 3) % 15),
    })),
    spacedRepetition: [
      { interval: 'Day 1 (Immediate)', topic: 'Structuralism vs Post-Structuralism', scheduledDate: 'Today', status: 'Due Today', notesCount: 3 },
      { interval: 'Day 3 (Reinforcement)', topic: 'Augustan Heroic Couplets & Pope', scheduledDate: 'Tomorrow', status: 'Upcoming', notesCount: 2 },
      { interval: 'Day 7 (Deep Memory)', topic: 'Metaphysical Conceits & John Donne', scheduledDate: 'In 3 days', status: 'Upcoming', notesCount: 4 },
      { interval: 'Day 14 (Consolidation)', topic: 'Coleridge: Biographia Literaria', scheduledDate: 'In 6 days', status: 'Upcoming', notesCount: 2 },
      { interval: 'Day 30 (Mastery Lock)', topic: 'Chaucer General Prologue & Estates', scheduledDate: 'Completed Oct 20', status: 'Completed', notesCount: 5 },
    ]
  },
  {
    id: 'student-2',
    name: 'Student B (Rahul M.)',
    avatar: 'RM',
    targetExam: 'Kerala SET English',
    batch: 'Evening Intensive Batch',
    enrolledDate: '01 Feb 2026',
    overallMastery: 63,
    streakDays: 6,
    questionsSolved: 215,
    accuracyRate: 64,
    periodMastery: [
      { period: 'Medieval', mastery: 52, questionsAttempted: 30 },
      { period: 'Renaissance', mastery: 68, questionsAttempted: 50 },
      { period: 'Neoclassical', mastery: 54, questionsAttempted: 40 },
      { period: 'Romantic', mastery: 82, questionsAttempted: 45 },
      { period: 'Victorian', mastery: 65, questionsAttempted: 30 },
      { period: 'Modernist', mastery: 60, questionsAttempted: 15 },
      { period: 'Literary Theory', mastery: 50, questionsAttempted: 5 },
    ],
    topicMastery: [
      { topic: 'Poetic Forms', mastery: 74, questionsAttempted: 40 },
      { topic: 'Epic Poetry', mastery: 62, questionsAttempted: 35 },
      { topic: 'Medieval Literature', mastery: 50, questionsAttempted: 25 },
      { topic: 'Early Modern Drama', mastery: 70, questionsAttempted: 35 },
      { topic: 'Novel and Social Critique', mastery: 65, questionsAttempted: 30 },
      { topic: 'Literary Criticism', mastery: 52, questionsAttempted: 25 },
      { topic: 'Literary Theory', mastery: 48, questionsAttempted: 15 },
      { topic: 'Postcolonial Studies', mastery: 55, questionsAttempted: 10 },
    ],
    weakAreas: [
      { tag: 'Medieval Literature', category: 'topic', currentScore: 50, recommendedReason: 'Chaucerian dialects and alliterative revival texts need review' },
      { tag: 'Literary Theory', category: 'period', currentScore: 50, recommendedReason: 'Key terminology like Ostranenie and Langue/Parole untested' },
      { tag: 'Neoclassical', category: 'period', currentScore: 54, recommendedReason: 'Dryden and Pope satires scored below 55%' },
    ],
    streakCalendar: Array.from({ length: 14 }, (_, i) => ({
      day: i + 1,
      dateStr: `Oct ${12 + i}`,
      completed: i >= 7,
      questionsCount: i >= 7 ? 12 : 0,
    })),
    spacedRepetition: [
      { interval: 'Day 1 (Immediate)', topic: 'Middle English Dialects & Chaucer', scheduledDate: 'Today', status: 'Due Today', notesCount: 3 },
      { interval: 'Day 3 (Reinforcement)', topic: 'Saussure and Semiotics', scheduledDate: 'In 2 days', status: 'Upcoming', notesCount: 2 },
      { interval: 'Day 7 (Deep Memory)', topic: 'Dryden vs Shadwell Satires', scheduledDate: 'In 5 days', status: 'Upcoming', notesCount: 3 },
      { interval: 'Day 14 (Consolidation)', topic: 'Browning Dramatic Monologues', scheduledDate: 'In 11 days', status: 'Upcoming', notesCount: 4 },
      { interval: 'Day 30 (Mastery Lock)', topic: 'Shakespearean Sonnet Structures', scheduledDate: 'Completed Oct 18', status: 'Completed', notesCount: 2 },
    ]
  },
  {
    id: 'student-3',
    name: 'Student C (Devika S.)',
    avatar: 'DS',
    targetExam: 'GATE English / CUET-PG',
    batch: 'Research Aspirants Cohort',
    enrolledDate: '18 Dec 2025',
    overallMastery: 83,
    streakDays: 14,
    questionsSolved: 512,
    accuracyRate: 85,
    periodMastery: [
      { period: 'Medieval', mastery: 80, questionsAttempted: 60 },
      { period: 'Renaissance', mastery: 86, questionsAttempted: 85 },
      { period: 'Neoclassical', mastery: 82, questionsAttempted: 70 },
      { period: 'Romantic', mastery: 91, questionsAttempted: 80 },
      { period: 'Victorian', mastery: 78, questionsAttempted: 65 },
      { period: 'Modernist', mastery: 84, questionsAttempted: 72 },
      { period: 'Literary Theory', mastery: 79, questionsAttempted: 80 },
    ],
    topicMastery: [
      { topic: 'Poetic Forms', mastery: 90, questionsAttempted: 70 },
      { topic: 'Epic Poetry', mastery: 85, questionsAttempted: 60 },
      { topic: 'Metaphysical Poetry', mastery: 88, questionsAttempted: 50 },
      { topic: 'Early Modern Drama', mastery: 86, questionsAttempted: 75 },
      { topic: 'Novel and Social Critique', mastery: 74, questionsAttempted: 65 },
      { topic: 'Literary Criticism', mastery: 84, questionsAttempted: 70 },
      { topic: 'Literary Theory', mastery: 80, questionsAttempted: 62 },
      { topic: 'Postcolonial Studies', mastery: 76, questionsAttempted: 60 },
    ],
    weakAreas: [
      { tag: 'Novel and Social Critique', category: 'topic', currentScore: 74, recommendedReason: 'Industrial Victorian novels (Hard Times, Mary Barton) require revision' },
      { tag: 'Postcolonial Studies', category: 'topic', currentScore: 76, recommendedReason: 'Spivak subaltern historiography nuances' },
      { tag: 'Victorian', category: 'period', currentScore: 78, recommendedReason: 'Arnoldian cultural critique and Pre-Raphaelite poetry' },
    ],
    streakCalendar: Array.from({ length: 14 }, (_, i) => ({
      day: i + 1,
      dateStr: `Oct ${12 + i}`,
      completed: true,
      questionsCount: Math.floor(15 + (i * 2) % 20),
    })),
    spacedRepetition: [
      { interval: 'Day 1 (Immediate)', topic: 'Victorian Industrial Social Novels', scheduledDate: 'Today', status: 'Due Today', notesCount: 4 },
      { interval: 'Day 3 (Reinforcement)', topic: 'Spivak: Can the Subaltern Speak?', scheduledDate: 'Tomorrow', status: 'Upcoming', notesCount: 3 },
      { interval: 'Day 7 (Deep Memory)', topic: 'Matthew Arnold: Culture and Anarchy', scheduledDate: 'In 4 days', status: 'Upcoming', notesCount: 2 },
      { interval: 'Day 14 (Consolidation)', topic: 'Modernist Stream of Consciousness', scheduledDate: 'In 9 days', status: 'Upcoming', notesCount: 5 },
      { interval: 'Day 30 (Mastery Lock)', topic: 'Milton’s Grand Style & Theodicy', scheduledDate: 'Completed Oct 22', status: 'Completed', notesCount: 4 },
    ]
  }
];

export const CLASS_HEATMAP_DATA = [
  { student: 'Student A (Aparna)', Medieval: 85, Renaissance: 78, Neoclassical: 62, Romantic: 88, Victorian: 75, Modernist: 72, Theory: 58 },
  { student: 'Student B (Rahul)', Medieval: 52, Renaissance: 68, Neoclassical: 54, Romantic: 82, Victorian: 65, Modernist: 60, Theory: 50 },
  { student: 'Student C (Devika)', Medieval: 80, Renaissance: 86, Neoclassical: 82, Romantic: 91, Victorian: 78, Modernist: 84, Theory: 79 },
  { student: 'Student D (Gautham)', Medieval: 60, Renaissance: 70, Neoclassical: 58, Romantic: 76, Victorian: 68, Modernist: 65, Theory: 52 },
  { student: 'Student E (Meera)', Medieval: 75, Renaissance: 82, Neoclassical: 70, Romantic: 85, Victorian: 80, Modernist: 78, Theory: 65 },
  { student: 'Student F (Arun)', Medieval: 58, Renaissance: 62, Neoclassical: 48, Romantic: 74, Victorian: 62, Modernist: 58, Theory: 46 },
  { student: 'Student G (Kavya)', Medieval: 82, Renaissance: 88, Neoclassical: 75, Romantic: 90, Victorian: 84, Modernist: 80, Theory: 72 },
  { student: 'Student H (Naveen)', Medieval: 64, Renaissance: 72, Neoclassical: 60, Romantic: 78, Victorian: 70, Modernist: 64, Theory: 55 },
  { student: 'Student I (Anjali)', Medieval: 70, Renaissance: 76, Neoclassical: 66, Romantic: 84, Victorian: 74, Modernist: 70, Theory: 62 },
  { student: 'Student J (Vishnu)', Medieval: 50, Renaissance: 60, Neoclassical: 45, Romantic: 68, Victorian: 58, Modernist: 54, Theory: 44 },
  { student: 'Student K (Parvathy)', Medieval: 78, Renaissance: 84, Neoclassical: 72, Romantic: 86, Victorian: 82, Modernist: 76, Theory: 68 },
  { student: 'Student L (Siddharth)', Medieval: 66, Renaissance: 74, Neoclassical: 62, Romantic: 80, Victorian: 72, Modernist: 68, Theory: 56 },
  { student: 'Student M (Reshma)', Medieval: 72, Renaissance: 78, Neoclassical: 68, Romantic: 82, Victorian: 76, Modernist: 72, Theory: 60 },
  { student: 'Student N (Akhil)', Medieval: 55, Renaissance: 64, Neoclassical: 50, Romantic: 70, Victorian: 60, Modernist: 56, Theory: 48 },
  { student: 'Student O (Lakshmi)', Medieval: 84, Renaissance: 86, Neoclassical: 78, Romantic: 92, Victorian: 85, Modernist: 82, Theory: 74 },
  { student: 'Student P (Deepak)', Medieval: 62, Renaissance: 69, Neoclassical: 56, Romantic: 75, Victorian: 66, Modernist: 62, Theory: 53 },
  { student: 'Student Q (Sneha)', Medieval: 76, Renaissance: 80, Neoclassical: 71, Romantic: 85, Victorian: 79, Modernist: 75, Theory: 66 },
  { student: 'Student R (Manoj)', Medieval: 54, Renaissance: 63, Neoclassical: 49, Romantic: 72, Victorian: 61, Modernist: 57, Theory: 47 },
  { student: 'Student S (Fathima)', Medieval: 81, Renaissance: 85, Neoclassical: 74, Romantic: 89, Victorian: 83, Modernist: 79, Theory: 70 },
  { student: 'Student T (Harikrishnan)', Medieval: 68, Renaissance: 75, Neoclassical: 63, Romantic: 81, Victorian: 73, Modernist: 69, Theory: 58 }
];
