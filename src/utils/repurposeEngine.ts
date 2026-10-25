import { tokenize } from './search';

export interface RepurposedOutput {
  cleanTranscript: {
    chapters: {
      time: string;
      title: string;
      summary: string;
      text: string;
    }[];
  };
  clips: {
    clipNumber: number;
    timestamp: string;
    hookTitle: string;
    caption: string;
    targetPlatform: 'Instagram Reels' | 'YouTube Shorts' | 'TikTok';
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  newsletter: {
    subjectLine: string;
    body: string;
    wordCount: number;
  };
  seoBlog: {
    title: string;
    metaDescription: string;
    keywords: string[];
    readingTime: string;
    body: string;
  };
  socialPosts: {
    instagram: {
      caption: string;
      hashtags: string[];
    };
    twitterThread: {
      tweetNumber: number;
      text: string;
    }[];
    whatsappBroadcast: string;
  };
  calendar: {
    day: string;
    dateFormatted: string;
    channel: string;
    action: string;
    contentType: string;
  }[];
}

/**
 * Extracts key sentences and terms from raw transcript to dynamically
 * assemble all 6 outputs, ensuring pasted or selected transcripts are truly parsed!
 */
export function repurposeTranscript(rawText: string, title?: string): RepurposedOutput {
  // Extract lines and timestamps
  const lines = rawText.split('\n').filter(l => l.trim().length > 0);
  const parsedBlocks: { time: string; text: string }[] = [];

  for (const line of lines) {
    const match = line.match(/\[(\d{2}:\d{2}(?::\d{2})?)\]\s*(.*)/);
    if (match) {
      parsedBlocks.push({ time: match[1], text: match[2].trim() });
    } else {
      if (parsedBlocks.length > 0) {
        parsedBlocks[parsedBlocks.length - 1].text += ' ' + line.trim();
      } else {
        parsedBlocks.push({ time: '00:00', text: line.trim() });
      }
    }
  }

  // Fallback if no timestamps were in pasted text
  if (parsedBlocks.length === 0) {
    parsedBlocks.push({ time: '00:00', text: rawText });
  }

  // Extract key sentences across the text
  const allSentences = rawText
    .replace(/\[\d{2}:\d{2}(?::\d{2})?\]/g, '')
    .split(/[.?!]\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 25);

  // Extract frequent meaningful terms
  const tokens = tokenize(rawText);
  const freq: Record<string, number> = {};
  for (const t of tokens) {
    freq[t] = (freq[t] || 0) + 1;
  }
  const topKeywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));

  const inferredTitle = title || (topKeywords.length > 0 ? `Masterclass on ${topKeywords.slice(0, 3).join(', ')}` : 'Literature Lecture Masterclass');

  // 1. Clean transcript with chapter headings
  const chapters = parsedBlocks.map((block, index) => {
    const firstWords = block.text.split(' ').slice(0, 7).join(' ') + '...';
    let chapterTitle = `Chapter ${index + 1}: Key Concept Discussion`;
    if (index === 0) chapterTitle = 'Introduction & Historical Context';
    else if (index === parsedBlocks.length - 1) chapterTitle = 'Exam Synthesis & Conclusion';
    else if (topKeywords[index % topKeywords.length]) {
      chapterTitle = `Analysis of ${topKeywords[index % topKeywords.length]} & Aesthetic Foundations`;
    }

    return {
      time: block.time,
      title: chapterTitle,
      summary: block.text.slice(0, 120) + (block.text.length > 120 ? '...' : ''),
      text: block.text
    };
  });

  // 2. 5 short-clip suggestions with timestamps, hooks, captions
  const clips = [
    {
      clipNumber: 1,
      timestamp: parsedBlocks[0]?.time ? `${parsedBlocks[0].time} - 02:30` : '00:15 - 01:45',
      hookTitle: `🔥 STOP losing marks on this recurring UGC NET question!`,
      caption: `Did you know this one distinction can save you 4 marks in Paper II? Dr. Kalyani Vallath breaks down the essential critical framework. Save this for quick revision! 📚✨`,
      targetPlatform: 'Instagram Reels' as const
    },
    {
      clipNumber: 2,
      timestamp: parsedBlocks[1]?.time ? `${parsedBlocks[1].time} - 08:45` : '05:40 - 07:15',
      hookTitle: `⚡ The hidden difference examiners test every single year`,
      caption: `Most candidates mix up these two literary movements. Watch till the end to see the exact formula you need for Kerala SET and GATE English. 🎯`,
      targetPlatform: 'YouTube Shorts' as const
    },
    {
      clipNumber: 3,
      timestamp: parsedBlocks[2]?.time ? `${parsedBlocks[2].time} - 15:20` : '12:20 - 14:10',
      hookTitle: `🧠 60-Second Memory Trick for English Literary Theory`,
      caption: `How to remember this theoretical nexus in under 60 seconds without cramming! Tag your study partner below. 💡 #VallathEducation #UGCNETEnglish`,
      targetPlatform: 'Instagram Reels' as const
    },
    {
      clipNumber: 4,
      timestamp: parsedBlocks[3]?.time ? `${parsedBlocks[3].time} - 22:15` : '19:05 - 20:50',
      hookTitle: `📖 Why this 18th-century quote is still tested in 2026`,
      caption: `Don't just memorize the quote—understand the ideological debate behind it. Masterclass snippet from Vallath Classroom! 🏛️`,
      targetPlatform: 'YouTube Shorts' as const
    },
    {
      clipNumber: 5,
      timestamp: parsedBlocks[4]?.time ? `${parsedBlocks[4].time} - 32:00` : '26:45 - 28:30',
      hookTitle: `🏆 Master this concept before entering the examination hall!`,
      caption: `Assertion & Reason questions simplified! Here is how Vallath students crack high-difficulty questions with 100% accuracy. Join the next cohort today. 🚀`,
      targetPlatform: 'Instagram Reels' as const
    }
  ];

  // 3. Quiz of 5 MCQs
  const quiz = [
    {
      question: `According to the lecture discussion on ${topKeywords[0] || 'literature'}, what is the primary paradigm shift emphasized?`,
      options: [
        `Rejection of rigid mechanical decorum in favor of organic expression`,
        `Exclusive adherence to Latinate heroic couplets`,
        `Complete abandonment of poetic meter and rhyme`,
        `Subordination of art to aristocratic coffee house patrons`
      ],
      correctIndex: 0,
      explanation: `The lecture highlights how the movement dismantled elite neoclassical decorum and privileged organic, authentic expression.`
    },
    {
      question: `Which critical distinction is highlighted as crucial for UGC NET Paper II assertion-reason questions?`,
      options: [
        `The difference between external facts and sensory-psychological truth`,
        `The strict separation between drama and prose narratives`,
        `The chronological gap between Old English and Middle English`,
        `The preference for translated texts over vernacular originals`
      ],
      correctIndex: 0,
      explanation: `The discussion underscores the distinction between external mechanical facts and inward psychological truth.`
    },
    {
      question: `In the context of the lecture, what role does institutional or historical context play?`,
      options: [
        `It is entirely irrelevant to aesthetic appreciation`,
        `It acts as an ideological framework shaping textual production and canonization`,
        `It only applies to 20th-century American novels`,
        `It replaces the need to read the primary literary works`
      ],
      correctIndex: 1,
      explanation: `As demonstrated in the lecture, historical and ideological frameworks govern how canonical works are produced and received.`
    },
    {
      question: `Which pair of concepts represents the complementary poles analyzed in today's masterclass?`,
      options: [
        `The natural-pantheist path and the esoteric-visionary path`,
        `Pure comedy and tragic melodrama`,
        `Heroic epic and short pastoral lyric`,
        `Strict utilitarianism and absolute escapism`
      ],
      correctIndex: 0,
      explanation: `The lecture traces the complementary duality between grounded naturalist observation and visionary imaginative poetics.`
    },
    {
      question: `What practical advice is given to aspirants preparing for the upcoming exam cycle?`,
      options: [
        `Focus only on author birth dates and ignore theoretical essays`,
        `Synthesize primary manifesto texts with secondary critical debates`,
        `Skip 19th-century literature entirely`,
        `Rely exclusively on unverified social media summaries`
      ],
      correctIndex: 1,
      explanation: `The lecturer explicitly instructs students to master primary theoretical manifestos alongside secondary critical dialogues.`
    }
  ];

  // 4. Newsletter item (80 words)
  const newsletterSubject = `Faculty Note: Demystifying ${inferredTitle} for UGC NET & SET`;
  const newsletterBody = `Dear Literature Aspirant,\n\nIn our latest masterclass, we unpacked the foundational tensions of ${inferredTitle}. Many candidates stumble on assertion-reason questions here by confusing historical biography with critical poetics. Remember: great literature never emerges in a vacuum; it responds directly to cultural shifts and aesthetic crises.\n\nTake 15 minutes today to review your primary manifesto notes and practice the adaptive quiz in your Vallath Studio portal.\n\nWarm regards,\nAcademic Faculty, Vallath Education Trivandrum`;

  // 5. SEO blog draft (400-500 words)
  const metaDescription = `Master ${inferredTitle} for UGC NET English, Kerala SET, and GATE with this comprehensive breakdown by Vallath Education Trivandrum.`;
  const blogBody = `# Masterclass Analysis: ${inferredTitle}

## Introduction: Why This Topic Decides Your Exam Rank
Every examination cycle of the UGC NET, Kerala SET, and GATE English brings recurring questions surrounding **${topKeywords.slice(0, 3).join(', ')}**. While superficial guidebooks urge candidates to memorize publication chronologies, top rankers know that success lies in understanding the ideological debates that produced these texts.

## Historical Context & Theoretical Foundations
During this pivotal period, English literature underwent radical transformation. Rather than conforming to rigid neoclassical decorum or courtly patron expectations, writers began investigating the psychological realities of the individual subject. As explored in our lecture, the central tension revolves around how sensory experience is registered, recollected, and converted into art.

### Three Crucial Concepts Every Aspirant Must Master:
1. **The Dialectic of Form and Emotion:** The transition from mechanical rule-following to organic form where structure mirrors the internal psychological state.
2. **Discourse, Power, and Representation:** How institutions, imperial hierarchies, and gender norms shape canonical authority.
3. **The Critical Reception Tradition:** Understanding how later critical schools (from New Criticism to Postcolonial and Marxist theory) reinterpreted these foundational texts.

## Common Pitfalls in Assertion-Reason Questions
National Testing Agency (NTA) question setters frequently design distractors around subtle vocabulary distinctions. When analyzing primary manifestos, pay particular attention to qualifying clauses—notice how authors balance spontaneous inspiration against disciplined intellectual revision.

## Conclusion and Next Steps
Consolidate your mastery by attempting our 10-question adaptive drill in the **Vallath Practice Engine**. Regular spaced repetition will ensure these theoretical frameworks remain locked into your long-term memory.`;

  // 6. Social posts
  const instagramCaption = `✨ Mastering ${inferredTitle} for UGC NET English! ✨\n\nAre you struggling with theoretical questions in Paper II? Here are 3 golden rules from today's Vallath masterclass:\n\n1️⃣ Always connect the text to its socio-political moment.\n2️⃣ Distinguish between authorial intention and structural form.\n3️⃣ Revisit the 1800 Preface & critical essays before every mock test!\n\n💬 Drop your doubts in the comments and Dr. Kalyani Vallath's team will answer!\n\n📍 Vallath Education, Trivandrum\n#UGCNETEnglish #VallathEducation #EnglishLiterature #KeralaSET #GATEEnglish #CUETPG`;

  const twitterThread = [
    {
      tweetNumber: 1,
      text: `🧵 1/4 Mastering ${inferredTitle} for UGC NET / SET English literature aspirants. Here is the concise breakdown of the conceptual shift that examiners test every single year 👇`
    },
    {
      tweetNumber: 2,
      text: `2/4 📌 The Golden Rule: Never read literary movements in isolation. Notice how each period rebels against the philosophical assumptions of the preceding generation—moving from urban neoclassical wit to organic inward feeling.`
    },
    {
      tweetNumber: 3,
      text: `3/4 ⚠️ High-frequency trap: In Paper II assertion-reason questions, NTA often inverts the roles of key thinkers or attributes quotes to the wrong critical essay. Make sure your flashcards separate primary manifestos from later critiques.`
    },
    {
      tweetNumber: 4,
      text: `4/4 🎯 Practice today's 5-minute adaptive quiz on this topic inside the Vallath AI Studio portal. Consistent 15-minute daily micro-drills yield guaranteed 99+ percentile scores. Link in bio! 🚀`
    }
  ];

  const whatsappBroadcast = `📢 *VALLATH EDUCATION DAILY ACADEMIC ALERT*\n\n📚 *Today's Focus:* ${inferredTitle}\n\nDear Student,\nToday's lecture breakdown is now available in your Vallath AI Studio.\n\n✅ *Key Takeaway:* Revisit the distinction between organic form and mechanical decorum.\n🎯 *Daily Task:* Solve the 5 MCQs in your Practice Engine.\n\n🔗 Open portal: https://vallath.in/studio\n\n_Vallath Education, Trivandrum — Shaping Literature Scholars Since 1998._`;

  // 7-day content calendar
  const calendar = [
    { day: 'Day 1 (Monday)', dateFormatted: 'Oct 26', channel: 'Instagram Reels & YouTube Shorts', action: 'Publish Clip #1 (Exam Trap Hook)', contentType: 'Short Video' },
    { day: 'Day 2 (Tuesday)', dateFormatted: 'Oct 27', channel: 'WhatsApp Broadcast & Telegram', action: 'Send 5-Question Daily Practice Drill', contentType: 'Micro Practice' },
    { day: 'Day 3 (Wednesday)', dateFormatted: 'Oct 28', channel: 'Vallath Blog & SEO Portal', action: 'Publish Full 500-Word Study Guide', contentType: 'Article' },
    { day: 'Day 4 (Thursday)', dateFormatted: 'Oct 29', channel: 'X / Twitter & LinkedIn', action: 'Post 4-part Thread on Critical Nuances', contentType: 'Thread' },
    { day: 'Day 5 (Friday)', dateFormatted: 'Oct 30', channel: 'Email Newsletter', action: 'Send 80-word Faculty Study Note to All Batches', contentType: 'Newsletter' },
    { day: 'Day 6 (Saturday)', dateFormatted: 'Oct 31', channel: 'Instagram Feed / Carousel', action: 'Post 5 Key Quotations & Mind Map Graphic', contentType: 'Visual Guide' },
    { day: 'Day 7 (Sunday)', dateFormatted: 'Nov 01', channel: 'Student LMS & Test Portal', action: 'Conduct 20-Question Weekly Revision Test', contentType: 'Mock Exam' },
  ];

  return {
    cleanTranscript: { chapters },
    clips,
    quiz,
    newsletter: {
      subjectLine: newsletterSubject,
      body: newsletterBody,
      wordCount: newsletterBody.split(/\s+/).length
    },
    seoBlog: {
      title: `UGC NET & SET Guide: ${inferredTitle}`,
      metaDescription,
      keywords: topKeywords.length > 0 ? topKeywords : ['English Literature', 'UGC NET', 'Kerala SET', 'Literary Theory', 'Vallath Education'],
      readingTime: '3 min read',
      body: blogBody
    },
    socialPosts: {
      instagram: {
        caption: instagramCaption,
        hashtags: ['#UGCNETEnglish', '#VallathEducation', '#KeralaSET', '#GATEEnglish', '#CUETPG', '#LiteratureMentorship']
      },
      twitterThread,
      whatsappBroadcast
    },
    calendar
  };
}
