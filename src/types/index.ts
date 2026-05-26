export interface TaxGain {
  balance: number
  gain: number
}

export interface Holding {
  coin: string
  coinName: string
  logo: string
  currentPrice: number
  totalHolding: number
  averageBuyPrice: number
  stcg: TaxGain
  ltcg: TaxGain
}

export interface CapitalGains {
  capitalGains: {
    stcg: {
      profits: number
      losses: number
    }
    ltcg: {
      profits: number
      losses: number
    }
  }
}

export interface ComputedGains {
  stcg: {
    profits: number
    losses: number
    netGain: number
  }
  ltcg: {
    profits: number
    losses: number
    netGain: number
  }
  totalNetGain: number
}
