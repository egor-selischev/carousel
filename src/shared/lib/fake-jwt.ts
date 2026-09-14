import { isRecord } from './guards';

export interface FakeJwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

const encodeBase64Url = (value: string): string => {
  const binary = Array.from(new TextEncoder().encode(value), (byte) =>
    String.fromCharCode(byte),
  ).join('');

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const decodeBase64Url = (value: string): string => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
};

const isFakeJwtPayload = (value: unknown): value is FakeJwtPayload =>
  isRecord(value) &&
  typeof value.sub === 'string' &&
  typeof value.email === 'string' &&
  typeof value.iat === 'number' &&
  typeof value.exp === 'number';

export const createFakeJwt = (email: string, ttlMs: number): string => {
  const issuedAt = Date.now();
  const header = { alg: 'none', typ: 'JWT' };
  const payload: FakeJwtPayload = {
    sub: crypto.randomUUID(),
    email,
    iat: issuedAt,
    exp: issuedAt + ttlMs,
  };
  const signature = crypto.randomUUID().replace(/-/g, '');

  return [
    encodeBase64Url(JSON.stringify(header)),
    encodeBase64Url(JSON.stringify(payload)),
    signature,
  ].join('.');
};

export const decodeFakeJwt = (token: string): FakeJwtPayload | null => {
  const [, payloadPart] = token.split('.');

  if (!payloadPart) {
    return null;
  }

  try {
    const payload: unknown = JSON.parse(decodeBase64Url(payloadPart));

    return isFakeJwtPayload(payload) ? payload : null;
  } catch {
    return null;
  }
};

export const isFakeJwtExpired = (payload: FakeJwtPayload, now: number = Date.now()): boolean =>
  payload.exp <= now;
