import { Star, Trophy, Gift, ChevronRight, LogOut } from "lucide-react";

const mockCoupons = [
  { id: 1, code: "FRIKI-5OFF", desc: "5€ descuento en compra +30€", expires: "28 Feb 2026", status: "available" },
  { id: 2, code: "DOBLE-PTS", desc: "Doble puntos en tu próxima compra", expires: "15 Mar 2026", status: "available" },
];

const levels = [
  { name: "Novato", min: 0, icon: "🎮" },
  { name: "Friki", min: 500, icon: "🎯" },
  { name: "Pro Gamer", min: 1000, icon: "⚔️" },
  { name: "Legendario", min: 2000, icon: "👑" },
  { name: "Mítico", min: 5000, icon: "🌟" },
];

const PerfilPage = () => {
  const currentPoints = 1250;
  const currentLevel = levels.filter((l) => currentPoints >= l.min).pop()!;
  const nextLevel = levels.find((l) => l.min > currentPoints);

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-display">Mi Perfil</h1>

      {/* User Card */}
      <div className="bg-card rounded-2xl p-5 border-glow glow-primary text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full gradient-neon flex items-center justify-center text-2xl">
          {currentLevel.icon}
        </div>
        <div>
          <p className="font-semibold text-lg">Jugador Friki</p>
          <p className="text-sm text-muted-foreground">friki@email.com</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Trophy className="w-4 h-4 text-neon-orange" />
          <span className="text-sm font-semibold text-neon-orange text-display">{currentLevel.name}</span>
        </div>
        <p className="text-3xl font-bold text-primary text-display">{currentPoints.toLocaleString()} pts</p>
        {nextLevel && (
          <p className="text-xs text-muted-foreground">
            Faltan {nextLevel.min - currentPoints} pts para {nextLevel.icon} {nextLevel.name}
          </p>
        )}
      </div>

      {/* Levels */}
      <section>
        <h2 className="text-sm font-semibold text-display tracking-wider uppercase mb-3">Niveles</h2>
        <div className="space-y-2">
          {levels.map((level) => {
            const reached = currentPoints >= level.min;
            return (
              <div key={level.name} className={`flex items-center gap-3 p-3 rounded-xl ${reached ? "bg-card border border-primary/20" : "bg-muted/50 opacity-50"}`}>
                <span className="text-xl">{level.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{level.name}</p>
                  <p className="text-xs text-muted-foreground">{level.min.toLocaleString()} pts</p>
                </div>
                {reached && <Star className="w-4 h-4 text-primary" />}
              </div>
            );
          })}
        </div>
      </section>

      {/* Coupons */}
      <section>
        <h2 className="text-sm font-semibold text-display tracking-wider uppercase mb-3">Mis Cupones</h2>
        <div className="space-y-2">
          {mockCoupons.map((c) => (
            <div key={c.id} className="bg-card rounded-xl p-4 border border-neon-orange/20">
              <div className="flex items-center justify-between mb-1">
                <code className="text-sm font-bold text-neon-orange text-display">{c.code}</code>
                <Gift className="w-4 h-4 text-neon-orange" />
              </div>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Válido hasta: {c.expires}</p>
            </div>
          ))}
        </div>
      </section>

      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
        <LogOut className="w-4 h-4" />
        Cerrar sesión
      </button>
    </div>
  );
};

export default PerfilPage;
