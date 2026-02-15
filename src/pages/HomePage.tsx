import { Receipt, ShoppingBag, Calendar, Gift, Star, Trophy, TrendingUp, CheckCircle, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useStore } from "@/contexts/StoreContext";

const quickActions = [
  { icon: Receipt, label: "Enviar Ticket", path: "/tickets", color: "text-primary" },
  { icon: ShoppingBag, label: "Reservar", path: "/reservas", color: "text-neon-orange" },
  { icon: Calendar, label: "Eventos", path: "/eventos", color: "text-neon-purple" },
];

const mockEvents = [
  { id: 1, title: "Torneo Pokémon TCG", date: "15 Feb", spots: 4, category: "TCG" },
  { id: 2, title: "Lanzamiento One Piece OP-10", date: "20 Feb", spots: 12, category: "Lanzamiento" },
  { id: 3, title: "Quedada Warhammer", date: "22 Feb", spots: 8, category: "Evento" },
];

const mockGiveaways = [
  { id: 1, title: "Booster Box Pokémon SV7", endDate: "28 Feb", entries: 42 },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { config } = useStore();

  const currentPoints = profile?.points ?? 0;
  const currentLevel = profile?.level ?? "Novato";
  const nextLevelPoints = currentPoints < 500 ? 500 : currentPoints < 1000 ? 1000 : currentPoints < 2000 ? 2000 : currentPoints < 5000 ? 5000 : null;
  const progressPercent = nextLevelPoints ? (currentPoints / nextLevelPoints) * 100 : 100;

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Bienvenido de nuevo</p>
          <h1 className="text-2xl font-bold text-gradient-neon text-display">{config.store_name}</h1>
        </div>
        <button
          onClick={() => navigate("/perfil")}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-border"
        >
          <Star className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Points Card */}
      <div className="rounded-2xl bg-card p-5 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground text-display tracking-widest uppercase">Tus Puntos</p>
            <p className="text-3xl font-bold text-primary text-display">{currentPoints.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-neon-orange" />
              <span className="text-sm font-semibold text-neon-orange text-display">{currentLevel}</span>
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progreso al siguiente nivel</span>
            {nextLevelPoints && <span>{currentPoints}/{nextLevelPoints}</span>}
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-neon rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">+ 1 participación en sorteos</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {quickActions.map(({ icon: Icon, label, path, color }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="relative flex flex-col items-center gap-2 p-4 rounded-2xl bg-card hover:bg-surface-hover transition-colors border border-border"
          >
            <div>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <span className="text-xs text-muted-foreground leading-tight text-center">{label}</span>
          </button>
        ))}
      </div>

      {/* Rewards CTA */}
      <button
        onClick={() => navigate("/recompensas")}
        className="w-full flex items-center gap-3 bg-card rounded-2xl p-4 border border-primary/20 hover:bg-surface-hover transition-colors"
      >
        <div className="w-11 h-11 rounded-xl gradient-neon flex items-center justify-center shrink-0">
          <Award className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold">Canjea tus puntos</p>
          <p className="text-xs text-muted-foreground">Descubre las recompensas disponibles</p>
        </div>
        <span className="text-xs text-primary font-medium">Ver →</span>
      </button>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Cupones", value: 1, icon: Gift, color: "text-neon-orange" },
          { label: "Reservas", value: 2, icon: ShoppingBag, color: "text-primary" },
          { label: "Eventos", value: mockEvents.length, icon: Calendar, color: "text-neon-purple" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card rounded-2xl p-4 border border-border text-center">
            <Icon className={`w-7 h-7 mx-auto mb-1.5 ${color}`} />
            <p className="text-2xl font-bold text-display">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-display tracking-wider uppercase">Próximos Eventos</h2>
          <button onClick={() => navigate("/eventos")} className="text-xs text-primary font-medium">Ver todos</button>
        </div>
        <div className="space-y-2">
          {mockEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border">
              <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-neon-purple" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.date} · {event.spots} plazas</p>
              </div>
              <button
                onClick={() => navigate("/eventos")}
                className="shrink-0 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                Inscribirme
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Active Giveaway */}
      {mockGiveaways.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-display tracking-wider uppercase mb-3">Sorteo Activo 🎉</h2>
          {mockGiveaways.map((g) => (
            <div key={g.id} className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border">
              <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-neon-pink" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{g.title}</p>
                <p className="text-xs text-muted-foreground">Finaliza: {g.endDate} · {g.entries} participantes</p>
              </div>
              <button
                onClick={() => navigate("/sorteos")}
                className="shrink-0 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                Participar
              </button>
            </div>
          ))}
        </section>
      )}

      {/* Activity */}
      <section>
        <h2 className="text-sm font-semibold text-display tracking-wider uppercase mb-3">Actividad Reciente</h2>
        <div className="space-y-2">
          {[
            { text: "Ticket aprobado · +25 pts", time: "Hace 2h", icon: CheckCircle, color: "text-neon-green" },
            { text: "Reserva confirmada: Gojo Fig.", time: "Ayer", icon: ShoppingBag, color: "text-primary" },
            { text: "Inscripción: Torneo Pokémon", time: "Hace 3d", icon: Calendar, color: "text-neon-purple" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm">{item.text}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
