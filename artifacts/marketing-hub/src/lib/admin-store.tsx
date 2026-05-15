import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { TOOLS } from "./tools";

export type ToolStatus = "Em andamento" | "Em desenvolvimento";

export interface ToolConfig {
  id: string;
  title: string;
  description: string;
  status: ToolStatus;
  enabled: boolean;
  buttonText: string;
  buttonUrl: string;
  buttonNewTab: boolean;
  videoUrl: string;
  videoEmptyMessage: string;
}

export interface PlatformConfig {
  pageTitle: string;
  companyPrefix: string;
  companyHighlight: string;
  companyName: string;
  footerHub: string;
  footerLinkText: string;
  footerLinkUrl: string;
  footerTagline: string;
  primaryColor: string;
  accentColor: string;
  greenColor: string;
  tools: ToolConfig[];
}

export const DEFAULT_CONFIG: PlatformConfig = {
  pageTitle: "Central de Ferramentas do Marketing",
  companyPrefix: "GRUPO",
  companyHighlight: "MULTI",
  companyName: "NACIONAL",
  footerHub: "Hub da Nacional",
  footerLinkText: "Linkme!",
  footerLinkUrl: "#",
  footerTagline: "Tudo que a equipe precisa, em um só lugar.",
  primaryColor: "#0D1B35",
  accentColor: "#C41230",
  greenColor: "#16A34A",
  tools: TOOLS.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    enabled: true,
    buttonText: "Acessar ferramenta",
    buttonUrl: "",
    buttonNewTab: true,
    videoUrl: "",
    videoEmptyMessage: "Nenhum vídeo disponível no momento.",
  })),
};

const STORAGE_KEY = "mkt-hub-admin-v1";

interface AdminContextValue {
  config: PlatformConfig;
  updateConfig: (partial: Partial<Omit<PlatformConfig, "tools">>) => void;
  updateTool: (id: string, partial: Partial<ToolConfig>) => void;
  resetConfig: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PlatformConfig>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PlatformConfig;
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          tools: DEFAULT_CONFIG.tools.map((def) => {
            const saved = parsed.tools?.find((t) => t.id === def.id);
            return saved ? { ...def, ...saved } : def;
          }),
        };
      }
    } catch {}
    return DEFAULT_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = (partial: Partial<Omit<PlatformConfig, "tools">>) =>
    setConfig((prev) => ({ ...prev, ...partial }));

  const updateTool = (id: string, partial: Partial<ToolConfig>) =>
    setConfig((prev) => ({
      ...prev,
      tools: prev.tools.map((t) => (t.id === id ? { ...t, ...partial } : t)),
    }));

  const resetConfig = () => setConfig(DEFAULT_CONFIG);

  return (
    <AdminContext.Provider value={{ config, updateConfig, updateTool, resetConfig }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
