import { Receipt, ShoppingBag, Calendar, Gift, Users, TrendingUp, Bell, Trophy } from "lucide-react";

const stats = [
  { label: "Tickets hoy", value: 12, change: "+3", icon: Receipt, color: "text-primary" },
  { label: "Reservas activas", value: 24, change: "+5", icon: ShoppingBag, color: "text-neon-orange" },
  { label: "Eventos próximos", value: 3, change: "0", icon: Calendar, color: "text-neon-purple" },
  { label: "Sorteos activos", value: 2, change: "+1", icon: Gift, color: "text-neon-pink" },
  { label: "Usuarios activos (30d)", value: 187, change: "+22", icon: Users, color: "text-neon-green" },
  { label: "Notifs enviadas", value: 534, change: "+48", icon: Bell, color: "text-neon-cyan" },
];

const recentActivity = [
  { text: "Ticket #1042 aprobado → +48 pts a Carlos M.", time: "Hace 5 min", type: "ticket" },
  { text: "Reserva confirmada: Gojo Satoru (Ana R.)", time: "Hace 15 min", type: "reserva" },
  { text: "Inscripción: Torneo Pokémon (Laura G.)", time: "Hace 30 min", type: "evento" },
  { text: "Sorteo: nueva participación (Pedro L.)", time: "Hace 1h", type: "sorteo" },
  { text: "Ticket #1041 rechazado → duplicado", time: "Hace 2h", type: "ticket" },
];

const AdminDashboard = () => (
  <div className="p-6 space-y-6 animate-fade-in">
    <h1 className="text-2xl font-bold text-display">Dashboard</h1>

    {/* Stats Grid */}
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map(({ label, value, change, icon: Icon, color }) => (
        <div key={label} className="bg-card rounded-xl p-4 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <Icon className={`w-5 h-5 ${color}`} />
            <span className={`text-xs font-medium ${change.startsWith("+") ? "text-neon-green" : "text-muted-foreground"}`}>
              {change}
            </span>
          </div>
          <p className="text-2xl font-bold text-display">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>

    {/* Key Metrics */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-card rounded-xl p-5 border border-border/50">
        <h2 className="text-sm font-semibold text-display tracking-wider uppercase mb-4">Métricas Clave</h2>
        <div className="space-y-3">
          {[
            { label: "Repetición 30 días", value: "34%", target: "40%" },
            { label: "Tickets aprobados", value: "92%", target: "95%" },
            { label: "Reservas completadas", value: "78%", target: "85%" },
            { label: "Asistencia eventos", value: "81%", target: "80%" },
          ].map((m) => (
            <div key={m.label} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{m.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{m.value}</span>
                <span className="text-[10px] text-muted-foreground">/ {m.target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl p-5 border border-border/50">
        <h2 className="text-sm font-semibold text-display tracking-wider uppercase mb-4">Actividad Reciente</h2>
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <p className="text-sm">{a.text}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
