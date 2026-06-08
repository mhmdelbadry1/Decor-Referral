import { describe, it, expect } from 'vitest'
import {
  normalizeKSAPhone,
  normalizePhone,
  isValidPhone,
  isValidKSAPhone,
  formatKSAPhoneDisplay,
  formatPhoneDisplay,
  TESTING_EXTRA_COUNTRIES,
} from '@/lib/phone'

describe('normalizeKSAPhone', () => {
  const valid = '+966512345678'

  it('accepts 05XXXXXXXX format', () => expect(normalizeKSAPhone('0512345678')).toBe(valid))
  it('accepts 5XXXXXXXX format',  () => expect(normalizeKSAPhone('512345678')).toBe(valid))
  it('accepts 966XXXXXXXXX format', () => expect(normalizeKSAPhone('966512345678')).toBe(valid))
  it('accepts 00966XXXXXXXXX format', () => expect(normalizeKSAPhone('00966512345678')).toBe(valid))
  it('accepts E.164 with spaces', () => expect(normalizeKSAPhone('+966 51 234 5678')).toBe(valid))
  it('accepts E.164 with dashes', () => expect(normalizeKSAPhone('+966-51-234-5678')).toBe(valid))

  it('rejects non-mobile prefix (landline 011)', () => expect(normalizeKSAPhone('0111234567')).toBeNull())
  it('rejects too-short number',  () => expect(normalizeKSAPhone('051234')).toBeNull())
  it('rejects too-long number',   () => expect(normalizeKSAPhone('051234567890')).toBeNull())
  it('rejects empty string',      () => expect(normalizeKSAPhone('')).toBeNull())
  it('rejects letters',           () => expect(normalizeKSAPhone('abcdefgh')).toBeNull())

  it.each(['50', '51', '52', '53', '54', '55', '56', '57', '58', '59'])(
    'accepts mobile prefix %s',
    (prefix) => expect(normalizeKSAPhone(`0${prefix}1234567`)).not.toBeNull()
  )
})

describe('normalizePhone — Egypt (+20)', () => {
  const egypt = (local: string) => `+20${local}`

  it('accepts 010XXXXXXXX (Vodafone)', () => expect(normalizePhone('01012345678')).toBe(egypt('1012345678')))
  it('accepts 011XXXXXXXX (Etisalat)', () => expect(normalizePhone('01112345678')).toBe(egypt('1112345678')))
  it('accepts 012XXXXXXXX (Orange)',   () => expect(normalizePhone('01212345678')).toBe(egypt('1212345678')))
  it('accepts 015XXXXXXXX (WE)',       () => expect(normalizePhone('01512345678')).toBe(egypt('1512345678')))
  it('accepts +20 prefix',            () => expect(normalizePhone('+201012345678')).toBe(egypt('1012345678')))
  it('accepts 00201 prefix',          () => expect(normalizePhone('00201012345678')).toBe(egypt('1012345678')))
  it('accepts 201 prefix',            () => expect(normalizePhone('201012345678')).toBe(egypt('1012345678')))

  it('rejects 013 Egyptian prefix (not mobile)', () => {
    const result = normalizePhone('01312345678')
    expect(result).toBeNull()
  })
})

describe('normalizePhone — KSA takes priority', () => {
  it('returns KSA result when KSA matches', () => {
    expect(normalizePhone('0512345678')).toBe('+966512345678')
  })
})

describe('isValidPhone', () => {
  it('returns true for valid KSA',  () => expect(isValidPhone('0512345678')).toBe(true))
  it('returns true for valid Egypt', () => expect(isValidPhone('01012345678')).toBe(true))
  it('returns false for invalid',   () => expect(isValidPhone('12345')).toBe(false))
  it('returns false for empty',     () => expect(isValidPhone('')).toBe(false))
})

describe('isValidKSAPhone', () => {
  it('returns true for KSA',  () => expect(isValidKSAPhone('0512345678')).toBe(true))
  it('returns false for Egypt', () => expect(isValidKSAPhone('01012345678')).toBe(false))
})

describe('formatKSAPhoneDisplay', () => {
  it('formats E.164 to readable', () => {
    expect(formatKSAPhoneDisplay('+966512345678')).toBe('+966 51 234 5678')
  })
  it('returns original if not valid E.164', () => {
    expect(formatKSAPhoneDisplay('badvalue')).toBe('badvalue')
  })
})

describe('formatPhoneDisplay', () => {
  it('formats KSA number', () => {
    expect(formatPhoneDisplay('+966512345678')).toBe('+966 51 234 5678')
  })
  it('formats Egyptian number', () => {
    const result = formatPhoneDisplay('+201012345678')
    expect(result).toContain('+20')
    expect(result).toContain('10')
  })
  it('returns as-is for unknown prefix', () => {
    expect(formatPhoneDisplay('+441234567890')).toBe('+441234567890')
  })
})

describe('TESTING_EXTRA_COUNTRIES', () => {
  it('contains Egypt config', () => {
    const egypt = TESTING_EXTRA_COUNTRIES.find(c => c.countryCode === '20')
    expect(egypt).toBeDefined()
    expect(egypt?.e164Prefix).toBe('+20')
    expect(egypt?.localLength).toBe(10)
  })
})
