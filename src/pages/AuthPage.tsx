import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  ChevronRight,
  Coins,
  Gift,
  Lock,
  Mail,
  Ticket,
  User,
  UserRound,
} from "lucide-react";
import landingBackground from "@/assets/frikiquest-landing-bg.webp";
import frikiQuestLogo from "@/assets/logo-friki-quest.png";

type AuthMode = "landing" | "login" | "signup";

const features = [
  { icon: Ticket, label: "Escanea tickets", color: "text-sky-300", glow: "shadow-sky-400/40" },
  { icon: Coins, label: "Gana puntos", color: "text-yellow-300", glow: "shadow-yellow-300/40" },
  { icon: Gift, label: "Canjea recompensas", color: "text-pink-300", glow: "shadow-pink-400/40" },
  { icon: CalendarDays, label: "Eventos y reservas", color: "text-emerald-300", glow: "shadow-emerald-400/40" },
  { icon: Bell, label: "Alertas TCG", color: "text-purple-300", glow: "shadow-purple-400/40" },
];

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      navigate("/home");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: displayName },
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Cuenta creada. Revisa tu email para confirmar tu cuenta.");
    }
    setLoading(false);
  };

  if (mode === "landing") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#07081c] text-white">
        <img
          src={landingBackground}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#050617]/15" />

        <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-5 py-8 text-center">
          <img
            src={frikiQuestLogo}
            alt="FrikiQuest"
            className="w-full max-w-[390px] object-contain drop-shadow-[0_22px_28px_rgba(10,3,28,0.85)]"
          />

          <div className="-mt-2 space-y-3">
            <h1 className="text-3xl font-black leading-tight text-display">
              Tu tienda friki.
              <br />
              Tus <span className="text-fuchsia-300 drop-shadow-[0_0_16px_rgba(217,70,239,0.7)]">recompensas.</span>
            </h1>
            <p className="mx-auto max-w-sm text-base font-medium leading-relaxed text-slate-300">
              Escanea, acumula puntos, consigue recompensas y disfruta de experiencias unicas.
            </p>
          </div>

          <div className="mt-8 grid w-full grid-cols-5 divide-x divide-white/15">
            {features.map(({ icon: Icon, label, color, glow }) => (
              <div key={label} className="flex min-w-0 flex-col items-center gap-2 px-1">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 shadow-lg ${glow}`}>
                  <Icon className={`h-7 w-7 ${color}`} strokeWidth={2.5} />
                </div>
                <span className="text-[11px] font-semibold leading-tight text-slate-100">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 w-full space-y-4">
            <button
              onClick={() => setMode("signup")}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-purple-600 px-5 py-4 text-base font-black uppercase tracking-wide text-white shadow-[0_0_34px_rgba(192,38,211,0.38)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Empezar a ganar puntos
              <ChevronRight className="h-6 w-6" />
            </button>

            <button
              onClick={() => setMode("login")}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-purple-400/80 bg-[#180835]/60 px-5 py-4 text-base font-black uppercase tracking-wide text-purple-100 shadow-[inset_0_0_22px_rgba(168,85,247,0.12),0_0_22px_rgba(168,85,247,0.22)] transition-colors hover:bg-purple-950/80"
            >
              <UserRound className="h-6 w-6 text-purple-300" />
              Ya tengo cuenta
            </button>
          </div>

          <p className="mt-5 text-xs font-medium text-purple-200/70">FrikiQuest para tiendas, eventos y TCG</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <button onClick={() => setMode("landing")} className="self-start mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <h1 className="text-2xl font-bold text-display mb-1">
        {mode === "login" ? "Iniciar sesion" : "Crear cuenta"}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {mode === "login" ? "Accede a tu cuenta FrikiQuest" : "Unete a la comunidad FrikiQuest"}
      </p>

      {error && (
        <div className="w-full max-w-sm mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="w-full max-w-sm mb-4 p-3 rounded-xl bg-neon-green/10 text-neon-green text-sm">
          {success}
        </div>
      )}

      {!success && (
        <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="w-full max-w-sm space-y-4">
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Nombre"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Contrasena"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl gradient-neon text-white font-semibold text-base shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Registrarme"}
          </button>
        </form>
      )}

      <p className="text-sm text-muted-foreground mt-6">
        {mode === "login" ? "No tienes cuenta? " : "Ya tienes cuenta? "}
        <button
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
          className="text-primary font-semibold hover:underline"
        >
          {mode === "login" ? "Crear cuenta" : "Iniciar sesion"}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
