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
  };
}
