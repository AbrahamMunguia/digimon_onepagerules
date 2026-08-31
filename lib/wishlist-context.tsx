"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "digimon-onepagerules:wishlist";

const listeners = new Set<() => void>();
const EMPTY_IDS: number[] = [];
let cachedIds: number[] | null = null;

function readStoredIds(): number[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === "number") : [];
  } catch {
    return [];
  }
}

// useSyncExternalStore (rather than useState+useEffect) reads localStorage
// synchronously on the client after hydration, avoiding an extra render
// pass and the server/client mismatch a plain effect-based load would cause.
function getSnapshot(): number[] {
  if (cachedIds === null) cachedIds = readStoredIds();
  return cachedIds;
}

function getServerSnapshot(): number[] {
  return EMPTY_IDS;
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function writeIds(ids: number[]) {
  cachedIds = ids;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be unavailable (private mode, quota); the in-memory
    // cache still works for the rest of the session.
  }
  listeners.forEach((listener) => listener());
}

interface WishlistContextValue {
  ids: number[];
  has: (id: number) => boolean;
  toggle: (id: number) => void;
  remove: (id: number) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((id: number) => {
    const current = getSnapshot();
    writeIds(
      current.includes(id) ? current.filter((existing) => existing !== id) : [...current, id],
    );
  }, []);

  const remove = useCallback((id: number) => {
    writeIds(getSnapshot().filter((existing) => existing !== id));
  }, []);

  const has = useCallback((id: number) => ids.includes(id), [ids]);

  const value = useMemo(() => ({ ids, has, toggle, remove }), [ids, has, toggle, remove]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
