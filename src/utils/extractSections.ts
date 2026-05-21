/**
 * Generic JD HTML parser.
 *
 * The API returns `jd_html` with an outer `<div class="jd-content">` containing
 * `<h2>` headings followed by `<p>` paragraphs and/or `<ul><li>` lists.
 *
 * This parser extracts every section (heading + content) in order, regardless
 * of section name — so it works for any JD structure the backend generates.
 */

export interface ParsedSection {
  /** Section heading text, e.g. "Key Responsibilities" */
  title: string;
  /** Paragraph text blocks (from <p> tags between this <h2> and the next) */
  paragraphs: string[];
  /** Bullet items (from <li> tags between this <h2> and the next) */
  items: string[];
}

export interface ParsedJobSections {
  /** Intro paragraph(s) before the first <h2>, if any */
  overview: string;
  /** Each <h2>-delimited section */
  sections: ParsedSection[];
  // Legacy compat (kept so existing code doesn't break if referenced elsewhere)
  responsibilities: string[];
  skills: string[];
  about: string[];
}

/** Strip all HTML tags from a string */
const stripTags = (html: string): string =>
  html.replace(/<[^>]+>/g, "").trim();

/** Extract all <li> contents from a chunk of HTML */
const extractListItems = (html: string): string[] => {
  const matches: string[] = [];
  const liRegex = /<li[^>]*>(.*?)<\/li>/gi;
  let m: RegExpExecArray | null;
  while ((m = liRegex.exec(html)) !== null) {
    const text = stripTags(m[1]);
    if (text) matches.push(text);
  }
  return matches;
};

/** Extract all <p> contents from a chunk of HTML (excluding those inside <ul>) */
const extractParagraphs = (html: string): string[] => {
  // Remove <ul>…</ul> blocks first so we don't pick up stray <p> inside lists
  const withoutLists = html.replace(/<ul[^>]*>.*?<\/ul>/gi, "");
  const matches: string[] = [];
  const pRegex = /<p[^>]*>(.*?)<\/p>/gi;
  let m: RegExpExecArray | null;
  while ((m = pRegex.exec(withoutLists)) !== null) {
    const text = stripTags(m[1]);
    if (text) matches.push(text);
  }
  return matches;
};

export const extractSections = (html: string): ParsedJobSections => {
  const empty: ParsedJobSections = {
    overview: "",
    sections: [],
    responsibilities: [],
    skills: [],
    about: [],
  };
  if (!html) return empty;

  const clean = html.replace(/\n/g, "").replace(/\s+/g, " ").trim();

  // Split by <h2> tags. The part before the first <h2> is the overview.
  // Each subsequent chunk starts with the heading text followed by content.
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  const headings: { title: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = h2Regex.exec(clean)) !== null) {
    headings.push({ title: stripTags(m[1]), index: m.index });
  }

  // Everything before the first <h2> is the overview
  const overviewHtml = headings.length > 0 ? clean.slice(0, headings[0].index) : clean;
  const overview = stripTags(overviewHtml);

  // Build sections
  const sections: ParsedSection[] = headings.map((h, i) => {
    const start = h.index;
    const end = i < headings.length - 1 ? headings[i + 1].index : clean.length;
    const chunk = clean.slice(start, end);
    return {
      title: h.title,
      paragraphs: extractParagraphs(chunk),
      items: extractListItems(chunk),
    };
  });

  // Legacy compat: find common section names for backward compatibility
  const findSection = (keywords: string[]): ParsedSection | undefined =>
    sections.find((s) =>
      keywords.some((kw) => s.title.toLowerCase().includes(kw))
    );

  const respSection = findSection(["responsibilities"]);
  const skillSection = findSection(["skills", "qualifications"]);
  const aboutSection = findSection(["offer", "benefits", "environment"]);

  return {
    overview,
    sections,
    responsibilities: respSection?.items ?? [],
    skills: skillSection?.items ?? [],
    about: aboutSection?.items.length
      ? aboutSection.items
      : aboutSection?.paragraphs ?? [],
  };
};