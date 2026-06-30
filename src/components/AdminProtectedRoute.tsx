import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type RoleCheckState = "loading" | "allowed" | "denied";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [roleCheck, setRoleCheck] = useState<RoleCheckState>("loading");

  useEffect(() => {
    let cancelled = false;

    const checkAdminRole = async () => {
      if (loading) return;

      if (!user) {
        setRoleCheck("denied");
        return;
      }

      setRoleCheck("loading");
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });

      if (!cancelled) {
        setRoleCheck(!error && data ? "allowed" : "denied");
      }
    };

    checkAdminRole();

    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  if (loading || roleCheck === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roleCheck === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-display">Acceso restringido</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Esta zona solo está disponible para administradores de la tienda.
            </p>
          </div>
          <Link
            to="/home"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Volver a la app
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
