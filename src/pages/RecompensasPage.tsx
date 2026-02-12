import { useState } from "react";
import { Gift, Ticket, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRewards, useMyRedemptions, useRedeemReward } from "@/hooks/useRewards";
import { useProfile } from "@/hooks/useProfile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const tagStyles: Record<string, string> = {
  Popular: "bg-neon-orange/10 text-neon-orange border-neon-orange/20",
  Limitado: "bg-destructive/10 text-destructive border-destructive/20",
  Exclusivo: "bg-neon-purple/10 text-neon-purple border-neon-purple/20",
  Nuevo: "bg-neon-green/10 text-neon-green border-neon-green/20",
};

const RecompensasPage = () => {
  const [tab, setTab] = useState<"catalogo" | "misCanjes">("catalogo");
  const { data: rewards, isLoading: loadingRewards } = useRewards();
  const { data: redemptions, isLoading: loadingRedemptions } = useMyRedemptions();
  const { data: profile } = useProfile();
  const redeemMutation = useRedeemReward();
  const [lastCoupon, setLastCoupon] = useState<{ code: string; name: string } | null>(null);
  const [confirmReward, setConfirmReward] = useState<{ id: string; name: string; cost: number } | null>(null);

  const handleRedeem = async (rewardId: string) => {
    try {
      const result = await redeemMutation.mutateAsync(rewardId);
      setLastCoupon({ code: result.coupon_code!, name: result.reward_name! });
      setConfirmReward(null);
    } catch {
      setConfirmReward(null);
    }
  };

  const statusColors: Record<string, { label: string; color: string }> = {
    disponible: { label: "Disponible", color: "text-neon-green" },
    usado: { label: "Usado", color: "text-muted-foreground" },
    caducado: { label: "Caducado", color: "text-destructive" },
  };

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-display">Recompensas</h1>
        {profile && (
          <span className="text-sm font-semibold text-primary text-display">
            {profile.points.toLocaleString()} pts
          </span>
        )}
      </div>

      {/* Success banner */}
      {lastCoupon && (
        <div className="bg-neon-green/10 border border-neon-green/20 rounded-xl p-4 text-center space-y-1">
          <CheckCircle2 className="w-8 h-8 text-neon-green mx-auto" />
          <p className="text-sm font-semibold">¡{lastCoupon.name} canjeado!</p>
          <p className="text-lg font-bold text-display text-neon-green">{lastCoupon.code}</p>
          <p className="text-xs text-muted-foreground">Muestra este código en la tienda</p>
          <button onClick={() => setLastCoupon(null)} className="text-xs text-primary mt-2">Cerrar</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-muted rounded-xl p-1">
        {([
          { key: "catalogo" as const, label: "Catálogo" },
          { key: "misCanjes" as const, label: "Mis Canjes" },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? "bg-card text-foreground glow-primary" : "text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {redeemMutation.isError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {redeemMutation.error?.message || "Error al canjear"}
        </div>
      )}

      {tab === "catalogo" ? (
        loadingRewards ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !rewards?.length ? (
          <div className="text-center py-12 text-muted-foreground">
            <Gift className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No hay recompensas disponibles aún</p>
            <p className="text-xs mt-1">¡Pronto habrá premios increíbles! 🎁</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rewards.map((r) => {
              const canAfford = (profile?.points ?? 0) >= r.points_cost;
              const outOfStock = r.stock !== null && r.stock <= 0;
              const tags = (r as any).tags as string[] | null;
              return (
                <div key={r.id} className="bg-card rounded-2xl p-4 border border-border">
                  {/* Tags */}
                  {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tagStyles[tag] || "bg-muted text-muted-foreground border-border"}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0 text-2xl">
                      {r.image_url ? (
                        <img src={r.image_url} alt={r.name} className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        "🎁"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{r.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-primary text-display">
                          {r.points_cost.toLocaleString()} pts
                        </span>
                        {r.stock !== null && (
                          <span className="text-[10px] text-muted-foreground">
                            {r.stock > 0 ? `${r.stock} disponibles` : "Agotado"}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setConfirmReward({ id: r.id, name: r.name, cost: r.points_cost })}
                        disabled={!canAfford || outOfStock || redeemMutation.isPending}
                        className={`mt-2 w-full py-2 rounded-lg text-xs font-semibold border transition-colors ${
                          canAfford && !outOfStock
                            ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                            : "bg-muted text-muted-foreground border-border cursor-not-allowed"
                        }`}
                      >
                        {outOfStock ? (
                          "Agotado"
                        ) : !canAfford ? (
                          `Necesitas ${(r.points_cost - (profile?.points ?? 0)).toLocaleString()} pts más`
                        ) : (
                          "Canjear"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : loadingRedemptions ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : !redemptions?.length ? (
        <div className="text-center py-12 text-muted-foreground">
          <Ticket className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Aún no has canjeado nada</p>
          <p className="text-xs mt-1">¡Explora el catálogo y canjea tus puntos!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {redemptions.map((rd) => {
            const sc = statusColors[rd.status] || statusColors.disponible;
            return (
              <div key={rd.id} className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <code className="text-sm font-bold text-primary text-display">{rd.coupon_code}</code>
                  <span className={`text-[10px] font-medium ${sc.color}`}>{sc.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {(rd as any).rewards?.name || "Recompensa"}
                </p>
                {rd.expires_at && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Válido hasta: {new Date(rd.expires_at).toLocaleDateString("es-ES")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmReward} onOpenChange={(open) => !open && setConfirmReward(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Canjear {confirmReward?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Se descontarán <strong className="text-primary">{confirmReward?.cost.toLocaleString()} puntos</strong> de tu saldo.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmReward && handleRedeem(confirmReward.id)}
              disabled={redeemMutation.isPending}
            >
              {redeemMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar canje"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RecompensasPage;
