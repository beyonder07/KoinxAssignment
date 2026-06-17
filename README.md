# 🪙 KoinX - Tax Loss Harvesting Dashboard

A production-grade, highly polished **Tax Loss Harvesting Dashboard** built with **React 18 + TypeScript + Vite + Tailwind CSS**. This application is designed as part of the KoinX Frontend Intern Assessment, featuring a premium dark fintech aesthetic inspired by platforms like Stripe, Zerodha, and CoinDCX Pro.

---

## 🎨 Design System & Aesthetic Details

The application enforces a premium, high-fidelity dark UI with the following architectural highlights:
* **Color System**: Custom tailwind configuration with precise HEX/HSL palettes including Dark Navy page backgrounds (`#080b11`), Charcoal cards (`#111827`), deep active glow panels (`#102a61`), and rich semantic colors for gains (`#10b981`) and losses (`#ef4444`).
* **Typography**: Clean, professional layout using the **Inter** font family (loaded dynamically via Google Fonts) with precise leading and letter-spacing settings for absolute financial SaaS authenticity.
* **Micro-interactions**: 
  * Smooth cubic-bezier transitions for the collapsible disclaimer accordion.
  * Pop-in scale animations on the Tax Savings badge.
  * Real-time text transition highlights when capital gains recalculate.
  * Custom indeterminate states for select-all checkboxes.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** ≥ 18.0.0
* **npm** or **pnpm** installed on your system

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <your-repo-url>
   cd Intern-Assignment-main
   ```

2. Install the node packages:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The local environment will start at `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).

### Building for Production
Optimize assets and bundle the application:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 🏗 Directory Architecture

```
src/
├── api/
│   └── mockApi.ts              # Async data fetch layer with Promise delays (800ms)
├── components/
│   ├── CapitalGainsCard.tsx    # STCG & LTCG visual ledger for Pre & After harvesting cards
│   ├── DisclaimerBanner.tsx    # Smooth animated legal and logic guidelines accordions
│   ├── Header.tsx              # Application navbar with KoinX theme brand
│   ├── HoldingsTable.tsx       # Core transaction data grid with selection + sort indicators
│   ├── HowItWorksModal.tsx     # Backdrop-blurred walkthrough stepper modal
│   ├── SkeletonLoader.tsx      # Pulse shimmer placeholders for async states
│   └── Tooltip.tsx             # Interactive helper tooltips for abbreviated figures
├── context/
│   └── HarvestingContext.tsx   # React Context API global state container & calculus hook
├── types/
│   └── index.ts                # TypeScript strict interfaces (Holding, CapitalGains)
├── utils/
│   └── index.ts                # Financial formatters: Indian Rupee (en-IN), abbreviation, scientific formatting
├── App.tsx                     # Layout grid compositor
├── index.css                   # Tailwind base directives & root styling tokens
└── main.tsx                    # React DOM renderer
```

---

## ⚙️ Mathematical & Technical Assumptions

1. **Local Currency (INR - ₹)**:
   All valuation metrics are rendered in Indian Rupees (`₹`). String serialization uses the `en-IN` format (e.g., Lakhs and Crores placement: `₹2,11,756.00` instead of `₹211,756.00`).
2. **Duplicate Ledger Resolution**:
   The assignment data contains two instances of `USDC` with different names/underlying protocols. To prevent React key-clashing and incorrect checkbox bindings, we generate composite keys via:
   `getRowKey(holding, index) = "${holding.coin}-${holding.coinName}-${index}"`
3. **Optimized Gain Offset Logic**:
   The computation dynamically evaluates offsets. For each selected holding:
   * A positive gain increases realised **profits**.
   * A negative gain increases realised **losses** (offsetting net gains).
   Calculations are run through `useMemo` hooks in `HarvestingContext` to guarantee $O(1)$ re-renders on checkbox transitions.
4. **Scientific Notation for Dust Balances**:
   Dust holdings (e.g., quantities like `3.469e-17`) are rendered in clean scientific notation to avoid UI overflow, with hover tooltips disclosing the full floating point number.
5. **Auto-Sorting**:
   Assets are automatically sorted descending by the absolute value of their total gain, displaying the highest tax-loss-harvesting opportunities at the top.

---

## ✅ Core & Bonus Features Checklist

- [x] **Double Capital Ledger Cards**: Implements side-by-side comparison tables separating pre-harvest states and post-harvest projections.
- [x] **Real-Time Tax Engine**: Toggling checkboxes instantly updates STCG, LTCG, and Net Capital Gains.
- [x] **Intelligent Savings Badge**: Prominently highlights savings with custom scaling animations; disappears automatically if no savings are calculated.
- [x] **Rich Table Columns**: Renders Asset, STCG (Balance + Gain), LTCG (Balance + Gain), and Amount to Sell.
- [x] **Row Selection Styling**: Active rows render with a solid vertical indicator block and a subtle row color tint.
- [x] **Show More/Less Accordion**: The 25 mock holdings default to 4 rows initially for compact aesthetics and can be toggled to show the full list.
- [x] **Responsive Layout**: Seamlessly shifts to mobile viewports by converting grids into cards, enabling horizontal table scrolls, and selectively hiding minor columns.
- [x] **Shimmer Loading State**: Simulate real server requests using skeletons styled directly from the grid layouts.
- [x] **Explanatory Modal & Banner**: Click-outside-closable process modal and an elegant collapsible warning accordion.

---

## 🛠 Tech Stack Summary

| Package | Purpose |
| :--- | :--- |
| **React 18** | UI engine with hooks (`useContext`, `useMemo`, `useState`, `useEffect`) |
| **TypeScript** | Static typing with strict compile targets |
| **Vite** | Lightning-fast development server and bundle optimization |
| **Tailwind CSS** | Design system utility layer |
| **Google Fonts** | Professional web typography (Inter) |

---

## 👤 Author

* **Rajul Mishra**
* **GitHub**: [@beyonder07](https://github.com/beyonder07)
* **Email**: mrajul1234@gmail.com
* **Repository**: [KoinxAssignment](https://github.com/beyonder07/KoinxAssignment)


<!-- START_STATS_SECTION -->
### 📊 Auto-Update Stats
- **Last Active:** 6/17/2026, 2:05:47 PM
- **Latest Focus:** Redis Caching & Pub-Sub Mechanisms
- **Current Streak Status:** Active 🔥
- **Commit Mode:** Automated Daily Log System
<!-- END_STATS_SECTION -->
