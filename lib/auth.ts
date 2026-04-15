export const ADMIN_COOKIE = 'admin_session'

/**
 * SHA-256 hash of the given string.
 * Uses the Web Crypto API — available natively in Node.js 18+ and the Edge runtime.
 * No external dependencies required.
 */
export async function hashSecret(secret: string): Promise<string> {
  const data      = new TextEncoder().encode(secret)
  const hashBuf   = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuf))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
