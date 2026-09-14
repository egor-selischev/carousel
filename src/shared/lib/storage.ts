export type TypeGuard<T> = (value: unknown) => value is T;

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is unavailable — the in-memory state stays the source of truth.
  }
};

export const getFromStorage = <T>(key: string, isValid?: TypeGuard<T>): T | null => {
  try {
    const raw = localStorage.getItem(key);

    if (raw === null) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (isValid) {
      return isValid(parsed) ? parsed : null;
    }

    return parsed as T;
  } catch {
    return null;
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage is unavailable — nothing to remove.
  }
};
