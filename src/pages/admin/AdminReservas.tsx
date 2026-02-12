import { useState } from "react";
import { Clock, Truck, Package, CheckCircle, XCircle, Bell } from "lucide-react";

type ReservaStatus = "solicitada" | "confirmada" | "en_camino" | "lista" | "retirada" | "cancelada";

const statusCfg: Record<ReservaStatus, { label: string; color: string; bg: string }> = {
  solicitada: { label: "Solicitada", color: "text-neon-orange", bg: "bg-neon-orange/10" },
  confirmada: { label: "Confirmada", color: "text-primary", bg: "bg-primary/10" },
  en_camino: { label: "En camino", color: "text-neon-purple", bg: "bg-neon-purple/10" },
  lista: { label: "Lista", color: "text-neon-green", bg: "bg-neon-green/10" },
  retirada: { label: "Retirada", color: "text-muted-foreground", bg: "bg-muted" },
  cancelada: { label: "Cancelada", color: "text-destructive", bg: "bg-destructive/10" },
};

const mockReservas = [
  { id: 1, user: "Carlos M.", product: "Gojo Satoru - Hollow Purple", status: "solicitada" as ReservaStatus, date: "12 Feb 2026", deposit: "Señal en tienda" },
  { id: 2, user: "Ana R.", product: "Pokémon SV8 Booster Box", status: "confirmada" as ReservaStatus, date: "10 Feb 2026", deposit: "Ninguno" },
  { id: 3, user: "Laura G.", product: "Chainsaw Man Vol. 18", status: "lista" as ReservaStatus, date: "8 Feb 2026", deposit: "Ninguno" },
  { id: 4, user: "Pedro L.", product: "Dragon Ball Daima Box Set", status: "en_camino" as ReservaStatus, date: "5 Feb 2026", deposit: "Señal en tienda" },
  { id: 5, user: "Jorge V.", product: "One Piece Card Game OP-10", status: "retirada" as ReservaStatus, date: "1 Feb 2026", deposit: "Ninguno" },
];

const AdminReservas = () => {
  const [filter, setFilter] = useState<"all" | ReservaStatus>("all");
  const filtered = filter === "all" ? mockReservas : mockReservas.filter((r) => r.status === filter);

  const statusOptions: ("all" | ReservaStatus)[] = ["all", "solicitada", "confirmada", "en_camino", "lista", "retirada", "cancelada"];

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-display">Reservas</h1>
        <span className="text-sm text-neon-orange font-medium">
          {mockReservas.filter((r) => r.status === "solicitada").length} nuevas
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "all" ? "Todas" : statusCfg[s].label}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-xs text-muted-foreground font-medium">ID</th>
                <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Usuario</th>
                <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Producto</th>
                <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Fecha</th>
                <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Depósito</th>
                <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Estado</th>
                <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const cfg = statusCfg[r.status];
                return (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">#{r.id}</td>
                    <td className="px-4 py-3">{r.user}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate">{r.product}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{r.deposit}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      {r.status !== "retirada" && r.status !== "cancelada" && (
                        <select className="bg-muted text-xs rounded-lg px-2 py-1.5 border border-border/50 outline-none">
                          {Object.entries(statusCfg).map(([key, val]) => (
                            <option key={key} value={key} selected={key === r.status}>
                              {val.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReservas;
