/**
 * Vallath AI Studio - Brand Configuration
 * 
 * Centralized place for branding settings. 
 * Any institute or deployment can swap the name, tagline, colors, logo, and hero image here.
 */

export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  subTagline: string;
  institutionLocation: string;
  examsTargeted: string[];
  heroSentence: string;
  logoPath: string;
  heroImagePath: string;
  colors: {
    primaryMaroon: string;
    secondaryInk: string;
    accentGold: string;
    bgCream: string;
    cardCream: string;
    borderMuted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  disclaimerText: string;
  contactSupportText: string;
}

export const BRAND: BrandConfig = {
  name: "Vallath Education",
  shortName: "Vallath AI Studio",
  tagline: "Premier English Literature Coaching & Research Mentorship",
  subTagline: "Trivandrum, Kerala • UGC NET / JRF • Kerala SET • GATE • CUET-PG",
  institutionLocation: "Trivandrum, Kerala, India",
  examsTargeted: ["UGC NET / JRF", "Kerala SET", "GATE English", "CUET-PG", "Kerala PSC"],
  heroSentence: "Four tools that give every student a mentor at midnight and give your team their time back.",
  logoPath: "/brand/logo.svg",
  heroImagePath: "/brand/hero.svg", // SVG fallback or /brand/hero.jpg
  colors: {
    primaryMaroon: "#6B1724", // Deep rich burgundy/maroon
    secondaryInk: "#1A2B4C",   // Deep scholarly ink blue
    accentGold: "#C29B38",     // Antique parchment gold
    bgCream: "#FAF6F0",        // Soft archival warm cream
    cardCream: "#FFFFFF",
    borderMuted: "#EADBCC",
  },
  fonts: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'Inter', sans-serif",
  },
  disclaimerText: "Concept demo prepared for Vallath Education, not an official product. Sample data only.",
  contactSupportText: "Academic Faculty & Operations Support Desk, Vallath Education",
};
