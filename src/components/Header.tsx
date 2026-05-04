interface Props {
  ownerName: string
  businessName: string
  onMenuToggle: () => void
}

export default function Header({ ownerName, businessName, onMenuToggle }: Props) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const greeting = ownerName ? `Welcome, ${ownerName} 👋` : 'Welcome 👋'

  return (
    <header className="no-print bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <p className="font-bold text-gray-800 text-lg leading-tight">{greeting}</p>
          <p className="text-gray-400 text-sm leading-tight">
            {businessName || 'Weekly payroll made simple'}
          </p>
        </div>
      </div>
      <div className="hidden sm:block text-right">
        <p className="text-gray-400 text-sm">{today}</p>
      </div>
    </header>
  )
}
