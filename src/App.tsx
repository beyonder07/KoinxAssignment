import { HarvestingProvider } from './context/HarvestingContext'
import { Header } from './components/Header'
import { DisclaimerBanner } from './components/DisclaimerBanner'
import { CapitalGainsCard } from './components/CapitalGainsCard'
import { HoldingsTable } from './components/HoldingsTable'

function AppContent() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <Header />
      <main className="max-w-[1280px] mx-auto px-6 pb-20">
        <DisclaimerBanner />

        {/* Capital Gains Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
          <CapitalGainsCard variant="before" title="Pre Harvesting" />
          <CapitalGainsCard variant="after"  title="After Harvesting" />
        </div>

        {/* Holdings Table */}
        <HoldingsTable />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <HarvestingProvider>
      <AppContent />
    </HarvestingProvider>
  )
}
