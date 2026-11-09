import { useEffect, useState } from "react";
import { onSlow } from "@/lib/api";

/** Shown when a request takes long: on the free plan the server sleeps and needs ~30 s to wake up. */
export function WakeNotice() {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const stop = onSlow(setSlow);
    return stop;
  }, []);
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-cream/10 bg-coal/95 px-5 py-3 text-sm shadow-2xl backdrop-blur transition duration-500 ${
        slow ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {slow ? (
        <>
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal" />
          </span>
          Encendiendo el proyector… el servidor gratuito estaba dormido, tarda unos segundos.
        </>
      ) : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60svh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-5xl">Se cortó la cinta</p>
      <p className="mt-4 text-dim">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="btn btn-primary mt-8">
          Intentar de nuevo
        </button>
      ) : null}
    </div>
  );
}

export function PosterSkeleton({ count = 7 }: { count?: number }) {
  return (
    <div className="mt-14 flex gap-4 overflow-hidden px-4 sm:px-10" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="aspect-[2/3] w-[130px] shrink-0 animate-pulse rounded-xl bg-coal sm:w-[200px]" />
      ))}
    </div>
  );
}
