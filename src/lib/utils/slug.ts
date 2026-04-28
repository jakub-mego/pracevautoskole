export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function uniqueSlug(input: string): string {
  const base = slugify(input) || "profil";
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}
