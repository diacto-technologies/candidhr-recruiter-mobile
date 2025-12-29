export interface ParsedJobSections {
    overview: string;
    responsibilities: string[];
    skills: string[];
    about: string[];
  }
  
  export const extractSections = (html: string): ParsedJobSections => {
    if (!html) {
      return { overview: "", responsibilities: [], skills: [], about: [] };
    }
  
    const clean = html.replace(/\n/g, "").replace(/\s+/g, " ").trim();
  
    const extractList = (label: string): string[] => {
      const pattern = new RegExp(`${label}:?</strong></p>?\\s*<ul>(.*?)</ul>`, "i");
      const match = clean.match(pattern);
      if (!match) return [];
      return match[1]
        .split("</li>")
        .map((t) => t.replace("<li>", "").trim())
        .filter(Boolean);
    };
  
    /** ⭐ NEW: Extract paragraph instead of UL */
    const extractParagraph = (label: string): string[] => {
      const pattern = new RegExp(
        `<p><strong>${label}:?<\\/strong>(.*?)<\\/p>`,
        "i"
      );
  
      const match = clean.match(pattern);
      if (!match) return [];
  
      return [match[1].trim()]; // returns as array so UI works same
    };
  
    return {
      overview: clean.split("<p><strong>Key Responsibilities")[0] ?? "",
      responsibilities: extractList("Key Responsibilities"),
      skills: extractList("Required Skills"),
      about: extractParagraph("Work Environment"), // ✔ FIXED
    };
  };
  