// Pulls the World-English example text out of a spec markdown file, so the scanner only ever
// looks at text that is *supposed* to be valid World English — never the Standard-English
// columns (which legitimately hold abolished forms) or the pronunciation respelling tables.

export interface Span {
  file: string;
  /** 1-based line number the text sits on. */
  line: number;
  /** The World-English text to scan (markdown emphasis and cell separators stripped). */
  text: string;
  /** Where it came from, for diagnostics. */
  source: "table" | "sample";
}

const WOE_HEADER = /world english/i;
/** "World English rule" summary columns hold prose rule descriptions, not forms — skip. */
const RULE_HEADER = /\brule\b/i;

/** Split a markdown table row into trimmed cell strings. */
function splitRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((c) => c.trim());
}

function isDelimiterRow(line: string): boolean {
  return /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(line) && line.includes("-");
}

function isTableRow(line: string): boolean {
  return line.trim().startsWith("|") || line.includes("|");
}

/** Strip markdown emphasis/backticks so cell content tokenizes cleanly. */
function cleanCell(cell: string): string {
  return cell.replace(/[*`_]/g, " ");
}

/**
 * Remove parenthetical editorial annotations from a World-English *table cell*. In the specs,
 * the World-English form is the non-parenthetical part of the cell; parentheses hold English
 * meta-commentary — "(definite, singular)", "(kept — no swap needed)", markdown link anchors
 * like "(#rule-g5-all-nouns-are-countable)" — which is ordinary English and would otherwise
 * false-positive on abolished forms it legitimately contains. Iterates to clear nesting.
 * NOT applied to sample blockquotes, which are full translations with no such annotations.
 */
function stripAnnotations(cell: string): string {
  let prev: string;
  let s = cell;
  do {
    prev = s;
    s = s.replace(/\([^()]*\)/g, " ");
  } while (s !== prev);
  return s;
}

export function extractWoeSpans(file: string, content: string): Span[] {
  const lines = content.split("\n");
  const spans: Span[] = [];

  extractTables(file, lines, spans);
  extractSamplePassages(file, lines, spans);

  return spans;
}

function extractTables(file: string, lines: string[], spans: Span[]): void {
  for (let i = 0; i < lines.length - 1; i++) {
    const header = lines[i]!;
    const delim = lines[i + 1]!;
    if (!isTableRow(header) || !isDelimiterRow(delim)) continue;

    const headerCells = splitRow(header);
    // Index of the World-English form column, if any (and not a "rule" summary column).
    const woeCol = headerCells.findIndex(
      (h) => WOE_HEADER.test(h) && !RULE_HEADER.test(h),
    );
    if (woeCol === -1) {
      // Not a mapping table we scan; skip to the end of this table block.
      i = endOfTable(lines, i);
      continue;
    }

    // Scan every data row's World-English cell.
    for (let r = i + 2; r < lines.length; r++) {
      const row = lines[r]!;
      if (!isTableRow(row) || row.trim() === "") break;
      const cells = splitRow(row);
      const cell = cells[woeCol];
      if (cell) {
        spans.push({ file, line: r + 1, text: cleanCell(stripAnnotations(cell)), source: "table" });
      }
    }
    i = endOfTable(lines, i);
  }
}

function endOfTable(lines: string[], headerIdx: number): number {
  let r = headerIdx + 2;
  while (r < lines.length && isTableRow(lines[r]!) && lines[r]!.trim() !== "") r++;
  return r - 1;
}

/** samples.md: a `**World English**` heading followed by a `>` blockquote is the translation. */
function extractSamplePassages(file: string, lines: string[], spans: Span[]): void {
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*\*\*world english\*\*\s*$/i.test(lines[i]!)) continue;
    let started = false;
    for (let r = i + 1; r < lines.length; r++) {
      const line = lines[r]!;
      const isQuote = line.trimStart().startsWith(">");
      if (line.trim() === "") {
        if (started) break; // blank line after the quote → passage done
        continue; // blank line between heading and quote → keep looking
      }
      if (!isQuote) break; // non-blank, non-quote → quote block never started or ended
      started = true;
      const text = line.replace(/^\s*>\s?/, "");
      spans.push({ file, line: r + 1, text: cleanCell(text), source: "sample" });
    }
  }
}
