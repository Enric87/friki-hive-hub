import { Receipt, ShoppingBag, Calendar, Gift, Users, TrendingUp, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["admin_metrics"],
    queryFn: async () => {
      const [profilesRes, redemptionsRes, rewardsRes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("reward_redemptions").select("*", { count: "exact", head: true }),
        supabase.from("rewards").select("*", { count: "exact", head: true }).eq("active", true),
      ]);

      return {
        totalUsers: profilesRes.count ?? 0,
        totalRedemptions: redemptionsRes.count ?? 0,
        activeRewards: rewardsRes.count ?? 0,
      };
    },
  });

  const { data: recentRedemptions } = useQuery({
    queryKey: ["admin_recent_redemptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reward_redemptions")
        .select("*, rewards(name)")
        .order("redeemed_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
  });

  const stats = [
    { label: "Usuarios totales", value: metrics?.totalUsers ?? "—", icon: Users, color: "text-neon-green" },
    { label: "Recompensas activas", value: metrics?.activeRewards ?? "—", icon: Gift, color: "text-neon-orange" },
    { label: "Canjes realizados", value: metrics?.totalRedemptions ?? "—", icon: TrendingUp, color: "text-primary" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-display">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-3xl font-bold text-display">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Redemptions */}
      <div className="bg-card rounded-xl p-5 border border-border/50">
        <h2 className="text-sm font-semibold text-display tracking-wider uppercase mb-4">Canjes Recientes</h2>
        {!recentRedemptions?.length ? (
          <p className="text-sm text-muted-foreground">No hay canjes aún</p>
        ) : (
          <div className="space-y-3">
            {recentRedemptions.map((rd) => (
              <div key={rd.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{(rd as any).rewards?.name || "—"}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(rd.redeemed_at).toLocaleDateString("es-ES")} · <code className="text-primary">{rd.coupon_code}</code>
                  </p>
                </div>
                <span className={`text-[10px] font-medium ${rd.status === "disponible" ? "text-neon-green" : "text-muted-foreground"}`}>
                  {rd.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
