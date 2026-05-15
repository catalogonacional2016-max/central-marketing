import { useParams, Link } from "wouter";
import { ArrowLeft, ExternalLink, Play } from "lucide-react";
import { useAdmin } from "@/lib/admin-store";
import { getIcon } from "@/lib/icon-map";
import { parseVideoUrl } from "@/lib/video-utils";
import { SiteHeader, SiteFooter } from "@/components/site-layout";

function VideoPlayer({ videoUrl, emptyMessage }: { videoUrl: string; emptyMessage: string }) {
  const info = parseVideoUrl(videoUrl);

  if (!info.type) {
    return (
      <div
        className="w-full max-w-2xl rounded border flex flex-col items-center justify-center gap-2"
        style={{ minHeight: 240, borderColor: "#D1D5DB", backgroundColor: "#F9FAFB" }}
        data-testid="section-no-video"
      >
        <Play className="w-8 h-8 text-gray-300" />
        <p className="text-sm font-semibold text-center px-8" style={{ color: "#9CA3AF" }}>
          {emptyMessage || "Nenhum vídeo disponível no momento."}
        </p>
      </div>
    );
  }

  if (info.type === "mp4") {
    return (
      <div className="w-full max-w-2xl rounded overflow-hidden border border-gray-200 shadow-sm" data-testid="section-video-mp4">
        <video controls className="w-full" style={{ maxHeight: 360 }}>
          <source src={info.embedUrl} type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-2xl rounded overflow-hidden border border-gray-200 shadow-sm"
      style={{ aspectRatio: "16/9" }}
      data-testid="section-video-embed"
    >
      <iframe
        src={info.embedUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Vídeo da ferramenta"
      />
    </div>
  );
}

export default function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const { config } = useAdmin();
  const tool = config.tools.find((t) => t.id === id && t.enabled);

  if (!tool) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-white">
        <SiteHeader />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-lg font-bold" style={{ color: config.primaryColor }}>
            Ferramenta não encontrada.
          </p>
          <Link href="/">
            <span className="text-sm font-semibold underline cursor-pointer" style={{ color: config.accentColor }}>
              Voltar ao hub
            </span>
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const isActive = tool.status === "Em andamento";
  const statusColor = isActive ? config.greenColor : config.accentColor;
  const Icon = getIcon(tool.id);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white">
      <SiteHeader />

      <div className="bg-white px-6 pt-5 pb-3 text-center border-b border-gray-100">
        <h1
          className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight"
          style={{ color: config.primaryColor }}
          data-testid="text-page-title"
        >
          {config.pageTitle}
        </h1>
      </div>

      <main className="flex-1 flex flex-col items-center px-6 py-8 gap-6" data-testid="section-tool-detail">
        <div className="flex flex-col items-center gap-3 w-full max-w-lg">
          <p className="text-base font-bold text-center" style={{ color: config.primaryColor }}>
            <span data-testid="text-detail-title">{tool.title}</span>
            {" – "}
            <span style={{ color: statusColor }} data-testid="text-detail-status">{tool.status}</span>
          </p>

          <div
            className="flex items-center justify-center shrink-0 rounded-full border-[3px]"
            style={{ width: 60, height: 60, backgroundColor: config.primaryColor, borderColor: config.accentColor }}
          >
            <Icon className="w-6 h-6 text-white" data-testid="icon-detail" />
          </div>

          <p className="text-sm leading-relaxed text-center" style={{ color: "#374151" }} data-testid="text-detail-desc">
            {tool.description}
          </p>

          {tool.buttonUrl && (
            <a
              href={tool.buttonUrl}
              target={tool.buttonNewTab ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded transition-opacity hover:opacity-80"
              style={{ backgroundColor: config.accentColor, color: "#ffffff" }}
              data-testid="btn-detail-access"
            >
              {tool.buttonText || "Acessar ferramenta"}
              {tool.buttonNewTab && <ExternalLink className="w-4 h-4" />}
            </a>
          )}
        </div>

        <VideoPlayer videoUrl={tool.videoUrl} emptyMessage={tool.videoEmptyMessage} />

        <Link href="/" data-testid="link-back-home">
          <span
            className="flex items-center gap-1 text-sm font-semibold cursor-pointer hover:opacity-70 transition-opacity"
            style={{ color: config.primaryColor }}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao hub
          </span>
        </Link>
      </main>

      <SiteFooter />
    </div>
  );
}
