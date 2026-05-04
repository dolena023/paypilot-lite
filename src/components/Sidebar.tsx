import type { Page } from '../types'

interface NavItem {
  page: Page
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { page: 'home', label: 'Home', icon: '🏠' },
  { page: 'employees', label: 'Employee List', icon: '👥' },
  { page: 'enter-hours', label: 'Enter Hours', icon: '✏️' },
  { page: 'review-print', label: 'Review & Print', icon: '🖨️' },
  { page: 'past-payrolls', label: 'Past Payrolls', icon: '📋' },
  { page: 'simple-totals', label: 'Simple Totals', icon: '💰' },
  { page: 'business-info', label: 'Business Info', icon: '⚙️' },
]

interface Props {
  currentPage: Page
  onNavigate: (page: Page) => void
  dadMode: boolean
}

export default function Sidebar({ currentPage, onNavigate, dadMode }: Props) {
  return (
    <aside className="no-print w-64 bg-slate-800 text-white flex flex-col h-screen flex-shrink-0">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-white">PayPilot Lite</h1>
        {dadMode && <p className="text-slate-400 text-sm mt-1">Simple Weekly Payroll</p>}
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {NAV_ITEMS.map(item => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`w-full text-left px-6 flex items-center gap-3 transition-colors ${
              dadMode ? 'py-4 text-lg' : 'py-3 text-base'
            } ${
              currentPage === item.page
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          Calculates payroll only. Does not file taxes or send payments.
        </p>
      </div>
    </aside>
  )
}
