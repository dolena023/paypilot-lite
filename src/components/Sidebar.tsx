import type { Page } from '../types'

interface NavItem {
  page: Page
  label: string
  emoji: string
}

const NAV: NavItem[] = [
  { page: 'home', label: 'Home', emoji: '🏠' },
  { page: 'employees', label: 'Employee List', emoji: '👥' },
  { page: 'enter-hours', label: 'Enter Hours', emoji: '✏️' },
  { page: 'review-print', label: 'Review & Print', emoji: '🖨️' },
  { page: 'past-payrolls', label: 'Past Payrolls', emoji: '📋' },
  { page: 'simple-totals', label: 'Simple Totals', emoji: '💰' },
  { page: 'business-info', label: 'Business Info', emoji: '⚙️' },
]

interface Props {
  currentPage: Page
  onNavigate: (page: Page) => void
  dadMode: boolean
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ currentPage, onNavigate, dadMode, isOpen, onClose }: Props) {
  function go(page: Page) {
    onNavigate(page)
    onClose()
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`no-print fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-slate-900 text-white
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
              PP
            </div>
            <div>
              <p className="text-base font-bold text-white leading-tight">PayPilot Lite</p>
              {dadMode && <p className="text-slate-400 text-xs">Simple Weekly Payroll</p>}
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV.map(item => {
            const active = currentPage === item.page
            return (
              <button
                key={item.page}
                onClick={() => go(item.page)}
                className={`w-full text-left flex items-center gap-3 rounded-xl transition-all
                  ${dadMode ? 'px-4 py-3.5 text-base' : 'px-3 py-2.5 text-sm'}
                  ${active
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <span className={active ? 'text-lg' : 'text-base opacity-80'}>{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Disclaimer footer */}
        <div className="px-4 py-4 border-t border-slate-700/60">
          <p className="text-xs text-slate-500 text-center leading-relaxed">
            Calculates payroll only.<br />Does not file taxes or send payments.
          </p>
        </div>
      </aside>
    </>
  )
}
