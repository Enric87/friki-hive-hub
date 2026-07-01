import { Bell, Calendar, ChevronRight, ShoppingBag, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLevels, useProfile } from "@/hooks/useProfile";
import { useStore } from "@/contexts/StoreContext";
import pokemonEvent from "@/assets/eventos/torneo-pokemon.jpg";
import gojoFigure from "@/assets/reservas/gojo-hollow-purple.jpg";
import pokemonBooster from "@/assets/reservas/pokemon-sv8-booster.jpg";
import rewardsIcon from "@/assets/home-icons-cropped/canjea-recompensas.png";
import ticketsIcon from "@/assets/home-icons-cropped/escanea-tickets.png";
import eventsIcon from "@/assets/home-icons-cropped/eventos-reservas.png";

const quickActions = [
  { image: ticketsIcon, label: "Subir ticket", path: "/tickets" },
  { image: eventsIcon, label: "Eventos y reservas", path: "/eventos" },
  { image: rewardsIcon, label: "Canjear puntos", path: "/recompensas" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: levels } = useLevels();
  const { config } = useStore();

  const currentPoints = profile?.points ?? 0;
  const currentLevelData = levels?.filter((level) => currentPoints >= level.min_points).pop();
  const nextLevel = levels?.find((level) => level.min_points > currentPoints);
  const currentLevel = currentLevelData?.name ?? profile?.level ?? "Novato";
  const progressBase = currentLevelData?.min_points ?? 0;
  const nextTarget = nextLevel?.min_points ?? Math.max(currentPoints, 500);
  const progressPercent = nextLevel
    ? ((currentPoints - progressBase) / (nextLevel.min_points - progressBase)) * 100
    : 100;

  const userName = profile?.display_name?.split(" ")[0] || "Alex";

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pb-4 pt-5 animate-fade-in">
      <header className="flex items-center justify-between">
        <button onClick={() => navigate("/perfil")} className="flex items-center gap-3 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-300/50 bg-gradient-to-br from-amber-300 to-violet-600 shadow-[0_0_22px_rgba(168,85,247,0.35)]">
            <Star className="h-5 w-5 fill-white text-white" />
          </div>
          <div>
            <p className="text-base font-black">Hola, {userName}!</p>
            <p className="text-xs font-medium text-cyan-300">{config.store_name}</p>
          </div>
        </button>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <Bell className="h-5 w-5 text-white" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.9)]" />
        </button>
      </header>

      <section className="app-card overflow-hidden rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wide text-yellow-100">Puntos disponibles</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-5xl font-black leading-none text-yellow-300 text-display">{currentPoints}</span>
              <span className="pb-1 text-xl font-black text-yellow-200">pts</span>
            </div>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-yellow-200/60 bg-yellow-300/10 shadow-[0_0_30px_rgba(250,204,21,0.45)]">
            <Star className="h-10 w-10 fill-yellow-300 text-yellow-300" />
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-300">
            <span>Siguiente nivel: {nextLevel?.name ?? currentLevel}</span>
            <span>{currentPoints} / {nextTarget} pts</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-fuchsia-400 shadow-[0_0_18px_rgba(250,204,21,0.55)]"
              style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-black">Acciones rápidas</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map(({ image, label, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex min-h-[108px] flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] p-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_24px_rgba(168,85,247,0.12)] transition-transform active:scale-95"
            >
              <img src={image} alt="" aria-hidden="true" className="h-14 w-14 object-contain" />
              <span className="text-xs font-black leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <PreviewSection title="Próximo evento" action={() => navigate("/eventos")}>
        <button onClick={() => navigate("/eventos")} className="app-card flex w-full items-center gap-3 rounded-xl p-3 text-left">
          <img src={pokemonEvent} alt="" className="h-16 w-16 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black">Torneo Pokémon</p>
            <p className="mt-1 text-xs text-slate-300">Sábado, 15 feb · 17:00</p>
            <p className="mt-1 text-xs font-bold text-emerald-300">Quedan 8 plazas</p>
          </div>
          <ChevronRight className="h-5 w-5 text-cyan-300" />
        </button>
      </PreviewSection>

      <PreviewSection title="Reservas activas" action={() => navigate("/reservas")}>
        <button onClick={() => navigate("/reservas")} className="app-card flex w-full items-center gap-3 rounded-xl p-3 text-left">
          <img src={gojoFigure} alt="" className="h-16 w-16 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black">Figura Gojo SSJ</p>
            <p className="mt-1 text-xs text-slate-300">Reservada · Recogida en tienda</p>
            <p className="mt-1 text-xs font-bold text-emerald-300">Fecha límite: 20 feb</p>
          </div>
          <ShoppingBag className="h-5 w-5 text-violet-300" />
        </button>
      </PreviewSection>

      <PreviewSection title="Alertas TCG" action={() => navigate("/tcg")}>
        <button onClick={() => navigate("/tcg")} className="app-card flex w-full items-center gap-3 rounded-xl p-3 text-left">
          <img src={pokemonBooster} alt="" className="h-16 w-16 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black">Nuevo restock: Pokémon 151</p>
            <p className="mt-1 text-xs text-slate-300">Hace 2 horas</p>
          </div>
          <Bell className="h-5 w-5 text-pink-300" />
        </button>
      </PreviewSection>
    </div>
  );
};

const PreviewSection = ({ title, action, children }: { title: string; action: () => void; children: React.ReactNode }) => (
  <section>
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-black">{title}</h2>
      <button onClick={action} className="flex items-center gap-1 text-xs font-bold text-cyan-300">
        Ver todos <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
    {children}
  </section>
);

export default HomePage;
