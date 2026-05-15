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

export type ToolStatus = "Em andamento" | "Em desenvolvimento";

export interface Tool {
  id: string;
  title: string;
  status: ToolStatus;
  description: string;
  icon: LucideIcon;
}

export const TOOLS: Tool[] = [
  {
    id: "leitor-pedidos",
    title: "Leitor de Pedidos",
    status: "Em desenvolvimento",
    description: "Transforma pedidos em informações rápidas para análise comercial.",
    icon: FileText,
  },
  {
    id: "verificador-promocao",
    title: "Verificador de promoção",
    status: "Em andamento",
    description:
      "Confere automaticamente produtos em promoção, validando códigos, descrições, preços e imagens antes da divulgação.",
    icon: Tag,
  },
  {
    id: "depurador-regiao",
    title: "Depurador de região",
    status: "Em desenvolvimento",
    description:
      "Analisa clientes, regiões e oportunidades de forma inteligente e automatizada.",
    icon: MapPin,
  },
  {
    id: "analise-rca",
    title: "Analise de RCAs Excluídos",
    status: "Em desenvolvimento",
    description:
      "Analisa histórico e desempenho de RCAs excluídos, auxiliando em avaliações e tomadas de decisão estratégicas.",
    icon: Users,
  },
  {
    id: "comparativo-preco",
    title: "Comparativo de preço",
    status: "Em desenvolvimento",
    description: "Analisa preços concorrentes e posicionamento estratégico.",
    icon: BarChart3,
  },
  {
    id: "layout-campanhas",
    title: "Layout de Campanhas",
    status: "Em andamento",
    description:
      "Painel interativo para acompanhamento da campanha, metas, rankings e desempenho das equipes em tempo real.",
    icon: LayoutDashboard,
  },
  {
    id: "gerador-promocao",
    title: "Gerador de promoção",
    status: "Em desenvolvimento",
    description: "Padroniza campanhas promocionais em segundos.",
    icon: Sparkles,
  },
  {
    id: "gerador-artes",
    title: "Gerador de Artes",
    status: "Em andamento",
    description: "Cria artes automáticas com templates oficiais da empresa.",
    icon: Palette,
  },
];
