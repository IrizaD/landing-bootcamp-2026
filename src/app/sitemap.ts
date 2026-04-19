import type { MetadataRoute } from "next";
import { content } from "./content";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = content.seo.url;
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${site}/`,                 lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${site}/privacidad`,       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${site}/terminos`,         lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${site}/cookies`,          lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${site}/eliminar-datos`,   lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];
  return pages;
}
