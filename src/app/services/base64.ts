export function base64DecodeUtf8(b64: string): string {
  // fix URL-safe base64 variants
  b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
  // add padding if missing
  while (b64.length % 4 !== 0) b64 += '=';

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}
