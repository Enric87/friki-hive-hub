import { useState } from "react";
import { Calendar, MapPin, Users, Clock, ChevronRight } from "lucide-react";

type EventCategory = "all" | "TCG" | "Lanzamiento" | "Evento" | "Torneo";

const mockEvents = [
  {
    id: 1,
    title: "Torneo Pokémon TCG Liga Febrero",
    date: "15 Feb 2026",
    time: "17:00",
    location: "Tienda - Sala Principal",
    spots: { total: 16, taken: 12 },
    category: "Torneo" as const,
    price: "5€",
    registered: false,
  },
  {
    id: 2,
    title: "Lanzamiento One Piece OP-10",
    date: "20 Feb 2026",
    time: "10:00",
    location: "Tienda",
    spots: { total: 30, taken: 18 },
    category: "Lanzamiento" as const,
    price: null,
    registered: true,
  },
  {
    id: 3,
    title: "Quedada Warhammer: Pintura",
    date: "22 Feb 2026",
    time: "16:00",
    location: "Tienda - Sala 2",
    spots: { total: 10, taken: 2 },
    category: "Evento" as const,
    price: null,
    registered: false,
  },
  {
    id: 4,
    title: "Torneo Yu-Gi-Oh! Locals",
    date: "1 Mar 2026",
    time: "11:00",
    location: "Tienda - Sala Principal",
    spots: { total: 16, taken: 16 },
    category: "Torneo" as const,
    price: "3€",
    registered: false,
  },
];

const categoryColors: Record<string, string> = {
  TCG: "bg-neon-green/10 text-neon-green",
  Lanzamiento: "bg-neon-orange/10 text-neon-orange",
  Evento: "bg-neon-purple/10 text-neon-purple",
  Torneo: "bg-primary/10 text-primary",
};

const categories: EventCategory[] = ["all", "TCG", "Lanzamiento", "Evento", "Torneo"];

const EventosPage = () => {
  const [filter, setFilter] = useState<EventCategory>("all");
  const filtered = filter === "all" ? mockEvents : mockEvents.filter((e) => e.category === filter);

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-display">Eventos</h1>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === c
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {c === "all" ? "Todos" : c}
          </button>
        ))}
      </div>

      {/* Event List */}
      <div className="space-y-3">
        {filtered.map((event) => {
          const full = event.spots.taken >= event.spots.total;
          return (
            <div key={event.id} className="bg-card rounded-xl p-4 border border-border/50 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${categoryColors[event.category] || "bg-muted text-muted-foreground"}`}>
                      {event.category}
                    </span>
                    {event.price && <span className="text-[10px] text-neon-orange">{event.price}</span>}
                  </div>
                  <p className="text-sm font-semibold">{event.title}</p>
                </div>
                {event.registered && (
                  <span className="text-[10px] bg-neon-green/10 text-neon-green px-2 py-1 rounded-full shrink-0 ml-2">
                    Inscrito ✓
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                <span className={`flex items-center gap-1 ${full ? "text-destructive" : "text-neon-green"}`}>
                  <Users className="w-3 h-3" />{event.spots.taken}/{event.spots.total}
                </span>
              </div>

              {!event.registered && (
                <button
                  disabled={full}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    full
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                  }`}
                >
                  {full ? "Completo" : "Inscribirme"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventosPage;
