import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CompareList",
    short_name: "CompareList",
    description: "Free online tool to compare two lists instantly",
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#818cf8",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
