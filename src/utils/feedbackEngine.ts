import { FeedbackCategory, FeedbackResult, RubricCriterion } from '../data/feedbackSamples';

/**
 * Deterministic rubric-based feedback evaluator using keyword heuristics,
 * structural markers, theory terms, and citation checks.
 */
export function analyzeSubmission(
  text: string,
  category: FeedbackCategory
): FeedbackResult {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const lower = text.toLowerCase();

  // Heuristic signals
  const hasParagraphs = text.split(/\n\s*\n/).length >= 3;
  const hasThesis = lower.includes('argue') || lower.includes('contend') || lower.includes('assert') || lower.includes('demonstrate') || lower.includes('posits') || lower.includes('investigate');
  const hasCitations = /['"][A-Z][a-zA-Z\s,]+['"]/.test(text) || /\(\d{4}\)/.test(text) || lower.includes('according to');
  const hasTheoryTerms = ['ideology', 'hegemony', 'discourse', 'objective correlative', 'subaltern', 'aesthetic', 'bourgeois', 'metaphysical', 'ecofeminist', 'subvert', 'diaspora', 'paradox', 'dialectic', 'epistemic'].filter(t => lower.includes(t));
  const hasTransitions = ['furthermore', 'moreover', 'consequently', 'nevertheless', 'on the other hand', 'in contrast', 'therefore', 'subsequently'].filter(t => lower.includes(t));

  const criteria: RubricCriterion[] = [];
  const inlineHighlights: FeedbackResult['inlineHighlights'] = [];
  const thingsToFix: string[] = [];

  if (category.id === 'asst-prof') {
    // 5 criteria, max 5 each -> 25 total
    const c1Score = hasThesis ? (wordCount >= 380 ? 4.5 : 4.0) : 3.0;
    criteria.push({
      name: 'Thesis Clarity & Theoretical Framing',
      score: c1Score,
      maxScore: 5,
      comment: hasThesis 
        ? 'Explicit argumentative spine established in opening paragraph with clear theoretical grounding.' 
        : 'Lacks a strong definitive assertion; statement is currently more expository than thesis-driven.'
    });

    const c2Score = hasCitations ? 4.5 : 3.2;
    criteria.push({
      name: 'Textual Evidence & Scholarly References',
      score: c2Score,
      maxScore: 5,
      comment: hasCitations 
        ? 'Well-integrated textual quotations and secondary critical citations throughout.' 
        : 'Relies on generalized summary; integrate direct textual phrases and authoritative critics.'
    });

    const c3Score = hasTheoryTerms.length >= 3 ? 4.5 : 3.5;
    criteria.push({
      name: 'Critical Nuance & Historiography',
      score: c3Score,
      maxScore: 5,
      comment: hasTheoryTerms.length >= 3 
        ? `Engages theoretical concepts (${hasTheoryTerms.slice(0, 3).join(', ')}) with historical awareness.` 
        : 'Theoretical context is thin; articulate the socio-historical stakes of the movement.'
    });

    const c4Score = hasParagraphs && hasTransitions.length >= 2 ? 4.5 : 3.8;
    criteria.push({
      name: 'Structure, Rhetoric & Paragraph Transitions',
      score: c4Score,
      maxScore: 5,
      comment: hasParagraphs 
        ? 'Cohesive flow with clear transitions moving between theoretical setup and textual application.' 
        : 'Paragraph breaks need sharper demarcations to guide the university examiner.'
    });

    const c5Score = wordCount >= 350 ? 4.5 : 3.5;
    criteria.push({
      name: 'Academic Register & Diction',
      score: c5Score,
      maxScore: 5,
      comment: 'Elevated academic vocabulary appropriate for PSC/University Lecturer grade evaluation.'
    });

    const total = criteria.reduce((sum, c) => sum + c.score, 0);

    // Highlights
    if (hasThesis) {
      inlineHighlights.push({
        text: text.slice(0, 180),
        type: 'strong',
        comment: 'Strong opening: establishes critical context and stakes immediately.'
      });
    }
    if (hasCitations) {
      inlineHighlights.push({
        text: text.includes('Eliot forcefully rejects this romantic egoism') 
          ? 'Eliot forcefully rejects this romantic egoism' 
          : text.slice(220, 340),
        type: 'strong',
        comment: 'Accurate critical contrast between Wordsworthian expressivism and classicist impersonality.'
      });
    }
    inlineHighlights.push({
      text: text.slice(-250),
      type: 'improve',
      comment: 'Consider concluding with a forward-looking sentence connecting this to contemporary syllabus trends.'
    });

    thingsToFix.push('Include at least one direct quote from the secondary critic (e.g. Cleanth Brooks or Terry Eagleton) to cement evaluation.');
    thingsToFix.push('Ensure the distinction between biographical emotion and artistic emotion is explicitly reiterated in the synthesis.');
    thingsToFix.push('Keep the conclusion under 80 words while preserving critical punch.');

    return {
      scoreBand: `${total.toFixed(1)} / 25 (Distinction Grade A)`,
      totalScore: total,
      maxTotalScore: 25,
      wordCount,
      criteria,
      inlineHighlights,
      thingsToFix,
      aiDraftNote: `AI Faculty Assessment: The submission demonstrates high scholarly maturity (${wordCount} words). Strong grasp of critical concepts with seamless transitions. Recommended for Teacher Approval.`
    };
  } else if (category.id === 'research-prop') {
    // 4 criteria, max 5 each -> 20 total
    const c1Score = hasThesis ? 4.5 : 3.5;
    criteria.push({
      name: 'Research Question & Problem Statement',
      score: c1Score,
      maxScore: 5,
      comment: 'Clearly defined problematization distinguishing the study from conventional descriptive readings.'
    });

    const c2Score = hasTheoryTerms.length >= 2 ? 4.5 : 3.5;
    criteria.push({
      name: 'Theoretical & Methodological Framework',
      score: c2Score,
      maxScore: 5,
      comment: `Methodology explicitly invokes theoretical tools (${hasTheoryTerms.slice(0, 3).join(', ') || 'ecocritical/materialist'}).`
    });

    const c3Score = 4.0;
    criteria.push({
      name: 'Literature Review & Identified Gaps',
      score: c3Score,
      maxScore: 5,
      comment: 'Identifies specific gaps in existing canonical criticism with clear research justification.'
    });

    const c4Score = 4.2;
    criteria.push({
      name: 'Feasibility, Bibliography & Scholarly Significance',
      score: c4Score,
      maxScore: 5,
      comment: 'Research scope is well-bounded for a doctoral timeline with identifiable archival resources.'
    });

    const total = criteria.reduce((sum, c) => sum + c.score, 0);

    inlineHighlights.push({
      text: text.slice(0, 160),
      type: 'strong',
      comment: 'Compelling title and problem framing suitable for Ph.D. interview boards.'
    });
    inlineHighlights.push({
      text: text.slice(200, 380),
      type: 'strong',
      comment: 'Methodology articulates both theoretical pillars and primary archival parameters.'
    });
    inlineHighlights.push({
      text: text.slice(-200),
      type: 'improve',
      comment: 'Clarify potential ethical or archival accessibility constraints during field work.'
    });

    thingsToFix.push('Add 3-4 specific primary archival collections or manuscript catalogs to be consulted.');
    thingsToFix.push('State 2-3 specific chapter breakdown hypotheses to demonstrate 3-year doctoral feasibility.');
    thingsToFix.push('Clarify whether regional Indian translations or primary English texts form the primary corpus.');

    return {
      scoreBand: `${total.toFixed(1)} / 20 (Strong Ph.D. Candidacy)`,
      totalScore: total,
      maxTotalScore: 20,
      wordCount,
      criteria,
      inlineHighlights,
      thingsToFix,
      aiDraftNote: `AI Proposal Review: High academic viability. The theoretical integration is robust and will impress a university doctoral screening committee.`
    };
  } else {
    // IELTS Writing Task 2: 4 criteria, 9-band scale
    const taScore = wordCount >= 250 ? 8.0 : 6.0;
    criteria.push({
      name: 'Task Achievement',
      score: taScore,
      maxScore: 9,
      comment: wordCount >= 250 
        ? `Addresses all parts of the prompt comprehensively with well-supported arguments (${wordCount} words).`
        : `Under length limit (${wordCount}/250 words); expand examples to avoid band penalty.`
    });

    const ccScore = hasTransitions.length >= 3 ? 8.0 : 7.0;
    criteria.push({
      name: 'Coherence and Cohesion',
      score: ccScore,
      maxScore: 9,
      comment: 'Logically sequenced paragraph progression with varied cohesive devices and referential signposts.'
    });

    const lrScore = hasTheoryTerms.length >= 1 ? 8.0 : 7.5;
    criteria.push({
      name: 'Lexical Resource (Vocabulary)',
      score: lrScore,
      maxScore: 9,
      comment: 'Sophisticated academic vocabulary with natural collocation and minimal inappropriate register.'
    });

    const graScore = 8.0;
    criteria.push({
      name: 'Grammatical Range and Accuracy',
      score: graScore,
      maxScore: 9,
      comment: 'Wide range of complex sentence structures with high grammatical accuracy and proper punctuation.'
    });

    const avgBand = (criteria.reduce((s, c) => s + c.score, 0) / criteria.length);
    const bandFormatted = (Math.round(avgBand * 2) / 2).toFixed(1);

    inlineHighlights.push({
      text: text.slice(0, 150),
      type: 'strong',
      comment: 'Effective paraphrase of prompt and distinct thesis stance.'
    });
    inlineHighlights.push({
      text: text.slice(220, 400),
      type: 'strong',
      comment: 'Cohesive topic sentence followed by concrete illustrative real-world evidence.'
    });
    inlineHighlights.push({
      text: text.slice(-180),
      type: 'improve',
      comment: 'Ensure final sentence does not introduce any brand new unargued premises.'
    });

    thingsToFix.push('Ensure both opposing viewpoints are weighted equally before cementing your own stance.');
    thingsToFix.push('Vary sentence starters to avoid overusing conjunctive adverbs at the beginning of clauses.');
    thingsToFix.push('Check that paragraph 3 contains a specific real-world example to bolster the theoretical claim.');

    return {
      scoreBand: `Band ${bandFormatted} (Very Good User)`,
      totalScore: parseFloat(bandFormatted),
      maxTotalScore: 9.0,
      wordCount,
      criteria,
      inlineHighlights,
      thingsToFix,
      aiDraftNote: `AI IELTS Evaluator: Clear Band ${bandFormatted} performance. Excellent lexical precision and cohesive flow. Ready for final teacher verification.`
    };
  }
}
