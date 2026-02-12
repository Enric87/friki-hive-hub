import { useState } from "react";
import { Clock, CheckCircle, XCircle, AlertTriangle, Eye, Check, X } from "lucide-react";

type TicketStatus = "all" | "pending" | "approved" | "rejected";

const mockTickets = [
  { id: 1042, user: "Carlos M.", date: "12 Feb 2026", total: "47.90€", status: "pending" as const, risk: "low" as const, images: 1 },
  { id: 1041, user: "Ana R.", date: "11 Feb 2026", total: "23.50€", status: "pending" as const, risk: "medium" as const, images: 2 },
  { id: 1040, user: "Pedro L.", date: "10 Feb 2026", total: "112.00€", status: "approved" as const, risk: "low" as const, images: 1 },
  { id: 1039, user: "Laura G.", date: "10 Feb 2026", total: "15.00€", status: "rejected" as const, risk: "high" as const, images: 1 },
  { id: 1038, user: "Jorge V.", date: "9 Feb 2026", total: "89.90€", status: "approved" as const, risk: "low" as const, images: 1 },
  { id: 1037, user: "María P.", date: "8 Feb 2026", total: "200.00€", status: "pending" as const, risk: "high" as const, images: 3 },
];

const statusCfg = {
  pending: { label: "Pendiente", icon: Clock, color: "text-neon-orange", bg: "bg-neon-orange/10" },
  approved: { label: "Aprobado", icon: CheckCircle, color: "text-neon-green", bg: "bg-neon-green/10" },
  rejected: { label: "Rechazado", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

const riskCfg = {
  low: { label: "Bajo", color: "text-neon-green", bg: "bg-neon-green/10" },
  medium: { label: "Medio", color: "text-neon-orange", bg: "bg-neon-orange/10" },
  high: { label: "Alto", color: "text-destructive", bg: "bg-destructive/10" },
};

const filters: { value: TicketStatus; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "approved", label: "Aprobados" },
  { value: "rejected", label: "Rechazados" },
];

const AdminTickets = () => {
  const [filter, setFilter] = useState<TicketStatus>("all");
  const filtered = filter === "all" ? mockTickets : mockTickets.filter((t) => t.status === filter);

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-display">Tickets</h1>
        <span className="text-sm text-neon-orange font-medium">
          {mockTickets.filter((t) => t.status === "pending").length} pendientes
        </span>
      </div>

      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
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
                <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Fecha</th>
                <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Total</th>
                <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Riesgo</th>
                <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Estado</th>
                <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const s = statusCfg[t.status];
                const r = riskCfg[t.risk];
                const StatusIcon = s.icon;
                return (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">#{t.id}</td>
                    <td className="px-4 py-3">{t.user}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                    <td className="px-4 py-3 font-semibold">{t.total}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${r.bg} ${r.color}`}>
                        {t.risk === "high" && <AlertTriangle className="w-3 h-3 inline mr-0.5" />}
                        {r.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${s.bg} ${s.color} inline-flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />{s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-surface-hover" title="Ver">
                          <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        {t.status === "pending" && (
                          <>
                            <button className="w-7 h-7 rounded-lg bg-neon-green/10 flex items-center justify-center hover:bg-neon-green/20" title="Aprobar">
                              <Check className="w-3.5 h-3.5 text-neon-green" />
                            </button>
                            <button className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20" title="Rechazar">
                              <X className="w-3.5 h-3.5 text-destructive" />
                            </button>
                          </>
                        )}
                      </div>
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

export default AdminTickets;
