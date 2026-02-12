import { Gift, ChevronRight, Trophy, Clock } from "lucide-react";
import luffyImage from "@/assets/sorteos/luffy-gear5.png";

const mockGiveaways = [
  {
    id: 1,
    title: "Booster Box Pokémon SV7",
    prize: "1x Booster Box Stellar Crown",
    endDate: "28 Feb 2026",
    entries: 42,
    myEntries: 3,
    active: true,
    rules: "1 participación por ticket aprobado",
    image: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=400&q=80",
  },
  {
    id: 2,
    title: "Figura Luffy Gear 5 - Banpresto",
    prize: "1x Figura King of Artist",
    endDate: "15 Mar 2026",
    entries: 28,
    myEntries: 1,
    active: true,
    rules: "1 participación por reserva o evento",
    image: luffyImage,
  },
  {
    id: 3,
    title: "Pack Fundas Dragon Shield",
    prize: "3x Pack Dragon Shield Matte",
    endDate: "31 Ene 2026",
    entries: 67,
    myEntries: 5,
    active: false,
    winner: "Carlos M.",
    image: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=400&q=80",
  },
];

const SorteosPage = () => {
  const active = mockGiveaways.filter((g) => g.active);
  const past = mockGiveaways.filter((g) => !g.active);

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-display">Sorteos</h1>

      {/* Active */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-display tracking-wider uppercase text-neon-pink">🎉 Activos</h2>
        {active.map((g) => (
          <div key={g.id} className="bg-card rounded-xl overflow-hidden border border-neon-pink/20 glow-orange space-y-3">
            <img src={g.image} alt={g.title} className="w-full h-36 object-cover" />
            <div className="px-4 pb-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold">{g.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">🎁 {g.prize}</p>
              </div>
              <Gift className="w-5 h-5 text-neon-pink shrink-0" />
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Hasta {g.endDate}</span>
              <span>{g.entries} participantes</span>
            </div>
            <div className="flex items-center justify-between bg-muted rounded-lg p-3">
              <span className="text-xs text-muted-foreground">Mis participaciones</span>
              <span className="text-sm font-bold text-primary text-display">{g.myEntries}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">📋 {g.rules}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-display tracking-wider uppercase text-muted-foreground">Finalizados</h2>
          {past.map((g) => (
            <div key={g.id} className="bg-card rounded-xl overflow-hidden border border-border/50 opacity-70">
              <img src={g.image} alt={g.title} className="w-full h-28 object-cover" />
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{g.title}</p>
                  <p className="text-xs text-muted-foreground">Ganador: {g.winner}</p>
                </div>
                <Trophy className="w-5 h-5 text-neon-orange" />
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default SorteosPage;
