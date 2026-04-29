import type { GenerateQuestionsResponse } from "./types";

type Callbacks = {
  onSuccess?: (data: GenerateQuestionsResponse) => void;
  onError?: (message: string) => void;
};

const callbacksByRequestId = new Map<string, Callbacks>();

export function registerGenerateQuestionsCallbacks(
  requestId: string,
  callbacks: Callbacks
) {
  callbacksByRequestId.set(requestId, callbacks);
}

export function takeGenerateQuestionsCallbacks(requestId: string): Callbacks {
  const cb = callbacksByRequestId.get(requestId) ?? {};
  callbacksByRequestId.delete(requestId);
  return cb;
}

