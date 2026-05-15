export interface VideoInfo {
  type: "youtube" | "vimeo" | "mp4" | null;
  embedUrl: string;
  thumbUrl: string;
}

export function parseVideoUrl(url: string): VideoInfo {
  const s = url?.trim() ?? "";
  if (!s) return { type: null, embedUrl: "", thumbUrl: "" };

  const yt = s.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) {
    const id = yt[1];
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`,
      thumbUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  const vimeo = s.match(/vimeo\.com\/(\d+)/);
  if (vimeo) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}`,
      thumbUrl: "",
    };
  }

  if (s.endsWith(".mp4") || s.startsWith("blob:") || s.includes(".mp4?")) {
    return { type: "mp4", embedUrl: s, thumbUrl: "" };
  }

  return { type: null, embedUrl: "", thumbUrl: "" };
}
