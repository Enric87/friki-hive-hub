import { useState } from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

import lanzamientoOnepieceImg from "@/assets/eventos/lanzamiento-onepiece.jpg";
import quedadaWarhammerImg from "@/assets/eventos/quedada-warhammer.jpg";
import torneoPokemonImg from "@/assets/eventos/torneo-pokemon.jpg";
import torneoTcgLeagueImg from "@/assets/eventos/torneo-tcg-league.jpg";
import torneoYugiohImg from "@/assets/eventos/torneo-yugioh.jpg";

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
    price: "5 €",
    registered: false,
    image: torneoPokemonImg,
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
    image: lanzamientoOnepieceImg,
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
    image: quedadaWarhammerImg,
  },
  {
    id: 4,
    title: "Torneo Yu-Gi-Oh! Locals",
    date: "1 Mar 2026",
    time: "11:00",
    location: "Tienda - Sala Principal",
    spots: { total: 16, taken: 16 },
    category: "Torneo" as const,
    price: "3 €",
    registered: false,
    image: torneoYugiohImg,
  },
  {
    id: 5,
    title: "Liga TCG Semanal - Magic Modern",
    date: "25 Feb 2026",
    time: "18:00",
    location: "Tienda - Sala Principal",
    spots: { total: 20, taken: 8 },
    category: "TCG" as const,
    price: "3 €",
    registered: false,
    image: torneoTcgLeagueImg,
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
  const [events, setEvents] = useState(mockEvents);
  const [filter, setFilter] = useState<EventCategory>("all");
  const filtered = filter === "all" ? events : events.filter((event) => event.category === filter);

  const handleRegister = (eventId: number) => {
    setEvents((currentEvents) =>
      currentEvents.map((event) => {
        const full = event.spots.taken >= event.spots.total;

        if (event.id !== eventId || event.registered || full) {
          return event;
        }

        return {
          ...event,
          registered: true,
          spots: {
            ...event.spots,
            taken: event.spots.taken + 1,
          },
        };
      }),
    );
  };

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pb-4 pt-6 animate-fade-in">
      <h1 className="text-xl font-bold text-display">Eventos</h1>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === category ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {category === "all" ? "Todos" : category}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((event) => {
          const full = event.spots.taken >= event.spots.total;
          return (
            <div key={event.id} className="overflow-hidden rounded-xl border border-border/50 bg-card">
              <img src={event.image} alt={event.title} className="h-36 w-full object-cover" />
              <div className="space-y-3 px-4 pb-4 pt-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] ${categoryColors[event.category] || "bg-muted text-muted-foreground"}`}>
                        {event.category}
                      </span>
                      {event.price && <span className="text-[10px] text-neon-orange">{event.price}</span>}
                    </div>
                    <p className="text-sm font-semibold">{event.title}</p>
                  </div>
                  {event.registered && (
                    <span className="ml-2 shrink-0 rounded-full bg-neon-green/10 px-2 py-1 text-[10px] text-neon-green">
                      Inscrito
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{event.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
                  <span className={`flex items-center gap-1 ${full ? "text-destructive" : "text-neon-green"}`}>
                    <Users className="h-3 w-3" />{event.spots.taken}/{event.spots.total}
                  </span>
                </div>

                {!event.registered && (
                  <button
                    disabled={full}
                    onClick={() => handleRegister(event.id)}
                    className={`w-full rounded-lg py-2 text-sm font-medium transition-colors ${
                      full
                        ? "cursor-not-allowed bg-muted text-muted-foreground"
                        : "border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    {full ? "Completo" : "Inscribirme"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventosPage;
