import { StudyNote } from '../data/knowledge/notesData';

export interface SearchResult {
  note: StudyNote;
  score: number;
}

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'she', 'should', 'so', 'some', 'such',
  'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very',
  'was', 'wasn\'t', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours'
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

/**
 * BM25 / TF-IDF Search Engine for in-browser RAG
 */
export class LiteratureSearchEngine {
  private notes: StudyNote[] = [];
  private docTokens: Map<string, string[]> = new Map();
  private docFrequencies: Map<string, number> = new Map();
  private avgDocLength: number = 0;
  private readonly k1 = 1.5;
  private readonly b = 0.75;

  constructor(initialNotes: StudyNote[]) {
    this.setNotes(initialNotes);
  }

  public setNotes(notes: StudyNote[]) {
    this.notes = notes;
    this.docTokens.clear();
    this.docFrequencies.clear();

    let totalLength = 0;

    for (const note of notes) {
      // Weight title and topic more heavily
      const text = `${note.title} ${note.title} ${note.topic} ${note.author} ${note.period} ${note.content}`;
      const tokens = tokenize(text);
      this.docTokens.set(note.id, tokens);
      totalLength += tokens.length;

      const uniqueTokens = new Set(tokens);
      for (const token of uniqueTokens) {
        this.docFrequencies.set(token, (this.docFrequencies.get(token) || 0) + 1);
      }
    }

    this.avgDocLength = notes.length > 0 ? totalLength / notes.length : 1;
  }

  public addNote(note: StudyNote) {
    this.setNotes([note, ...this.notes.filter(n => n.id !== note.id)]);
  }

  public search(query: string, topK: number = 3): SearchResult[] {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0 || this.notes.length === 0) {
      return [];
    }

    const nDocs = this.notes.length;
    const scores: { note: StudyNote; score: number }[] = [];

    for (const note of this.notes) {
      const docTokens = this.docTokens.get(note.id) || [];
      const docLen = docTokens.length;

      // Count term frequencies in this document
      const termFreqs: Map<string, number> = new Map();
      for (const token of docTokens) {
        termFreqs.set(token, (termFreqs.get(token) || 0) + 1);
      }

      let score = 0;

      for (const token of queryTokens) {
        const df = this.docFrequencies.get(token) || 0;
        if (df === 0) continue;

        // IDF calculation
        const idf = Math.log(1 + (nDocs - df + 0.5) / (df + 0.5));

        // TF with length normalization
        const tf = termFreqs.get(token) || 0;
        const numerator = tf * (this.k1 + 1);
        const denominator = tf + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLength));

        score += idf * (numerator / (denominator || 1));

        // Extra boost if query token appears directly in title
        if (note.title.toLowerCase().includes(token)) {
          score += 2.5;
        }
      }

      if (score > 0) {
        scores.push({ note, score });
      }
    }

    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, topK);
  }
}

/**
 * Generate a grounded answer based strictly on retrieved notes
 */
export function generateGroundedAnswer(
  query: string,
  searchResults: SearchResult[],
  guardrailThreshold: number = 1.8
): {
  isGrounded: boolean;
  answer: string;
  sources: { id: string; title: string; period: string }[];
  confidenceScore: number;
} {
  if (searchResults.length === 0 || searchResults[0].score < guardrailThreshold) {
    return {
      isGrounded: false,
      answer: "I can't find this in the Vallath study material. I've flagged it for a teacher to review and answer in your classroom dashboard.",
      sources: [],
      confidenceScore: 12
    };
  }

  const top = searchResults[0];
  const secondary = searchResults[1];

  // Clean note body (strip markdown frontmatter)
  const cleanBody = (content: string) => {
    return content.replace(/^---[\s\S]*?---\s*/, '').trim();
  };

  const primaryText = cleanBody(top.note.content);
  const secondaryText = secondary && secondary.score > guardrailThreshold ? cleanBody(secondary.note.content) : '';

  // Extract key sentences
  const primarySentences = primaryText.split(/\.\s+/).filter(s => s.length > 20);
  const secondarySentences = secondaryText ? secondaryText.split(/\.\s+/).filter(s => s.length > 20) : [];

  const keyPoints = primarySentences.slice(0, 3).map(s => s.endsWith('.') ? s : s + '.');
  const additionalContext = secondarySentences.length > 0 ? secondarySentences[0] + '.' : '';

  const answer = `Based on Vallath Education's verified study module for **${top.note.title}** (${top.note.period}):

${keyPoints[0] || primaryText.slice(0, 150)}

**Key Exam Takeaways:**
• ${keyPoints[1] || `Focus on ${top.note.author}'s critical framework within ${top.note.topic}.`}
• ${keyPoints[2] || `Remember that this is a high-frequency recurring topic for UGC NET Paper II and SET examinations.`}
${additionalContext ? `• **Related context:** ${additionalContext}` : ''}

*Cited directly from Vallath Study Note repository: [${top.note.title}]*`;

  // Confidence mapping
  const normalizedConfidence = Math.min(98, Math.max(78, Math.round(75 + top.score * 3.5)));

  const sources = [
    { id: top.note.id, title: top.note.title, period: top.note.period },
    ...(secondary && secondary.score > guardrailThreshold
      ? [{ id: secondary.note.id, title: secondary.note.title, period: secondary.note.period }]
      : [])
  ];

  return {
    isGrounded: true,
    answer,
    sources,
    confidenceScore: normalizedConfidence
  };
}
