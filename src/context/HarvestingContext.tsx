import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react'
import { Holding, CapitalGains, ComputedGains } from '../types/index'
import { fetchHoldings, fetchCapitalGains } from '../api/mockApi'

// Row key must match the table — coin+coinName+idx to handle duplicate coins (e.g. two USDC rows)
export const getRowKey = (h: Holding, idx: number) =>
  `${h.coin}-${h.coinName}-${idx}`

interface HarvestingContextType {
  capitalGains: CapitalGains | null
  holdings: Holding[]
  selectedCoins: Set<string>
  loading: boolean
  error: string | null
  showAll: boolean
  afterHarvestingGains: ComputedGains | null
  toggleCoin: (key: string) => void
  toggleAll: () => void
  setShowAll: (show: boolean) => void
  retry: () => void
}

const HarvestingContext = createContext<HarvestingContextType | undefined>(undefined)

export const HarvestingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [capitalGains, setCapitalGains] = useState<CapitalGains | null>(null)
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [selectedCoins, setSelectedCoins] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [gainsData, holdingsData] = await Promise.all([
        fetchCapitalGains(),
        fetchHoldings(),
      ])
      setCapitalGains(gainsData)
      setHoldings(holdingsData)
    } catch (err) {
      setError('Failed to load data. Please try again.')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // ── Compute afterHarvestingGains using useMemo ──────────────────────
  const afterHarvestingGains = useMemo<ComputedGains | null>(() => {
    if (!capitalGains || holdings.length === 0) return null

    let stcgProfits = capitalGains.capitalGains.stcg.profits
    let stcgLosses  = capitalGains.capitalGains.stcg.losses
    let ltcgProfits = capitalGains.capitalGains.ltcg.profits
    let ltcgLosses  = capitalGains.capitalGains.ltcg.losses

    // For each selected row: positive gain → add to profits, negative → add |gain| to losses
    selectedCoins.forEach(key => {
      const idx     = parseInt(key.split('-').pop() ?? '0', 10)
      const holding = holdings[idx]
      if (!holding) return

      if (holding.stcg.gain > 0) {
        stcgProfits += holding.stcg.gain
      } else if (holding.stcg.gain < 0) {
        stcgLosses  += Math.abs(holding.stcg.gain)
      }

      if (holding.ltcg.gain > 0) {
        ltcgProfits += holding.ltcg.gain
      } else if (holding.ltcg.gain < 0) {
        ltcgLosses  += Math.abs(holding.ltcg.gain)
      }
    })

    const stcgNetGain  = stcgProfits - stcgLosses
    const ltcgNetGain  = ltcgProfits - ltcgLosses
    const totalNetGain = stcgNetGain + ltcgNetGain

    return {
      stcg: { profits: stcgProfits, losses: stcgLosses, netGain: stcgNetGain },
      ltcg: { profits: ltcgProfits, losses: ltcgLosses, netGain: ltcgNetGain },
      totalNetGain,
    }
  }, [selectedCoins, holdings, capitalGains])

  // ── Toggle helpers ──────────────────────────────────────────────────
  const toggleCoin = (key: string) => {
    setSelectedCoins(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedCoins.size === holdings.length) {
      setSelectedCoins(new Set())
    } else {
      const allKeys = new Set(holdings.map((h, i) => getRowKey(h, i)))
      setSelectedCoins(allKeys)
    }
  }

  return (
    <HarvestingContext.Provider
      value={{
        capitalGains,
        holdings,
        selectedCoins,
        loading,
        error,
        showAll,
        afterHarvestingGains,
        toggleCoin,
        toggleAll,
        setShowAll,
        retry: fetchData,
      }}
    >
      {children}
    </HarvestingContext.Provider>
  )
}

export const useHarvesting = () => {
  const context = useContext(HarvestingContext)
  if (!context) throw new Error('useHarvesting must be used within a HarvestingProvider')
  return context
}
