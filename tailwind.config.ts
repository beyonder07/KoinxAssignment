import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        page:      '#080b11',
        'card-pre':   '#111827',
        'card-after': '#102a61',
        divider:   '#1f2937',
        'row-hover': '#1f2937',
        'selected-row': '#1a2744',
        gain:      '#10b981',
        loss:      '#ef4444',
        link:      '#3b82f6',
        checkbox:  '#2563eb',
      },
      borderColor: {
        divider: '#1f2937',
      },
      textColor: {
        primary:   '#ffffff',
        secondary: '#9ca3af',
        muted:     '#6b7280',
        link:      '#3b82f6',
        gain:      '#10b981',
        loss:      '#ef4444',
      },
      borderRadius: {
        lg: '12px',
        sm: '8px',
      },
    },
  },
  plugins: [],
}

export default config
