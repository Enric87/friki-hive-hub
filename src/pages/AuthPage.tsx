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

type AuthMode = "landing" | "login" | "signup";

const features = [
  { icon: Ticket, label: "Escanea tickets", color: "text-sky-300", glow: "shadow-sky-400/40" },
  { icon: Coins, label: "Gana puntos", color: "text-yellow-300", glow: "shadow-yellow-300/40" },
  { icon: Gift, label: "Canjea recompensas", color: "text-pink-300", glow: "shadow-pink-400/40" },
  { icon: CalendarDays, label: "Eventos y reservas", color: "text-emerald-300", glow: "shadow-emerald-400/40" },
  { icon: Bell, label: "Alertas TCG", color: "text-purple-300", glow: "shadow-purple-400/40" },
];

const backgroundIcons = [
  { icon: "GAME", className: "left-8 top-10 -rotate-12" },
  { icon: "D20", className: "left-8 top-[27%] rotate-12" },
  { icon: "TCG", className: "right-8 top-[22%] -rotate-12" },
  { icon: "XP", className: "left-12 bottom-[35%] rotate-12" },
  { icon: "STAR", className: "right-8 bottom-[31%] -rotate-12" },
  { icon: "+", className: "left-10 bottom-24 rotate-12" },
  { icon: "O", className: "right-12 top-10 rotate-12" },
  { icon: "+", className: "right-9 bottom-28 -rotate-12" },
];

const CodeCatLogo = () => (
  <div className="relative mx-auto w-full max-w-[360px]">
    <div className="absolute left-9 top-[35%] h-8 w-16 -rotate-[28deg] rounded-full bg-purple-500/80 blur-sm" />
    <div className="absolute right-7 top-[33%] h-8 w-14 rotate-[22deg] rounded-full bg-fuchsia-500/80 blur-sm" />
    <svg
      viewBox="0 0 360 315"
      className="relative z-10 w-full drop-shadow-[0_18px_24px_rgba(10,3,28,0.8)]"
      role="img"
      aria-label="FrikiQuest logo"
    >
      <defs>
        <linearGradient id="questGradient" x1="42" x2="322" y1="222" y2="270" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C2DFF" />
          <stop offset="0.55" stopColor="#C23BFF" />
          <stop offset="1" stopColor="#F04DCE" />
        </linearGradient>
        <linearGradient id="lensGradient" x1="120" x2="215" y1="70" y2="135" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8FAFC" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      <path d="M101 100 L83 42 L137 68 C151 50 176 40 199 48 C218 35 239 27 270 19 C281 54 278 82 263 103 C274 114 280 130 280 148 C280 197 237 224 181 224 C124 224 81 195 81 148 C81 129 88 113 101 100Z" fill="#111525" stroke="#F8FAFC" strokeWidth="9" strokeLinejoin="round" />
      <path d="M104 101 L91 57 L130 79" fill="#050817" stroke="#252A44" strokeWidth="7" strokeLinejoin="round" />
      <path d="M231 76 C241 66 252 58 265 52 C266 70 263 87 254 101" fill="#050817" stroke="#252A44" strokeWidth="7" strokeLinejoin="round" />
      <path d="M133 52 C153 63 166 74 179 89 C193 78 204 74 222 73 C214 83 205 90 195 95 C215 92 227 94 243 103" fill="none" stroke="#111525" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M133 52 C153 63 166 74 179 89 C193 78 204 74 222 73 C214 83 205 90 195 95 C215 92 227 94 243 103" fill="none" stroke="#F8FAFC" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M124 55 C145 65 163 78 178 94 C194 81 207 75 223 75" fill="none" stroke="#111525" strokeWidth="7" strokeLinecap="round" />

      <circle cx="139" cy="134" r="38" fill="#080B19" stroke="url(#lensGradient)" strokeWidth="7" />
      <circle cx="222" cy="132" r="38" fill="#080B19" stroke="#F8FAFC" strokeWidth="7" />
      <path d="M177 132 C188 126 192 126 204 132" fill="none" stroke="#F8FAFC" strokeWidth="7" strokeLinecap="round" />
      <circle cx="129" cy="129" r="19" fill="#F8FAFC" />
      <circle cx="137" cy="121" r="7" fill="#050817" />
      <path d="M207 131 C218 119 232 117 244 126" fill="none" stroke="#F8FAFC" strokeWidth="6" strokeLinecap="round" />
      <path d="M174 154 C180 161 190 161 196 154" fill="#F472B6" stroke="#F8FAFC" strokeWidth="3" strokeLinejoin="round" />
      <path d="M181 151 L188 158 L195 151" fill="#F9A8D4" />
      <path d="M171 143 L181 149 L191 143" fill="none" stroke="#F8FAFC" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M98 178 C103 158 128 161 131 184" fill="#111525" stroke="#050817" strokeWidth="4" />
      <path d="M239 182 C241 160 269 158 271 180" fill="#111525" stroke="#050817" strokeWidth="4" />

      <path d="M38 169 L293 141 L310 177 L344 174 L337 230 L319 232 L308 278 L56 297 L45 264 L18 266 L28 206 L48 204 Z" fill="#090B1A" stroke="#F8FAFC" strokeWidth="9" strokeLinejoin="round" />
      <text x="56" y="217" fill="#F8FAFC" stroke="#FFFFFF" strokeWidth="2" fontFamily="Orbitron, sans-serif" fontSize="61" fontWeight="900" transform="skewX(-9)">FRIKI</text>
      <text x="42" y="271" fill="url(#questGradient)" stroke="#C084FC" strokeWidth="2" fontFamily="Orbitron, sans-serif" fontSize="63" fontWeight="900" transform="skewX(-9)">QUEST</text>
      <path d="M48 229 L310 202" stroke="#7C3AED" strokeWidth="3" opacity="0.45" />
    </svg>
  </div>
);

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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(50,74,153,0.32),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(143,35,207,0.55),transparent_34%),linear-gradient(180deg,#07081c_0%,#0b0b29_58%,#26084b_100%)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:42px_42px]" />
        {backgroundIcons.map((item) => (
          <span
            key={`${item.icon}-${item.className}`}
            className={`absolute text-4xl font-black text-indigo-300/10 text-display ${item.className}`}
          >
            {item.icon}
          </span>
        ))}
        <div className="absolute -bottom-24 left-1/2 h-52 w-[130%] -translate-x-1/2 rounded-[50%] bg-purple-700/55 blur-sm" />

        <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-5 py-8 text-center">
          <CodeCatLogo />

          <div className="-mt-3 space-y-3">
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
