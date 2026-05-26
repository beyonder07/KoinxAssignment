import React, { useState } from 'react'
import { HowItWorksModal } from './HowItWorksModal'

export const Header: React.FC = () => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <header className="max-w-[1280px] mx-auto px-6 pt-8 pb-6 flex items-start justify-between">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.12em' }}
          >
            KoinX · Tax Center
          </p>
          <h1
            className="font-bold text-white"
            style={{ fontSize: '24px', lineHeight: '1.25', letterSpacing: '-0.02em' }}
          >
            Tax Optimisation
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Reduce your tax liability by harvesting unrealised losses
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 text-sm font-medium mt-1 transition-opacity duration-150 hover:opacity-70"
          style={{ color: 'var(--text-link)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          How it works?
        </button>
      </header>

      {showModal && <HowItWorksModal onClose={() => setShowModal(false)} />}
    </>
  )
}
