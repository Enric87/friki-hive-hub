import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Store } from "lucide-react";

const AdminConfigTienda = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    store_name: "",
    logo_url: "",
    primary_color: "#6d28d9",
    secondary_color: "#f97316",
    address: "",
    schedule: "",
    phone: "",
    whatsapp_url: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["store_config"],
    queryFn: async () => {
      const { data, error } = await supabase.from("store_config").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setForm({
        store_name: data.store_name || "",
        logo_url: data.logo_url || "",
        primary_color: data.primary_color || "#6d28d9",
        secondary_color: data.secondary_color || "#f97316",
        address: data.address || "",
        schedule: data.schedule || "",
        phone: data.phone || "",
        whatsapp_url: data.whatsapp_url || "",
      });
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!data?.id) return;
      const { error } = await supabase.from("store_config").update(form).eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["store_config"] }),
  });

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Store className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-display">Configuración de Tienda</h1>
      </div>

      <div className="bg-card rounded-2xl p-5 border border-border space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Nombre de la tienda</label>
          <input
            value={form.store_name}
            onChange={(e) => setForm({ ...form, store_name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">URL del logo</label>
          <input
            value={form.logo_url}
            onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Color primario</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="w-10 h-10 rounded border-0 cursor-pointer" />
              <input value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Color secundario</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className="w-10 h-10 rounded border-0 cursor-pointer" />
              <input value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Dirección</label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Horario</label>
          <input
            value={form.schedule}
            onChange={(e) => setForm({ ...form, schedule: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Teléfono</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">WhatsApp URL</label>
            <input
              value={form.whatsapp_url}
              onChange={(e) => setForm({ ...form, whatsapp_url: e.target.value })}
              placeholder="https://wa.me/34..."
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm"
            />
          </div>
        </div>

        <button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
        >
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar cambios
        </button>

        {saveMutation.isSuccess && <p className="text-sm text-neon-green">✓ Guardado correctamente</p>}
        {saveMutation.isError && <p className="text-sm text-destructive">Error al guardar</p>}
      </div>
    </div>
  );
};

export default AdminConfigTienda;
