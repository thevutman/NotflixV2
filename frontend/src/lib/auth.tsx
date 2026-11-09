import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, readSession, writeSession } from "./api";
import type { Session, Title } from "./types";

interface AuthValue {
  session: Session | null;
  signIn: (session: Session) => void;
  signOut: () => void;
  /** Ids of the titles in "Mi lista", so every heart on screen agrees. */
  liked: Set<string>;
  myList: Title[];
  toggleLike: (title: Title) => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readSession);
  const [myList, setMyList] = useState<Title[]>([]);

  const signIn = useCallback((next: Session) => {
    writeSession(next);
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    writeSession(null);
    setSession(null);
    setMyList([]);
  }, []);

  useEffect(() => {
    if (!session) return;
    let alive = true;
    api
      .myList()
      .then((list) => alive && setMyList(list))
      .catch(() => alive && setMyList([]));
    return () => {
      alive = false;
    };
  }, [session]);

  const liked = useMemo(() => new Set(myList.map((t) => t.id)), [myList]);

  // Optimistic: the heart fills at once and rolls back if the server says no.
  const toggleLike = useCallback(
    async (title: Title) => {
      const had = liked.has(title.id);
      setMyList((list) => (had ? list.filter((t) => t.id !== title.id) : [title, ...list]));
      try {
        if (had) await api.unlike(title.id);
        else await api.like(title.id, title.type);
      } catch (error) {
        setMyList((list) => (had ? [title, ...list] : list.filter((t) => t.id !== title.id)));
        throw error;
      }
    },
    [liked],
  );

  const value = useMemo(
    () => ({ session, signIn, signOut, liked, myList, toggleLike }),
    [session, signIn, signOut, liked, myList, toggleLike],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return value;
}
