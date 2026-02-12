import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useProfileStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile_stats", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { count: redemptionCount } = await supabase
        .from("reward_redemptions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      return {
        redemptionCount: redemptionCount ?? 0,
      };
    },
    enabled: !!user,
  });
};
