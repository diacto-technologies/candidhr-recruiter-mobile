import type { AssessmentJudgeLanguage } from '../../../../features/assessments/types'
import type { CreateProblemQuestionPayload } from '../../../../features/assessments/types'
import { CODING_PROBLEM_DIFFICULTY_IDS } from '../../../../features/assessments/constants'

export type CodingExample = {
    id: string
    input: string
    output: string
    exploration: string
}

export type CodingTestCase = {
    id: string
    input: string
    expectedOutput: string
}

export type CodingProblemFormState = {
    instructions: string
    localId: string
    serverQuestionId: string | null
    title: string
    difficulty: string | null
    points: number
    timeMinutes: number
    problemStatementHtml: string
    constraints: string
    examples: CodingExample[]
    testCases: CodingTestCase[]
    languages: string[]
    starterLanguage: string
    starterCodeByLang: Record<string, string>
    referenceSolutionByLang: Record<string, string>
}

export const DEFAULT_DIFFICULTY = 'easy'
export const DEFAULT_POINTS = 10
export const DEFAULT_TIME_MIN = 30

export function getDefaultStarterTemplate(langValue: string, displayLabel: string): string {
    const v = String(langValue ?? '').toLowerCase()
    const label = displayLabel || langValue
    if (/python/.test(v)) {
        return `def main():
    s = input()
# TODO: implement logic
`
    }
    if (/javascript|node/.test(v) || /javascript|node/i.test(label)) {
        return `// Starter code for ${label}...
// This will be shown to candidates as a starting point
`
    }
    return `// Starter code for ${label}...
// This will be shown to candidates as a starting point
`
}

export const FALLBACK_LANGUAGE_OPTIONS: { label: string; value: string }[] = [
    { label: 'Python (3.14.0)', value: 'python (3.14.0)' },
]

export const POPULAR_LABELS = ['Python', 'JavaScript', 'Java', 'C++', 'C', 'C#', 'Go', 'Rust', 'Ruby'] as const

export type PopularLabel = (typeof POPULAR_LABELS)[number]

/** Maps a catalog row to one of the Popular chip families, or null if it is not one of those families. */
export function popularLabelForJudgeLanguage(item: AssessmentJudgeLanguage): PopularLabel | null {
    const dn = item.display_name
    if (/^python/i.test(dn)) return 'Python'
    if (/javascript/i.test(dn)) return 'JavaScript'
    if (/^java\s/i.test(dn) && !/javascript/i.test(dn)) return 'Java'
    if (/c\+\+/i.test(dn)) return 'C++'
    if (/^c\s*\(/i.test(dn) && !/\+\+/i.test(dn)) return 'C'
    if (/c#/i.test(dn)) return 'C#'
    if (/^go\s/i.test(dn)) return 'Go'
    if (/^rust/i.test(dn)) return 'Rust'
    if (/^ruby/i.test(dn)) return 'Ruby'
    return null
}

/**
 * Applies Popular chip multi-select: keeps non–popular-family languages as-is; for each selected
 * chip adds exactly one catalog `name`, preferring a version already present in `prevLanguages`.
 */
export function mergeLanguagesFromPopularChipSelection(
    prevLanguages: string[],
    selectedChipLabels: string[],
    items: AssessmentJudgeLanguage[],
    languageOptions: { label: string; value: string }[],
): string[] {
    const selectedSet = new Set(selectedChipLabels.map(String))

    const keepNonPopularFamily = (name: string): boolean => {
        if (!items.length) return true
        const row = items.find((i) => i.name === name)
        if (!row) return true
        return popularLabelForJudgeLanguage(row) === null
    }

    const fromObscure = prevLanguages.filter(keepNonPopularFamily)

    const popularResolved: string[] = []
    for (const label of POPULAR_LABELS) {
        if (!selectedSet.has(label)) continue
        const existing = prevLanguages.find((v) => {
            const row = items.find((i) => i.name === v)
            return row ? popularLabelForJudgeLanguage(row) === label : false
        })
        const name = existing ?? popularNameForLabel(label, items)
        if (name) popularResolved.push(name)
    }

    const merged = [...new Set([...fromObscure, ...popularResolved])]
    return normalizeLanguagesToOptions(merged, languageOptions)
}

export function normalizeLanguagesToOptions(
    names: string[],
    options: { label: string; value: string }[],
): string[] {
    const out: string[] = []
    const seen = new Set<string>()
    for (const n of names) {
        const raw = String(n ?? '').trim()
        if (!raw) continue
        const canon =
            resolveLangToken(raw, options) ||
            options.find((o) => o.value === raw)?.value ||
            options.find((o) => o.label === raw)?.value
        if (canon && !seen.has(canon)) {
            seen.add(canon)
            out.push(canon)
        }
    }
    return out
}

function isLegacyPython2(row: AssessmentJudgeLanguage): boolean {
    const blob = `${row.display_name} ${row.name} ${row.version ?? ''}`.toLowerCase()
    if (/\bpython\s*2\b/.test(blob)) return true
    if (/\bpython\s*\(\s*2\./.test(blob)) return true
    if (/\bpython\s*\(2\./.test(blob)) return true
    if (/\b2\.7[\d.]*/.test(blob) && /python/.test(blob)) return true
    return false
}

/** Parse leading numeric version from API `version` or from parentheses in labels like "Python (3.14.0)". */
function semverTupleFromJudgeLanguage(row: AssessmentJudgeLanguage): [number, number, number] | null {
    const tryParse = (s: string | null | undefined): [number, number, number] | null => {
        if (!s) return null
        const m = String(s).trim().match(/(\d+)(?:\.(\d+)(?:\.(\d+))?)?/)
        if (!m) return null
        return [parseInt(m[1], 10) || 0, parseInt(m[2] ?? '0', 10) || 0, parseInt(m[3] ?? '0', 10) || 0]
    }
    if (row.version != null && String(row.version).trim()) {
        const fromField = tryParse(row.version)
        if (fromField) return fromField
    }
    const paren = row.display_name.match(/\(([^)]+)\)\s*$/)
    if (paren) {
        const inner = paren[1]
        const innerMatch = inner.match(/(\d+)(?:\.(\d+)(?:\.(\d+))?)?/)
        if (innerMatch) {
            return [
                parseInt(innerMatch[1], 10) || 0,
                parseInt(innerMatch[2] ?? '0', 10) || 0,
                parseInt(innerMatch[3] ?? '0', 10) || 0,
            ]
        }
    }
    return tryParse(row.display_name) ?? tryParse(row.name)
}

function versionSortKey(row: AssessmentJudgeLanguage): number {
    const t = semverTupleFromJudgeLanguage(row)
    if (!t) return 0
    const [a, b, c] = t
    return a * 1_000_000 + b * 1_000 + c
}

function pickNewestJudgeLanguage(rows: AssessmentJudgeLanguage[]): AssessmentJudgeLanguage | null {
    if (!rows.length) return null
    return [...rows].sort((a, b) => versionSortKey(b) - versionSortKey(a))[0] ?? null
}

export function resolveLangToken(
    token: string,
    options: { label: string; value: string }[],
): string | null {
    const t = String(token ?? '').trim()
    if (!t) return null
    const byValue = options.find((o) => o.value === t)
    if (byValue) return byValue.value
    const byLabel = options.find((o) => o.label === t)
    if (byLabel) return byLabel.value
    const fold = (s: string) => s.toLowerCase().replace(/\s+/g, ' ')
    const tf = fold(t)
    const loose = options.find((o) => fold(o.label) === tf || fold(o.value) === tf)
    return loose?.value ?? null
}

/**
 * Default catalog `name` for a Popular chip. Uses all matching rows and picks the newest
 * sensible version (not the first row in API order, which is often oldest).
 */
export function popularNameForLabel(label: string, items: AssessmentJudgeLanguage[]): string | null {
    if (!items.length) return null
    const dn = (x: AssessmentJudgeLanguage) => x.display_name
    let candidates: AssessmentJudgeLanguage[] = []
    switch (label) {
        case 'Python':
            candidates = items.filter((x) => /^python/i.test(dn(x)))
            break
        case 'JavaScript':
            candidates = items.filter((x) => /javascript/i.test(dn(x)))
            break
        case 'Java':
            candidates = items.filter((x) => /^java\s/i.test(dn(x)) && !/javascript/i.test(dn(x)))
            break
        case 'C++':
            candidates = items.filter((x) => /c\+\+/i.test(dn(x)))
            break
        case 'C':
            candidates = items.filter((x) => /^c\s*\(/i.test(dn(x)) && !/\+\+/i.test(dn(x)))
            break
        case 'C#':
            candidates = items.filter((x) => /c#/i.test(dn(x)))
            break
        case 'Go':
            candidates = items.filter((x) => /^go\s/i.test(dn(x)))
            break
        case 'Rust':
            candidates = items.filter((x) => /^rust/i.test(dn(x)))
            break
        case 'Ruby':
            candidates = items.filter((x) => /^ruby/i.test(dn(x)))
            break
        default:
            return null
    }
    if (!candidates.length) return null
    if (label === 'Python') {
        const withoutPy2 = candidates.filter((x) => !isLegacyPython2(x))
        if (withoutPy2.length) candidates = withoutPy2
    }
    if (label === 'C') {
        const gccOnly = candidates.filter((x) => /\bgcc\b/i.test(`${x.display_name} ${x.name}`))
        if (gccOnly.length) candidates = gccOnly
    }
    return pickNewestJudgeLanguage(candidates)?.name ?? null
}

export function pruneLangRecord<T extends Record<string, string>>(rec: T, allowed: Set<string>): T {
    const next = { ...rec }
    for (const k of Object.keys(next)) {
        if (!allowed.has(k)) delete (next as any)[k]
    }
    return next
}

export function hasRichTextContent(html: string): boolean {
    const text = (html ?? '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;|&#160;/gi, ' ')
        .replace(/&#[0-9]+;/g, ' ')
        .replace(/&[a-z]+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    return text.length > 0
}

export function htmlToPlainText(html: string): string {
    return (html ?? '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;|&#160;/gi, ' ')
        .replace(/&#[0-9]+;/g, ' ')
        .replace(/&[a-z]+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function escapeHtmlPlain(s: string): string {
    return String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}

export function plainProblemDescriptionToHtml(text: string): string {
    const trimmed = String(text ?? '').trim()
    if (!trimmed) return ''
    const blocks = trimmed.split(/\n{2,}/)
    return blocks
        .map((block) => {
            const withBreaks = escapeHtmlPlain(block).replace(/\n/g, '<br/>')
            return `<p>${withBreaks}</p>`
        })
        .join('')
}

export function formatMetadataExampleInput(input: unknown): string {
    if (Array.isArray(input)) return input.map((x) => String(x ?? '')).join('\n')
    return String(input ?? '')
}

export function labelForLangValue(value: string, options: { label: string; value: string }[]): string {
    const row = options.find((o) => o.value === value)
    return row?.label ?? value
}

function codingDifficultyIdFromLevel(difficulty: string | null): number {
    const k = String(difficulty ?? DEFAULT_DIFFICULTY).toLowerCase()
    return CODING_PROBLEM_DIFFICULTY_IDS[k] ?? CODING_PROBLEM_DIFFICULTY_IDS.medium
}

export function buildCodingProblemQuestionPayload(
    draft: CodingProblemFormState,
    testId: string,
    languageOptions: { label: string; value: string }[],
): CreateProblemQuestionPayload {
    const examples = draft.examples.map((e) => ({
        input: e.input,
        output: e.output,
        ...(String(e.exploration ?? '').trim() ? { explanation: e.exploration } : {}),
    }))
    const test_cases = draft.testCases.map((t) => ({
        input: t.input,
        output: t.expectedOutput,
    }))
    const code_snippets: { language: string; code: string }[] = []
    for (const lang of draft.languages) {
        const label = labelForLangValue(lang, languageOptions)
        const hasStored = Object.prototype.hasOwnProperty.call(draft.starterCodeByLang, lang)
        const code = hasStored
            ? draft.starterCodeByLang[lang]
            : getDefaultStarterTemplate(lang, label)
        code_snippets.push({ language: label, code: String(code ?? '') })
    }
    const reference_solutions: Record<string, string> = {}
    for (const lang of draft.languages) {
        const ref = draft.referenceSolutionByLang[lang]?.trim()
        if (ref) {
            reference_solutions[labelForLangValue(lang, languageOptions)] = ref
        }
    }
    return {
        test_id: testId,
        title: draft.title.trim(),
        description: draft.problemStatementHtml,
        constraints: draft.constraints ?? '',
        difficulty_id: codingDifficultyIdFromLevel(draft.difficulty),
        points: Math.max(1, draft.points),
        time_limit: Math.max(1, draft.timeMinutes),
        examples,
        test_cases,
        code_snippets,
        reference_solutions,
        editorial: null,
        hints: null,
    }
}
