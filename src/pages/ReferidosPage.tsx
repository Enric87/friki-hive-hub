import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Copy, Gift, Loader2, Share2, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useClaimReferralCode,
  useMyClaimedReferral,
  useMyReferrals,
  useReferralCode,
} from "@/hooks/useReferrals";
import StateEmpty from "@/components/StateEmpty";
import StateError from "@/components/StateError";
import StateSkeleton from "@/components/StateSkeleton";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "text-neon-orange" },
  qualified: { label: "Validado", color: "text-neon-green" },
};

const ReferidosPage = () => {
  const navigate = useNavigate();
  const { data: referralCode, isLoading: loadingCode, isError: codeError, refetch: refetchCode } = useReferralCode();
  const { data: referrals, isLoading: loadingReferrals } = useMyReferrals();
  const { data: claimedReferral, isLoading: loadingClaimed } = useMyClaimedReferral();
  const claimReferral = useClaimReferralCode();
  const [copied, setCopied] = useState(false);
  const [claimCode, setClaimCode] = useState("");

  const shareUrl = useMemo(() => {
    if (!referralCode) return "";
    return `${window.location.origin}/?ref=${encodeURIComponent(referralCode)}`;
  }, [referralCode]);

  const qualifiedCount = referrals?.filter((referral) => referral.status === "qualified").length ?? 0;
  const pendingCount = referrals?.filter((referral) => referral.status === "pending").length ?? 0;
  const earnedPoints = referrals
    ?.filter((referral) => referral.status === "qualified")
    .reduce((sum, referral) => sum + referral.reward_points, 0) ?? 0;

  const handleCopy = async () => {
    if (!referralCode) return;
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleShare = async () => {
    if (!shareUrl) return;

    if (navigator.share) {
      await navigator.share({
        title: "Únete a FrikiQuest",
        text: `Usa mi código ${referralCode} y empieza a ganar puntos en FrikiQuest.`,
        url: shareUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleClaim = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!claimCode.trim()) return;
    await claimReferral.mutateAsync(claimCode);
    setClaimCode("");
  };

  const isLoading = loadingCode || loadingReferrals || loadingClaimed;

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-display">Referidos</h1>
      </div>

      {codeError ? (
        <StateError message="No se pudo cargar tu código" onRetry={() => refetchCode()} />
      ) : (
        <>
          <section className="rounded-2xl bg-card p-5 border border-primary/20 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl gradient-neon flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">Invita amigos</p>
                <p className="text-xs text-muted-foreground">
                  Gana 50 puntos cuando la tienda valide la primera compra de tu referido.
                </p>
              </div>
            </div>

            {loadingCode ? (
              <div className="h-16 rounded-xl bg-muted animate-pulse" />
            ) : (
              <div className="rounded-xl bg-background border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Tu código</p>
                <p className="text-3xl font-bold text-primary text-display tracking-widest">{referralCode}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopy}
                disabled={!referralCode}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiado" : "Copiar"}
              </button>
              <button
                onClick={handleShare}
                disabled={!shareUrl}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-muted text-foreground text-sm font-medium disabled:opacity-50"
              >
                <Share2 className="w-4 h-4" />
                Compartir
              </button>
            </div>
          </section>

          <section className="grid grid-cols-3 gap-3">
            <div className="bg-card rounded-xl p-3 border border-border text-center">
              <p className="text-lg font-bold text-display">{qualifiedCount}</p>
              <p className="text-[10px] text-muted-foreground">Validados</p>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border text-center">
              <p className="text-lg font-bold text-display">{pendingCount}</p>
              <p className="text-[10px] text-muted-foreground">Pendientes</p>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border text-center">
              <p className="text-lg font-bold text-display">{earnedPoints}</p>
              <p className="text-[10px] text-muted-foreground">Puntos</p>
            </div>
          </section>

          <section className="bg-card rounded-2xl p-4 border border-border space-y-3">
            <div>
              <p className="text-sm font-semibold">¿Vienes invitado?</p>
              <p className="text-xs text-muted-foreground">
                Introduce el código de tu amigo antes de tu primera compra validada.
              </p>
            </div>

            {claimedReferral ? (
              <div className="flex items-center gap-2 rounded-xl bg-neon-green/10 p-3 text-sm text-neon-green">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Código aplicado. Tu referido está pendiente de validación.
              </div>
            ) : (
              <form onSubmit={handleClaim} className="space-y-2">
                <input
                  value={claimCode}
                  onChange={(event) => setClaimCode(event.target.value.toUpperCase())}
                  placeholder="FQ-ABC123"
                  className="w-full rounded-xl bg-background border border-border px-3 py-3 text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  disabled={claimReferral.isPending || !claimCode.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
                >
                  {claimReferral.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
                  Aplicar código
                </button>
              </form>
            )}

            {claimReferral.isError && (
              <p className="text-xs text-destructive">{claimReferral.error.message}</p>
            )}
          </section>

          <section>
            <h2 className="text-sm font-semibold text-display tracking-wider uppercase mb-3">Tus Invitaciones</h2>
            {isLoading ? (
              <StateSkeleton count={3} type="row" />
            ) : !referrals?.length ? (
              <StateEmpty
                icon={UserPlus}
                title="Aún no has invitado a nadie"
                subtitle="Comparte tu código para empezar a ganar puntos."
              />
            ) : (
              <div className="space-y-2">
                {referrals.map((referral) => {
                  const status = statusConfig[referral.status] || statusConfig.pending;
                  return (
                    <div key={referral.id} className="bg-card rounded-xl p-4 border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Invitación</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(referral.created_at).toLocaleDateString("es-ES")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-semibold ${status.color}`}>{status.label}</p>
                          <p className="text-xs text-muted-foreground">+{referral.reward_points} pts</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default ReferidosPage;
