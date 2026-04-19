import type { MetadataRoute } from "next";
import { content } from "./content";

export default function robots(): MetadataRoute.Robots {
  const site = content.seo.url;
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dashboard", "/dashboard/*", "/api/*"] },
      { userAgent: "GPTBot",       allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User",  allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot",     allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot",      allow: "/" },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
