import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Session } from "@/lib/types";

/** The split screen of the 2022 login: the pitch on the left, the form on the right. */
function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 grid grid-cols-4 gap-3 p-3 opacity-50">
          {["nosferatu", "el-maquinista-de-la-general", "detour", "viaje-a-la-luna", "el-fantasma-de-la-opera", "luna-nueva", "caligari", "el-autoestopista"].map((slug, i) => (
            <img
              key={slug}
              src={`/posters/${slug}.webp`}
              alt=""
              className="aspect-[2/3] w-full rounded-xl object-cover grayscale"
              style={{ transform: `translateY(${i % 2 ? 40 : -20}px)` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-ink/70 to-ink" />
        <div className="relative flex h-full flex-col justify-end p-14">
          <h2 className="max-w-lg font-serif text-6xl leading-[0.95]">Mira series y películas gratis y 0 % piratas</h2>
          <p className="mt-5 max-w-md text-mist/80">
            Clásicos del cine que ya son de todos: Murnau, Keaton, Chaplin, Romero. Copias legales de dominio público,
            sin anuncios y sin tarjeta de crédito.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 pt-24 pb-12">{children}</div>
    </div>
  );
}

function useFinish() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  return (session: Session) => {
    signIn(session);
    navigate(from, { replace: true });
  };
}

function GuestButton({ onError }: { onError: (message: string) => void }) {
  const finish = useFinish();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          finish(await api.guest());
        } catch (e) {
          onError((e as Error).message);
          setBusy(false);
        }
      }}
      className="btn btn-ghost w-full"
    >
      {busy ? "Entrando…" : "Entrar como invitado"}
    </button>
  );
}

export function Login() {
  const finish = useFinish();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      finish(await api.login(email, password));
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-5xl">Iniciar sesión</h1>
        <p className="mt-3 text-dim">Guarda tus favoritos en Mi lista y sigue donde ibas.</p>
        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" className="field" aria-invalid={!!error} />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">Contraseña</label>
            <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="field" aria-invalid={!!error} />
          </div>
          {error ? <p role="alert" className="text-sm text-signal">{error}</p> : null}
          <button type="submit" disabled={busy} className="btn btn-primary w-full">
            {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>
        <div className="my-6 flex items-center gap-4 text-xs text-dim">
          <span className="h-px flex-1 bg-cream/10" />o<span className="h-px flex-1 bg-cream/10" />
        </div>
        <GuestButton onError={setError} />
        <p className="mt-8 text-center text-sm text-dim">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-semibold text-cream underline-offset-4 hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export function Register() {
  const finish = useFinish();
  const [form, setForm] = useState({ name: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setBusy(true);
    try {
      finish(await api.register(form));
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-5xl">Crear cuenta</h1>
        <p className="mt-3 text-dim">Gratis, sin tarjeta y en menos de un minuto.</p>
        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">Nombre</label>
              <input id="name" required autoComplete="given-name" value={form.name} onChange={set("name")} className="field" />
            </div>
            <div>
              <label htmlFor="lastName" className="mb-2 block text-sm font-medium">Apellido</label>
              <input id="lastName" autoComplete="family-name" value={form.lastName} onChange={set("lastName")} className="field" />
            </div>
          </div>
          <div>
            <label htmlFor="r-email" className="mb-2 block text-sm font-medium">Email</label>
            <input id="r-email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} placeholder="user@example.com" className="field" />
          </div>
          <div>
            <label htmlFor="r-password" className="mb-2 block text-sm font-medium">Contraseña</label>
            <input id="r-password" type="password" required autoComplete="new-password" value={form.password} onChange={set("password")} placeholder="Mínimo 8 caracteres" className="field" />
          </div>
          {error ? <p role="alert" className="text-sm text-signal">{error}</p> : null}
          <button type="submit" disabled={busy} className="btn btn-primary w-full">
            {busy ? "Creando tu cuenta…" : "Crear cuenta"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-dim">
          ¿Ya tienes cuenta?{" "}
          <Link to="/entrar" className="font-semibold text-cream underline-offset-4 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
