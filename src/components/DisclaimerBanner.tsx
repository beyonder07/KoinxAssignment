import React, { useState } from 'react'

const BULLETS: { title: string; body: string }[] = [
  {
    title: 'Not financial advice',
    body: 'Tax-loss harvesting calculations are estimates only. This tool does not constitute financial, investment, or tax advice.',
  },
  {
    title: 'Actual liability may vary',
    body: 'Results depend on your jurisdiction, applicable tax laws, and individual financial circumstances. Consult a qualified CA.',
  },
  {
    title: 'Short-term vs Long-term',
    body: 'STCG applies to assets held under 1 year and is taxed at a higher rate. LTCG applies to assets held 1 year or longer.',
  },
  {
    title: 'Wash-sale rules',
    body: 'In some jurisdictions, repurchasing a substantially identical asset within 30 days may disallow the harvested loss.',
  },
  {
    title: 'KoinX liability',
    body: 'KoinX is not responsible for tax consequences arising from decisions made using this tool. Always verify with a professional.',
  },
]

export const DisclaimerBanner: React.FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="rounded-xl mb-7 overflow-hidden"
      style={{
        background: 'var(--bg-card-pre)',
        border: '1px solid var(--border-divider)',
      }}
    >
      {/* ── Toggle Row ── */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="disclaimer-body"
      >
        <div className="flex items-center gap-3">
          <span
            className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full font-bold text-white"
            style={{ background: '#d97706', fontSize: '11px' }}
          >
            !
          </span>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Important Disclaimer
          </span>
          <span
            className="hidden sm:inline text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(217,119,6,0.12)', color: '#fbbf24' }}
          >
            Read before proceeding
          </span>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            color: 'var(--text-secondary)',
            flexShrink: 0,
            transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* ── Body ── */}
      <div
        id="disclaimer-body"
        className={`disclaimer-body${open ? ' open' : ''}`}
      >
        <div
          className="px-5 pb-5 pt-1 grid gap-3"
          style={{ borderTop: '1px solid var(--border-divider)' }}
        >
          {BULLETS.map((b, i) => (
            <div key={i} className="flex gap-3">
              <span
                className="flex-shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full"
                style={{ background: '#d97706', marginTop: '7px' }}
              />
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {b.title}:{' '}
                </span>
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
