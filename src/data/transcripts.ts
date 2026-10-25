export interface LectureTranscript {
  id: string;
  title: string;
  topic: string;
  duration: string;
  date: string;
  keyConcepts: string[];
  rawText: string;
}

export const SAMPLE_TRANSCRIPTS: LectureTranscript[] = [
  {
    id: 'lecture-romanticism',
    title: 'The Romantic Revolution: Lyrical Ballads, Nature & The Poetics of Sensation',
    topic: 'Romantic Period (1798–1837)',
    duration: '42 mins',
    date: 'Autumn Faculty Lecture Series',
    keyConcepts: ['Lyrical Ballads 1798', 'Preface 1800', 'Spontaneous overflow of powerful feelings', 'Willing suspension of disbelief', 'Egotistical sublime vs Negative capability'],
    rawText: `[00:00:15] Good morning everyone, and welcome back to our intensive masterclass series for UGC NET and SET English literature aspirants. Today we are unpacking the seismic paradigm shift that occurred in the year 1798 with the anonymous publication of 'Lyrical Ballads' by William Wordsworth and Samuel Taylor Coleridge.

[00:05:40] To understand why this slim volume was so revolutionary, you must first remember what eighteenth-century English poetry sounded like. The Augustan Age—dominated by Alexander Pope, John Dryden, and Dr. Samuel Johnson—was an age of heroic couplets, neoclassical decorum, urban polish, and intellectual wit. Poetry belonged to London coffee houses, aristocratic parlors, and witty satires. It was governed by strict rules of decorum and Latinate diction.

[00:12:20] Wordsworth and Coleridge deliberately detonated this elite consensus. In the famous 1800 Preface to the Lyrical Ballads, which is mandatory reading for Paper II, Wordsworth issued his famous manifesto: 'Poetry is the spontaneous overflow of powerful feelings: it takes its origin from emotion recollected in tranquillity.' Notice the two verbs there—overflow and recollected. It is not raw hysteria in the heat of the moment; it is sensory experience stored in memory, revisited in serene contemplation, and then transmuted into art.

[00:19:05] Furthermore, Wordsworth declared that the poet should employ 'a selection of language really used by men'. Why rustic and humble life? Because in rural conditions, uncorrupted by modern industrial greed, human passions are directly incorporated with the beautiful and permanent forms of nature. Man is connected to the soil, the sky, and the seasons.

[00:26:45] Now pay very close attention to how the labour was divided between the two poets. Coleridge tells us in Chapter XIV of 'Biographia Literaria' that they agreed on two distinct cardinal points of poetry. Wordsworth was to take the everyday, the ordinary rustic incident, and give it the charm of novelty by awakening the mind's attention from the lethargy of custom. Coleridge, on the other hand, was to deal with supernatural characters and incidents, but treat them with such psychological truth as to transfer from our inward nature a human interest and a semblance of truth sufficient to procure for these shadows of imagination 'that willing suspension of disbelief for the moment, which constitutes poetic faith'.

[00:34:10] This distinction is vital for your UGC NET assertion-reason questions. While Wordsworth writes 'Tintern Abbey', Michael, and The Idiot Boy, Coleridge produces 'The Rime of the Ancient Mariner', 'Christabel', and 'Kubla Khan'. We see here the two complementary poles of English Romanticism: the naturalist-pantheist path and the esoteric-visionary path.

[00:39:50] To conclude today's session, remember how this paved the way for the younger Romantics. When John Keats reads Wordsworth, he will admire him, but he will also warn us against the 'Wordsworthian or egotistical sublime'. Keats will formulate his own counter-concept of 'Negative Capability'—the ability to exist in doubts and mysteries without irritable reaching after certainty. In our next lecture, we will dive deeply into Keats's 1819 Odes. Review your notes on the 1800 Preface tonight!`
  },
  {
    id: 'lecture-postcolonial',
    title: 'Postcolonial Theory: Edward Said, Discourse & Decentering the Western Canon',
    topic: 'Literary Theory & Cultural Studies',
    duration: '48 mins',
    date: 'Advanced Theory & Research Methodology',
    keyConcepts: ['Orientalism 1978', 'Michel Foucault Power/Knowledge', 'Antonio Gramsci Hegemony', 'Subalternity', 'Homi Bhabha Mimicry & Hybridity'],
    rawText: `[00:00:20] Welcome, scholars. Today we are tackling what is perhaps the single most tested theoretical framework in recent UGC NET and GATE English examinations: Postcolonial Literary Theory, with specific emphasis on Edward Said's foundational 1978 text, 'Orientalism'.

[00:06:15] Let us start with a fundamental question: What is Orientalism? Said defines it on three interdependent levels. First, it is an academic designation: anyone who teaches, writes about, or researches the Orient is an Orientalist. Second, it is a broader ontological and epistemological distinction made between 'the Orient' and 'the Occident'—the East and the West. But third, and most crucially for literary theory, Orientalism is a Western style for dominating, restructuring, and having authority over the Orient.

[00:14:30] Where does Said get his analytical tools? This is a classic NET multiple-choice question. Said synthesizes two major European theorists: Michel Foucault and Antonio Gramsci. From Foucault, Said adopts the concept of 'discourse' and the unbreakable nexus between 'power and knowledge' (pouvoir/savoir). Knowledge about the Orient is never disinterested, neutral, or innocent; knowledge is produced by institutions of imperial power to justify subjugation. From Gramsci, Said takes the concept of cultural 'hegemony'—the non-coercive ways in which dominant ideas are naturalized across culture, school syllabi, and imaginative literature.

[00:22:50] Look at how classic English literature participated in this discourse. When you read William Shakespeare's 'The Tempest', Caliban is constructed as the brutish, uncivilized native whose language is merely a vehicle for cursing his master. In Charlotte Brontë's 'Jane Eyre', Bertha Mason—the Jamaican Creole heiress—is animalized in the attic as a 'madwoman' so that the English domestic order can be sanitized. When you read Jane Austen's 'Mansfield Park', Edward Said famously demonstrated in 'Culture and Imperialism' that the tranquil moral order of the English country house is directly funded by Sir Thomas Bertram's slave plantations in Antigua.

[00:31:40] Now let us trace how subsequent postcolonial thinkers developed and critiqued Said. Gayatri Chakravorty Spivak, in her 1988 essay 'Can the Subaltern Speak?', cautioned that Said's model still treated the Orient as a monolithic entity and warned against speaking on behalf of marginalized subaltern women who are caught between imperialist patriarchy and native feudalism.

[00:38:15] Meanwhile, Homi Bhabha shifted the focus from monolithic domination to ambivalence and psychodynamics. In 'The Location of Culture', Bhabha introduces the concepts of 'mimicry' and 'hybridity'. When the colonial authority demands that the native subject copy British manners, language, and religion, the result is mimicry: 'almost the same, but not white'. This mimicry is never pure obedience; it is also mockery and menace, because it destabilizes the absolute difference upon which colonial superiority relies.

[00:44:00] For your practice test this weekend, make sure you can map Said to Foucault and Gramsci, Spivak to Subaltern Studies, and Bhabha to post-structuralist psychoanalysis. These theoretical connections represent guaranteed marks in your paper.`
  },
  {
    id: 'lecture-modernism',
    title: 'Modernism: Urban Alienation, The Waste Land & Stream of Consciousness',
    topic: 'Modernist Literature (1900–1945)',
    duration: '45 mins',
    date: 'Paper II Core Literature Series',
    keyConcepts: ['Post-WWI disillusionment', 'T.S. Eliot The Waste Land', 'Objective correlative', 'Stream of consciousness in Woolf and Joyce', 'Mythic method'],
    rawText: `[00:00:25] Good evening class. Today our inquiry enters the fractured, hyper-urban terrain of 20th-century Modernism. Virginia Woolf famously declared in her essay 'Mr. Bennett and Mrs. Brown' that 'on or about December 1910, human character changed.' What did she mean? She meant that the Victorian verities—faith in imperial progress, bourgeois moral certainty, linear historical narrative, and stable psychological identities—had shattered irrevocably.

[00:07:35] The cataclysm of World War I from 1914 to 1918 turned the European continent into a mechanized slaughterhouse. Trench warfare, poisonous mustard gas, and mass trauma stripped away the illusion that Western civilization was morally superior or rational. Authors found that nineteenth-century realism—the panoramic, omniscient narration of Charles Dickens or George Eliot—could no longer express the nervous, traumatized reality of the modern metropolis.

[00:15:10] Enter T.S. Eliot with 'The Waste Land' in 1922, the annus mirabilis of Modernism. Notice the profound structural method Eliot uses. Instead of a chronological heroic quest, Eliot presents a collage of fragmented voices, pub conversations, Sanskrit mantras, and classical allusions. Eliot famously writes at the end of the poem: 'These fragments I have shored against my ruins.' 

[00:23:45] To represent this psychological disorientation, Eliot utilized what he defined in 'Hamlet and His Problems' as the 'Objective Correlative'. Art cannot simply declare emotion in sentimental outbursts; it must construct a specific set of objects, a concrete situation, a chain of physical events which serves as the formula of that particular emotion. The dirty canal in winter, the wet dead lilacs, the typist's drying underwear on the divan—these sensory objects become the objective correlatives for the spiritual drought and emotional paralysis of post-war Europe.

[00:32:00] Concurrently, novelists like Virginia Woolf and James Joyce were revolutionizing narrative time. In her 1919 essay 'Modern Fiction', Woolf argued that the Edwardian realists were obsessed with external material trivia: umbrellas, furniture, wages. Instead, she demanded: 'Let us record the atoms as they fall upon the mind in the order in which they fall.' This led directly to the stream-of-consciousness technique in 'Mrs Dalloway' and Joyce's 'Ulysses'.

[00:39:20] Notice how time behaves in 'Mrs Dalloway'. Clock time—the objective, authoritative chime of Big Ben—marches relentlessly forward, representing the patriarchal, institutional state. But psychological time—the Bergsonian durée—expands and contracts through memory, sensory triggers, and associative interior monologues. Clarissa Dalloway mending her green dress experiences fifty years of emotional history in thirty seconds.

[00:44:10] In your NET preparation, always link 1922 to the simultaneous publication of 'Ulysses' and 'The Waste Land', and trace the transition from outer Victorian realism to inward psychological polyphony. We will analyze the Five Sections of The Waste Land in detail tomorrow!`
  }
];
