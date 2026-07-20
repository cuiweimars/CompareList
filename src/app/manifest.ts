import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CompareList",
    short_name: "CompareList",
    description: "Private, local-first list and spreadsheet comparison workspace",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#818cf8",
    categories: ["productivity", "utilities"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Compare lists", short_name: "Compare", url: "/#tool" },
      { name: "Compare CSV files", short_name: "CSV", url: "/compare-csv-files" },
      { name: "Compare Excel columns", short_name: "Excel", url: "/compare-excel-columns" },
    ],
  };
}
