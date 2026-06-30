import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type ClaimReferralResult = {
  success: boolean;
  error?: string;
  reward_points?: number;
};

export const useReferralCode = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["referral_code", user?.id],
    queryFn: async () => {
      if (!user) return "";
      const { data, error } = await supabase.rpc("ensure_my_referral_code");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useMyReferrals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my_referrals", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("inviter_user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useMyClaimedReferral = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my_claimed_referral", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("invited_user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useClaimReferralCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase.rpc("claim_referral_code", {
        p_code: code,
      });
      if (error) throw error;

      const result = data as ClaimReferralResult;
      if (!result.success) {
        throw new Error(result.error || "No se pudo aplicar el código");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_claimed_referral"] });
      queryClient.invalidateQueries({ queryKey: ["my_referrals"] });
    },
  });
};
