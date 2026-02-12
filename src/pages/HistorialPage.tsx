import { Loader2, Gift, ArrowLeft } from "lucide-react";
import { useMyRedemptions } from "@/hooks/useRewards";
import { useNavigate } from "react-router-dom";

const HistorialPage = () => {
  const navigate = useNavigate();
  const { data: redemptions, isLoading } = useMyRedemptions();

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-display">Historial de Actividad</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : !redemptions?.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <Gift className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aún no tienes actividad</p>
          <p className="text-xs mt-1">Tu historial de canjes aparecerá aquí 📜</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

          <div className="space-y-4">
            {redemptions.map((rd) => {
              const statusLabel = rd.status === "disponible" ? "Activo" : rd.status === "usado" ? "Usado" : "Caducado";
              const statusColor = rd.status === "disponible" ? "text-neon-green" : "text-muted-foreground";
              return (
                <div key={rd.id} className="flex gap-4 pl-1">
                  <div className="w-7 h-7 rounded-full bg-card border-2 border-primary flex items-center justify-center shrink-0 z-10">
                    <Gift className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-card rounded-xl p-3 border border-border flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold">{(rd as any).rewards?.name || "Recompensa"}</p>
                      <span className={`text-[10px] font-medium ${statusColor}`}>{statusLabel}</span>
                    </div>
                    <code className="text-xs font-bold text-primary text-display">{rd.coupon_code}</code>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(rd.redeemed_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
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
