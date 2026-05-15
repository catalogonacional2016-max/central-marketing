import { Link } from "wouter";
import { Settings } from "lucide-react";
import { useAdmin } from "@/lib/admin-store";
import type { ToolConfig } from "@/lib/admin-store";
import { getIcon } from "@/lib/icon-map";
import { SiteHeader, SiteFooter } from "@/components/site-layout";

function ToolCard({ tool }: { tool: ToolConfig }) {
  const { config } = useAdmin();
  const { primaryColor, accentColor, greenColor } = config;
  const isActive = tool.status === "Em andamento";
  const statusColor = isActive ? greenColor : accentColor;
  const Icon = getIcon(tool.id);

  return (
    <div className="flex flex-col gap-1.5" data-testid={`tool-card-${tool.id}`}>
      <p className="text-sm font-bold" style={{ color: primaryColor }}>
        <span data-testid={`text-title-${tool.id}`}>{tool.title}</span>
        {" – "}
        <span style={{ color: statusColor }} data-testid={`text-status-${tool.id}`}>{tool.status}</span>
      </p>

      <div className="flex items-center gap-2">
        <Link href={`/ferramenta/${tool.id}`} data-testid={`link-tool-${tool.id}`}>
          <div
            className="flex items-center justify-center shrink-0 rounded-full border-[3px] hover:opacity-75 transition-opacity cursor-pointer"
            style={{ width: 44, height: 44, backgroundColor: primaryColor, borderColor: accentColor }}
            data-testid={`icon-${tool.id}`}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>
        </Link>

        {tool.buttonUrl && (
          <a
            href={tool.buttonUrl}
            target={tool.buttonNewTab ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-xs font-bold px-2.5 py-1 rounded transition-opacity hover:opacity-80"
            style={{ backgroundColor: accentColor, color: "#ffffff" }}
            data-testid={`btn-access-${tool.id}`}
          >
            {tool.buttonText || "Acessar ferramenta"}
          </a>
        )}
      </div>

      <p className="text-xs leading-relaxed pl-1" style={{ color: "#374151" }} data-testid={`text-desc-${tool.id}`}>
        {tool.description}
      </p>
    </div>
  );
}

export default function Home() {
  const { config } = useAdmin();
  const activeTools = config.tools.filter((t) => t.enabled);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white">
      <SiteHeader />

      <div className="bg-white px-6 pt-5 pb-3 text-center border-b border-gray-100 relative">
        <h1
          className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight"
          style={{ color: config.primaryColor }}
          data-testid="text-page-title"
        >
          {config.pageTitle}
        </h1>
        <Link href="/admin">
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            data-testid="link-admin"
          >
            <Settings className="w-3.5 h-3.5" />
            Admin
          </span>
        </Link>
      </div>

      <main className="flex-1 px-6 md:px-10 py-6" data-testid="section-tools">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
          {activeTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
