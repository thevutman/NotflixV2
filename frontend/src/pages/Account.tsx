import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export function Account() {
  const { session, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", lastName: "", phone: "" });
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const isGuest = session?.email.startsWith("invitado@");

  useEffect(() => {
    if (!session) return;
    api.me().then((me) => setForm({ name: me.name, lastName: me.lastName ?? "", phone: me.phone ?? "" })).catch(() => undefined);
  }, [session]);

  if (!session) return <Navigate to="/entrar" state={{ from: "/cuenta" }} replace />;

  const save = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const me = await api.updateMe(form);
      signIn({ ...session, name: [me.name, me.lastName].filter(Boolean).join(" ") });
      setStatus({ ok: true, message: "Cambios guardados" });
    } catch (err) {
      setStatus({ ok: false, message: (err as Error).message });
    }
  };

  const remove = async () => {
    try {
      await api.deleteMe();
      signOut();
      navigate("/", { replace: true });
    } catch (err) {
      setStatus({ ok: false, message: (err as Error).message });
    }
  };

  return (
    <div className="mx-auto min-h-svh max-w-xl px-5 pt-28 pb-20 sm:pt-36">
      <p className="text-xs font-semibold tracking-[0.2em] text-signal uppercase">Mi cuenta</p>
      <h1 className="mt-3 font-serif text-6xl">Hola, {session.name.split(" ")[0]}</h1>
      <p className="mt-2 text-dim">{session.email}</p>
      {isGuest ? (
        <p className="mt-6 rounded-2xl border border-cream/10 bg-coal p-4 text-sm text-mist/80">
          Estás usando la cuenta de invitado, que comparten todos los visitantes. Para editar tus datos crea tu propia cuenta.
        </p>
      ) : null}
      <form onSubmit={save} className="mt-10 space-y-4">
        <fieldset disabled={isGuest} className="space-y-4 disabled:opacity-50">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="a-name" className="mb-2 block text-sm font-medium">Nombre</label>
              <input id="a-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" />
            </div>
            <div>
              <label htmlFor="a-last" className="mb-2 block text-sm font-medium">Apellido</label>
              <input id="a-last" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="field" />
            </div>
          </div>
          <div>
            <label htmlFor="a-phone" className="mb-2 block text-sm font-medium">Teléfono</label>
            <input id="a-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" />
          </div>
          <button type="submit" className="btn btn-primary">Guardar cambios</button>
        </fieldset>
        {status ? (
          <p role="status" className={`text-sm ${status.ok ? "text-mist" : "text-signal"}`}>{status.message}</p>
        ) : null}
      </form>

      {!isGuest ? (
        <section className="mt-16 border-t border-cream/10 pt-8">
          <h2 className="font-semibold">Eliminar cuenta</h2>
          <p className="mt-2 text-sm text-dim">Se borran tu cuenta y Mi lista. No se puede deshacer.</p>
          {confirming ? (
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={remove} className="btn bg-signal text-ink">Sí, eliminar</button>
              <button type="button" onClick={() => setConfirming(false)} className="btn btn-ghost">Cancelar</button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="btn btn-ghost mt-4">Eliminar mi cuenta</button>
          )}
        </section>
      ) : null}
    </div>
  );
}
