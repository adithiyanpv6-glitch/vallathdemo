export interface RubricCriterion {
  name: string;
  score: number;
  maxScore: number;
  comment: string;
}

export interface FeedbackResult {
  scoreBand: string;
  totalScore: number;
  maxTotalScore: number;
  wordCount: number;
  criteria: RubricCriterion[];
  inlineHighlights: {
    text: string;
    type: 'strong' | 'improve';
    comment: string;
  }[];
  thingsToFix: string[];
  aiDraftNote: string;
}

export interface FeedbackSample {
  id: string;
  title: string;
  studentName: string;
  promptQuestion: string;
  submissionText: string;
  expectedWordCount: string;
}

export interface FeedbackCategory {
  id: 'asst-prof' | 'research-prop' | 'ielts-task2';
  label: string;
  badge: string;
  description: string;
  rubricTemplate: {
    name: string;
    maxScore: number;
    weight: string;
  }[];
  samples: FeedbackSample[];
}

export const FEEDBACK_CATEGORIES: FeedbackCategory[] = [
  {
    id: 'asst-prof',
    label: 'Assistant Professor Descriptive Answer',
    badge: 'Kerala PSC & University Selection',
    description: 'Analytical essay evaluation assessing theoretical depth, textual citations, historical contextualization, and scholarly diction.',
    rubricTemplate: [
      { name: 'Thesis Clarity & Theoretical Framing', maxScore: 5, weight: '20%' },
      { name: 'Textual Evidence & Scholarly References', maxScore: 5, weight: '20%' },
      { name: 'Critical Nuance & Historiography', maxScore: 5, weight: '20%' },
      { name: 'Structure, Rhetoric & Paragraph Transitions', maxScore: 5, weight: '20%' },
      { name: 'Academic Register & Diction', maxScore: 5, weight: '20%' },
    ],
    samples: [
      {
        id: 'sample-ap-1',
        title: "T.S. Eliot's Impersonal Theory of Poetry in 'Tradition and the Individual Talent'",
        studentName: 'Student A (Aparna K.)',
        promptQuestion: "Critically evaluate T.S. Eliot's assertion that 'poetry is not a turning loose of emotion, but an escape from emotion; it is not the expression of personality, but an escape from personality.'",
        expectedWordCount: '450 - 550 words',
        submissionText: `In his landmark 1919 critical essay 'Tradition and the Individual Talent', T.S. Eliot mounted a decisive reaction against the Romantic dogma of subjective expressivism. For the Romantics, spearheaded by William Wordsworth's formula of 'the spontaneous overflow of powerful feelings', the poem was anchored in the emotional biography of the poet. Eliot forcefully rejects this romantic egoism, arguing instead that 'the mind of the mature poet differs from that of the immature one not precisely in any having 'more personality' to express, but by being a more finely perfected medium.'

Eliot introduces the famous chemical analogy of the catalyst to explain the depersonalization process. When sulfur dioxide and oxygen are combined in the presence of a filament of platinum, they form sulfurous acid; yet the platinum remains unchanged and inert. Similarly, the poet's mind is a receptacle where innumerable varied feelings and phrases seize upon one another without the poet's private emotions contaminating the finished verse. This radical separation between the 'man who suffers' and the 'mind which creates' underpins Modernist anti-sentimentalism.

Furthermore, Eliot anchors this aesthetic detachment within the historic sense. The poet does not create in isolated autonomy; rather, they must perceive literature from Homer down through the present as constituting a simultaneous order. When a truly new work of art is created, something happens simultaneously to all the works of art which preceded it. The existing monuments form an ideal order among themselves, which is modified by the introduction of the new work among them. Therefore, poetic creation is a continual surrender of himself as he is at the moment to something which is more valuable.

However, subsequent critics like Harold Bloom have noted that Eliot's impersonal facade conceals an anxiety of influence. Despite claiming emotional escape, Eliot's own masterpieces such as 'The Waste Land' reverberate with personal psychological anguish transformed into cultural myth. Thus, Eliot's doctrine must be understood not as literal emotional anesthesia, but as a deliberate classicist strategy to construct an authoritative tradition.`
      },
      {
        id: 'sample-ap-2',
        title: "Marxist Critique of Class Hegemony in Charles Dickens's 'Hard Times'",
        studentName: 'Student B (Rahul M.)',
        promptQuestion: "Examine Charles Dickens's 'Hard Times' through the lens of Marxist literary criticism, with reference to base, superstructure, and utilitarian ideology.",
        expectedWordCount: '450 - 550 words',
        submissionText: `Charles Dickens's 1854 industrial novel 'Hard Times' offers a blistering portrait of Victorian industrial capitalism and utilitarian alienation. When analyzed through Marxist literary theory, the fictional industrial settlement of Coketown exemplifies how the economic base—characterized by smoke-belching factories, mechanical routine, and capitalist owners—determines the cultural superstructure of law, education, and moral ideology.

Mr. Josiah Bounderby and Thomas Gradgrind personify the bourgeois ruling class. Gradgrind's model school operates as an ideological state apparatus, designed to produce compliant labor units trained strictly in 'Fact, Fact, Fact'. Imagination, wonder, and emotional solidarity—personified by Sleary's circus—are violently suppressed because they threaten capitalist efficiency. Dickens's depiction of the 'Hands' captures Karl Marx's theory of alienation from the labor process: workers are stripped of their human essence and reduced to repetitive extensions of the steam-engine piston.

Stephen Blackpool stands as the tragic proletarian caught between the ruthless factory owners and the corrupt union agitator Slackbridge. Dickens exposes how bourgeois legislation and the divorce law are commodified privileges inaccessible to the impoverished working class. Blackpool's constant refrain that 'it's all a muddle' reflects the ideological confusion of a worker unable to perceive systemic exploitation clearly.

Nevertheless, Marxist critics like Raymond Williams and Terry Eagleton point out Dickens's middle-class political limitations. While Dickens diagnoses the cruelty of utilitarianism, his resolution relies on individual benevolence and sentimental reconciliation rather than collective proletarian uprising. By portraying trade unions as demagogic threats, Dickens ultimately reasserts a reformist bourgeois humanism rather than revolutionary transformation.`
      }
    ]
  },
  {
    id: 'research-prop',
    label: 'PhD / MPhil Research Proposal',
    badge: 'University & NET JRF Research Gate',
    description: 'Evaluates research questions, methodology, literature review gaps, theoretical framework, and scholarly justification.',
    rubricTemplate: [
      { name: 'Research Question & Problem Statement', maxScore: 5, weight: '25%' },
      { name: 'Theoretical & Methodological Framework', maxScore: 5, weight: '25%' },
      { name: 'Literature Review & Identified Gaps', maxScore: 5, weight: '25%' },
      { name: 'Feasibility, Bibliography & Scholarly Significance', maxScore: 5, weight: '25%' },
    ],
    samples: [
      {
        id: 'sample-rp-1',
        title: 'Ecofeminist Re-readings of 19th Century Brontë Landscapes',
        studentName: 'Student C (Devika S.)',
        promptQuestion: 'Draft a PhD research proposal abstract and methodology examining the intersection of ecocriticism and gender in Emily and Charlotte Brontë.',
        expectedWordCount: '400 - 500 words',
        submissionText: `Title: Moorland, Mastery, and Gendered Cartographies: An Ecofeminist Investigation into Emily and Charlotte Brontë's Landscapes

Proposed Research Statement:
This research interrogates how the physical landscapes in Charlotte Brontë's 'Jane Eyre' and Emily Brontë's 'Wuthering Heights' function as dynamic ecofeminist counter-sites against patriarchal domesticity. While Victorian criticism predominantly viewed the Yorkshire moors and isolated country estates as atmospheric Gothic backdrops, this study posits that non-human environments actively embody ecological resistance against the capitalist enclosure and male subjugation of female autonomy.

Theoretical Framework & Methodology:
The investigation synthesizes material ecocriticism (Serenella Iovino, Cheryll Glotfelty) with feminist spatial theory (Gaston Bachelard, Doreen Massey). By reading the untamed heather of Penistone Crags and the subterranean weather of Thrushcross Grange as agential matter, the study traces how female protagonists negotiate bodily enclosure. Textual analysis will be coupled with archival analysis of Victorian mining expansion and land drainage acts in Haworth parish (1840–1860) to contextualize ecological devastation alongside patriarchal domestic violence.

Identified Research Gap:
Current scholarship primarily isolates either postcolonial readings (Spivak on Bertha Mason) or psychological Gothic analyses (Gilbert and Gubar). The explicit ecological entanglement of female madness and topographical degradation remains under-theorized. This doctoral project will fill this gap by demonstrating how the Brontë sisters anticipated the Anthropocene's intersection between ecological exploitation and gender discipline.`
      },
      {
        id: 'sample-rp-2',
        title: 'Subaltern Historiography and Memory in Amitav Ghosh’s Ibis Trilogy',
        studentName: 'Student D (Gautham V.)',
        promptQuestion: 'Submit a research proposal examining memory, archival violence, and maritime mobility in the Indian Ocean world.',
        expectedWordCount: '400 - 500 words',
        submissionText: `Title: Saltwater Subalterns: Archival Erasure and Maritime Resistance in Amitav Ghosh's Ibis Trilogy

Research Statement:
This project investigates the representation of indentured labor (girmitiyas) and coolie mobility across the Indian Ocean during the 19th-century Opium Wars in Amitav Ghosh's 'Sea of Poppies' (2008), 'River of Smoke' (2011), and 'Flood of Fire' (2015). The research seeks to understand how Ghosh's polyphonic narrative reconstructs subaltern agency beyond the static borders of colonial land-based archives.

Methodological Approaches:
Using Gayatri Spivak's critique of the colonial archive and Paul Gilroy's 'The Black Atlantic' (adapted to the 'Indian Ocean world' or 'Brown Atlantic' framework proposed by Isabel Hofmeyr), this thesis conducts comparative narrative discourse analysis. It examines the creole dialect (Chrestomathy) invented by Ghosh as a linguistic site of trans-oceanic solidarity that subverts British East India Company hegemony.

Significance and Research Contribution:
While contemporary postcolonial criticism has extensively studied diaspora in terrestrial colonial contexts, maritime indenture remains marginalized. This study will establish that the ship 'Ibis' functions not merely as a vehicle of imperial bondage, but as an insurgent heterotopia that reconstituted caste, gender, and linguistic subjectivities under early global capitalism.`
      }
    ]
  },
  {
    id: 'ielts-task2',
    label: 'IELTS / Academic Writing Task 2',
    badge: 'Overseas Higher Education & CUET',
    description: 'Assesses Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy on a 9-band scale.',
    rubricTemplate: [
      { name: 'Task Achievement', maxScore: 9, weight: '25%' },
      { name: 'Coherence and Cohesion', maxScore: 9, weight: '25%' },
      { name: 'Lexical Resource (Vocabulary)', maxScore: 9, weight: '25%' },
      { name: 'Grammatical Range and Accuracy', maxScore: 9, weight: '25%' },
    ],
    samples: [
      {
        id: 'sample-ielts-1',
        title: 'Preservation of Traditional Arts vs Modern Technology',
        studentName: 'Student E (Meera R.)',
        promptQuestion: 'Some people argue that governments should invest public funds to preserve endangered traditional art and literature forms, while others believe this money is better spent on modern technology and medical facilities. Discuss both views and give your opinion.',
        expectedWordCount: '250 - 320 words',
        submissionText: `In an era characterized by exponential technological acceleration, the debate regarding whether national budgets should support traditional cultural heritage or prioritize contemporary scientific and healthcare infrastructure has gained considerable prominence. While technological innovation directly improves tangible living standards, I contend that preserving classical arts and literature is equally indispensable for safeguarding national cultural identity and collective conscience.

Advocates of directing public expenditures solely toward medicine and digital infrastructure present pragmatic arguments. Healthcare facilities, medical research, and modern transportation networks provide immediate, quantifiable benefits by combating mortality and driving economic output. In emerging nations, allocating millions to restore antique manuscripts or subsidize classical theatre when public hospitals lack essential diagnostic apparatus may appear ethically dubious. Therefore, utilitarian priorities demand that fundamental physiological welfare precedes aesthetic indulgence.

Nevertheless, neglecting artistic traditions leads to societal deculturation and historical amnesia. Traditional literature, classical folklore, and performing arts encapsulate centuries of philosophical wisdom and communal memory that define a society's unique identity. Furthermore, cultural industries generate substantial indirect revenue through international tourism and creative exports. For example, countries such as Japan and the United Kingdom derive immense global soft power and tourist capital from state-supported heritage conservation programs. A society that excels exclusively in technology while abandoning its literary patrimony risks becoming culturally hollow.

In conclusion, although medical advancements and technological modernizations are vital for physical survival, cultural heritage is paramount for intellectual and spiritual flourishing. Consequently, governments must maintain a judicious fiscal equilibrium, allocating primary funds to public welfare while simultaneously preserving classical arts for posterity.`
      },
      {
        id: 'sample-ielts-2',
        title: 'Remote Learning vs Traditional Classroom Education',
        studentName: 'Student F (Arun S.)',
        promptQuestion: 'Online education has expanded rapidly across universities worldwide. Do the advantages of virtual higher education outweigh the disadvantages?',
        expectedWordCount: '250 - 320 words',
        submissionText: `The rapid democratization of digital communication has revolutionized university education, enabling millions of students to pursue academic degrees via virtual platforms. In my opinion, although digital distance learning offers remarkable geographic flexibility and financial accessibility, the severe absence of social development and hands-on laboratory interaction means its disadvantages ultimately outweigh its benefits.

On the positive side, online learning obliterates geographical and socio-economic hurdles. Students residing in peripheral rural regions or developing nations can access high-quality lectures delivered by world-renowned scholars without incurring astronomical relocation and dormitory expenditures. Additionally, asynchronous video archives enable working professionals to accommodate higher education around demanding occupational schedules, fostering lifelong learning.

However, the educational process entails far more than the passive absorption of theoretical content. Traditional campus life cultivates vital interpersonal competencies, collaborative teamwork, spontaneous classroom debates, and informal faculty mentorship that cannot be duplicated across computer screens. Crucially, scientific and technical disciplines demand tactile experimentation in physical laboratories, which virtual simulations cannot replicate faithfully. Prolonged isolation before screens frequently induces digital fatigue and elevated dropout rates among undergraduates.

In conclusion, while online higher education serves as a commendable supplementary tool for remote learners, it cannot replace the immersive psychological and pedagogical experience of physical university campuses.`
      }
    ]
  }
];
