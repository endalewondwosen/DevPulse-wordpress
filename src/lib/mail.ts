/** Build a mailto URL. Keep bodies short — long ones fail silently in some browsers. */
export function buildMailto(
  email: string,
  options?: { subject?: string; body?: string }
): string {
  const address = (email || '').trim();
  const parts: string[] = [];
  if (options?.subject) parts.push(`subject=${encodeURIComponent(options.subject)}`);
  if (options?.body) parts.push(`body=${encodeURIComponent(options.body)}`);
  return parts.length ? `mailto:${address}?${parts.join('&')}` : `mailto:${address}`;
}

/**
 * Open the system mail client and copy the address as a reliable fallback
 * (many browsers do nothing if no default mail app is configured).
 */
export async function openMailto(
  email: string,
  options?: { subject?: string; body?: string }
): Promise<{ copied: boolean }> {
  const address = (email || '').trim();
  if (!address) throw new Error('No contact email configured');

  const href = buildMailto(address, options);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  try {
    await navigator.clipboard.writeText(address);
    return { copied: true };
  } catch {
    return { copied: false };
  }
}
