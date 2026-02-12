import { useState } from "react";
import { Gift, Plus, Users, Trophy, Clock, Shuffle, Download } from "lucide-react";

const mockSorteos = [
  { id: 1, title: "Booster Box Pokémon SV7", prize: "1x Booster Box Stellar Crown", mode: "Por compras", endDate: "28 Feb 2026", entries: 42, active: true, winner: null },
  { id: 2, title: "Figura Luffy Gear 5", prize: "1x Figura King of Artist", mode: "Por acciones", endDate: "15 Mar 2026", entries: 28, active: true, winner: null },
  { id: 3, title: "Pack Fundas Dragon Shield", prize: "3x Pack Dragon Shield Matte", mode: "Por compras", endDate: "31 Ene 2026", entries: 67, active: false, winner: "Carlos M." },
];

const AdminSorteos = () => (
  <div className="p-6 space-y-5 animate-fade-in">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-display">Sorteos</h1>
      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
        <Plus className="w-4 h-4" />Crear Sorteo
      </button>
    </div>

    <div className="grid gap-4">
      {mockSorteos.map((s) => (
        <div key={s.id} className={`bg-card rounded-xl p-5 border ${s.active ? "border-neon-pink/20 glow-orange" : "border-border/50 opacity-70"} space-y-4`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${s.active ? "bg-neon-green/10 text-neon-green" : "bg-muted text-muted-foreground"}`}>
                  {s.active ? "Activo" : "Finalizado"}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{s.mode}</span>
              </div>
              <p className="text-base font-semibold">{s.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">🎁 {s.prize}</p>
            </div>
            <Gift className={`w-5 h-5 ${s.active ? "text-neon-pink" : "text-muted-foreground"}`} />
          </div>

          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.active ? `Hasta ${s.endDate}` : `Terminó ${s.endDate}`}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{s.entries} participantes</span>
          </div>

          {s.winner && (
            <div className="flex items-center gap-2 bg-neon-orange/10 rounded-lg p-3">
              <Trophy className="w-4 h-4 text-neon-orange" />
              <span className="text-sm font-medium text-neon-orange">Ganador: {s.winner}</span>
            </div>
          )}

          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs hover:bg-surface-hover transition-colors">
              <Download className="w-3.5 h-3.5" />Exportar ({s.entries})
            </button>
            {s.active && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-pink/10 text-neon-pink text-xs hover:bg-neon-pink/20 transition-colors">
                <Shuffle className="w-3.5 h-3.5" />Elegir ganador
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminSorteos;
