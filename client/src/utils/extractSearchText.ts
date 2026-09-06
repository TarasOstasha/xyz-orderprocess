/** Strip HTML to plain searchable text. */
export function htmlToPlainText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body?.textContent || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** OCR a screenshot / pasted image (data URL or blob URL) for search indexing. */
export async function ocrImage(imageSrc: string): Promise<string> {
  const Tesseract = (await import('tesseract.js')).default;
  const { data } = await Tesseract.recognize(imageSrc, 'eng', {
    logger: () => undefined,
  });
  return (data.text || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
