import type { Client, Home, Session, Title, TitleType } from "./types";

const BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8080/api").replace(/\/$/, "");
const SESSION_KEY = "notflix.session";

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function writeSession(session: Session | null) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* private mode: the session simply lasts until the tab closes */
  }
}

/**
 * The free server sleeps when nobody uses it and takes a while to wake up. Anyone who wants
 * to know can subscribe: the app shows a "waking the projector" notice after a few seconds.
 */
type SlowListener = (slow: boolean) => void;
const slowListeners = new Set<SlowListener>();
let pending = 0;
let slowTimer: number | undefined;

export function onSlow(listener: SlowListener) {
  slowListeners.add(listener);
  return () => void slowListeners.delete(listener);
}

function track(delta: 1 | -1) {
  pending += delta;
  window.clearTimeout(slowTimer);
  if (pending > 0) slowTimer = window.setTimeout(() => slowListeners.forEach((l) => l(true)), 3500);
  else slowListeners.forEach((l) => l(false));
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = readSession();
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  if (session) headers.set("Authorization", `Bearer ${session.token}`);

  track(1);
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.");
  } finally {
    track(-1);
  }

  if (res.status === 401 && session) writeSession(null);
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, body?.message ?? "Algo salió mal. Inténtalo de nuevo.");
  return body as T;
}

const json = (data: unknown) => JSON.stringify(data);

export const api = {
  home: () => request<Home>("/catalog"),
  search: (q: string) => request<{ movies: Title[]; series: Title[] }>(`/catalog/search?q=${encodeURIComponent(q)}`),
  movie: (slug: string) => request<Title>(`/movie/${encodeURIComponent(slug)}`),
  series: (slug: string) => request<Title>(`/series/${encodeURIComponent(slug)}`),
  play: (type: TitleType, id: string) =>
    request<{ views: number }>(`/${type === "MOVIE" ? "movie" : "series"}/${id}/play`, { method: "POST" }),

  login: (user: string, password: string) =>
    request<Session>("/auth", { method: "POST", body: json({ user, password }) }),
  guest: () => request<Session>("/auth/guest", { method: "POST" }),
  register: (data: { name: string; lastName: string; email: string; password: string; birthDate?: string; phone?: string }) =>
    request<Session>("/client", { method: "POST", body: json(data) }),
  me: () => request<Client>("/client/me"),
  updateMe: (data: { name: string; lastName: string; phone?: string; birthDate?: string }) =>
    request<Client>("/client/me", { method: "PUT", body: json(data) }),
  deleteMe: () => request<void>("/client/me", { method: "DELETE" }),

  myList: () => request<Title[]>("/score"),
  check: (titleId: string) => request<{ id?: string; state: boolean }>(`/score/check/${titleId}`),
  like: (titleId: string, type: TitleType) =>
    request<unknown>("/score", { method: "POST", body: json({ titleId, type }) }),
  unlike: (titleId: string) => request<void>(`/score/${titleId}`, { method: "DELETE" }),
};

export const titlePath = (t: Pick<Title, "type" | "slug">) =>
  `/${t.type === "MOVIE" ? "movies" : "series"}/${t.slug}`;

export const embedUrl = (video: string) => `https://archive.org/embed/${encodeURIComponent(video)}`;

export function runtime(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
