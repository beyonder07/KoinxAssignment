import React from 'react'
import { useHarvesting } from '../context/HarvestingContext'
import { formatCurrency, abbreviateCurrency, needsAbbreviation } from '../utils/index'
import { Tooltip } from './Tooltip'
import { CapitalGainsCardSkeleton } from './SkeletonLoader'

interface Props {
  variant: 'before' | 'after'
  title: string
}

// ── Shared value cell ─────────────────────────────────────────────────
interface ValueCellProps {
  value: number
  /** always render green */
  forceGreen?: boolean
  /** always render red */
  forceRed?: boolean
}

const ValueCell: React.FC<ValueCellProps> = ({ value, forceGreen, forceRed }) => {
  const color = forceRed
    ? 'var(--color-loss)'
    : forceGreen
    ? 'var(--color-gain)'
    : value > 0
    ? 'var(--color-gain)'
    : value < 0
    ? 'var(--color-loss)'
    : 'var(--text-muted)'

  const display = value === 0 ? '--' : abbreviateCurrency(value)
  const full = formatCurrency(value)

  const inner = (
    <span
      className="font-semibold tabular-nums"
      style={{ color, fontSize: '14px', cursor: needsAbbreviation(value) ? 'default' : 'auto' }}
    >
      {display}
    </span>
  )

  return needsAbbreviation(value)
    ? <Tooltip content={full}>{inner}</Tooltip>
    : inner
}

// ── Card divider ─────────────────────────────────────────────────────
const Divider: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ height: '1px', background: color, margin: '0 0' }} />
)

// ── Data row ─────────────────────────────────────────────────────────
interface DataRowProps {
  label: string
  stcg: number
  ltcg: number
  dividerColor: string
  forceGreen?: boolean
  forceRed?: boolean
  highlight?: boolean
  highlightBg?: string
}

const DataRow: React.FC<DataRowProps> = ({
  label, stcg, ltcg, dividerColor, forceGreen, forceRed, highlight, highlightBg,
}) => (
  <>
    <Divider color={dividerColor} />
    <div
      className="grid items-center"
      style={{
        gridTemplateColumns: '1fr 1fr 1fr',
        padding: highlight ? '12px 0' : '10px 0',
        background: highlight ? highlightBg : 'transparent',
        borderRadius: highlight ? '8px' : 0,
      }}
    >
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
        {label}
      </span>
      <div className="text-center">
        <ValueCell value={stcg} forceGreen={forceGreen} forceRed={forceRed} />
      </div>
      <div className="text-center">
        <ValueCell value={ltcg} forceGreen={forceGreen} forceRed={forceRed} />
      </div>
    </div>
  </>
)

// ── Main card ─────────────────────────────────────────────────────────
export const CapitalGainsCard: React.FC<Props> = ({ variant, title }) => {
  const { capitalGains, afterHarvestingGains, loading, selectedCoins } = useHarvesting()

  if (loading) return <CapitalGainsCardSkeleton isAfter={variant === 'after'} />
  if (!capitalGains) return null

  const isAfter = variant === 'after'

  const stcgProfits = isAfter && afterHarvestingGains ? afterHarvestingGains.stcg.profits : capitalGains.capitalGains.stcg.profits
  const stcgLosses  = isAfter && afterHarvestingGains ? afterHarvestingGains.stcg.losses  : capitalGains.capitalGains.stcg.losses
  const ltcgProfits = isAfter && afterHarvestingGains ? afterHarvestingGains.ltcg.profits : capitalGains.capitalGains.ltcg.profits
  const ltcgLosses  = isAfter && afterHarvestingGains ? afterHarvestingGains.ltcg.losses  : capitalGains.capitalGains.ltcg.losses

  const stcgNet  = stcgProfits - stcgLosses
  const ltcgNet  = ltcgProfits - ltcgLosses
  const totalNet = stcgNet + ltcgNet

  const preTotal =
    capitalGains.capitalGains.stcg.profits - capitalGains.capitalGains.stcg.losses +
    capitalGains.capitalGains.ltcg.profits - capitalGains.capitalGains.ltcg.losses

  const savings    = preTotal - totalNet
  const hasSavings = isAfter && selectedCoins.size > 0 && savings > 0

  const dividerColor = isAfter ? 'rgba(30,58,138,0.6)' : 'var(--border-divider)'
  const totalNetColor = totalNet >= 0 ? 'var(--color-gain)' : 'var(--color-loss)'

  return (
    <div
      className={isAfter ? 'card-after-glow' : 'card-pre-shadow'}
      style={{
        background: isAfter ? 'var(--bg-card-after)' : 'var(--bg-card-pre)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--card-padding)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {/* ── Card Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2
            className="font-semibold text-white"
            style={{ fontSize: '15px', letterSpacing: '-0.01em' }}
          >
            {title}
          </h2>
          {isAfter && (
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Updates as you select holdings below
            </p>
          )}
        </div>

        {hasSavings && (
          <div
            className="savings-badge flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.25)',
              color: 'var(--color-gain)',
              fontSize: '12px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            <span>🎉</span>
            <span>Save ~{abbreviateCurrency(savings)}</span>
          </div>
        )}
      </div>

      {/* ── Column Headers ── */}
      <div
        className="grid pb-2"
        style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
      >
        <div />
        {['Short-term', 'Long-term'].map(col => (
          <div
            key={col}
            className="text-center font-semibold uppercase"
            style={{
              fontSize: '10.5px',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
            }}
          >
            {col}
          </div>
        ))}
      </div>

      {/* ── Data Rows ── */}
      <DataRow label="Profits"           stcg={stcgProfits} ltcg={ltcgProfits} dividerColor={dividerColor} forceGreen />
      <DataRow label="Losses"            stcg={stcgLosses}  ltcg={ltcgLosses}  dividerColor={dividerColor} forceRed />
      <DataRow label="Net Capital Gains" stcg={stcgNet}     ltcg={ltcgNet}     dividerColor={dividerColor} />

      {/* ── Realised Capital Gains ── */}
      <div className="mt-4">
        <div
          className="flex items-center justify-between rounded-lg px-4 py-3.5"
          style={{
            background: isAfter
              ? 'rgba(37,99,235,0.14)'
              : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isAfter ? 'rgba(37,99,235,0.28)' : 'rgba(255,255,255,0.06)'}`,
          }}
        >
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>
              Realised Capital Gains
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              STCG + LTCG
            </p>
          </div>
          {needsAbbreviation(totalNet) ? (
            <Tooltip content={formatCurrency(totalNet)}>
              <span
                className="font-bold tabular-nums cursor-default"
                style={{ fontSize: '22px', color: totalNetColor, letterSpacing: '-0.02em' }}
              >
                {abbreviateCurrency(totalNet)}
              </span>
            </Tooltip>
          ) : (
            <span
              className="font-bold tabular-nums"
              style={{ fontSize: '22px', color: totalNetColor, letterSpacing: '-0.02em' }}
            >
              {formatCurrency(totalNet)}
            </span>
          )}
        </div>
      </div>

      {/* ── Savings Banner ── */}
      {hasSavings && (
        <div
          className="savings-badge mt-3 rounded-lg px-4 py-2.5 flex items-center gap-2"
          style={{
            background: 'var(--color-gain-bg)',
            border: '1px solid var(--color-gain-border)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-gain)', flexShrink: 0 }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <p style={{ fontSize: '13px', color: 'var(--color-gain)', fontWeight: 500 }}>
            Your taxable gains reduced by{' '}
            <strong className="font-semibold">~{abbreviateCurrency(savings)}</strong>
          </p>
        </div>
      )}
    </div>
  )
}
