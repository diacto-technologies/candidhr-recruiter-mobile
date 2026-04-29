import type { GenerateCodingProblemMetadataResponse } from "./types";

type Callbacks = {
  onSuccess?: (data: GenerateCodingProblemMetadataResponse) => void;
  onError?: (message: string) => void;
};

const callbacksByRequestId = new Map<string, Callbacks>();

export function registerGenerateCodingMetadataCallbacks(
  requestId: string,
  callbacks: Callbacks
) {
  callbacksByRequestId.set(requestId, callbacks);
}

export function takeGenerateCodingMetadataCallbacks(
  requestId: string
): Callbacks {
  const cb = callbacksByRequestId.get(requestId) ?? {};
  callbacksByRequestId.delete(requestId);
  return cb;
}
