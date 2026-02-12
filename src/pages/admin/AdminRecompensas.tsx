import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Loader2, Gift } from "lucide-react";

const AVAILABLE_TAGS = ["Popular", "Limitado", "Exclusivo", "Nuevo"];

const AdminRecompensas = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: rewards, isLoading } = useQuery({
    queryKey: ["admin_rewards"],
    queryFn: async () => {
      const { data, error } = await supabase.from("rewards").select("*").order("points_cost");
      if (error) throw error;
      return data;
    },
  });

  const { data: redemptions } = useQuery({
    queryKey: ["admin_redemptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reward_redemptions")
        .select("*, rewards(name)")
        .order("redeemed_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (reward: any) => {
      if (reward.id) {
        const { error } = await supabase.from("rewards").update(reward).eq("id", reward.id);
        if (error) throw error;
      } else {
        const { id, ...rest } = reward;
        const { error } = await supabase.from("rewards").insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_rewards"] });
      setShowForm(false);
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("rewards").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_rewards"] }),
  });

  const emptyReward = { name: "", description: "", points_cost: 100, reward_type: "discount", stock: null, active: true, image_url: "", tags: [] as string[] };

  const handleEdit = (r: any) => {
    setEditing({ ...r, tags: r.tags || [] });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditing({ ...emptyReward });
    setShowForm(true);
  };

  const toggleTag = (tag: string) => {
    const current: string[] = editing.tags || [];
    setEditing({
      ...editing,
      tags: current.includes(tag) ? current.filter((t: string) => t !== tag) : [...current, tag],
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-display">Recompensas</h1>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-neon text-white text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Nueva Recompensa
        </button>
      </div>

      {showForm && editing && (
        <div className="bg-card rounded-2xl p-5 border border-border space-y-4">
          <h2 className="text-sm font-semibold text-display">{editing.id ? "Editar" : "Nueva"} Recompensa</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Nombre"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="col-span-2 px-3 py-2 rounded-lg bg-muted border border-border text-sm"
            />
            <input
              placeholder="Descripción"
              value={editing.description || ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className="col-span-2 px-3 py-2 rounded-lg bg-muted border border-border text-sm"
            />
            <input
              type="number"
              placeholder="Coste en puntos"
              value={editing.points_cost}
              onChange={(e) => setEditing({ ...editing, points_cost: parseInt(e.target.value) || 0 })}
              className="px-3 py-2 rounded-lg bg-muted border border-border text-sm"
            />
            <input
              type="number"
              placeholder="Stock (vacío = ilimitado)"
              value={editing.stock ?? ""}
              onChange={(e) => setEditing({ ...editing, stock: e.target.value ? parseInt(e.target.value) : null })}
              className="px-3 py-2 rounded-lg bg-muted border border-border text-sm"
            />
            <input
              placeholder="URL imagen"
              value={editing.image_url || ""}
              onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
              className="col-span-2 px-3 py-2 rounded-lg bg-muted border border-border text-sm"
            />
            {/* Tags */}
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground mb-2">Etiquetas</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      (editing.tags || []).includes(tag)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.active}
                onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
              />
              Activa
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => saveMutation.mutate(editing)}
              disabled={saveMutation.isPending || !editing.name}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-lg bg-muted text-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-3">Nombre</th>
                <th className="p-3">Puntos</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Etiquetas</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rewards?.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3 text-primary text-display">{r.points_cost}</td>
                  <td className="p-3">{r.stock ?? "∞"}</td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {((r as any).tags as string[] || []).map((tag: string) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.active ? "bg-neon-green/10 text-neon-green" : "bg-muted text-muted-foreground"}`}>
                      {r.active ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleEdit(r)} className="p-1.5 rounded-lg hover:bg-muted"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteMutation.mutate(r.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent redemptions */}
      <section>
        <h2 className="text-lg font-bold text-display mb-3">Canjes Recientes</h2>
        {!redemptions?.length ? (
          <p className="text-sm text-muted-foreground">No hay canjes aún</p>
        ) : (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-3">Cupón</th>
                  <th className="p-3">Recompensa</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.map((rd) => (
                  <tr key={rd.id} className="border-b border-border last:border-0">
                    <td className="p-3 font-mono text-primary">{rd.coupon_code}</td>
                    <td className="p-3">{(rd as any).rewards?.name || "—"}</td>
                    <td className="p-3">
                      <span className={`text-xs ${rd.status === "disponible" ? "text-neon-green" : "text-muted-foreground"}`}>
                        {rd.status}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{new Date(rd.redeemed_at).toLocaleDateString("es-ES")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminRecompensas;
