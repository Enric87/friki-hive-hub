import { ArrowLeft, TrendingUp, TrendingDown, Gift, Receipt, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePointsLedger } from "@/hooks/usePointsLedger";
import { useMyRedemptions } from "@/hooks/useRewards";
import { useProfile } from "@/hooks/useProfile";
import StateEmpty from "@/components/StateEmpty";
import StateError from "@/components/StateError";
import StateSkeleton from "@/components/StateSkeleton";

const typeConfig: Record<string, { label: string; icon: typeof Gift; color: string }> = {
  ticket_approved: { label: "Ticket aprobado", icon: Receipt, color: "text-neon-green" },
  reward_redeemed: { label: "Canje de recompensa", icon: Gift, color: "text-destructive" },
  manual_adjustment: { label: "Ajuste manual", icon: Settings, color: "text-primary" },
};

const HistorialPage = () => {
  const navigate = useNavigate();
  const { data: ledger, isLoading: loadingLedger, isError: errorLedger, refetch: refetchLedger } = usePointsLedger();
  const { data: redemptions, isLoading: loadingRedemptions } = useMyRedemptions();
  const { data: profile } = useProfile();

  const isLoading = loadingLedger || loadingRedemptions;

  // Combine ledger + redemptions into a unified timeline
  const timeline = [
    ...(ledger || []).map((entry: any) => ({
      id: entry.id,
      date: entry.created_at,
      delta: entry.delta,
      type: entry.type,
      note: entry.note,
      source: "ledger" as const,
    })),
    // If no ledger entries, show redemptions as fallback
    ...(!ledger?.length && redemptions?.length
      ? redemptions.map((rd: any) => ({
          id: rd.id,
          date: rd.redeemed_at,
          delta: -(rd.rewards?.points_cost || 0),
          type: "reward_redeemed",
          note: rd.rewards?.name || "Recompensa",
          source: "redemption" as const,
        }))
      : []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-display">Historial de Actividad</h1>
      </div>

      {/* Balance card */}
      {profile && (
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <p className="text-xs text-muted-foreground">Saldo actual</p>
          <p className="text-2xl font-bold text-primary text-display">{profile.points.toLocaleString()} pts</p>
          <p className="text-xs text-muted-foreground mt-1">Nivel: {profile.level}</p>
        </div>
      )}

      {isLoading ? (
        <StateSkeleton count={4} type="row" />
      ) : errorLedger ? (
        <StateError onRetry={() => refetchLedger()} />
      ) : !timeline.length ? (
        <StateEmpty
          icon={Gift}
          title="Aún no tienes actividad"
          subtitle="Tu historial de puntos aparecerá aquí 📜"
        />
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
          <div className="space-y-3">
            {timeline.map((entry) => {
              const cfg = typeConfig[entry.type] || typeConfig.manual_adjustment;
              const EntryIcon = cfg.icon;
              const isPositive = entry.delta > 0;
              return (
                <div key={entry.id} className="flex gap-4 pl-1">
                  <div className={`w-7 h-7 rounded-full bg-card border-2 ${isPositive ? "border-neon-green" : "border-destructive"} flex items-center justify-center shrink-0 z-10`}>
                    {isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5 text-neon-green" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                    )}
                  </div>
                  <div className="bg-card rounded-xl p-3 border border-border flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{entry.note || cfg.label}</p>
                      <span className={`text-sm font-bold ${isPositive ? "text-neon-green" : "text-destructive"}`}>
                        {isPositive ? "+" : ""}{entry.delta}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">{cfg.label}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorialPage;
