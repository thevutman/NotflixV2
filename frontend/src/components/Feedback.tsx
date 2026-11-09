import { useEffect, useState } from "react";
import notFound from "@/assets/404.svg";
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
      className={`fixed bottom-5 left-1/2 z-50 w-[min(92vw,460px)] -translate-x-1/2 rounded-[14px] bg-frame px-5 py-4 text-center text-[14px] text-white shadow-2xl transition duration-500 ${
        slow ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {slow ? "Despertando el servidor… el plan gratuito se duerme cuando nadie lo usa. Tarda unos segundos." : null}
    </div>
  );
}

/** The 2022 404 page: the icon and the message in red, centred on the sheet. */
export function ErrorState({ title = "ERROR", message, onRetry }: { title?: string; message: string; onRetry?: () => void }) {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center gap-2 px-6 text-center">
      <img src={notFound} alt="" className="h-[100px] invert-[.15]" />
      <h1 className="mt-2 text-[22px] font-bold text-[rgb(252,3,3)]">{title}</h1>
      <p className="max-w-md text-[16px] font-bold text-[rgb(252,3,3)]">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="btn-wine mt-6">
          Reintentar
        </button>
      ) : null}
    </div>
  );
}

/** The green "Usuario creado correctamente" banner that slid across the register page. */
export function AcceptToast({ text }: { text: string }) {
  return (
    <div className="pointer-events-none fixed top-[70px] left-0 z-50 w-full overflow-hidden">
      <p className="accept mx-auto w-[min(90vw,420px)] rounded bg-green-700 px-4 py-4 text-center text-[16px] font-semibold text-white uppercase">
        {text}
      </p>
      <style>{`
        .accept { animation: accept 2.4s ease forwards; }
        @keyframes accept {
          0% { transform: translateX(100vw) scale(.6); opacity: 0; }
          30%, 70% { transform: translateX(0) scale(1); opacity: 1; }
          100% { transform: translateX(-100vw); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
