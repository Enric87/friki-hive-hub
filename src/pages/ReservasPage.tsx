import { useState } from "react";
import { ShoppingBag, Clock, Truck, Package, ChevronRight, Bell } from "lucide-react";

import gojoImg from "@/assets/reservas/gojo-hollow-purple.jpg";
import dragonballImg from "@/assets/reservas/dragonball-daima-boxset.jpg";
import pokemonImg from "@/assets/reservas/pokemon-sv8-booster.jpg";
import chainsawImg from "@/assets/reservas/chainsaw-man-vol18.jpg";

type ReservaStatus = "solicitada" | "confirmada" | "en_camino" | "lista" | "retirada" | "cancelada";

const statusConfig: Record<ReservaStatus, { label: string; color: string; bg: string }> = {
  solicitada: { label: "Solicitada", color: "text-neon-orange", bg: "bg-neon-orange/10" },
  confirmada: { label: "Confirmada", color: "text-primary", bg: "bg-primary/10" },
  en_camino: { label: "En camino", color: "text-neon-purple", bg: "bg-neon-purple/10" },
  lista: { label: "Lista para recoger", color: "text-neon-green", bg: "bg-neon-green/10" },
  retirada: { label: "Retirada", color: "text-muted-foreground", bg: "bg-muted" },
  cancelada: { label: "Cancelada", color: "text-destructive", bg: "bg-destructive/10" },
};

const mockProducts = [
  { id: 1, name: "Gojo Satoru - Hollow Purple", category: "Figuras", status: "soon" as const, price: "189.90€", eta: "Marzo 2026", image: gojoImg },
  { id: 2, name: "Dragon Ball Daima Box Set", category: "Manga", status: "out" as const, price: "45.00€", eta: null, image: dragonballImg },
  { id: 3, name: "Pokémon SV8 Booster Box", category: "TCG", status: "soon" as const, price: "149.99€", eta: "Abril 2026", image: pokemonImg },
  { id: 4, name: "Chainsaw Man Vol. 18 Ed. Especial", category: "Manga", status: "out" as const, price: "14.95€", eta: "Feb 2026", image: chainsawImg },
];

const mockReservas = [
  { id: 1, productName: "Gojo Satoru - Hollow Purple", status: "confirmada" as ReservaStatus, date: "10 Feb 2026", image: gojoImg },
  { id: 2, productName: "Pokémon SV7 Elite Trainer", status: "lista" as ReservaStatus, date: "8 Feb 2026", image: pokemonImg },
];

const ReservasPage = () => {
  const [tab, setTab] = useState<"catalogo" | "misReservas">("catalogo");

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-display">Reservas</h1>

      {/* Tabs */}
      <div className="flex bg-muted rounded-xl p-1">
        {[
          { key: "catalogo" as const, label: "Próximamente" },
          { key: "misReservas" as const, label: "Mis Reservas" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? "bg-card text-foreground glow-primary" : "text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "catalogo" ? (
        <div className="space-y-3">
          {mockProducts.map((p) => (
            <div key={p.id} className="bg-card rounded-2xl p-4 border border-border flex gap-4">
              <img
                src={p.image}
                alt={p.name}
                className="w-20 h-20 rounded-xl object-cover shrink-0 bg-muted"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                      p.status === "soon" ? "bg-neon-orange/10 text-neon-orange" : "bg-muted text-muted-foreground"
                    }`}>
                      {p.status === "soon" ? "Próximamente" : "Sin stock"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.category} · {p.price}</p>
                  {p.eta && <p className="text-xs text-neon-orange mt-0.5">📅 ETA: {p.eta}</p>}
                </div>
                <button className="mt-2 w-full py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20 hover:bg-primary/20 transition-colors">
                  Reservar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {mockReservas.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No tienes reservas activas</p>
            </div>
          ) : (
            mockReservas.map((r) => {
              const cfg = statusConfig[r.status];
              return (
                <div key={r.id} className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border">
                  <img
                    src={r.image}
                    alt={r.productName}
                    className="w-12 h-12 rounded-lg object-cover shrink-0 bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.productName}</p>
                    <p className={`text-xs ${cfg.color}`}>{cfg.label}</p>
                  </div>
                  {r.status === "lista" && (
                    <Bell className="w-4 h-4 text-neon-green animate-pulse-glow" />
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ReservasPage;
