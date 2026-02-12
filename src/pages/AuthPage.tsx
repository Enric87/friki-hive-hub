import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Star, Gift, Gamepad2, Mail, Lock, User, ArrowLeft } from "lucide-react";
import heroImage from "@/assets/hero-frikiquest.png";

type AuthMode = "landing" | "login" | "signup";

const features = [
  { icon: Star, text: "Gana puntos", highlight: "con tus compras" },
  { icon: Gift, text: "Reserva figuras", highlight: "antes que nadie" },
  { icon: Gamepad2, text: "Eventos, TCG y sorteos", highlight: "exclusivos" },
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
      setSuccess("¡Cuenta creada! Revisa tu email para confirmar tu cuenta.");
    }
    setLoading(false);
  };

  if (mode === "landing") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-4xl font-extrabold text-gradient-neon text-display tracking-tight mb-1">
          FrikiQuest
        </h1>
        <p className="text-muted-foreground text-base mb-8">Tu mundo friki en un solo lugar</p>

        <img src={heroImage} alt="FrikiQuest mascota" className="w-64 h-64 object-contain mx-auto mb-10" />

        <div className="space-y-4 mb-10 w-full max-w-sm text-left">
          {features.map(({ icon: Icon, text, highlight }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-foreground">
                <span className="font-semibold">{text}</span>{" "}
                <span className="text-muted-foreground">{highlight}</span>
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setMode("signup")}
          className="w-full max-w-sm py-3.5 rounded-2xl gradient-neon text-white font-semibold text-base shadow-lg hover:opacity-90 transition-opacity mb-4"
        >
          Crear cuenta
        </button>

        <p className="text-sm text-muted-foreground mb-6">
          Ya tengo cuenta →{" "}
          <button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">
            Iniciar sesión
          </button>
        </p>

        <p className="text-xs text-muted-foreground/60">Únete a tu tienda friki favorita</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <button onClick={() => setMode("landing")} className="self-start mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <h1 className="text-2xl font-bold text-display mb-1">
        {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {mode === "login" ? "Accede a tu cuenta FrikiQuest" : "Únete a la comunidad FrikiQuest"}
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
              placeholder="Contraseña"
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
        {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
        <button
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
          className="text-primary font-semibold hover:underline"
        >
          {mode === "login" ? "Crear cuenta" : "Iniciar sesión"}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
