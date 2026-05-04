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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className={`font-bold text-gray-800 ${dadMode ? 'text-4xl' : 'text-3xl'}`}>Home</h2>
        {dadMode && (
          <p className="text-gray-500 text-xl mt-1">Start here every week.</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg mb-1">Employees</p>
          <p className={`font-bold text-gray-800 ${dadMode ? 'text-5xl' : 'text-4xl'}`}>
            {activeEmployees.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg mb-1">Last Payroll Total</p>
          <p className={`font-bold text-green-600 ${dadMode ? 'text-4xl' : 'text-3xl'}`}>
            {lastRun ? `$${lastRun.totalAmount.toFixed(2)}` : '—'}
          </p>
        </div>
      </div>

      {lastRun && (
        <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-100">
          <p className={`text-blue-700 ${dadMode ? 'text-xl' : 'text-lg'}`}>
            Last payroll: <strong>Week of {lastRun.weekOf}</strong> — saved {lastRun.dateSaved}
          </p>
        </div>
      )}

      {/* Main action buttons */}
      <div className="flex flex-col gap-4 mb-8">
        <button
          onClick={() => onNavigate('enter-hours')}
          className={`bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-md transition-colors text-left ${
            dadMode ? 'text-2xl py-6 px-8' : 'text-xl py-5 px-6'
          }`}
        >
          ✏️ Enter This Week's Hours
        </button>
        <button
          onClick={() => onNavigate('review-print')}
          className={`bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-md transition-colors text-left ${
            dadMode ? 'text-2xl py-6 px-8' : 'text-xl py-5 px-6'
          }`}
        >
          🖨️ Print Check Sheet
        </button>
      </div>

      {activeEmployees.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <p className={`text-yellow-800 ${dadMode ? 'text-xl' : 'text-lg'}`}>
            👋 Welcome! Start by adding your employees.
          </p>
          <button
            onClick={() => onNavigate('employees')}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl py-3 px-6 font-semibold text-lg"
          >
            Add Employees
          </button>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded-xl">
        <p className="text-gray-500 text-sm text-center">
          This app helps you calculate and track payroll. It does not file taxes or send payments.
        </p>
      </div>
    </div>
  )
}
