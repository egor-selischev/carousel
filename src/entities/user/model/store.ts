import { create } from 'zustand';

import { STORAGE_KEYS } from '@shared/config';
import { removeFromStorage, saveToStorage } from '@shared/lib';

import { createSessionFromToken, restoreSession } from './session';
import type { Session, User } from './types';

interface SessionState {
  session: Session | null;
  startSession: (token: string) => boolean;
  endSession: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  session: restoreSession(),

  startSession: (token) => {
    const session = createSessionFromToken(token);

    if (!session) {
      return false;
    }

    saveToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
    set({ session });

    return true;
  },

  endSession: () => {
    removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
    set({ session: null });
  },
}));

export const selectIsAuthenticated = (state: SessionState): boolean => state.session !== null;

export const selectCurrentUser = (state: SessionState): User | null => state.session?.user ?? null;

export const selectStartSession = (state: SessionState): SessionState['startSession'] =>
  state.startSession;

export const selectEndSession = (state: SessionState): SessionState['endSession'] =>
  state.endSession;
