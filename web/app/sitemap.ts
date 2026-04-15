import type { MetadataRoute } from "next";
import { cancerTypes } from "@/lib/cancer-types";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticPaths = [
    "/",
    "/learn",
    "/learn/burden",
    "/learn/age",
    "/learn/types",
    "/learn/myths",
    "/learn/treatments",
    "/learn/medicines",
    "/learn/nutrition",
    "/learn/science",
    "/community",
    "/community/new",
  ];
  const typePaths = cancerTypes.map((c) => `/learn/types/${c.slug}`);
  const last = new Date();
  return [...staticPaths, ...typePaths].map((path) => ({
    url: `${base}${path}`,
    lastModified: last,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
