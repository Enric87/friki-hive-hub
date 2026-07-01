import { useState } from "react";
import { AlertCircle, CheckCircle2, Gift, Loader2, Ticket } from "lucide-react";
import { useMyRedemptions, useRedeemReward, useRewards } from "@/hooks/useRewards";
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

const statusColors: Record<string, { label: string; color: string }> = {
  disponible: { label: "Disponible", color: "text-neon-green" },
  usado: { label: "Usado", color: "text-muted-foreground" },
  caducado: { label: "Caducado", color: "text-destructive" },
};

const RecompensasPage = () => {
  const [tab, setTab] = useState<"catalogo" | "misCanjes">("catalogo");
  const [lastCoupon, setLastCoupon] = useState<{ code: string; name: string } | null>(null);
  const [confirmReward, setConfirmReward] = useState<{ id: string; name: string; cost: number } | null>(null);
  const { data: rewards, isLoading: loadingRewards } = useRewards();
  const { data: redemptions, isLoading: loadingRedemptions } = useMyRedemptions();
  const { data: profile } = useProfile();
  const redeemMutation = useRedeemReward();

  const handleRedeem = async (rewardId: string) => {
    try {
      const result = await redeemMutation.mutateAsync(rewardId);
      setLastCoupon({ code: result.coupon_code!, name: result.reward_name! });
      setConfirmReward(null);
    } catch {
      setConfirmReward(null);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pb-4 pt-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-display">Recompensas</h1>
        {profile && <span className="text-sm font-semibold text-primary text-display">{profile.points.toLocaleString()} pts</span>}
      </div>

      {lastCoupon && (
        <div className="space-y-1 rounded-xl border border-neon-green/20 bg-neon-green/10 p-4 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-neon-green" />
          <p className="text-sm font-semibold">¡{lastCoupon.name} canjeado!</p>
          <p className="text-lg font-bold text-neon-green text-display">{lastCoupon.code}</p>
          <p className="text-xs text-muted-foreground">Muestra este código en la tienda</p>
          <button onClick={() => setLastCoupon(null)} className="mt-2 text-xs text-primary">Cerrar</button>
        </div>
      )}

      <div className="flex rounded-xl bg-muted p-1">
        {[
          { key: "catalogo" as const, label: "Catálogo" },
          { key: "misCanjes" as const, label: "Mis canjes" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              tab === item.key ? "bg-card text-foreground glow-primary" : "text-muted-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {redeemMutation.isError && (
        <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {redeemMutation.error?.message || "Error al canjear"}
        </div>
      )}

      {tab === "catalogo" ? (
        loadingRewards ? (
          <LoadingState />
        ) : !rewards?.length ? (
          <EmptyState icon={Gift} title="No hay recompensas disponibles aún" subtitle="Pronto habrá premios increíbles." />
        ) : (
          <div className="space-y-3">
            {rewards.map((reward) => {
              const canAfford = (profile?.points ?? 0) >= reward.points_cost;
              const outOfStock = reward.stock !== null && reward.stock <= 0;
              const tags = (reward as any).tags as string[] | null;

              return (
                <div key={reward.id} className="rounded-2xl border border-border bg-card p-4">
                  {tags && tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span key={tag} className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${tagStyles[tag] || "bg-muted text-muted-foreground border-border"}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
                      {reward.image_url ? (
                        <img src={reward.image_url} alt={reward.name} className="h-full w-full rounded-xl object-cover" />
                      ) : (
                        <Gift className="h-8 w-8 text-neon-pink" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{reward.name}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{reward.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-lg font-bold text-primary text-display">{reward.points_cost.toLocaleString()} pts</span>
                        {reward.stock !== null && (
                          <span className="text-[10px] text-muted-foreground">{reward.stock > 0 ? `${reward.stock} disponibles` : "Agotado"}</span>
                        )}
                      </div>
                      <button
                        onClick={() => setConfirmReward({ id: reward.id, name: reward.name, cost: reward.points_cost })}
                        disabled={!canAfford || outOfStock || redeemMutation.isPending}
                        className={`mt-2 w-full rounded-lg border py-2 text-xs font-semibold transition-colors ${
                          canAfford && !outOfStock
                            ? "border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
                            : "cursor-not-allowed border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        {outOfStock ? "Agotado" : !canAfford ? `Necesitas ${(reward.points_cost - (profile?.points ?? 0)).toLocaleString()} pts más` : "Canjear"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : loadingRedemptions ? (
        <LoadingState />
      ) : !redemptions?.length ? (
        <EmptyState icon={Ticket} title="Aún no has canjeado nada" subtitle="Explora el catálogo y canjea tus puntos." />
      ) : (
        <div className="space-y-2">
          {redemptions.map((redemption) => {
            const status = statusColors[redemption.status] || statusColors.disponible;
            return (
              <div key={redemption.id} className="rounded-xl border border-border bg-card p-4">
                <div className="mb-1 flex items-center justify-between">
                  <code className="text-sm font-bold text-primary text-display">{redemption.coupon_code}</code>
                  <span className={`text-[10px] font-medium ${status.color}`}>{status.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{(redemption as any).rewards?.name || "Recompensa"}</p>
                {redemption.expires_at && (
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Válido hasta: {new Date(redemption.expires_at).toLocaleDateString("es-ES")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

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
            <AlertDialogAction onClick={() => confirmReward && handleRedeem(confirmReward.id)} disabled={redeemMutation.isPending}>
              {redeemMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar canje"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex justify-center py-12">
    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  </div>
);

const EmptyState = ({ icon: Icon, title, subtitle }: { icon: typeof Gift; title: string; subtitle: string }) => (
  <div className="py-12 text-center text-muted-foreground">
    <Icon className="mx-auto mb-2 h-10 w-10 opacity-40" />
    <p className="text-sm">{title}</p>
    <p className="mt-1 text-xs">{subtitle}</p>
  </div>
);

export default RecompensasPage;
