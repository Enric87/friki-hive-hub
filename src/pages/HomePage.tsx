import { BadgeCheck, Bell, CalendarClock, ChevronRight, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLevels, useProfile } from "@/hooks/useProfile";
import { useStore } from "@/contexts/StoreContext";
import pokemonEvent from "@/assets/eventos/torneo-pokemon.jpg";
import frikiQuestLogo from "@/assets/logo-friki-quest.png";
import gojoFigure from "@/assets/reservas/gojo-hollow-purple.jpg";
import pokemonBooster from "@/assets/reservas/pokemon-sv8-booster.jpg";
import pointsIcon from "@/assets/home-icons-cropped/gana-puntos.png";
import rewardsIcon from "@/assets/home-icons-cropped/canjea-recompensas.png";
import ticketsIcon from "@/assets/home-icons-cropped/escanea-tickets.png";
import eventsIcon from "@/assets/home-icons-cropped/eventos-reservas.png";

const quickActions = [
  { image: ticketsIcon, label: "Subir ticket", path: "/tickets", tone: "cyan" },
  { image: eventsIcon, label: "Eventos y reservas", path: "/eventos", tone: "blue" },
  { image: rewardsIcon, label: "Canjear puntos", path: "/recompensas", tone: "pink" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: levels } = useLevels();
  const { config } = useStore();

  const currentPoints = profile?.points ?? 0;
  const currentLevelData = levels?.filter((level) => currentPoints >= level.min_points).pop();
  const nextLevel = levels?.find((level) => level.min_points > currentPoints);
  const currentLevel = currentLevelData?.name ?? profile?.level ?? "Aventurero";
  const progressBase = currentLevelData?.min_points ?? 0;
  const nextTarget = nextLevel?.min_points ?? Math.max(currentPoints, 500);
  const progressPercent = nextLevel
    ? ((currentPoints - progressBase) / (nextLevel.min_points - progressBase)) * 100
    : 100;

  const userName = profile?.display_name?.split(" ")[0] || "Alex";

  return (
    <div className="relative mx-auto min-h-screen max-w-lg overflow-hidden px-4 pb-5 pt-4 animate-fade-in">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[440px] bg-[radial-gradient(circle_at_74%_18%,rgba(217,70,239,0.36),transparent_24%),radial-gradient(circle_at_55%_8%,rgba(56,189,248,0.16),transparent_25%),linear-gradient(180deg,rgba(8,10,36,0.96),rgba(4,6,20,0.72)_58%,rgba(4,6,20,0)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[214px] h-44 opacity-60 [background:linear-gradient(90deg,transparent_0_5%,rgba(17,24,39,0.82)_5%_9%,transparent_9%_13%,rgba(15,23,42,0.76)_13%_17%,transparent_17%_23%,rgba(17,24,39,0.7)_23%_29%,transparent_29%_68%,rgba(15,23,42,0.78)_68%_75%,transparent_75%_81%,rgba(17,24,39,0.68)_81%_87%,transparent_87%_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[linear-gradient(115deg,transparent_0_62%,rgba(168,85,247,0.55)_63%,transparent_64%),linear-gradient(122deg,transparent_0_70%,rgba(236,72,153,0.35)_71%,transparent_72%)] opacity-70" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between text-sm font-black text-white/95">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-4 rounded-sm bg-white/90" />
            <span className="h-3 w-5 rounded-[3px] border border-white/90" />
          </div>
        </div>

        <header className="flex items-center justify-between">
          <button onClick={() => navigate("/perfil")} className="flex min-w-0 items-center gap-3 text-left">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-violet-400/70 bg-white shadow-[0_0_26px_rgba(168,85,247,0.42)]">
              <img src={frikiQuestLogo} alt="" aria-hidden="true" className="h-full w-full scale-[1.58] object-contain object-top" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-3xl font-black tracking-tight">¡Hola, {userName}!</p>
              <p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-slate-300">
                {currentLevel}
                <BadgeCheck className="h-4 w-4 fill-cyan-400 text-cyan-950" />
              </p>
            </div>
          </button>

          <button className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_0_22px_rgba(255,255,255,0.08)]">
            <Bell className="h-7 w-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            <span className="absolute right-1.5 top-1.5 h-3.5 w-3.5 rounded-full bg-orange-500 shadow-[0_0_14px_rgba(249,115,22,0.95)]" />
          </button>
        </header>

        <section className="rounded-[24px] border-2 border-violet-500/80 bg-[#100b2b]/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_56px_rgba(3,5,18,0.42)] backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-black uppercase tracking-wide text-yellow-200">Puntos disponibles</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-6xl font-black leading-none text-yellow-300 text-display drop-shadow-[0_0_22px_rgba(250,204,21,0.42)]">
                  {currentPoints}
                </span>
                <span className="pb-2 text-2xl font-black text-yellow-200">pts</span>
              </div>
            </div>
            <img src={pointsIcon} alt="" aria-hidden="true" className="h-28 w-28 shrink-0 object-contain" />
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between gap-3 text-sm font-bold text-slate-300">
              <span className="min-w-0 truncate">Siguiente nivel: {nextLevel?.name ?? currentLevel}</span>
              <span className="shrink-0 text-yellow-200">
                {currentPoints} / {nextTarget} pts
              </span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 shadow-[0_0_22px_rgba(250,204,21,0.65)]"
                style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-black tracking-tight">Acciones rápidas</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map(({ image, label, path, tone }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex min-h-[130px] flex-col items-center justify-center gap-3 rounded-[20px] border bg-[#071129]/76 p-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_24px_rgba(3,5,18,0.3)] transition-transform active:scale-95 ${getActionTone(tone)}`}
              >
                <img src={image} alt="" aria-hidden="true" className="h-16 w-16 object-contain" />
                <span className="text-base font-black leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <PreviewSection title="Próximo evento" action={() => navigate("/eventos")}>
          <button onClick={() => navigate("/eventos")} className="app-card flex w-full items-center gap-4 rounded-[20px] p-3 text-left">
            <img src={pokemonEvent} alt="" className="h-20 w-24 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xl font-black">Torneo Pokémon</p>
              <p className="mt-1 text-sm font-semibold text-slate-300">Sábado, 15 feb · 17:00</p>
              <p className="mt-1 text-sm font-black text-emerald-300">Quedan 8 plazas</p>
            </div>
            <ChevronRight className="h-7 w-7 text-cyan-300" />
          </button>
        </PreviewSection>

        <PreviewSection title="Reservas activas" action={() => navigate("/reservas")}>
          <button onClick={() => navigate("/reservas")} className="app-card flex w-full items-center gap-4 rounded-[20px] p-3 text-left">
            <img src={gojoFigure} alt="" className="h-20 w-24 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xl font-black">Figura Gojo SSJ</p>
              <p className="mt-1 text-sm font-semibold text-slate-300">Reservada · Recogida en tienda</p>
              <p className="mt-1 text-sm font-black text-emerald-300">Fecha límite: 20 feb</p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/70 bg-violet-500/10">
              <CalendarClock className="h-7 w-7 text-violet-300" />
            </div>
          </button>
        </PreviewSection>

        <PreviewSection title="Alertas TCG" action={() => navigate("/tcg")}>
          <button onClick={() => navigate("/tcg")} className="app-card flex w-full items-center gap-4 rounded-[20px] p-3 text-left">
            <img src={pokemonBooster} alt="" className="h-20 w-24 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xl font-black">Nuevo restock: Pokémon 151</p>
              <p className="mt-1 text-sm font-semibold text-slate-300">Hace 2 horas</p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-fuchsia-400/70 bg-fuchsia-500/10">
              <Bell className="h-7 w-7 text-fuchsia-300" />
            </div>
          </button>
        </PreviewSection>
      </div>
    </div>
  );
};

const getActionTone = (tone: string) => {
  if (tone === "cyan") return "border-cyan-400/70 shadow-cyan-500/10";
  if (tone === "blue") return "border-blue-500/60 shadow-blue-500/10";
  return "border-fuchsia-400/70 shadow-fuchsia-500/10";
};

const PreviewSection = ({ title, action, children }: { title: string; action: () => void; children: React.ReactNode }) => (
  <section>
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-2xl font-black tracking-tight">{title}</h2>
      <button onClick={action} className="flex items-center gap-1 text-lg font-bold text-cyan-300">
        Ver todos <ChevronRight className="h-5 w-5" />
      </button>
    </div>
    {children}
  </section>
);

export default HomePage;
