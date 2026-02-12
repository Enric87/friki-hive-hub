import { Star, Trophy, Gift, ChevronRight, LogOut, Loader2, Award, Receipt, Calendar, ShoppingBag } from "lucide-react";
import { useProfile, useLevels, useAchievements } from "@/hooks/useProfile";
import { useMyRedemptions } from "@/hooks/useRewards";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProfileStats } from "@/hooks/useProfileStats";

const PerfilPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { data: levels, isLoading: loadingLevels } = useLevels();
  const { data: redemptions } = useMyRedemptions();
  const { allAchievements, userAchievements } = useAchievements();
  const { data: stats } = useProfileStats();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loadingProfile || loadingLevels) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentPoints = profile?.points ?? 0;
  const currentLevelData = levels?.filter((l) => currentPoints >= l.min_points).pop();
  const nextLevel = levels?.find((l) => l.min_points > currentPoints);
  const activeCoupons = redemptions?.filter((r) => r.status === "disponible") ?? [];
  const unlockedIds = new Set(userAchievements.data?.map((ua) => ua.achievement_id) ?? []);

  const profileStats = [
    { label: "Puntos", value: currentPoints.toLocaleString(), icon: Star, color: "text-primary" },
    { label: "Canjes", value: stats?.redemptionCount ?? 0, icon: Gift, color: "text-neon-orange" },
    { label: "Logros", value: userAchievements.data?.length ?? 0, icon: Award, color: "text-neon-purple" },
  ];

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-display">Mi Perfil</h1>

      {/* User Card */}
      <div className="bg-card rounded-2xl p-5 border-glow glow-primary text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full gradient-neon flex items-center justify-center text-2xl">
          {currentLevelData?.icon || "🎮"}
        </div>
        <div>
          <p className="font-semibold text-lg">{profile?.display_name || "Jugador"}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Trophy className="w-4 h-4 text-neon-orange" />
          <span className="text-sm font-semibold text-neon-orange text-display">{currentLevelData?.name || profile?.level}</span>
        </div>
        <p className="text-3xl font-bold text-primary text-display">{currentPoints.toLocaleString()} pts</p>
        {nextLevel && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Faltan {(nextLevel.min_points - currentPoints).toLocaleString()} pts para {nextLevel.icon} {nextLevel.name}
            </p>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-neon rounded-full transition-all duration-500"
                style={{ width: `${((currentPoints - (currentLevelData?.min_points ?? 0)) / (nextLevel.min_points - (currentLevelData?.min_points ?? 0))) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {profileStats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card rounded-xl p-3 border border-border text-center">
            <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
            <p className="text-lg font-bold text-display">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Levels */}
      <section>
        <h2 className="text-sm font-semibold text-display tracking-wider uppercase mb-3">Niveles</h2>
        <div className="space-y-2">
          {levels?.map((level) => {
            const reached = currentPoints >= level.min_points;
            return (
              <div key={level.id} className={`flex items-center gap-3 p-3 rounded-xl ${reached ? "bg-card border border-primary/20" : "bg-muted/50 opacity-50"}`}>
                <span className="text-xl">{level.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{level.name}</p>
                  <p className="text-xs text-muted-foreground">{level.min_points.toLocaleString()} pts</p>
                  {reached && level.benefits && level.benefits.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {level.benefits.map((b, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{b}</span>
                      ))}
                    </div>
                  )}
                </div>
                {reached && <Star className="w-4 h-4 text-primary" />}
              </div>
            );
          })}
        </div>
      </section>

      {/* Achievements */}
      {allAchievements.data && allAchievements.data.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-display tracking-wider uppercase mb-3">Logros</h2>
          <div className="grid grid-cols-3 gap-2">
            {allAchievements.data.map((a) => {
              const unlocked = unlockedIds.has(a.id);
              return (
                <div key={a.id} className={`text-center p-3 rounded-xl ${unlocked ? "bg-card border border-primary/20" : "bg-muted/50 opacity-40"}`}>
                  <span className="text-2xl">{a.icon}</span>
                  <p className="text-[10px] font-medium mt-1 line-clamp-1">{a.name}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Active Coupons */}
      {activeCoupons.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-display tracking-wider uppercase mb-3">Cupones Activos</h2>
          <div className="space-y-2">
            {activeCoupons.map((c) => (
              <div key={c.id} className="bg-card rounded-xl p-4 border border-neon-orange/20">
                <div className="flex items-center justify-between mb-1">
                  <code className="text-sm font-bold text-neon-orange text-display">{c.coupon_code}</code>
                  <Gift className="w-4 h-4 text-neon-orange" />
                </div>
                <p className="text-xs text-muted-foreground">{(c as any).rewards?.name || "Recompensa"}</p>
                {c.expires_at && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Válido hasta: {new Date(c.expires_at).toLocaleDateString("es-ES")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* History link */}
      <button
        onClick={() => navigate("/historial")}
        className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-card border border-border text-sm font-medium"
      >
        <span>Ver historial de actividad</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>

      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium"
      >
        <LogOut className="w-4 h-4" />
        Cerrar sesión
      </button>
    </div>
  );
};

export default PerfilPage;
