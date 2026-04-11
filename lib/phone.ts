/**
 * Saudi KSA phone number utilities
 *
 * Accepted input formats:
 *   05XXXXXXXX         (local 10-digit)
 *   5XXXXXXXX          (local without leading 0)
 *   9665XXXXXXXX       (without +)
 *   00 9665XXXXXXXX    (with 00 prefix)
 *   +966 5X XXX XXXX   (E.164 with spaces/dashes)
 *
 * Normalized output: +9665XXXXXXXX (E.164, 13 chars)
 *
 * Valid mobile prefixes (after 966): 50–59
 */

const MOBILE_PREFIX_RE = /^5[0-9]/

/** Strip all non-digit characters */
function digitsOnly(s: string): string {
  return s.replace(/\D/g, '')
}

/**
 * Normalize a KSA phone number to E.164 (+9665XXXXXXXX).
 * Returns null if the input cannot be recognized as a KSA mobile number.
 */
export function normalizeKSAPhone(raw: string): string | null {
  const digits = digitsOnly(raw)

  let local: string | null = null

  if (digits.startsWith('00966')) {
    // 009665XXXXXXXX
    local = digits.slice(5)
  } else if (digits.startsWith('966')) {
    // 9665XXXXXXXX
    local = digits.slice(3)
  } else if (digits.startsWith('05')) {
    // 05XXXXXXXX
    local = digits.slice(1)
  } else if (digits.startsWith('5')) {
    // 5XXXXXXXX
    local = digits
  }

  if (!local) return null
  // Must be exactly 9 digits and start with 5X (mobile prefix)
  if (local.length !== 9) return null
  if (!MOBILE_PREFIX_RE.test(local)) return null

  return `+966${local}`
}

/**
 * Returns true if the raw input is a valid KSA mobile number.
 */
export function isValidKSAPhone(raw: string): boolean {
  return normalizeKSAPhone(raw) !== null
}

/**
 * Format a normalized E.164 number for display: +966 5X XXX XXXX
 */
export function formatKSAPhoneDisplay(e164: string): string {
  // e164 = +9665XXXXXXXX (13 chars)
  if (!e164.startsWith('+966') || e164.length !== 13) return e164
  const local = e164.slice(4) // 9 digits: 5XXXXXXXX
  return `+966 ${local[0]}${local[1]} ${local.slice(2, 5)} ${local.slice(5)}`
}
