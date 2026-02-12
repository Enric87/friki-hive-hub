import { useNavigate } from "react-router-dom";
import { Bell, User, Star, Trophy, ChevronRight, Settings, LogOut } from "lucide-react";

const menuItems = [
  { icon: Bell, label: "Alertas TCG", desc: "Reposiciones y lanzamientos", path: "/tcg", color: "text-neon-green" },
  { icon: User, label: "Mi Perfil", desc: "Datos, niveles y cupones", path: "/perfil", color: "text-foreground" },
];

const MorePage = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-display">Más</h1>

      {/* Level Card Mini */}
      <div className="bg-card rounded-xl p-4 border-glow flex items-center gap-3">
        <div className="w-12 h-12 rounded-full gradient-neon flex items-center justify-center">
          <Trophy className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Pro Gamer</p>
          <p className="text-xs text-muted-foreground">1.250 puntos · 2 cupones</p>
        </div>
        <Star className="w-5 h-5 text-neon-orange" />
      </div>

      {/* Menu */}
      <div className="space-y-1">
        {menuItems.map(({ icon: Icon, label, desc, path, color }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-hover transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default MorePage;
