import {
  FileText,
  Tag,
  MapPin,
  Users,
  BarChart3,
  LayoutDashboard,
  Sparkles,
  Palette,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  "leitor-pedidos": FileText,
  "verificador-promocao": Tag,
  "depurador-regiao": MapPin,
  "analise-rca": Users,
  "comparativo-preco": BarChart3,
  "layout-campanhas": LayoutDashboard,
  "gerador-promocao": Sparkles,
  "gerador-artes": Palette,
};

export function getIcon(id: string): LucideIcon {
  return ICON_MAP[id] ?? FileText;
}
