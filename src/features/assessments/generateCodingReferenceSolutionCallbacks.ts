import type { GenerateCodingReferenceSolutionResponse } from "./types";

type Callbacks = {
  onSuccess?: (data: GenerateCodingReferenceSolutionResponse) => void;
  onError?: (message: string) => void;
};

const callbacksByRequestId = new Map<string, Callbacks>();

export function registerGenerateCodingReferenceSolutionCallbacks(
  requestId: string,
  callbacks: Callbacks
) {
  callbacksByRequestId.set(requestId, callbacks);
}

export function takeGenerateCodingReferenceSolutionCallbacks(
  requestId: string
): Callbacks {
  const cb = callbacksByRequestId.get(requestId) ?? {};
  callbacksByRequestId.delete(requestId);
  return cb;
}
