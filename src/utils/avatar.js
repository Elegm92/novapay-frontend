const DICEBEAR_STYLES = [
  "bottts",
  "adventurer",
  "avataaars",
  "personas",
  "notionists",
  "open-peeps",
  "pixel-art",
  "shapes",
  "lorelei",
  "micah",
];
export const getAvatarUrl = (style, seed, size = 36) => {
  const s = style || "bottts";
  if (DICEBEAR_STYLES.includes(s)) {
    return `https://api.dicebear.com/7.x/${s}/svg?seed=${seed}&size=${size}`;
  }
  return `https://www.gravatar.com/avatar/${seed}?d=${s}&s=${size}&f=y`;
};
