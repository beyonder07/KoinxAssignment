// ── Currency formatter (INR) ──────────────────────────────────────────

/** Format as ₹1,23,456.78 */
export const formatCurrency = (value: number): string => {
  if (!isFinite(value)) return '--'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Smart abbreviation for large INR values:
 *   10_000_000 → ₹1.00Cr
 *   100_000    → ₹1.00L
 *   1_000      → ₹1.00K
 */
export const abbreviateCurrency = (value: number): string => {
  if (!isFinite(value)) return '--'
  const abs  = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 10_000_000) return `${sign}₹${(abs / 10_000_000).toFixed(2)}Cr`
  if (abs >= 100_000)    return `${sign}₹${(abs / 100_000).toFixed(2)}L`
  if (abs >= 1_000)      return `${sign}₹${(abs / 1_000).toFixed(2)}K`
  return `${sign}₹${abs.toFixed(2)}`
}

/** Gain/loss with +/- prefix: +₹1,245.00 or -₹842.00. Zero → '--' */
export const formatGain = (value: number): string => {
  if (value === 0 || !isFinite(value)) return '--'
  const abs = formatCurrency(Math.abs(value))
  return value > 0 ? `+${abs}` : `-${abs}`
}

/** Abbreviated gain: +₹1.24K or -₹842.00. Zero → '--' */
export const abbreviateGain = (value: number): string => {
  if (value === 0 || !isFinite(value)) return '--'
  const prefix = value > 0 ? '+' : '-'
  return `${prefix}${abbreviateCurrency(Math.abs(value))}`
}

/** True when a value is large enough to benefit from abbreviation tooltip */
export const needsAbbreviation = (value: number): boolean =>
  Math.abs(value) >= 1_000

/**
 * Format a holding quantity with smart precision:
 * - Very small numbers use scientific-like display
 * - Normal numbers use up to 8 decimals, trailing zeros stripped
 */
export const formatNumber = (value: number): string => {
  if (value === 0) return '0'
  if (!isFinite(value)) return '--'
  const abs = Math.abs(value)
  if (abs > 0 && abs < 0.000001) {
    return value.toExponential(4)
  }
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(value)
}

export const classNames = (...classes: (string | undefined | boolean | null)[]): string =>
  classes.filter(Boolean).join(' ')
