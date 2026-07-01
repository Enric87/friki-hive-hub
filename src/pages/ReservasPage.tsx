import { useState } from "react";
import { AlertTriangle, Bell, ChevronRight, Clock, ShoppingBag } from "lucide-react";

import gojoImg from "@/assets/reservas/gojo-hollow-purple.jpg";
import dragonballImg from "@/assets/reservas/dragonball-daima-boxset.jpg";
import pokemonImg from "@/assets/reservas/pokemon-sv8-booster.jpg";
import chainsawImg from "@/assets/reservas/chainsaw-man-vol18.jpg";

type ReservaStatus = "solicitada" | "confirmada" | "en_camino" | "lista" | "retirada" | "cancelada" | "caducada";

const statusConfig: Record<ReservaStatus, { label: string; color: string; bg: string }> = {
  solicitada: { label: "Solicitada", color: "text-neon-orange", bg: "bg-neon-orange/10" },
  confirmada: { label: "Confirmada", color: "text-primary", bg: "bg-primary/10" },
  en_camino: { label: "En camino", color: "text-neon-purple", bg: "bg-neon-purple/10" },
  lista: { label: "Lista para recoger", color: "text-neon-green", bg: "bg-neon-green/10" },
  retirada: { label: "Retirada", color: "text-muted-foreground", bg: "bg-muted" },
  cancelada: { label: "Cancelada", color: "text-destructive", bg: "bg-destructive/10" },
  caducada: { label: "Caducada", color: "text-destructive", bg: "bg-destructive/10" },
};

const mockProducts = [
  { id: 1, name: "Gojo Satoru - Hollow Purple", category: "Figuras", status: "soon" as const, price: "189,90 €", eta: "Marzo 2026", image: gojoImg, stock: 3 },
  { id: 2, name: "Dragon Ball Daima Box Set", category: "Manga", status: "out" as const, price: "45,00 €", eta: null, image: dragonballImg, stock: 0 },
  { id: 3, name: "Pokémon SV8 Booster Box", category: "TCG", status: "soon" as const, price: "149,99 €", eta: "Abril 2026", image: pokemonImg, stock: 8 },
  { id: 4, name: "Chainsaw Man Vol. 18 Ed. Especial", category: "Manga", status: "out" as const, price: "14,95 €", eta: "Feb 2026", image: chainsawImg, stock: 1 },
];

const mockReservas = [
  { id: 1, productName: "Gojo Satoru - Hollow Purple", status: "confirmada" as ReservaStatus, date: "10 Feb 2026", image: gojoImg, expiresIn: "47h 23m" },
  { id: 2, productName: "Pokémon SV7 Elite Trainer", status: "lista" as ReservaStatus, date: "8 Feb 2026", image: pokemonImg, expiresIn: null },
];

const ReservasPage = () => {
  const [tab, setTab] = useState<"catalogo" | "misReservas">("catalogo");

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pb-4 pt-6 animate-fade-in">
      <h1 className="text-xl font-bold text-display">Reservas</h1>

      <div className="flex rounded-xl bg-muted p-1">
        {[
          { key: "catalogo" as const, label: "Próximamente" },
          { key: "misReservas" as const, label: "Mis reservas" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              tab === item.key ? "bg-card text-foreground glow-primary" : "text-muted-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "catalogo" ? (
        <div className="space-y-3">
          {mockProducts.map((product) => (
            <div key={product.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
              <img src={product.image} alt={product.name} className="h-20 w-20 shrink-0 rounded-xl bg-muted object-cover" />
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{product.name}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                      product.status === "soon" ? "bg-neon-orange/10 text-neon-orange" : "bg-muted text-muted-foreground"
                    }`}>
                      {product.status === "soon" ? "Próximamente" : "Sin stock"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{product.category} · {product.price}</p>
                  {product.eta && <p className="mt-0.5 text-xs text-neon-orange">ETA: {product.eta}</p>}

                  {product.stock > 0 && product.stock <= 5 && (
                    <div className="mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      <span className="text-[10px] font-semibold text-destructive">¡Solo quedan {product.stock} unidades!</span>
                    </div>
                  )}
                  {product.stock === 0 && <p className="mt-1 text-[10px] text-muted-foreground">Sin unidades disponibles</p>}
                </div>
                <button
                  disabled={product.stock === 0}
                  className={`mt-2 w-full rounded-lg border py-1.5 text-xs font-medium transition-colors ${
                    product.stock > 0
                      ? "border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
                      : "cursor-not-allowed border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {product.stock > 0 ? "Reservar" : "Sin stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {mockReservas.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <ShoppingBag className="mx-auto mb-2 h-10 w-10 opacity-40" />
              <p className="text-sm">No tienes reservas activas</p>
              <p className="mt-1 text-xs">¡Reserva antes de que se agoten!</p>
            </div>
          ) : (
            mockReservas.map((reserva) => {
              const cfg = statusConfig[reserva.status];
              return (
                <div key={reserva.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <img src={reserva.image} alt={reserva.productName} className="h-12 w-12 shrink-0 rounded-lg bg-muted object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{reserva.productName}</p>
                      <p className={`text-xs ${cfg.color}`}>{cfg.label}</p>
                    </div>
                    {reserva.status === "lista" && <Bell className="h-4 w-4 text-neon-green animate-pulse-glow" />}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {reserva.expiresIn && (
                    <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-neon-orange/10 px-3 py-1.5">
                      <Clock className="h-3 w-3 text-neon-orange" />
                      <span className="text-[10px] font-medium text-neon-orange">Reserva expira en {reserva.expiresIn}</span>
                    </div>
                  )}
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
