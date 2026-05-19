/**
 * Lightweight JWT helpers (decode payload only; no signature verification).
 */

type JwtPayload = {
  exp?: number;
};

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(padded);
  }

  throw new Error('atob is not available');
}

export function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const json = base64UrlDecode(parts[1]);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/** Returns expiry timestamp in milliseconds, or null if missing/invalid. */
export function getJwtExpiryMs(token: string | null | undefined): number | null {
  if (!token) return null;
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return null;
  return payload.exp * 1000;
}

export function msUntilJwtExpiry(token: string | null | undefined): number | null {
  const expiryMs = getJwtExpiryMs(token);
  if (expiryMs == null) return null;
  return expiryMs - Date.now();
}
