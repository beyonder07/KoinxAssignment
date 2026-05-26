import React from 'react'

interface HowItWorksModalProps {
  onClose: () => void
}

const STEPS = [
  {
    number: '01',
    title: 'View your capital gains',
    body: 'The Pre Harvesting card shows your current STCG and LTCG based on your realised trades. This is your starting tax liability.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Select holdings to harvest',
    body: 'Check assets in the Holdings table that have unrealised losses. Selling them "realises" those losses, which offset your gains.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'See your savings in real-time',
    body: 'The After Harvesting card updates instantly. Watch your Realised Capital Gains drop as losses offset gains.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Execute trades & save taxes',
    body: 'Sell the selected assets before year-end to lock in the losses. Consult your tax advisor to confirm the optimal strategy.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
]

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose }) => {
  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={handleBackdrop}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: '#0d1626',
          border: '1px solid var(--border-divider)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          animation: 'modal-in 0.22s cubic-bezier(0.34,1.2,0.64,1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid var(--border-divider)' }}
        >
          <div>
            <h2 className="font-bold text-white" style={{ fontSize: '17px', letterSpacing: '-0.01em' }}>
              How Tax-Loss Harvesting Works
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              A simple 4-step process to reduce your tax liability
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--border-divider)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            aria-label="Close modal"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Steps */}
        <div className="px-6 py-5 space-y-4">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-4">
              {/* Icon + number */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-xl"
                  style={{ background: 'rgba(37,99,235,0.12)', color: 'var(--text-link)' }}
                >
                  {step.icon}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: '1px', flex: 1, minHeight: '16px', background: 'var(--border-divider)', marginTop: '2px' }} />
                )}
              </div>
              {/* Content */}
              <div className="pb-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-bold tabular-nums"
                    style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em' }}
                  >
                    {step.number}
                  </span>
                  <h3 className="font-semibold text-white" style={{ fontSize: '14px' }}>
                    {step.title}
                  </h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div
          className="px-6 py-4 flex items-start gap-2.5"
          style={{ borderTop: '1px solid var(--border-divider)', background: 'rgba(255,255,255,0.02)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#d97706', flexShrink: 0, marginTop: '1px' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Always consult a qualified CA or tax professional before executing any trades based on this tool.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
