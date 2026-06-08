export function buildPrompt(styleFragment: string, roomType: string, details?: string) {
  return [
    `Restyle this ${roomType} in the following interior design style: ${styleFragment}.`,
    `Keep the room's architecture EXACTLY the same - do not move or alter the walls,`,
    `windows, doors, ceiling, floor layout, room dimensions, or the camera angle and`,
    `perspective. Only change furniture, decor, materials, textures, colors, rugs,`,
    `lighting fixtures, and styling to match the chosen aesthetic.`,
    `Preserve the natural light direction coming from the existing windows.`,
    `Output a single photorealistic, professionally photographed interior image with`,
    `realistic proportions, accurate shadows, and magazine-quality composition.`,
    ...(details?.trim() ? [`Additional instructions from the user: ${details.trim()}`] : []),
  ].join(" ");
}
