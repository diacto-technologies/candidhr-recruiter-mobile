import type { GenerateCodingTestcasesSnippetsResponse } from "./types";

type Callbacks = {
  onSuccess?: (data: GenerateCodingTestcasesSnippetsResponse) => void;
  onError?: (message: string) => void;
};

const callbacksByRequestId = new Map<string, Callbacks>();

export function registerGenerateCodingTestcasesCallbacks(
  requestId: string,
  callbacks: Callbacks
) {
  callbacksByRequestId.set(requestId, callbacks);
}

export function takeGenerateCodingTestcasesCallbacks(
  requestId: string
): Callbacks {
  const cb = callbacksByRequestId.get(requestId) ?? {};
  callbacksByRequestId.delete(requestId);
  return cb;
}
