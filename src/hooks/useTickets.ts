import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useTickets = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tickets", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateTicket = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ imageFile, totalAmount }: { imageFile: File; totalAmount?: number }) => {
      if (!user) throw new Error("No autenticado");

      // Upload image
      const ext = imageFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("ticket-images")
        .upload(path, imageFile);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("ticket-images")
        .getPublicUrl(path);

      // Create ticket record
      const { data, error } = await supabase
        .from("tickets")
        .insert({
          user_id: user.id,
          image_url: urlData.publicUrl,
          total_amount: totalAmount || null,
          status: "pending",
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};
