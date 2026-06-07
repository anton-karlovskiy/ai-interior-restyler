export type StylePreset = {
  id: string;
  name: string;
  prompt: string;
  gradient: string;
};

export const STYLES: StylePreset[] = [
  {
    id: "scandinavian",
    name: "Scandinavian",
    prompt:
      "light natural wood tones, white and soft-grey palette, clean simple forms, hygge textiles, linen and wool textures, uncluttered surfaces, plenty of natural light diffused through sheer curtains",
    gradient: "linear-gradient(135deg, #EDE8E0 0%, #C8BAA8 100%)",
  },
  {
    id: "japandi",
    name: "Japandi",
    prompt:
      "Japanese-Scandinavian blend, warm neutral tones, low-profile natural-wood furniture, handmade ceramics with wabi-sabi textures, calm and uncluttered space, soft diffused indirect light, muted earthy palette with deep forest green accents",
    gradient: "linear-gradient(135deg, #D8CFC4 0%, #8C7E6E 100%)",
  },
  {
    id: "modern-minimalist",
    name: "Minimalist",
    prompt:
      "monochrome neutral palette with white and warm grey, sleek low-profile furniture with clean architectural lines, hidden storage solutions, sculptural statement lighting, generous negative space, refined and airy atmosphere, polished matte surfaces",
    gradient: "linear-gradient(135deg, #EBEBEB 0%, #ADADAD 100%)",
  },
  {
    id: "mid-century",
    name: "Mid-Century",
    prompt:
      "rich walnut and teak wood tones, tapered slender furniture legs, warm mustard yellow and teal and burnt orange accents, iconic 1950s-60s furniture silhouettes, statement arc floor lamp or globe pendant, organic curved shapes, retro-modern warmth",
    gradient: "linear-gradient(135deg, #C8923C 0%, #6B5230 100%)",
  },
  {
    id: "industrial",
    name: "Industrial",
    prompt:
      "exposed concrete and brick wall tones, blackened steel frames and shelving, aged leather seating, reclaimed wood surfaces with natural grain, Edison-style filament pendant lighting, raw urban loft aesthetic with warmth",
    gradient: "linear-gradient(135deg, #7A6E65 0%, #2E2825 100%)",
  },
  {
    id: "warm-bohemian",
    name: "Bohemian",
    prompt:
      "layered textiles with global patterns and rich textures, rattan and natural woven fiber furniture, terracotta and earthy ochre and rust tones, abundant indoor plants, macramé wall hangings and woven baskets, eclectic warm and inviting atmosphere",
    gradient: "linear-gradient(135deg, #B87048 0%, #7A3E22 100%)",
  },
];
