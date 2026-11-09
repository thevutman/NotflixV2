import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Client } from "@/lib/types";

/** The 2022 "Mis datos personales": Hola + name, then email, phone and birth date. Now editable. */
export function Account() {
  const { session, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [me, setMe] = useState<Client | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", lastName: "", phone: "", birthDate: "" });
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const isGuest = session?.email.startsWith("invitado@") ?? false;

  useEffect(() => {
    api.me().then((client) => {
      setMe(client);
      setForm({ name: client.name, lastName: client.lastName ?? "", phone: client.phone ?? "", birthDate: client.birthDate ?? "" });
    }, () => setMessage({ ok: false, text: "No pudimos cargar tus datos" }));
  }, []);

  if (!session) return null;

  const save = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateMe(form);
      setMe(updated);
      signIn({ ...session, name: [updated.name, updated.lastName].filter(Boolean).join(" ") });
      setEditing(false);
      setMessage({ ok: true, text: "Datos actualizados" });
    } catch (err) {
      setMessage({ ok: false, text: (err as Error).message });
    }
  };

  const remove = async () => {
    try {
      await api.deleteMe();
      signOut();
      navigate("/", { replace: true });
    } catch (err) {
      setMessage({ ok: false, text: (err as Error).message });
    }
  };

  return (
    <div className="sheet flex flex-col items-center justify-evenly gap-8 px-6 py-12 text-center text-white">
      <h1 className="text-[22px] font-extrabold">Hola {me ? `${me.name} ${me.lastName ?? ""}` : session.name}</h1>

      {message ? <p role="status" className={message.ok ? "rounded-md bg-green-700 px-5 py-3 font-bold" : "error-box"}>{message.text}</p> : null}

      {editing ? (
        <form onSubmit={save} className="flex w-full max-w-[350px] flex-col gap-3 text-left">
          {(
            [
              ["name", "Nombre", "text"],
              ["lastName", "Apellido", "text"],
              ["phone", "Teléfono", "tel"],
              ["birthDate", "Fecha de nacimiento", "date"],
            ] as const
          ).map(([key, label, type]) => (
            <div key={key}>
              <label htmlFor={`a-${key}`} className="field-label">{label}</label>
              <input id={`a-${key}`} type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="field" required={key === "name"} />
            </div>
          ))}
          <div className="mt-3 flex justify-center gap-3">
            <button type="submit" className="btn-wine">Guardar</button>
            <button type="button" className="btn-outline" onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-[24px] font-extrabold">Email:</h2>
          <p className="text-[16px]">{me?.email ?? session.email}</p>
          <h2 className="text-[24px] font-extrabold">Phone:</h2>
          <p className="text-[16px]">{me?.phone || "Sin registrar"}</p>
          <h2 className="text-[24px] font-extrabold">birthDate:</h2>
          <p className="text-[16px]">{me?.birthDate || "Sin registrar"}</p>
        </div>
      )}

      {isGuest ? (
        <p className="max-w-sm text-[14px] font-light text-mist">
          Estás en la cuenta de invitado, que comparten todos los visitantes. Crea tu propia cuenta para editar tus datos.
        </p>
      ) : !editing ? (
        <div className="flex flex-col items-center gap-4">
          <button type="button" className="btn-wine" onClick={() => setEditing(true)}>Editar mis datos</button>
          {confirming ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-[14px] text-mist">Se borran tu cuenta y Mi lista. No se puede deshacer.</p>
              <div className="flex gap-3">
                <button type="button" className="btn-wine !bg-[red]" onClick={remove}>Sí, eliminar</button>
                <button type="button" className="btn-outline" onClick={() => setConfirming(false)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <button type="button" className="text-[14px] font-light text-mist underline hover:text-red-500" onClick={() => setConfirming(true)}>
              Eliminar mi cuenta
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
