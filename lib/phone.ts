/**
 * Phone number utilities — primary target: Saudi KSA (+966)
 *
 * KSA accepted input formats:
 *   05XXXXXXXX         (local 10-digit)
 *   5XXXXXXXX          (local without leading 0)
 *   9665XXXXXXXX       (without +)
 *   00 9665XXXXXXXX    (with 00 prefix)
 *   +966 5X XXX XXXX   (E.164 with spaces/dashes)
 *
 * Normalized output: E.164 e.g. +9665XXXXXXXX
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
    local = digits.slice(5)
  } else if (digits.startsWith('966')) {
    local = digits.slice(3)
  } else if (digits.startsWith('05')) {
    local = digits.slice(1)
  } else if (digits.startsWith('5')) {
    local = digits
  }

  if (!local) return null
  if (local.length !== 9) return null
  if (!MOBILE_PREFIX_RE.test(local)) return null

  return `+966${local}`
}

/** Returns true if the raw input is a valid KSA mobile number. */
export function isValidKSAPhone(raw: string): boolean {
  return normalizeKSAPhone(raw) !== null
}

/** Format a normalized KSA E.164 for display: +966 5X XXX XXXX */
export function formatKSAPhoneDisplay(e164: string): string {
  if (!e164.startsWith('+966') || e164.length !== 13) return e164
  const local = e164.slice(4)
  return `+966 ${local[0]}${local[1]} ${local.slice(2, 5)} ${local.slice(5)}`
}

// ── TESTING: extra country configs ────────────────────────────────────────
// To revert to KSA-only: set TESTING_EXTRA_COUNTRIES to []
interface ExtraCountryConfig {
  countryCode  : string    // numeric country code, e.g. '20'
  e164Prefix   : string    // e.g. '+20'
  mobileRegex  : RegExp    // matches the local part (after country code stripped)
  localLength  : number    // expected digit count in local part
  localPrefixes: string[]  // how locals look with/without leading zero
  e164Regex    : string    // regex string fragment for E.164 validation
  displayFormat: (local: string) => string
}

export const TESTING_EXTRA_COUNTRIES: ExtraCountryConfig[] = []
// ─────────────────────────────────────────────────────────────────────────

function normalizeExtraCountry(raw: string, cfg: ExtraCountryConfig): string | null {
  const digits = digitsOnly(raw)
  const cc = cfg.countryCode
  let local: string | null = null

  if (digits.startsWith(`00${cc}`)) {
    local = digits.slice(2 + cc.length)
  } else if (digits.startsWith(cc) && !digits.startsWith('0')) {
    local = digits.slice(cc.length)
  } else {
    for (const prefix of cfg.localPrefixes) {
      if (digits.startsWith(prefix)) {
        local = prefix.startsWith('0') ? digits.slice(1) : digits
        break
      }
    }
  }

  if (!local || local.length !== cfg.localLength) return null
  if (!cfg.mobileRegex.test(local)) return null
  return `${cfg.e164Prefix}${local}`
}

/**
 * Normalize any supported phone number to E.164.
 * Tries KSA first, then any entry in TESTING_EXTRA_COUNTRIES.
 * Returns null if no country matches.
 */
export function normalizePhone(raw: string): string | null {
  const ksa = normalizeKSAPhone(raw)
  if (ksa) return ksa
  for (const cfg of TESTING_EXTRA_COUNTRIES) {
    const result = normalizeExtraCountry(raw, cfg)
    if (result) return result
  }
  return null
}

/** Returns true if the raw input is a valid phone for any supported country. */
export function isValidPhone(raw: string): boolean {
  return normalizePhone(raw) !== null
}

/** Format a normalized E.164 number for display, for any supported country. */
export function formatPhoneDisplay(e164: string): string {
  if (e164.startsWith('+966')) return formatKSAPhoneDisplay(e164)
  for (const cfg of TESTING_EXTRA_COUNTRIES) {
    if (e164.startsWith(cfg.e164Prefix)) {
      return cfg.displayFormat(e164.slice(cfg.e164Prefix.length))
    }
  }
  return e164
}
