import { useAdmin } from "@/lib/admin-store";

export function SiteHeader() {
  const { config } = useAdmin();
  const { primaryColor, accentColor, companyPrefix, companyHighlight, companyName } = config;

  return (
    <header
      style={{ backgroundColor: primaryColor, position: "relative", overflow: "hidden" }}
      data-testid="site-header"
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, borderTop: `72px solid ${accentColor}`, borderRight: "72px solid transparent" }} />
      <div className="flex items-center justify-center py-3 px-8">
        <div className="flex flex-col items-center leading-none gap-0">
          <span className="font-bold tracking-[0.25em] uppercase" style={{ color: accentColor, fontSize: "9px" }}>
            {companyPrefix}
          </span>
          <span className="font-black tracking-tight" style={{ fontSize: "1.6rem", lineHeight: 1 }}>
            <span style={{ color: accentColor }}>{companyHighlight}</span>
            <span className="text-white">{companyName}</span>
          </span>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 0, height: 0, borderBottom: `72px solid ${accentColor}`, borderLeft: "72px solid transparent" }} />
    </header>
  );
}

export function SiteFooter() {
  const { config } = useAdmin();
  const { primaryColor, accentColor, footerHub, footerLinkText, footerLinkUrl, footerTagline } = config;

  return (
    <footer
      style={{ backgroundColor: primaryColor, position: "relative", overflow: "hidden" }}
      data-testid="site-footer"
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, borderTop: `56px solid ${accentColor}`, borderRight: "56px solid transparent" }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 0, height: 0, borderBottom: `56px solid ${accentColor}`, borderLeft: "56px solid transparent" }} />
      <div className="flex flex-col items-center justify-center gap-0.5 py-4 px-8 text-center">
        <p className="text-white/80 text-xs font-semibold" data-testid="text-footer-hub">{footerHub}</p>
        <p className="text-white text-base font-extrabold" data-testid="text-footer-linkme">
          Acesse pelo{" "}
          <a
            href={footerLinkUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 underline-offset-2 hover:opacity-80 transition-opacity"
            style={{ color: accentColor }}
          >
            {footerLinkText}
          </a>
        </p>
        <p className="text-white/80 text-sm font-bold mt-1" data-testid="text-footer-tagline">{footerTagline}</p>
      </div>
    </footer>
  );
}
