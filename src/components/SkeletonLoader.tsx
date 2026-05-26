import React from 'react'

// ── Generic skeleton bar ──────────────────────────────────────────────
export const SkeletonLoader: React.FC<{
  width?: string
  height?: string
  className?: string
}> = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`skeleton ${width} ${height} ${className}`} />
)

// ── Capital Gains Card skeleton ───────────────────────────────────────
export const CapitalGainsCardSkeleton: React.FC<{ isAfter?: boolean }> = ({ isAfter }) => {
  const bg = isAfter ? '#102a61' : '#111827'
  const border = isAfter ? '#1e3a8a' : '#1f2937'

  return (
    <div
      className="rounded-xl p-6"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-6">
        <SkeletonLoader width="w-32" height="h-5" />
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 gap-4 mb-2">
        <div />
        <SkeletonLoader height="h-3" />
        <SkeletonLoader height="h-3" />
      </div>

      {/* Rows */}
      {['Profits', 'Losses', 'Net Capital Gains'].map(label => (
        <div key={label} className="grid grid-cols-3 gap-4 py-3" style={{ borderBottom: `1px solid ${border}` }}>
          <SkeletonLoader width="w-20" height="h-4" />
          <SkeletonLoader height="h-4" />
          <SkeletonLoader height="h-4" />
        </div>
      ))}

      {/* Total row */}
      <div className="mt-4 rounded-lg px-4 py-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div className="flex justify-between items-center">
          <SkeletonLoader width="w-40" height="h-4" />
          <SkeletonLoader width="w-24" height="h-7" />
        </div>
      </div>
    </div>
  )
}

// ── Holdings Table skeleton ───────────────────────────────────────────
export const HoldingsTableSkeleton: React.FC = () => (
  <div>
    <SkeletonLoader width="w-24" height="h-6" className="mb-5" />
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border-divider)' }}
    >
      {/* Table header bar */}
      <div
        className="px-5 py-4 grid gap-4"
        style={{
          gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 1fr 1fr',
          background: '#111827',
          borderBottom: '1px solid var(--border-divider)',
        }}
      >
        <SkeletonLoader width="w-4" height="h-4" />
        {['', '', '', '', '', ''].map((_, i) => (
          <SkeletonLoader key={i} height="h-3" />
        ))}
      </div>

      {/* Rows */}
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="px-5 py-0 grid gap-4 items-center"
          style={{
            gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 1fr 1fr',
            height: '64px',
            background: '#111827',
            borderBottom: i < 4 ? '1px solid var(--border-divider)' : 'none',
          }}
        >
          <SkeletonLoader width="w-4" height="h-4" />
          {/* Asset col: circle + two lines */}
          <div className="flex items-center gap-3">
            <SkeletonLoader width="w-8" height="h-8" className="rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <SkeletonLoader width="w-24" height="h-3.5" />
              <SkeletonLoader width="w-12" height="h-3" />
            </div>
          </div>
          {/* Remaining cols */}
          {[1, 2, 3, 4, 5].map(j => (
            <div key={j} className="text-right">
              <SkeletonLoader height="h-3.5" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
)
