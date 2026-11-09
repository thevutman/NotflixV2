/**
 * The 2022 logo was a famous red wordmark "with a patch". The joke stays, the borrowed look goes:
 * the O is a "no" sign, because Notflix is 0 % piracy.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center font-extrabold tracking-[-0.04em] uppercase ${className}`} aria-label="Notflix">
      <span aria-hidden="true">N</span>
      <span aria-hidden="true" className="relative mx-[0.04em] inline-block h-[0.74em] w-[0.74em]">
        <span className="absolute inset-0 rounded-full border-[0.13em] border-signal" />
        <span className="absolute top-1/2 left-[-0.06em] h-[0.12em] w-[calc(100%+0.12em)] -translate-y-1/2 rotate-[35deg] rounded-full bg-cream" />
      </span>
      <span aria-hidden="true">TFLIX</span>
    </span>
  );
}
