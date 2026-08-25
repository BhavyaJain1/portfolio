import { experience } from "@/data/resume";

/**
 * Helpers for surfacing the measurable parts of the resume.
 *
 * Everything here is derived from existing bullet text — nothing is
 * fabricated, and no bullet is rewritten. We only *select* and *highlight*.
 */

/**
 * Matches figures worth emphasising: 300+, 1,000, 45, 200–250, 2 days, 8.0.
 * Built fresh per call — a shared /g regex carries `lastIndex` between calls.
 */
const numberPattern = () => /(\d[\d,.]*(?:\s*[–-]\s*\d[\d,.]*)?\+?)/g;

/** A bullet is "measurable" when it states a figure. */
export function isMeasurable(text: string) {
  return /\d/.test(text);
}

/**
 * Splits a bullet into plain strings and numeric tokens so the caller can
 * wrap the numbers in a highlight span. Returns tuples of [text, isNumber].
 */
export function tokenizeNumbers(text: string): Array<[string, boolean]> {
  const parts: Array<[string, boolean]> = [];
  const re = numberPattern();
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    const index = match.index;
    if (index > lastIndex) parts.push([text.slice(lastIndex, index), false]);
    parts.push([match[0], true]);
    lastIndex = index + match[0].length;
    // Guard against a zero-length match spinning the loop forever.
    if (match[0].length === 0) re.lastIndex++;
  }

  if (lastIndex < text.length) parts.push([text.slice(lastIndex), false]);
  return parts;
}

export type ImpactBullet = {
  text: string;
  company: string;
  project?: string;
};

/**
 * Auto-pulls every measurable bullet across all roles, for the
 * "Impact Highlights" panel. Ordered by how many figures the bullet contains,
 * so the densest results float to the top.
 */
export function collectImpactBullets(limit?: number): ImpactBullet[] {
  const out: ImpactBullet[] = [];

  for (const role of experience) {
    for (const bullet of role.bullets) {
      if (isMeasurable(bullet)) out.push({ text: bullet, company: role.company });
    }
    for (const project of role.projects) {
      for (const bullet of project.bullets) {
        if (isMeasurable(bullet)) {
          out.push({
            text: bullet,
            company: role.company,
            project: project.title,
          });
        }
      }
    }
  }

  const density = (s: string) => (s.match(/\d[\d,.]*/g) ?? []).length;
  out.sort((a, b) => density(b.text) - density(a.text));

  return typeof limit === "number" ? out.slice(0, limit) : out;
}
