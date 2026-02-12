import { useState } from "react";
import { Camera, Upload, Clock, CheckCircle, XCircle, ChevronRight } from "lucide-react";

type TicketStatus = "all" | "pending" | "approved" | "rejected";

const mockTickets = [
  { id: 1, date: "12 Feb 2026", total: "47.90€", status: "approved" as const, points: 48 },
  { id: 2, date: "10 Feb 2026", total: "23.50€", status: "pending" as const, points: 0 },
  { id: 3, date: "5 Feb 2026", total: "112.00€", status: "approved" as const, points: 112 },
  { id: 4, date: "1 Feb 2026", total: "15.00€", status: "rejected" as const, points: 0 },
];

const statusConfig = {
  pending: { label: "Pendiente", icon: Clock, color: "text-neon-orange", bg: "bg-neon-orange/10" },
  approved: { label: "Aprobado", icon: CheckCircle, color: "text-neon-green", bg: "bg-neon-green/10" },
  rejected: { label: "Rechazado", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

const filters: { value: TicketStatus; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "approved", label: "Aprobados" },
  { value: "rejected", label: "Rechazados" },
];

const TicketsPage = () => {
  const [filter, setFilter] = useState<TicketStatus>("all");

  const filtered = filter === "all" ? mockTickets : mockTickets.filter((t) => t.status === filter);

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-display">Mis Tickets</h1>

      {/* Upload Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 py-4 rounded-xl bg-card border-glow glow-primary hover:bg-surface-hover transition-all">
          <Camera className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Foto Ticket</span>
        </button>
        <button className="flex items-center justify-center gap-2 py-4 rounded-xl bg-card border border-border/50 hover:bg-surface-hover transition-all">
          <Upload className="w-5 h-5 text-neon-purple" />
          <span className="text-sm font-medium">Escanear QR</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Ticket List */}
      <div className="space-y-2">
        {filtered.map((ticket) => {
          const cfg = statusConfig[ticket.status];
          const StatusIcon = cfg.icon;
          return (
            <div key={ticket.id} className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border/50">
              <div className={`w-10 h-10 rounded-lg ${cfg.bg} flex items-center justify-center`}>
                <StatusIcon className={`w-5 h-5 ${cfg.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{ticket.total}</p>
                  {ticket.points > 0 && (
                    <span className="text-xs text-neon-green font-semibold">+{ticket.points} pts</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{ticket.date}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TicketsPage;
