import type { Employee, PayrollRun, Page } from '../types'

interface Props {
  employees: Employee[]
  payrollRuns: PayrollRun[]
  dadMode: boolean
  onNavigate: (page: Page) => void
}

export default function Home({ employees, payrollRuns, dadMode, onNavigate }: Props) {
  const activeEmployees = employees.filter(e => e.active)
  const lastRun = payrollRuns.length > 0 ? payrollRuns[payrollRuns.length - 1] : null
  const ts = dadMode ? 'text-xl' : 'text-base'

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Page title */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Home</h2>
        {dadMode && <p className={`text-gray-500 mt-1 ${ts}`}>Start here every week.</p>}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-1">Employees</p>
          <p className="text-4xl font-bold text-gray-800">{activeEmployees.length}</p>
          <p className="text-gray-400 text-sm mt-1">active workers</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-1">Last Payroll Total</p>
          <p className="text-4xl font-bold text-emerald-600">
            {lastRun ? `$${lastRun.totalAmount.toFixed(2)}` : '—'}
          </p>
          <p className="text-gray-400 text-sm mt-1">{lastRun ? `${lastRun.employeeCount} employees` : 'no payroll yet'}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-1">Last Pay Date</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{lastRun ? lastRun.dateSaved : '—'}</p>
          <p className="text-gray-400 text-sm mt-1">{lastRun ? `Week of ${lastRun.weekOf}` : 'not paid yet'}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('enter-hours')}
          className={`bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-sm
            transition-colors text-left flex items-center gap-4
            ${dadMode ? 'p-6 text-2xl' : 'p-5 text-xl'}`}
        >
          <span className="text-3xl">✏️</span>
          <div>
            <p className="font-bold">Enter This Week's Hours</p>
            {dadMode && <p className="text-emerald-100 text-sm font-normal mt-0.5">Start payroll here</p>}
          </div>
        </button>
        <button
          onClick={() => onNavigate('review-print')}
          className={`bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-sm
            transition-colors text-left flex items-center gap-4
            ${dadMode ? 'p-6 text-2xl' : 'p-5 text-xl'}`}
        >
          <span className="text-3xl">🖨️</span>
          <div>
            <p className="font-bold">Print Check Sheet</p>
            {dadMode && <p className="text-blue-100 text-sm font-normal mt-0.5">Print & write checks</p>}
          </div>
        </button>
      </div>

      {/* Step guide */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">How It Works</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {[
            { step: '1', label: 'Enter Hours', desc: 'Type each person\'s hours', emoji: '✏️' },
            { step: '2', label: 'Review & Print', desc: 'Check the totals', emoji: '👀' },
            { step: '3', label: 'Write Checks', desc: 'Pay your employees', emoji: '✅' },
          ].map((s, i) => (
            <div key={s.step} className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className={`font-semibold text-gray-800 ${dadMode ? 'text-base' : 'text-sm'}`}>{s.emoji} {s.label}</p>
                  {dadMode && <p className="text-gray-400 text-sm">{s.desc}</p>}
                </div>
              </div>
              {i < 2 && (
                <span className="hidden sm:block text-gray-300 text-xl ml-2">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* No employees nudge */}
      {activeEmployees.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <span className="text-2xl">👋</span>
          <div>
            <p className={`font-semibold text-amber-800 ${dadMode ? 'text-xl' : 'text-lg'}`}>
              Welcome! Let's get started.
            </p>
            <p className={`text-amber-700 mt-0.5 ${dadMode ? 'text-lg' : 'text-base'}`}>
              Add your employees first before entering hours.
            </p>
            <button
              onClick={() => onNavigate('employees')}
              className="mt-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2.5 px-5 font-semibold text-base transition-colors"
            >
              Add Employees →
            </button>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-gray-400 text-xs pb-2">
        This app calculates payroll only. It does not file taxes or send payments.
      </p>
    </div>
  )
}
