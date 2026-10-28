import { CopilotStreamEvent } from './types';

/**
 * Creates an incremental Server-Sent Events (SSE) parser.
 * Handles split lines across chunk boundaries, multi-line events, and [DONE] markers.
 */
export function createSseParser(onEvent: (event: CopilotStreamEvent) => void) {
  let buffer = '';

  const processLine = (rawLine: string) => {
    const line = rawLine.trim();
    if (!line || line.startsWith(':')) {
      // Empty line or SSE comment (e.g. keepalive)
      return;
    }

    if (line.startsWith('data:')) {
      const dataStr = line.slice(5).trim();
      if (!dataStr) return;

      if (dataStr === '[DONE]') {
        onEvent({ type: 'done' });
        return;
      }

      try {
        const parsed = JSON.parse(dataStr) as CopilotStreamEvent;
        onEvent(parsed);
      } catch (err) {
        if (__DEV__) {
          console.warn('[SSE Parser] Failed to parse JSON data line:', dataStr, err);
        }
      }
    }
  };

  const feed = (chunk: string) => {
    buffer += chunk;
    const lines = buffer.split(/\r\n|\r|\n/);
    // Retain the last incomplete chunk in the buffer
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      processLine(line);
    }
  };

  const flush = () => {
    if (buffer.trim()) {
      processLine(buffer);
      buffer = '';
    }
  };

  return { feed, flush };
}
