import { useEffect, useState } from "react";

type State<T> = { data: T | null; error: Error | null; loading: boolean };

/** Runs a request whenever `key` changes and ignores answers that arrive after it changed again. */
export function useAsync<T>(load: () => Promise<T>, key: unknown): State<T> & { retry: () => void } {
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: true });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ data: s.data, error: null, loading: true }));
    load().then(
      (data) => alive && setState({ data, error: null, loading: false }),
      (error: Error) => alive && setState({ data: null, error, loading: false }),
    );
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
