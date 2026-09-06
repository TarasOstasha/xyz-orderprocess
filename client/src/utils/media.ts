/** Turn a stored image path into a browser URL. Keep data: URLs as-is. */
export function resolveMediaUrl(pathOrData: string): string {
  if (!pathOrData) return '';
  if (pathOrData.startsWith('data:') || pathOrData.startsWith('blob:') || pathOrData.startsWith('http')) {
    return pathOrData;
  }
  const api = import.meta.env.VITE_API_URL || '';
  const origin = api.replace(/\/api\/?$/, '');
  const cleaned = pathOrData.replace(/^\//, '');
  return `${origin}/${cleaned}`;
}

/** PastedHistory.images may be a single path or a JSON array string. */
export function parseStoredImages(images: unknown): string[] {
  if (!images) return [];
  if (Array.isArray(images)) {
    return images.map(String).filter(Boolean);
  }
  if (typeof images === 'string') {
    const trimmed = images.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
      } catch {
        // fall through — treat as a single path
      }
    }
    return [trimmed];
  }
  return [];
}
