import { useState } from "react";
import { Calendar, Users, Plus, MapPin, Clock, Eye, UserCheck } from "lucide-react";

const mockEvents = [
  { id: 1, title: "Torneo Pokémon TCG Liga Febrero", date: "15 Feb 2026", time: "17:00", location: "Sala Principal", spots: { total: 16, taken: 12 }, price: "5€", category: "Torneo", registrations: 12, checkins: 0 },
  { id: 2, title: "Lanzamiento One Piece OP-10", date: "20 Feb 2026", time: "10:00", location: "Tienda", spots: { total: 30, taken: 18 }, price: null, category: "Lanzamiento", registrations: 18, checkins: 0 },
  { id: 3, title: "Quedada Warhammer: Pintura", date: "22 Feb 2026", time: "16:00", location: "Sala 2", spots: { total: 10, taken: 2 }, price: null, category: "Evento", registrations: 2, checkins: 0 },
  { id: 4, title: "Torneo Yu-Gi-Oh! Locals", date: "1 Mar 2026", time: "11:00", location: "Sala Principal", spots: { total: 16, taken: 16 }, price: "3€", category: "Torneo", registrations: 16, checkins: 0 },
];

const AdminEventos = () => (
  <div className="p-6 space-y-5 animate-fade-in">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-display">Eventos</h1>
      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
        <Plus className="w-4 h-4" />Crear Evento
      </button>
    </div>

    <div className="grid gap-4">
      {mockEvents.map((event) => {
        const full = event.spots.taken >= event.spots.total;
        return (
          <div key={event.id} className="bg-card rounded-xl p-5 border border-border/50 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple">{event.category}</span>
                  {event.price && <span className="text-[10px] text-neon-orange">{event.price}</span>}
                  {full && <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">Completo</span>}
                </div>
                <p className="text-base font-semibold">{event.title}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
              <span className={`flex items-center gap-1 ${full ? "text-destructive" : "text-neon-green"}`}>
                <Users className="w-3 h-3" />{event.spots.taken}/{event.spots.total}
              </span>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs hover:bg-surface-hover transition-colors">
                <Eye className="w-3.5 h-3.5" />Ver inscritos ({event.registrations})
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-green/10 text-neon-green text-xs hover:bg-neon-green/20 transition-colors">
                <UserCheck className="w-3.5 h-3.5" />Check-in ({event.checkins})
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default AdminEventos;
