const base64UrlDecode = (segment) => {
  if (typeof segment !== 'string' || segment.length === 0) {
    throw new Error('Invalid token segment');
  }

  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const base64 = normalized + padding;

  const base64Decoder =
    typeof atob === 'function'
      ? (value) => atob(value)
      : typeof window !== 'undefined' && typeof window.atob === 'function'
        ? (value) => window.atob(value)
        : null;

  if (!base64Decoder) {
    throw new Error('Base64 decoder is not available in this environment');
  }

  const binary = base64Decoder(base64);
  const percentEncoded = Array.from(binary)
    .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
    .join('');

  return decodeURIComponent(percentEncoded);
};

export const decodeJwt = (token) => {
  if (typeof token !== 'string') {
    throw new Error('Token must be a string');
  }

  const parts = token.split('.');

  if (parts.length < 2) {
    throw new Error('Token does not have the expected format');
  }

  const payload = base64UrlDecode(parts[1]);

  return JSON.parse(payload);
};
