// Spoken audio for the pronunciation tool (docs/to-do.md item 13; rules P1–P7 in
// docs/pronunciation.md), driving the external `espeak-ng` synthesizer.
//
// The whole project's philosophy is that the respelling/IPA *is* the pronunciation — nothing is
// guessed. So the audio must speak *our* phonemes, not let espeak-ng re-guess English (World
// English regularizes pronunciation, so espeak's own reading would contradict the respelling the
// learner sees). espeak-ng does not parse IPA symbols, but it does speak its own ASCII phoneme
// mnemonics inside `[[...]]`. So this file mirrors src/respell.ts's respellingToIpa(): the same
// syllable/grapheme tokenizer, but emitting espeak's phonemes instead of IPA, with `'` before the
// stressed syllable. We drive the rhotic **en-us** voice, because our IPA is General American
// (ɑ, ɝ/ɚ, ɑr …) — the map below was validated segment-by-segment against `espeak-ng -v en-us
// --ipa` readback of the pronunciation.md gold sentence.
//
// Unknown words (no lexicon respelling) are the audio analog of the renderer's "emit verbatim and
// flag": they pass through as plain text for espeak to read itself, and reuse the same not-found
// flag, so the sentence still flows but nothing is silently invented.

import { splitSyllables, findStress, tokenizeSyllable, GRAPHEME_TO_IPA } from "./respell.ts";
import { defaultLexicon, type Lexicon } from "./lexicon.ts";
import { WORD, lineOf, type PronFlag } from "./pronounce.ts";

/** The rhotic General-American voice whose phoneme set the map below targets. */
export const ESPEAK_VOICE = "en-us";

/**
 * P2/P3 grapheme → espeak-ng (en-us) phoneme mnemonic, the audio twin of respell.ts's
 * GRAPHEME_TO_IPA. Consonants share their letters with espeak; the divergences are the vowels and
 * the r-colored vowels, taken from espeak's own -x readback of the matching NURSE/START/… word
 * (e.g. `doctor` → d'0kt3, `car` → k'A@, `here` → h'i@3). `er` and `y` stay context-sensitive and
 * are resolved in graphemeToEspeak, exactly as respell.ts resolves them for IPA.
 */
export const GRAPHEME_TO_ESPEAK: ReadonlyMap<string, string> = new Map([
  // Consonants (P2) — mnemonic == IPA letter except the digraphs below.
  ["b", "b"], ["d", "d"], ["f", "f"], ["g", "g"], ["h", "h"], ["j", "dZ"], ["k", "k"],
  ["l", "l"], ["m", "m"], ["n", "n"], ["p", "p"], ["r", "r"], ["s", "s"], ["t", "t"],
  ["v", "v"], ["w", "w"], ["z", "z"],
  ["ch", "tS"], ["sh", "S"], ["zh", "Z"], ["th", "T"], ["dh", "D"], ["ng", "N"],
  // Simple vowels (P2). `0` is espeak's LOT vowel (doctor → d'0kt3), the rhotic-voice ɑ.
  ["a", "a"], ["e", "E"], ["i", "I"], ["o", "0"], ["u", "V"], ["uu", "U"],
  ["ee", "i:"], ["ay", "eI"], ["oh", "oU"], ["oo", "u:"], ["aw", "O:"], ["ow", "aU"],
  ["oy", "OI"], ["uh", "@"],
  // R-colored vowels (P2), from espeak's readback of the START/NORTH/NEAR/SQUARE/CURE words.
  ["ar", "A@"], ["or", "O@"], ["eer", "i@3"], ["air", "e@"], ["oor", "U@"],
]);

/** Vowel graphemes — decide the `y` glide/vowel split (P2). Mirrors respell.ts's VOWEL_GRAPHEMES. */
const VOWEL_GRAPHEMES = new Set([
  "a", "e", "i", "o", "u", "uu", "ee", "ay", "oh", "oo", "aw", "ow", "oy", "uh",
  "er", "ar", "or", "eer", "air", "oor",
]);

/** Map one grapheme to its espeak phoneme, resolving `er` (NURSE `3`) and `y` (glide vs. PRICE). */
function graphemeToEspeak(grapheme: string, next: string | undefined): string {
  if (grapheme === "er") return "3"; // espeak's r-colored NURSE vowel (bird → b'3d); stress via `'`
  if (grapheme === "y") return next !== undefined && VOWEL_GRAPHEMES.has(next) ? "j" : "aI";
  const ph = GRAPHEME_TO_ESPEAK.get(grapheme);
  if (ph === undefined) throw new Error(`no espeak phoneme for grapheme "${grapheme}"`);
  return ph;
}

/**
 * Render one respelling to an espeak `[[...]]` phoneme body (no brackets). Mirrors respellingToIpa:
 * the same tokenizer, but espeak's `'` marks the stressed syllable *before* its body (espeak's
 * convention), and syllables are joined so espeak reads one word. A lone syllable carries no mark.
 */
export function respellingToEspeak(respelling: string): string {
  const syllables = splitSyllables(respelling);
  const stressIndex = findStress(syllables);
  const marked = syllables.length >= 2;

  return syllables
    .map((syllable, s) => {
      const graphemes = tokenizeSyllable(syllable);
      const body = graphemes
        .map((g, gi) => graphemeToEspeak(g, graphemes[gi + 1]))
        .join("");
      return marked && s === stressIndex ? "'" + body : body;
    })
    .join("");
}

export interface EspeakInput {
  /** The text to hand espeak-ng: `[[phonemes]]` for known words, raw text for unknown ones. */
  text: string;
  /** Not-found / homograph flags, identical to what the renderer reports for the same input. */
  flags: PronFlag[];
}

/**
 * Turn World English text into espeak-ng input. Walks words exactly as pronounce() does — known
 * words become `[[phonemes]]` from their respelling (first entry for a homograph, flagged), unknown
 * words pass through verbatim for espeak to read and are flagged not-found. Gaps between words
 * (spaces, punctuation) are copied through so prosody and sentence boundaries survive.
 */
export function textToEspeak(text: string, opts: { lexicon?: Lexicon; file?: string } = {}): EspeakInput {
  const lexicon = opts.lexicon ?? defaultLexicon;
  const file = opts.file ?? "<stdin>";
  const flags: PronFlag[] = [];

  let out = "";
  let last = 0;
  for (const m of text.matchAll(WORD)) {
    const word = m[0];
    const start = m.index;
    out += text.slice(last, start);

    const entries = lexicon.entries.get(word.toLowerCase());
    if (!entries || entries.length === 0) {
      out += word; // no respelling — let espeak read it, and flag exactly as the renderer does
      flags.push({ file, line: lineOf(text, start), word, kind: "not-found", detail: "no respelling entry" });
    } else {
      const chosen = entries[0]!;
      out += `[[${respellingToEspeak(chosen.respelling)}]]`;
      if (entries.length > 1) {
        const detail = entries
          .map((e) => `${e.respelling}${e.note ? ` (${e.note})` : ""}`)
          .join(" | ");
        flags.push({ file, line: lineOf(text, start), word, kind: "homograph", detail });
      }
    }
    last = start + word.length;
  }
  return { text: out + text.slice(last), flags };
}

/** True iff `espeak-ng` is on PATH and runnable — used to give a helpful hint when it is not. */
export async function espeakAvailable(): Promise<boolean> {
  try {
    const proc = Bun.spawn(["espeak-ng", "--version"], { stdout: "ignore", stderr: "ignore" });
    return (await proc.exited) === 0;
  } catch {
    return false; // ENOENT — not installed
  }
}

export interface SynthesizeOptions {
  lexicon?: Lexicon;
  file?: string;
  /** espeak-ng voice; defaults to the rhotic en-us the phoneme map targets. */
  voice?: string;
  /** Output WAV path. */
  out: string;
}

/**
 * Synthesize World English `text` to a WAV file at `opts.out` using espeak-ng, and return the same
 * flags the renderer would. Throws if espeak-ng is unavailable (callers check espeakAvailable first
 * to print an install hint) or exits non-zero.
 */
export async function synthesizeToWav(text: string, opts: SynthesizeOptions): Promise<{ flags: PronFlag[] }> {
  const { text: input, flags } = textToEspeak(text, { lexicon: opts.lexicon, file: opts.file });
  const voice = opts.voice ?? ESPEAK_VOICE;

  const proc = Bun.spawn(["espeak-ng", "-v", voice, "--stdin", "-w", opts.out], {
    stdin: new Blob([input]),
    stdout: "ignore",
    stderr: "pipe",
  });
  const [stderr, exitCode] = await Promise.all([new Response(proc.stderr).text(), proc.exited]);
  if (exitCode !== 0) {
    throw new Error(`espeak-ng exited ${exitCode}${stderr ? `: ${stderr.trim()}` : ""}`);
  }
  return { flags };
}

// Keep the audio phoneme map honest against the IPA engine: every grapheme respell.ts can turn into
// IPA must also have an espeak phoneme, or a lexicon word would render silently wrong in audio.
// (The two `er`/`y` context rules are handled in-engine and intentionally excluded here.)
for (const grapheme of GRAPHEME_TO_IPA.keys()) {
  if (grapheme === "er") continue;
  if (!GRAPHEME_TO_ESPEAK.has(grapheme)) {
    throw new Error(`espeak phoneme map is missing grapheme "${grapheme}" (present in the IPA map)`);
  }
}
