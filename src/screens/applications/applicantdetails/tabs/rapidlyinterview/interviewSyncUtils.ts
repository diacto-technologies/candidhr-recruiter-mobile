import {
  RapidlyInterviewReportResponse,
  RapidlyInterviewTimelineItem,
  RapidlyInterviewTurn,
  RapidlyInterviewQuestion,
  RapidlyInterviewTimelineWord,
} from '../../../../../features/rapidhire/types';
import type { RapidlyInterviewItem } from './components/RapidlyInterviewCard';

export interface ConversationExchange {
  index: number;
  aiText: string;
  aiStartMs?: number;
  aiEndMs?: number;
  candidateTurns: Array<{
    text: string;
    startMs?: number;
    endMs?: number;
    words?: RapidlyInterviewTimelineWord[];
  }>;
  candidateText: string;
  candidateStartMs?: number;
  candidateEndMs?: number;
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'with', 'by',
  'about', 'against', 'between', 'into', 'through', 'during', 'before',
  'after', 'above', 'below', 'from', 'up', 'down', 'out', 'off',
  'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just',
  'should', 'now', 'you', 'your', 'we', 'our', 'i', 'me', 'my',
  'please', 'tell', 'us', 'could', 'would',
]);

/**
 * Normalizes text for string comparisons: lowercase, strip punctuation, single whitespace.
 */
export const normalizeText = (text?: string | null): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Extracts non-stop words for semantic overlap matching.
 */
export const getSignificantWords = (text: string): string[] => {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  const words = normalized.split(' ').filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return words.length > 0 ? words : normalized.split(' ').filter((w) => w.length > 1);
};

/**
 * Calculates match score between question text and AI prompt text.
 * Returns a score between 0.0 and 1.0.
 */
export const calculateQuestionMatchScore = (questionText: string, aiText: string): number => {
  const normQ = normalizeText(questionText);
  const normAI = normalizeText(aiText);

  if (!normQ || !normAI) return 0;
  if (normAI.includes(normQ) || normQ.includes(normAI)) return 1.0;

  const qWords = getSignificantWords(questionText);
  if (!qWords.length) return 0;

  const aiWordsSet = new Set(getSignificantWords(aiText));
  let matchCount = 0;
  for (const word of qWords) {
    if (aiWordsSet.has(word)) {
      matchCount++;
    }
  }

  return matchCount / qWords.length;
};

const GREETING_PATTERNS = [
  /\b(ready to begin|can you hear|welcome to|start the interview|are you ready|shall we start|hello there)\b/i,
];

const CLOSING_PATTERNS = [
  /\b(concludes (our|the) interview|thank you for your time|wrap up|completed the interview|have a great day|goodbye|that is all for today|that's all for today)\b/i,
];

/**
 * Checks if an exchange is an introductory readiness check / greeting.
 */
export const isIntroExchange = (aiText: string, candidateText: string): boolean => {
  const normCandidate = normalizeText(candidateText);
  const isShortConfirmation =
    normCandidate.length > 0 &&
    normCandidate.length < 25 &&
    /^(yes|yeah|yep|sure|i am|i'm ready|ready|hello|hi|good|can hear you|loud and clear)/i.test(normCandidate);

  const hasGreetingPrompt = GREETING_PATTERNS.some((p) => p.test(aiText));
  return hasGreetingPrompt || (isShortConfirmation && /\b(ready|hear|welcome)\b/i.test(aiText));
};

/**
 * Checks if an exchange is a closing remark with no substantive interview question.
 */
export const isClosingExchange = (aiText: string): boolean => {
  return CLOSING_PATTERNS.some((p) => p.test(aiText));
};

/**
 * Normalizes a word timestamp into absolute video seconds.
 */
export const normalizeWordTimestamp = (rawVal: number, baseMs: number): number => {
  if (rawVal == null || isNaN(rawVal)) return 0;
  if (rawVal >= 100) {
    if (baseMs > 0 && rawVal < baseMs) {
      return Math.max(0, (baseMs + rawVal) / 1000);
    }
    return Math.max(0, rawVal / 1000);
  }
  if (baseMs > 0 && rawVal < baseMs / 1000) {
    return Math.max(0, baseMs / 1000 + rawVal);
  }
  return Math.max(0, rawVal);
};

/**
 * Groups chronological timeline/turn items into distinct dialogue exchanges.
 * An exchange begins with one or more AI utterances (the question/prompt),
 * followed by all candidate utterances (the response) before the next AI utterance.
 */
export const extractExchanges = (
  timeline?: RapidlyInterviewTimelineItem[],
  turns?: RapidlyInterviewTurn[],
  rawQuestions?: RapidlyInterviewQuestion[]
): ConversationExchange[] => {
  const items: RapidlyInterviewTimelineItem[] =
    timeline && timeline.length > 0
      ? timeline
      : (turns ?? []).map((t) => ({
          role: t.role,
          text: t.text,
          startMs: 0,
          endMs: 0,
        }));

  if (!items.length) return [];

  const exchanges: ConversationExchange[] = [];
  let currentAiTexts: string[] = [];
  let currentAiStartMs: number | undefined;
  let currentAiEndMs: number | undefined;
  let currentCandidateTurns: ConversationExchange['candidateTurns'] = [];

  const flushExchange = () => {
    if (currentAiTexts.length > 0 || currentCandidateTurns.length > 0) {
      const candStartMs = currentCandidateTurns.find(
        (t) => t.startMs !== undefined && t.startMs > 0
      )?.startMs;
      const candEndMs = currentCandidateTurns
        .slice()
        .reverse()
        .find((t) => t.endMs !== undefined && t.endMs > 0)?.endMs;

      exchanges.push({
        index: exchanges.length,
        aiText: currentAiTexts.join(' ').trim(),
        aiStartMs: currentAiStartMs,
        aiEndMs: currentAiEndMs,
        candidateTurns: currentCandidateTurns,
        candidateText: currentCandidateTurns
          .map((t) => t.text?.trim())
          .filter(Boolean)
          .join(' '),
        candidateStartMs: candStartMs,
        candidateEndMs: candEndMs,
      });

      currentAiTexts = [];
      currentAiStartMs = undefined;
      currentAiEndMs = undefined;
      currentCandidateTurns = [];
    }
  };

  for (const item of items) {
    const role = item.role || 'candidate';
    if (role === 'ai') {
      const hasPreviousAi = currentAiTexts.length > 0;
      const hasCandidateTurns = currentCandidateTurns.length > 0;

      let shouldFlush = hasCandidateTurns;

      if (!shouldFlush && hasPreviousAi) {
        const timeGap =
          currentAiEndMs !== undefined && item.startMs !== undefined && item.startMs > 0
            ? item.startMs - currentAiEndMs
            : 0;

        const matchesPredefinedQuestion =
          rawQuestions &&
          rawQuestions.some((q) => calculateQuestionMatchScore(q.text, item.text) >= 0.25);

        if (timeGap >= 2000 || matchesPredefinedQuestion) {
          shouldFlush = true;
        }
      }

      if (shouldFlush) {
        flushExchange();
      }

      currentAiTexts.push(item.text);
      if (currentAiStartMs === undefined && item.startMs !== undefined) {
        currentAiStartMs = item.startMs;
      }
      if (item.endMs !== undefined) {
        currentAiEndMs = item.endMs;
      }
    } else {
      currentCandidateTurns.push({
        text: item.text,
        startMs: item.startMs,
        endMs: item.endMs,
        words: item.words,
      });
    }
  }

  flushExchange();
  return exchanges;
};

/**
 * Builds synchronized question items with only the corresponding candidate responses.
 */
export const buildRapidlyInterviewItems = (
  reportData: RapidlyInterviewReportResponse | null | undefined
): RapidlyInterviewItem[] => {
  if (!reportData) return [];

  const allTimelineItems = reportData.timeline ?? [];
  const rawQuestions: RapidlyInterviewQuestion[] =
    reportData.report?.questions && reportData.report.questions.length > 0
      ? [...reportData.report.questions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      : [];

  const exchanges = extractExchanges(
    reportData.timeline,
    reportData.report?.turns,
    rawQuestions
  );

  const totalDur =
    reportData.duration_seconds ||
    reportData.report?.assessment?.delivery?.total_time_sec ||
    (allTimelineItems.length > 0
      ? Math.round(Math.max(...allTimelineItems.map((t) => t.endMs || t.startMs || 0)) / 1000)
      : 0);

  // Case 1: Predefined questions list exists
  if (rawQuestions.length > 0) {
    const questionItems: RapidlyInterviewItem[] = [];

    // Check if exchange 0 is an intro greeting check that is not Question 0
    let startExchangeIdx = 0;
    if (
      exchanges.length > rawQuestions.length &&
      exchanges[0] &&
      isIntroExchange(exchanges[0].aiText, exchanges[0].candidateText) &&
      calculateQuestionMatchScore(rawQuestions[0]?.text ?? '', exchanges[0].aiText) < 0.3
    ) {
      startExchangeIdx = 1;
    }

    // Match each question to the corresponding exchange(s) monotonically
    const questionExchangeMapping: number[] = [];
    let currentSearchIdx = startExchangeIdx;

    for (let qIdx = 0; qIdx < rawQuestions.length; qIdx++) {
      const q = rawQuestions[qIdx];
      let bestMatchIdx = -1;
      let highestScore = 0.2; // threshold for question matching

      for (let eIdx = currentSearchIdx; eIdx < exchanges.length; eIdx++) {
        const score = calculateQuestionMatchScore(q.text, exchanges[eIdx].aiText);
        if (score > highestScore) {
          highestScore = score;
          bestMatchIdx = eIdx;
        }
      }

      if (bestMatchIdx !== -1) {
        questionExchangeMapping.push(bestMatchIdx);
        currentSearchIdx = bestMatchIdx + 1;
      } else {
        // Sequential fallback if text match was ambiguous
        if (currentSearchIdx < exchanges.length) {
          questionExchangeMapping.push(currentSearchIdx);
          currentSearchIdx++;
        } else {
          questionExchangeMapping.push(-1);
        }
      }
    }

    for (let i = 0; i < rawQuestions.length; i++) {
      const q = rawQuestions[i];
      const matchedIdx = questionExchangeMapping[i];
      const nextMatchedIdx =
        i < rawQuestions.length - 1 ? questionExchangeMapping[i + 1] : exchanges.length;

      // Collect candidate turns from matched exchange only (or follow-up if within range)
      const candidateTurnsForQuestion: ConversationExchange['candidateTurns'] = [];
      let aiStartMs: number | undefined;

      if (matchedIdx !== -1 && matchedIdx < exchanges.length) {
        aiStartMs = exchanges[matchedIdx].aiStartMs;
        const endRange =
          nextMatchedIdx !== -1 && nextMatchedIdx > matchedIdx
            ? Math.min(nextMatchedIdx, exchanges.length)
            : matchedIdx + 1;

        for (let e = matchedIdx; e < endRange; e++) {
          if (exchanges[e]) {
            candidateTurnsForQuestion.push(...exchanges[e].candidateTurns);
          }
        }
      }

      const candText = candidateTurnsForQuestion
        .map((t) => t.text?.trim())
        .filter(Boolean)
        .join(' ');

      // Start time: prioritize AI question startMs, fallback to candidate startMs
      const firstCandTurn = candidateTurnsForQuestion.find((t) => t.startMs !== undefined && t.startMs > 0);
      let startTimeSec = 0;
      if (aiStartMs !== undefined && aiStartMs > 0) {
        startTimeSec = Math.floor(aiStartMs / 1000);
      } else if (firstCandTurn?.startMs !== undefined && firstCandTurn.startMs > 0) {
        startTimeSec = Math.floor(firstCandTurn.startMs / 1000);
      } else if (i > 0 && totalDur > 0) {
        startTimeSec = Math.round((i * totalDur) / rawQuestions.length);
      }

      // Ensure start times are strictly increasing
      if (i > 0 && questionItems[i - 1]) {
        const prevStart = questionItems[i - 1].startTime;
        if (startTimeSec <= prevStart) {
          startTimeSec = prevStart + 1;
        }
      }

      // End time: last candidate turn's endMs, or next question's startMs
      const lastCandTurn = candidateTurnsForQuestion
        .slice()
        .reverse()
        .find((t) => t.endMs !== undefined && t.endMs > 0);

      const nextExchange =
        nextMatchedIdx !== -1 && nextMatchedIdx < exchanges.length ? exchanges[nextMatchedIdx] : null;
      const nextAiStartSec =
        nextExchange?.aiStartMs !== undefined && nextExchange.aiStartMs > 0
          ? Math.floor(nextExchange.aiStartMs / 1000)
          : null;

      let endTimeSec = 0;
      if (lastCandTurn?.endMs !== undefined && lastCandTurn.endMs > 0) {
        endTimeSec = Math.ceil(lastCandTurn.endMs / 1000);
      } else if (nextAiStartSec !== null && nextAiStartSec > startTimeSec) {
        endTimeSec = nextAiStartSec;
      } else if (totalDur > 0) {
        const nextStart =
          i < rawQuestions.length - 1
            ? Math.round(((i + 1) * totalDur) / rawQuestions.length)
            : totalDur;
        endTimeSec = Math.max(startTimeSec + 1, nextStart);
      } else {
        endTimeSec = startTimeSec + 15;
      }

      const durationSec = Math.max(1, endTimeSec - startTimeSec);

      // Build transcription segments
      const segments: RapidlyInterviewItem['transcriptionSegments'] = [];
      if (candText) {
        for (const turn of candidateTurnsForQuestion) {
          const baseMs = turn.startMs || 0;
          const segStart = turn.startMs !== undefined && turn.startMs > 0 ? turn.startMs / 1000 : startTimeSec;
          const segEnd = turn.endMs !== undefined && turn.endMs > 0 ? turn.endMs / 1000 : segStart + 10;

          const words = turn.words?.map((w) => ({
            word: w.w,
            start: normalizeWordTimestamp(w.start, baseMs),
            end: normalizeWordTimestamp(w.end, baseMs),
          }));

          segments.push({
            text: turn.text,
            start: segStart,
            end: segEnd,
            words: words && words.length > 0 ? words : undefined,
          });
        }
      }

      questionItems.push({
        id: `rapidly-q-${i}-${startTimeSec}`,
        questionText: q.text,
        startedAt: reportData.updated_at,
        duration: durationSec,
        startTime: startTimeSec,
        endTime: endTimeSec,
        videoFile: reportData.recording_url,
        videoThumbnail: reportData.thumbnail_url,
        transcriptionText: candText || 'No spoken answer was transcribed for this question.',
        transcriptionSegments: segments,
      });
    }

    return questionItems;
  }

  // Case 2: No predefined questions in report, derive from substantive exchanges
  const substantiveExchanges = exchanges.filter((e, idx) => {
    // Filter out greeting if there are other exchanges
    if (idx === 0 && exchanges.length > 1 && isIntroExchange(e.aiText, e.candidateText)) {
      return false;
    }
    // Filter out closing statement if candidate didn't answer
    if (idx === exchanges.length - 1 && isClosingExchange(e.aiText) && !e.candidateText) {
      return false;
    }
    return Boolean(e.aiText || e.candidateText);
  });

  const targetExchanges = substantiveExchanges.length > 0 ? substantiveExchanges : exchanges;
  if (!targetExchanges.length) return [];

  return targetExchanges.map((exchange, i) => {
    const qText = exchange.aiText || (i === 0 ? 'Interview Question' : `Question ${i + 1}`);
    const candText = exchange.candidateText;

    let startTimeSec = 0;
    if (exchange.aiStartMs !== undefined && exchange.aiStartMs > 0) {
      startTimeSec = Math.floor(exchange.aiStartMs / 1000);
    } else if (exchange.candidateStartMs !== undefined && exchange.candidateStartMs > 0) {
      startTimeSec = Math.floor(exchange.candidateStartMs / 1000);
    } else if (i > 0 && totalDur > 0) {
      startTimeSec = Math.round((i * totalDur) / targetExchanges.length);
    }

    let endTimeSec = 0;
    if (exchange.candidateEndMs !== undefined && exchange.candidateEndMs > 0) {
      endTimeSec = Math.ceil(exchange.candidateEndMs / 1000);
    } else if (totalDur > 0) {
      const nextStart =
        i < targetExchanges.length - 1
          ? Math.round(((i + 1) * totalDur) / targetExchanges.length)
          : totalDur;
      endTimeSec = Math.max(startTimeSec + 1, nextStart);
    } else {
      endTimeSec = startTimeSec + 30;
    }

    const durationSec = Math.max(1, endTimeSec - startTimeSec);

    const segments: RapidlyInterviewItem['transcriptionSegments'] = [];
    for (const turn of exchange.candidateTurns) {
      const baseMs = turn.startMs || 0;
      const segStart = turn.startMs !== undefined && turn.startMs > 0 ? turn.startMs / 1000 : startTimeSec;
      const segEnd = turn.endMs !== undefined && turn.endMs > 0 ? turn.endMs / 1000 : segStart + 10;

      const words = turn.words?.map((w) => ({
        word: w.w,
        start: normalizeWordTimestamp(w.start, baseMs),
        end: normalizeWordTimestamp(w.end, baseMs),
      }));

      segments.push({
        text: turn.text,
        start: segStart,
        end: segEnd,
        words: words && words.length > 0 ? words : undefined,
      });
    }

    return {
      id: `rapidly-q-${i}-${startTimeSec}`,
      questionText: qText,
      startedAt: reportData.updated_at,
      duration: durationSec,
      startTime: startTimeSec,
      endTime: endTimeSec,
      videoFile: reportData.recording_url,
      videoThumbnail: reportData.thumbnail_url,
      transcriptionText: candText || 'No spoken answer was transcribed for this question.',
      transcriptionSegments:
        segments.length > 0
          ? segments
          : [
              {
                text: candText || 'No spoken answer was transcribed for this question.',
                start: startTimeSec,
                end: endTimeSec,
              },
            ],
    };
  });
};
