import React from 'react'
import { useHarvesting } from '../context/HarvestingContext'
import { getRowKey } from '../context/HarvestingContext'
import {
  formatCurrency,
  formatGain,
  abbreviateGain,
  needsAbbreviation,
  classNames,
  formatNumber,
} from '../utils/index'
import { Tooltip } from './Tooltip'
import { HoldingsTableSkeleton } from './SkeletonLoader'
import { Holding } from '../types/index'

// Sort by absolute total gain descending
const absGain = (h: Holding) => Math.abs(h.stcg.gain + h.ltcg.gain)

// ── Sub-components ────────────────────────────────────────────────────

const TH_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-muted)',
  letterSpacing: '0.07em',
  borderBottom: '1px solid var(--border-divider)',
}

const ThCell: React.FC<{
  children: React.ReactNode
  right?: boolean
  className?: string
}> = ({ children, right, className }) => (
  <th
    className={classNames('py-3.5 font-semibold uppercase tracking-wider', right ? 'text-right pr-5' : 'text-left', className)}
    style={TH_STYLE}
  >
    {children}
  </th>
)

/** Gain cell: shows abbreviated gain + balance as sub-text */
const GainCell: React.FC<{ gain: number; balance: number }> = ({ gain, balance }) => {
  const color =
    gain > 0 ? 'var(--color-gain)' :
    gain < 0 ? 'var(--color-loss)' :
    'var(--text-muted)'

  const abbreviated = abbreviateGain(gain)
  const full        = formatGain(gain)

  const gainEl = (
    <span
      className="font-semibold tabular-nums block"
      style={{ color, fontSize: '14px', lineHeight: '1.3' }}
    >
      {abbreviated}
    </span>
  )

  return (
    <div>
      {needsAbbreviation(gain)
        ? <Tooltip content={full}>{gainEl}</Tooltip>
        : gainEl
      }
      {balance !== 0 && (
        <div className="tabular-nums" style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '1px' }}>
          {formatNumber(balance)} coins
        </div>
      )}
    </div>
  )
}

// ── Coin Logo with React-managed fallback ─────────────────────────────
const CoinLogo: React.FC<{ logo: string; name: string; symbol: string }> = ({ logo, name, symbol }) => {
  const [errored, setErrored] = React.useState(false)

  return (
    <div
      className="flex-shrink-0 flex items-center justify-center"
      style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--border-divider)', overflow: 'hidden' }}
    >
      {!errored ? (
        <img
          src={logo}
          alt={name}
          style={{ width: 34, height: 34, objectFit: 'contain' }}
          onError={() => setErrored(true)}
        />
      ) : (
        <span className="font-bold uppercase" style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
          {symbol.slice(0, 2)}
        </span>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────

export const HoldingsTable: React.FC = () => {
  const {
    holdings,
    selectedCoins,
    toggleCoin,
    toggleAll,
    showAll,
    setShowAll,
    loading,
    error,
    retry,
  } = useHarvesting()

  if (loading) return <HoldingsTableSkeleton />

  if (error) {
    return (
      <div
        className="rounded-xl p-10 flex flex-col items-center gap-4 text-center"
        style={{ background: 'var(--bg-card-pre)', border: '1px solid rgba(239,68,68,0.15)' }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.1)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-loss)' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-white text-sm mb-1">Failed to load holdings</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
        </div>
        <button
          onClick={retry}
          className="px-5 py-2 rounded-lg text-sm font-semibold"
          style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)', transition: 'background 0.15s ease' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.12)' }}
        >
          Try again
        </button>
      </div>
    )
  }

  const sorted    = [...holdings].sort((a, b) => absGain(b) - absGain(a))
  const displayed = showAll ? sorted : sorted.slice(0, 4)

  const allSelected  = selectedCoins.size === holdings.length && holdings.length > 0
  const someSelected = selectedCoins.size > 0 && !allSelected

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-white" style={{ fontSize: '17px', letterSpacing: '-0.01em' }}>
            Holdings
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Select assets to simulate tax-loss harvesting
          </p>
        </div>
        {selectedCoins.size > 0 && (
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(37,99,235,0.12)', color: '#93c5fd', border: '1px solid rgba(37,99,235,0.2)' }}
          >
            {selectedCoins.size} selected
          </span>
        )}
      </div>

      {/* ── Table ── */}
      <div
        className="overflow-x-auto"
        style={{ borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-divider)' }}
      >
        <table className="w-full min-w-[900px]" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>

          <thead>
            <tr style={{ background: '#0d1421' }}>
              <th
                className="py-3.5 pl-5 pr-3 text-left"
                style={{ width: '44px', ...TH_STYLE }}
              >
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={el => { if (el) el.indeterminate = someSelected }}
                  onChange={toggleAll}
                  className="w-4 h-4"
                  aria-label="Select all holdings"
                />
              </th>
              <ThCell className="pl-1">Asset</ThCell>
              <ThCell right>Holdings</ThCell>
              <ThCell right>Current Price</ThCell>
              <ThCell right>Short-Term Gain</ThCell>
              <ThCell right>Long-Term Gain</ThCell>
              <ThCell right className="hidden md:table-cell">Amount to Sell</ThCell>
            </tr>
          </thead>

          <tbody>
            {/* Use index as part of key since USDC appears twice in dataset */}
            {displayed.map((holding, idx) => {
              const rowKey     = getRowKey(holding, idx)
              const isSelected = selectedCoins.has(rowKey)
              const isLast     = idx === displayed.length - 1

              return (
                <tr
                  key={rowKey}
                  className="table-row-transition cursor-pointer"
                  style={{
                    height: 'var(--row-height)',
                    background: isSelected ? 'var(--selected-row)' : 'var(--bg-card-pre)',
                    borderBottom: isLast ? 'none' : '1px solid var(--border-divider)',
                    borderLeft: `3px solid ${isSelected ? 'var(--selected-border)' : 'transparent'}`,
                  }}
                  onClick={() => toggleCoin(rowKey)}
                  onMouseEnter={e => {
                    if (!isSelected)
                      (e.currentTarget as HTMLElement).style.background = 'var(--row-hover)'
                  }}
                  onMouseLeave={e => {
                    if (!isSelected)
                      (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-pre)'
                  }}
                >
                  {/* Checkbox */}
                  <td className="pl-4 pr-3" style={{ width: '44px' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCoin(rowKey)}
                      onClick={e => e.stopPropagation()}
                      className="w-4 h-4"
                      aria-label={`Select ${holding.coinName}`}
                    />
                  </td>

                  {/* Asset */}
                  <td className="pr-4 pl-1">
                    <div className="flex items-center gap-3">
                      <CoinLogo logo={holding.logo} name={holding.coinName} symbol={holding.coin} />
                      <div>
                        <div className="font-medium text-white" style={{ fontSize: '14px', lineHeight: '1.3' }}>
                          {holding.coinName}
                        </div>
                        <div className="uppercase font-semibold" style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.07em' }}>
                          {holding.coin}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Holdings & Avg Buy Price */}
                  <td className="px-4 text-right">
                    <div className="font-medium text-white tabular-nums" style={{ fontSize: '14px', lineHeight: '1.3' }}>
                      {formatNumber(holding.totalHolding)}
                    </div>
                    <div className="tabular-nums" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      avg {formatCurrency(holding.averageBuyPrice)}
                    </div>
                  </td>

                  {/* Current Price */}
                  <td className="px-4 text-right">
                    <span className="font-medium text-white tabular-nums" style={{ fontSize: '14px' }}>
                      {formatCurrency(holding.currentPrice)}
                    </span>
                  </td>

                  {/* Short-Term Gain + balance */}
                  <td className="px-4 text-right">
                    <GainCell gain={holding.stcg.gain} balance={holding.stcg.balance} />
                  </td>

                  {/* Long-Term Gain + balance */}
                  <td className="px-4 text-right">
                    <GainCell gain={holding.ltcg.gain} balance={holding.ltcg.balance} />
                  </td>

                  {/* Amount to Sell — hidden on mobile */}
                  <td className="pl-4 pr-5 text-right hidden md:table-cell">
                    {isSelected ? (
                      <div>
                        <div className="font-semibold text-white tabular-nums" style={{ fontSize: '14px', lineHeight: '1.3' }}>
                          {formatNumber(holding.totalHolding)}
                        </div>
                        <div className="uppercase font-semibold" style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.07em' }}>
                          {holding.coin}
                        </div>
                      </div>
                    ) : (
                      <span className="tabular-nums" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>--</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* View All / View Less */}
      {holdings.length > 4 && (
        <button
          className="view-all-btn w-full mt-3 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          style={{
            background: 'var(--bg-card-pre)',
            color: 'var(--text-link)',
            border: '1px solid var(--border-divider)',
          }}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
              View Less
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              View All {holdings.length} Assets
            </>
          )}
        </button>
      )}
    </div>
  )
}
