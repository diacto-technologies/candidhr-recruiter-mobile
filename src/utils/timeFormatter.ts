/**
 * Format a duration for display. Input can be in minutes or seconds; pick `mode` for output shape.
 */
export type TimeFormatInputUnit = 'seconds' | 'minutes';
export type TimeFormatMode = 'min' | 'sec' | 'minSec' | 'hrMin' | 'full' | 'clock';

const INVALID = '—';

function totalSeconds(
  value: number,
  inputUnit: TimeFormatInputUnit
): number {
  return inputUnit === 'minutes' ? value * 60 : value;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/**
 * @param value - numeric duration; meaning depends on `inputUnit` (default: minutes)
 * @param options.inputUnit - whether `value` is total seconds or total minutes
 * @param options.mode
 *   - `min` — e.g. "10 min" (from minutes) or "5.5 min" (from 330 seconds)
 *   - `sec` — e.g. "90 sec"
 *   - `minSec` — e.g. "1 min 30 sec" (omits zero parts where sensible)
 *   - `hrMin` — e.g. "1 hr 5 min"
 *   - `full` — e.g. "1 hr 5 min 9 sec" (all non-zero parts with labels)
 *   - `clock` — e.g. "1:05:09" (H:MM:SS, hours omitted if 0: "5:09" for M:SS when under 1h — use 0:5:9? Usually HH:MM:SS with pad)
 */
export function formatCustomTime(
  value: number | null | undefined,
  options?: {
    inputUnit?: TimeFormatInputUnit;
    mode?: TimeFormatMode;
  }
): string {
  const inputUnit = options?.inputUnit ?? 'minutes';
  const mode = options?.mode ?? 'min';

  if (value == null || !Number.isFinite(value) || value < 0) {
    return INVALID;
  }

  const ts = totalSeconds(value, inputUnit);
  if (!Number.isFinite(ts) || ts < 0) {
    return INVALID;
  }
  const totalSec = Math.floor(ts + 1e-9);

  if (mode === 'min') {
    if (inputUnit === 'minutes') {
      const m = value;
      return `${formatNum(m)} min`;
    }
    const m = totalSec / 60;
    return `${formatNum(m)} min`;
  }

  if (mode === 'sec') {
    if (inputUnit === 'seconds') {
      return `${formatNumInt(totalSec)} sec`;
    }
    return `${formatNumInt(totalSec)} sec`;
  }

  if (mode === 'minSec') {
    if (totalSec < 60) {
      return `${totalSec} sec`;
    }
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    if (s === 0) {
      return `${m} min`;
    }
    return `${m} min ${s} sec`;
  }

  if (mode === 'hrMin') {
    return formatHrMinParts(totalSec);
  }

  if (mode === 'full') {
    return formatFullLabeled(totalSec);
  }

  if (mode === 'clock') {
    return formatClock(totalSec);
  }

  return INVALID;
}

function formatNum(n: number): string {
  if (Number.isInteger(n)) {
    return String(n);
  }
  const t = n.toFixed(1);
  return t.endsWith('.0') ? String(Math.round(n)) : t;
}

function formatNumInt(n: number): string {
  return String(Math.max(0, n));
}

function formatHrMinParts(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts: string[] = [];
  if (h > 0) {
    parts.push(`${h} hr`);
  }
  if (m > 0) {
    parts.push(`${m} min`);
  }
  if (h === 0 && m === 0 && s > 0) {
    return `${s} sec`;
  }
  if (parts.length === 0) {
    return '0 min';
  }
  return parts.join(' ');
}

function formatFullLabeled(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts: string[] = [];
  if (h > 0) {
    parts.push(`${h} hr`);
  }
  if (m > 0) {
    parts.push(`${m} min`);
  }
  if (s > 0 || parts.length === 0) {
    parts.push(`${s} sec`);
  }
  return parts.join(' ');
}

function formatClock(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}:${pad2(m)}:${pad2(s)}`;
  }
  return `${m}:${pad2(s)}`;
}
