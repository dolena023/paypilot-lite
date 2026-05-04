import type { PayrollRun, Page } from '../types'
import { exportPayrollHistoryCSV } from '../utils/export'

interface Props {
  payrollRuns: PayrollRun[]
  dadMode: boolean
  onNavigate: (page: Page) => void
  onViewRun: (run: PayrollRun) => void
}

export default function PastPayrolls({ payrollRuns, dadMode, onNavigate, onViewRun }: Props) {
  const sortedRuns = [...payrollRuns].reverse()
  const btnBase = `rounded-xl font-semibold transition-colors ${dadMode ? 'px-5 py-3 text-lg' : 'px-4 py-2 text-base'}`

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className={`font-bold text-gray-800 ${dadMode ? 'text-4xl' : 'text-3xl'}`}>Past Payrolls</h2>
          {dadMode && <p className="text-gray-500 text-xl mt-1">Find old payroll weeks here.</p>}
        </div>
        {payrollRuns.length > 0 && (
          <button
            onClick={() => exportPayrollHistoryCSV(payrollRuns)}
            className={`bg-gray-600 hover:bg-gray-700 text-white ${btnBase}`}
          >
            📥 Export History
          </button>
        )}
      </div>

      {payrollRuns.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <p className={`text-gray-500 mb-4 ${dadMode ? 'text-xl' : 'text-lg'}`}>
            No saved payrolls yet.
          </p>
          <button
            onClick={() => onNavigate('enter-hours')}
            className={`bg-green-600 hover:bg-green-700 text-white ${btnBase}`}
          >
            Enter This Week's Hours
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedRuns.map(run => (
            <div key={run.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className={`font-bold text-gray-800 ${dadMode ? 'text-2xl' : 'text-xl'}`}>
                    Week of {run.weekOf}
                  </p>
                  <p className={`text-gray-500 mt-0.5 ${dadMode ? 'text-lg' : 'text-base'}`}>
                    Saved {run.dateSaved} &nbsp;·&nbsp; {run.employeeCount} employees &nbsp;·&nbsp;{' '}
                    <strong className="text-green-700">${run.totalAmount.toFixed(2)}</strong>
                  </p>
                </div>
                <button
                  onClick={() => onViewRun(run)}
                  className={`bg-blue-100 hover:bg-blue-200 text-blue-700 ${btnBase}`}
                >
                  View / Print Again
                </button>
              </div>

              {/* Employee detail */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-3">
                {run.entries.map(e => (
                  <span
                    key={e.employeeId}
                    className={`bg-gray-100 rounded-lg px-3 py-1 text-gray-600 ${dadMode ? 'text-lg' : 'text-sm'}`}
                  >
                    {e.employeeName}: ${e.netPay.toFixed(2)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
