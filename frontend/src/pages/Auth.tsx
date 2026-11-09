import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AcceptToast } from "@/components/Feedback";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Session } from "@/lib/types";

function useFinish() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/home/all";
  return (session: Session) => {
    signIn(session);
    navigate(from, { replace: true });
  };
}

/** The 2022 login: the pitch on one side, the form on the other, the wine "Entrar" button. */
export function Login() {
  const { session } = useAuth();
  const finish = useFinish();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"login" | "guest" | null>(null);

  if (session) return <Navigate to="/home/all" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Escribe tu email y tu contraseña");
      return;
    }
    setBusy("login");
    try {
      finish(await api.login(email, password));
    } catch (err) {
      setError((err as Error).message);
      setBusy(null);
    }
  };

  const guest = async () => {
    setError("");
    setBusy("guest");
    try {
      finish(await api.guest());
    } catch (err) {
      setError((err as Error).message);
      setBusy(null);
    }
  };

  return (
    <div className="sheet flex flex-wrap items-center justify-evenly gap-10 px-6 py-10 md:p-[30px]">
      <div className="order-1 w-full text-center text-white md:order-none md:w-[40%]">
        <h2 className="text-[27px] font-bold">Mira series y películas gratis y 0% piratas</h2>
        <p className="mx-auto mt-3 max-w-md text-[16px]">
          Clásicos del cine que ya son de todos: Nosferatu, Buster Keaton, Chaplin, Romero y los primeros Superman.
          Copias legales de dominio público, sin anuncios y sin tarjeta.
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-4 text-white md:w-1/2">
        <h2 className="text-[25px] font-bold">Iniciar sesión</h2>
        {error ? <p role="alert" className="error-box w-full max-w-[350px]">{error}</p> : null}
        <form onSubmit={submit} className="flex w-[80%] max-w-[350px] flex-col gap-3" noValidate>
          <label htmlFor="email" className="field-label !mb-0">Email</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" className="field" aria-invalid={!!error} />
          <label htmlFor="password" className="field-label !mb-0">Contraseña</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="*******" className="field" aria-invalid={!!error} />
          <button type="submit" disabled={!!busy} className="btn-wine mx-auto mt-3">
            {busy === "login" ? "Entrando…" : "Entrar"}
          </button>
        </form>
        <button type="button" disabled={!!busy} onClick={guest} className="btn-outline">
          {busy === "guest" ? "Entrando…" : "Entrar como invitado"}
        </button>
        <p className="text-[14px] font-extralight">
          ¿No tienes cuenta? Regístrate <Link to="/register" className="link-red">aquí</Link>
        </p>
      </div>
    </div>
  );
}

const fields = [
  { id: "name", label: "Nombre", type: "text", auto: "given-name" },
  { id: "lastName", label: "Apellido", type: "text", auto: "family-name" },
  { id: "birthDate", label: "Fecha de nacimiento", type: "date", auto: "bday" },
  { id: "phone", label: "Teléfono", type: "tel", auto: "tel" },
  { id: "email", label: "Email", type: "email", auto: "email" },
  { id: "password", label: "Contraseña", type: "password", auto: "new-password" },
  { id: "repeat", label: "Repetir contraseña", type: "password", auto: "new-password" },
] as const;

type Form = Record<(typeof fields)[number]["id"], string>;

/** The 2022 register form, same seven fields, now validated in one pass with every problem listed. */
export function Register() {
  const finish = useFinish();
  const [form, setForm] = useState<Form>({ name: "", lastName: "", birthDate: "", phone: "", email: "", password: "", repeat: "" });
  const [invalid, setInvalid] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const bad = new Set<string>();
    const problems: string[] = [];
    if (!form.name.trim()) bad.add("name");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) bad.add("email");
    if (form.password.length < 8) {
      bad.add("password");
      problems.push("La contraseña debe tener al menos 8 caracteres");
    }
    if (form.password !== form.repeat) {
      bad.add("repeat");
      problems.push("La contraseña no coincide");
    }
    if (bad.has("name") || bad.has("email")) problems.unshift("Revisa los campos marcados en rojo");
    setInvalid(bad);
    setError(problems.join(". "));
    if (bad.size) return;

    setBusy(true);
    try {
      const session = await api.register({
        name: form.name,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        birthDate: form.birthDate || undefined,
        phone: form.phone || undefined,
      });
      setDone(true);
      window.setTimeout(() => finish(session), 1800);
    } catch (err) {
      setError((err as Error).message);
      if ((err as Error).message.includes("EMAIL")) setInvalid(new Set(["email"]));
      setBusy(false);
    }
  };

  return (
    <div className="sheet px-6 py-[45px]">
      {done ? <AcceptToast text="Usuario creado correctamente" /> : null}
      <div className="flex flex-col items-center gap-4 text-white">
        <h2 className="text-[25px] font-bold">Registro</h2>
        {error ? <p role="alert" className="error-box w-full max-w-[350px] uppercase">{error}</p> : null}
        <form onSubmit={submit} className="flex w-full max-w-[350px] flex-col gap-3" noValidate>
          {fields.map((f) => (
            <div key={f.id}>
              <label htmlFor={`r-${f.id}`} className="field-label">
                {f.label}
                {f.id === "lastName" || f.id === "birthDate" || f.id === "phone" ? <span className="text-[13px] font-light text-dim"> (opcional)</span> : null}
              </label>
              <input
                id={`r-${f.id}`}
                type={f.type}
                autoComplete={f.auto}
                value={form[f.id]}
                onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                placeholder={f.id === "email" ? "user@example.com" : f.type === "password" ? "*******" : ""}
                className="field"
                aria-invalid={invalid.has(f.id)}
              />
            </div>
          ))}
          <button type="submit" disabled={busy} className="btn-wine mx-auto mt-3">
            {busy ? "Creando…" : "Registrarme"}
          </button>
        </form>
        <p className="text-[14px] font-extralight">
          ¿Ya tienes cuenta? Ingresa <Link to="/" className="link-red">aquí</Link>
        </p>
      </div>
    </div>
  );
}
