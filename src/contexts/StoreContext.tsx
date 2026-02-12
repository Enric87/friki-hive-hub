import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StoreConfig {
  store_name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  address: string | null;
  schedule: string | null;
  phone: string | null;
  whatsapp_url: string | null;
  social_links: Record<string, string>;
}

const defaultConfig: StoreConfig = {
  store_name: "FrikiQuest",
  logo_url: null,
  primary_color: "#6d28d9",
  secondary_color: "#f97316",
  address: null,
  schedule: null,
  phone: null,
  whatsapp_url: null,
  social_links: {},
};

const StoreContext = createContext<{ config: StoreConfig; loading: boolean }>({
  config: defaultConfig,
  loading: true,
});

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<StoreConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("store_config")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setConfig({
            store_name: data.store_name,
            logo_url: data.logo_url,
            primary_color: data.primary_color || defaultConfig.primary_color,
            secondary_color: data.secondary_color || defaultConfig.secondary_color,
            address: data.address,
            schedule: data.schedule,
            phone: data.phone,
            whatsapp_url: data.whatsapp_url,
            social_links: (data.social_links as Record<string, string>) || {},
          });
        }
        setLoading(false);
      });
  }, []);

  return (
    <StoreContext.Provider value={{ config, loading }}>
      {children}
    </StoreContext.Provider>
  );
};
