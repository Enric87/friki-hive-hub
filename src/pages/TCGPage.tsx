import { useState } from "react";
import { Bell, Check, ChevronRight, Settings } from "lucide-react";

const tcgGames = [
  { id: "pokemon", name: "Pokémon", emoji: "⚡" },
  { id: "onepiece", name: "One Piece", emoji: "🏴‍☠️" },
  { id: "magic", name: "Magic: The Gathering", emoji: "🧙" },
  { id: "yugioh", name: "Yu-Gi-Oh!", emoji: "👁️" },
  { id: "lorcana", name: "Lorcana", emoji: "✨" },
];

const alertTypes = [
  { id: "restock", label: "Reposición", desc: "Cuando vuelva a estar en stock" },
  { id: "launch", label: "Nuevos lanzamientos", desc: "Fecha y recordatorio" },
  { id: "events", label: "Eventos TCG", desc: "Torneos y leagues" },
  { id: "drops", label: "Drops destacados", desc: "Selección curada por la tienda" },
];

const mockAlerts = [
  { id: 1, title: "Reposición: Pokémon SV7 Boosters", time: "Hace 2h", game: "pokemon", type: "restock" },
  { id: 2, title: "Lanzamiento: One Piece OP-10 - 20 Feb", time: "Hace 1d", game: "onepiece", type: "launch" },
  { id: 3, title: "Torneo Magic Modern - 25 Feb", time: "Hace 2d", game: "magic", type: "events" },
];

const TCGPage = () => {
  const [selectedGames, setSelectedGames] = useState<string[]>(["pokemon", "onepiece"]);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>(["restock", "launch", "events"]);
  const [showConfig, setShowConfig] = useState(false);

  const toggleGame = (id: string) => {
    setSelectedGames((prev) => prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]);
  };

  const toggleAlert = (id: string) => {
    setSelectedAlerts((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);
  };

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-display">TCG Alerts</h1>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {showConfig ? (
        <div className="space-y-5">
          {/* Game Preferences */}
          <section>
            <h2 className="text-sm font-semibold text-display tracking-wider uppercase mb-3">Mis Juegos</h2>
            <div className="space-y-2">
              {tcgGames.map((game) => {
                const selected = selectedGames.includes(game.id);
                return (
                  <button
                    key={game.id}
                    onClick={() => toggleGame(game.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                      selected ? "bg-primary/10 border border-primary/30" : "bg-card border border-border/50"
                    }`}
                  >
                    <span className="text-sm">
                      {game.emoji} {game.name}
                    </span>
                    {selected && <Check className="w-4 h-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Alert Types */}
          <section>
            <h2 className="text-sm font-semibold text-display tracking-wider uppercase mb-3">Tipo de Alertas</h2>
            <div className="space-y-2">
              {alertTypes.map((type) => {
                const selected = selectedAlerts.includes(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => toggleAlert(type.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                      selected ? "bg-neon-green/10 border border-neon-green/30" : "bg-card border border-border/50"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium">{type.label}</p>
                      <p className="text-xs text-muted-foreground">{type.desc}</p>
                    </div>
                    {selected && <Check className="w-4 h-4 text-neon-green" />}
                  </button>
                );
              })}
            </div>
          </section>

          <button
            onClick={() => setShowConfig(false)}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          >
            Guardar preferencias
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Active preferences */}
          <div className="flex gap-2 flex-wrap">
            {selectedGames.map((gid) => {
              const game = tcgGames.find((g) => g.id === gid);
              return game ? (
                <span key={gid} className="text-xs bg-muted px-2.5 py-1 rounded-full">
                  {game.emoji} {game.name}
                </span>
              ) : null;
            })}
          </div>

          {/* Alerts Feed */}
          <div className="space-y-2">
            {mockAlerts
              .filter((a) => selectedGames.includes(a.game))
              .map((alert) => (
                <div key={alert.id} className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border/50">
                  <div className="w-8 h-8 rounded-lg bg-neon-green/10 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-neon-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TCGPage;
