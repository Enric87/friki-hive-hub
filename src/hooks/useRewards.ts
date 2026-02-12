import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useRewards = () => {
  return useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .eq("active", true)
        .order("points_cost", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useMyRedemptions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my_redemptions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("reward_redemptions")
        .select("*, rewards(*)")
        .eq("user_id", user.id)
        .order("redeemed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useRedeemReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rewardId: string) => {
      const { data, error } = await supabase.rpc("redeem_reward", {
        p_reward_id: rewardId,
      });
      if (error) throw error;
      const result = data as unknown as { success: boolean; error?: string; coupon_code?: string; reward_name?: string };
      if (!result.success) throw new Error(result.error || "Error al canjear");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      queryClient.invalidateQueries({ queryKey: ["my_redemptions"] });
    },
  });
};
