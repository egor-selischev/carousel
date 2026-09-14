import { STORAGE_KEYS } from '@shared/config';
import {
  decodeFakeJwt,
  getFromStorage,
  isFakeJwtExpired,
  isString,
  removeFromStorage,
} from '@shared/lib';

import type { Session } from './types';

export const createSessionFromToken = (token: string): Session | null => {
  const payload = decodeFakeJwt(token);

  if (!payload || isFakeJwtExpired(payload)) {
    return null;
  }

  return { token, user: { email: payload.email }, expiresAt: payload.exp };
};

export const restoreSession = (): Session | null => {
  const token = getFromStorage(STORAGE_KEYS.AUTH_TOKEN, isString);

  if (token === null) {
    return null;
  }

  const session = createSessionFromToken(token);

  if (!session) {
    removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
  }

  return session;
};
