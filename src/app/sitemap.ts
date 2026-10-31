import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: brand.domain,
      lastModified: now,
      priority: 1,
    },
    {
      url: `${brand.domain}/privacy`,
      lastModified: now,
      priority: 0.2,
    },
    {
      url: `${brand.domain}/terms`,
      lastModified: now,
      priority: 0.2,
    },
  ];
}
