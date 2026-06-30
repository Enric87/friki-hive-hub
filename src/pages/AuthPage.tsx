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
  <div className="relative mx-auto w-full max-w-[390px]">
    <div className="absolute left-8 top-[39%] h-8 w-20 -rotate-[28deg] rounded-full bg-purple-500/80 blur-sm" />
    <div className="absolute right-4 top-[38%] h-8 w-20 rotate-[22deg] rounded-full bg-fuchsia-500/80 blur-sm" />
    <svg
      viewBox="0 0 420 390"
      className="relative z-10 w-full drop-shadow-[0_18px_24px_rgba(10,3,28,0.8)]"
      role="img"
      aria-label="FrikiQuest logo"
    >
      <defs>
        <linearGradient id="questGradient" x1="42" x2="356" y1="252" y2="312" gradientUnits="userSpaceOnUse">
          <stop stopColor="#741DFF" />
          <stop offset="0.5" stopColor="#B732F4" />
          <stop offset="1" stopColor="#F343D2" />
        </linearGradient>
        <linearGradient id="frikiGradient" x1="54" x2="336" y1="206" y2="221" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor="#F7F4FF" />
          <stop offset="1" stopColor="#DCD5FF" />
        </linearGradient>
        <linearGradient id="lensGradient" x1="128" x2="250" y1="82" y2="151" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8FAFC" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <filter id="hardShadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="0" floodColor="#271052" floodOpacity="1" />
          <feDropShadow dx="0" dy="18" stdDeviation="10" floodColor="#05030F" floodOpacity="0.75" />
        </filter>
      </defs>

      <path d="M92 166 L76 91 L132 122 C150 97 181 83 209 91 C232 70 266 56 312 44 C326 93 321 127 297 154 C310 169 318 188 318 210 C318 266 269 299 205 299 C139 299 91 264 91 210 C91 193 96 178 106 166Z" fill="#111525" stroke="#F8FAFC" strokeWidth="13" strokeLinejoin="round" filter="url(#hardShadow)" />
      <path d="M106 164 L92 106 L135 132" fill="#050817" stroke="#252A44" strokeWidth="8" strokeLinejoin="round" />
      <path d="M265 111 C277 99 291 91 308 84 C309 106 304 126 291 145" fill="#050817" stroke="#252A44" strokeWidth="8" strokeLinejoin="round" />
      <path d="M142 87 C166 98 184 112 204 132 C222 114 238 105 260 104 C250 117 238 127 225 133 C248 129 265 132 284 143" fill="none" stroke="#111525" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M142 87 C166 98 184 112 204 132 C222 114 238 105 260 104 C250 117 238 127 225 133 C248 129 265 132 284 143" fill="none" stroke="#F8FAFC" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />

      <circle cx="154" cy="189" r="43" fill="#080B19" stroke="url(#lensGradient)" strokeWidth="8" />
      <circle cx="249" cy="186" r="43" fill="#080B19" stroke="#F8FAFC" strokeWidth="8" />
      <path d="M197 187 C211 180 217 180 230 187" fill="none" stroke="#F8FAFC" strokeWidth="8" strokeLinecap="round" />
      <circle cx="143" cy="184" r="22" fill="#F8FAFC" />
      <circle cx="152" cy="174" r="8" fill="#050817" />
      <path d="M232 186 C245 171 262 170 276 181" fill="none" stroke="#F8FAFC" strokeWidth="7" strokeLinecap="round" />
      <path d="M195 214 C202 223 215 223 223 214" fill="#F472B6" stroke="#F8FAFC" strokeWidth="4" strokeLinejoin="round" />
      <path d="M204 211 L212 220 L221 211" fill="#F9A8D4" />
      <path d="M192 202 L204 209 L216 202" fill="none" stroke="#F8FAFC" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

      <path d="M82 256 C87 229 121 232 126 262" fill="#111525" stroke="#050817" strokeWidth="5" />
      <path d="M287 261 C291 232 328 231 331 257" fill="#111525" stroke="#050817" strokeWidth="5" />

      <path d="M25 213 L337 181 L356 224 L401 220 L390 289 L370 291 L354 344 L70 369 L55 328 L20 331 L32 257 L56 255 Z" fill="#080A19" stroke="#F8FAFC" strokeWidth="12" strokeLinejoin="round" filter="url(#hardShadow)" />
      <path d="M45 226 L324 199 L339 232 L374 229 L368 265 L344 266 L333 302 L73 326 L62 293 L41 295 L47 263 L68 260 Z" fill="#101225" stroke="#1D1238" strokeWidth="5" strokeLinejoin="round" />

      <text x="55" y="267" fill="#271052" fontFamily="Orbitron, sans-serif" fontSize="72" fontWeight="900" transform="skewX(-10)">FRIKI</text>
      <text x="51" y="258" fill="url(#frikiGradient)" stroke="#FFFFFF" strokeWidth="3" fontFamily="Orbitron, sans-serif" fontSize="72" fontWeight="900" transform="skewX(-10)">FRIKI</text>
      <text x="45" y="335" fill="#38136F" fontFamily="Orbitron, sans-serif" fontSize="78" fontWeight="900" transform="skewX(-10)">QUEST</text>
      <text x="39" y="326" fill="url(#questGradient)" stroke="#D8B4FE" strokeWidth="3" fontFamily="Orbitron, sans-serif" fontSize="78" fontWeight="900" transform="skewX(-10)">QUEST</text>
      <path d="M55 277 L349 249" stroke="#8B5CF6" strokeWidth="4" opacity="0.55" />

      <path d="M70 170 L47 141" stroke="#A855F7" strokeWidth="12" strokeLinecap="round" />
      <path d="M87 165 L79 130" stroke="#7C3AED" strokeWidth="7" strokeLinecap="round" />
      <path d="M340 168 L369 138" stroke="#A855F7" strokeWidth="12" strokeLinecap="round" />
      <path d="M326 158 L329 122" stroke="#7C3AED" strokeWidth="7" strokeLinecap="round" />
      <path d="M342 82 L353 58 L364 82 L388 93 L364 104 L353 128 L342 104 L318 93 Z" fill="#FACC15" stroke="#FFE68A" strokeWidth="4" />
      <path d="M49 108 L59 88 L69 108 L90 118 L69 128 L59 149 L49 128 L28 118 Z" fill="#EC4899" />
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

          <div className="-mt-1 space-y-3">
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
