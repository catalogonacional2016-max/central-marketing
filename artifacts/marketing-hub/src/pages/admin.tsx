import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, RotateCcw, Save, ChevronDown, ChevronUp, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useAdmin } from "@/lib/admin-store";
import type { ToolConfig } from "@/lib/admin-store";
import { getIcon } from "@/lib/icon-map";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</Label>
      {children}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border border-gray-200"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-sm uppercase w-32"
          maxLength={7}
        />
        <div className="w-8 h-8 rounded border border-gray-200" style={{ backgroundColor: value }} />
      </div>
    </Field>
  );
}

function ToolEditor({ tool, onSave }: { tool: ToolConfig; onSave: (id: string, data: Partial<ToolConfig>) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ToolConfig>(tool);
  const Icon = getIcon(tool.id);

  const set = (partial: Partial<ToolConfig>) => setDraft((d) => ({ ...d, ...partial }));
  const dirty = JSON.stringify(draft) !== JSON.stringify(tool);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" data-testid={`admin-tool-${tool.id}`}>
      <button
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
        onClick={() => setOpen((o) => !o)}
        data-testid={`toggle-tool-${tool.id}`}
      >
        <div
          className="w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#0D1B35", borderColor: "#C41230" }}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 truncate">{draft.title}</p>
          <p className="text-xs text-gray-400">{draft.status}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {!draft.enabled && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-400">Desativado</span>
          )}
          {dirty && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-700">Não salvo</span>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 py-4 flex flex-col gap-5 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={draft.enabled}
                onCheckedChange={(v) => set({ enabled: v })}
                id={`enabled-${tool.id}`}
                data-testid={`switch-enabled-${tool.id}`}
              />
              <Label htmlFor={`enabled-${tool.id}`} className="text-sm font-semibold cursor-pointer">
                {draft.enabled ? (
                  <span className="flex items-center gap-1 text-green-700"><Eye className="w-3.5 h-3.5" /> Ferramenta ativa</span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400"><EyeOff className="w-3.5 h-3.5" /> Ferramenta desativada</span>
                )}
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Título">
              <Input value={draft.title} onChange={(e) => set({ title: e.target.value })} data-testid={`input-title-${tool.id}`} />
            </Field>
            <Field label="Status">
              <Select value={draft.status} onValueChange={(v) => set({ status: v as ToolConfig["status"] })}>
                <SelectTrigger data-testid={`select-status-${tool.id}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Em desenvolvimento">Em desenvolvimento</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Descrição">
            <Textarea
              value={draft.description}
              onChange={(e) => set({ description: e.target.value })}
              rows={2}
              className="resize-none"
              data-testid={`input-desc-${tool.id}`}
            />
          </Field>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Botão de acesso</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Texto do botão">
                <Input value={draft.buttonText} onChange={(e) => set({ buttonText: e.target.value })} data-testid={`input-btn-text-${tool.id}`} />
              </Field>
              <Field label="URL de destino">
                <Input value={draft.buttonUrl} onChange={(e) => set({ buttonUrl: e.target.value })} placeholder="https://..." data-testid={`input-btn-url-${tool.id}`} />
              </Field>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Switch
                checked={draft.buttonNewTab}
                onCheckedChange={(v) => set({ buttonNewTab: v })}
                id={`newtab-${tool.id}`}
                data-testid={`switch-newtab-${tool.id}`}
              />
              <Label htmlFor={`newtab-${tool.id}`} className="text-sm cursor-pointer flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> Abrir em nova aba
              </Label>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Vídeo da ferramenta</p>
            <Field label="URL do vídeo (YouTube, Vimeo ou MP4)">
              <Input
                value={draft.videoUrl}
                onChange={(e) => set({ videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
                data-testid={`input-video-${tool.id}`}
              />
            </Field>
            {draft.videoUrl && (
              <p className="text-xs text-green-600 font-medium mt-1">✓ URL de vídeo configurada</p>
            )}
            <div className="mt-3">
              <Field label="Mensagem quando não há vídeo">
                <Input
                  value={draft.videoEmptyMessage}
                  onChange={(e) => set({ videoEmptyMessage: e.target.value })}
                  data-testid={`input-empty-msg-${tool.id}`}
                />
              </Field>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
            <Button
              className="text-white font-semibold"
              style={{ backgroundColor: "#0D1B35" }}
              onClick={() => { onSave(tool.id, draft); }}
              disabled={!dirty}
              data-testid={`btn-save-${tool.id}`}
            >
              <Save className="w-4 h-4 mr-1.5" />
              Salvar alterações
            </Button>
            <Button
              variant="outline"
              onClick={() => setDraft(tool)}
              disabled={!dirty}
              data-testid={`btn-discard-${tool.id}`}
            >
              Descartar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const { config, updateConfig, updateTool, resetConfig } = useAdmin();
  const [saved, setSaved] = useState(false);

  const handleSaveTool = (id: string, data: Partial<ToolConfig>) => {
    updateTool(id, data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveAppearance = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ backgroundColor: "#F3F4F6" }}>
      <header style={{ backgroundColor: "#0D1B35" }} className="sticky top-0 z-20">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/">
              <span className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors cursor-pointer" data-testid="link-back-hub">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao hub
              </span>
            </Link>
            <div className="w-px h-5 bg-white/20" />
            <div>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Grupo Multinacional</p>
              <p className="text-white font-black text-base leading-none tracking-tight">PAINEL ADMINISTRATIVO</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs font-semibold text-green-400 px-3 py-1 rounded bg-green-400/10 border border-green-400/20">
                ✓ Salvo com sucesso
              </span>
            )}
            <button
              onClick={() => { if (confirm("Restaurar todas as configurações padrão?")) resetConfig(); }}
              className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-medium transition-colors"
              data-testid="btn-reset-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar padrão
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-8 py-6 max-w-5xl mx-auto w-full">
        <Tabs defaultValue="ferramentas">
          <TabsList className="mb-6 bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
            <TabsTrigger value="ferramentas" className="font-semibold data-[state=active]:shadow-sm" data-testid="tab-ferramentas">
              Ferramentas
            </TabsTrigger>
            <TabsTrigger value="aparencia" className="font-semibold data-[state=active]:shadow-sm" data-testid="tab-aparencia">
              Aparência
            </TabsTrigger>
            <TabsTrigger value="conteudo" className="font-semibold data-[state=active]:shadow-sm" data-testid="tab-conteudo">
              Conteúdo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ferramentas">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-base font-black text-gray-900">Gerenciar Ferramentas</h2>
                  <p className="text-xs text-gray-500">Edite títulos, descrições, botões e vídeos de cada ferramenta.</p>
                </div>
                <span className="text-xs text-gray-400">{config.tools.filter((t) => t.enabled).length}/{config.tools.length} ativas</span>
              </div>
              {config.tools.map((tool) => (
                <ToolEditor key={tool.id} tool={tool} onSave={handleSaveTool} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="aparencia">
            <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col gap-6">
              <div>
                <h2 className="text-base font-black text-gray-900 mb-1">Cores da Plataforma</h2>
                <p className="text-xs text-gray-500 mb-4">Essas cores são aplicadas em todo o sistema.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ColorField
                    label="Cor primária (fundo escuro)"
                    value={config.primaryColor}
                    onChange={(v) => updateConfig({ primaryColor: v })}
                  />
                  <ColorField
                    label="Cor de destaque (vermelho)"
                    value={config.accentColor}
                    onChange={(v) => updateConfig({ accentColor: v })}
                  />
                  <ColorField
                    label="Cor ativa (verde)"
                    value={config.greenColor}
                    onChange={(v) => updateConfig({ greenColor: v })}
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-base font-black text-gray-900 mb-1">Identidade da Marca</h2>
                <p className="text-xs text-gray-500 mb-4">Textos exibidos no cabeçalho da plataforma.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Prefixo (ex: GRUPO)">
                    <Input
                      value={config.companyPrefix}
                      onChange={(e) => updateConfig({ companyPrefix: e.target.value })}
                      data-testid="input-company-prefix"
                    />
                  </Field>
                  <Field label="Destaque (ex: MULTI)">
                    <Input
                      value={config.companyHighlight}
                      onChange={(e) => updateConfig({ companyHighlight: e.target.value })}
                      data-testid="input-company-highlight"
                    />
                  </Field>
                  <Field label="Nome (ex: NACIONAL)">
                    <Input
                      value={config.companyName}
                      onChange={(e) => updateConfig({ companyName: e.target.value })}
                      data-testid="input-company-name"
                    />
                  </Field>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-base font-black text-gray-900 mb-1">Título da Página</h2>
                <Field label="Título principal">
                  <Input
                    value={config.pageTitle}
                    onChange={(e) => updateConfig({ pageTitle: e.target.value })}
                    data-testid="input-page-title"
                  />
                </Field>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pré-visualização do cabeçalho</p>
                  <div
                    className="rounded flex items-center justify-center py-3 px-8 relative overflow-hidden"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, borderTop: `40px solid ${config.accentColor}`, borderRight: "40px solid transparent" }} />
                    <div className="flex flex-col items-center leading-none gap-0">
                      <span className="font-bold tracking-[0.25em] uppercase" style={{ color: config.accentColor, fontSize: "8px" }}>{config.companyPrefix}</span>
                      <span className="font-black tracking-tight text-xl">
                        <span style={{ color: config.accentColor }}>{config.companyHighlight}</span>
                        <span className="text-white">{config.companyName}</span>
                      </span>
                    </div>
                    <div style={{ position: "absolute", bottom: 0, right: 0, width: 0, height: 0, borderBottom: `40px solid ${config.accentColor}`, borderLeft: "40px solid transparent" }} />
                  </div>
                </div>
                <Button
                  className="mt-3 text-white font-semibold"
                  style={{ backgroundColor: "#0D1B35" }}
                  onClick={handleSaveAppearance}
                  data-testid="btn-save-appearance"
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  Salvar aparência
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conteudo">
            <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col gap-6">
              <div>
                <h2 className="text-base font-black text-gray-900 mb-1">Rodapé</h2>
                <p className="text-xs text-gray-500 mb-4">Textos e links exibidos no rodapé da plataforma.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Texto do hub">
                    <Input
                      value={config.footerHub}
                      onChange={(e) => updateConfig({ footerHub: e.target.value })}
                      data-testid="input-footer-hub"
                    />
                  </Field>
                  <Field label="Texto do link">
                    <Input
                      value={config.footerLinkText}
                      onChange={(e) => updateConfig({ footerLinkText: e.target.value })}
                      data-testid="input-footer-link-text"
                    />
                  </Field>
                  <Field label="URL do link">
                    <Input
                      value={config.footerLinkUrl}
                      onChange={(e) => updateConfig({ footerLinkUrl: e.target.value })}
                      placeholder="https://..."
                      data-testid="input-footer-link-url"
                    />
                  </Field>
                  <Field label="Tagline">
                    <Input
                      value={config.footerTagline}
                      onChange={(e) => updateConfig({ footerTagline: e.target.value })}
                      data-testid="input-footer-tagline"
                    />
                  </Field>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pré-visualização do rodapé</p>
                  <div
                    className="rounded flex flex-col items-center justify-center py-3 px-8 relative overflow-hidden gap-0.5"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, borderTop: `36px solid ${config.accentColor}`, borderRight: "36px solid transparent" }} />
                    <p className="text-white/70 text-xs font-semibold">{config.footerHub}</p>
                    <p className="text-white text-sm font-extrabold">
                      Acesse pelo{" "}
                      <span style={{ color: config.accentColor }} className="underline">{config.footerLinkText}</span>
                    </p>
                    <p className="text-white/70 text-xs font-bold">{config.footerTagline}</p>
                    <div style={{ position: "absolute", bottom: 0, right: 0, width: 0, height: 0, borderBottom: `36px solid ${config.accentColor}`, borderLeft: "36px solid transparent" }} />
                  </div>
                </div>
                <Button
                  className="text-white font-semibold"
                  style={{ backgroundColor: "#0D1B35" }}
                  onClick={handleSaveAppearance}
                  data-testid="btn-save-content"
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  Salvar conteúdo
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
