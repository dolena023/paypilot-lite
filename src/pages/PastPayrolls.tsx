import type { PayrollRun, Page } from '../types'
import { exportPayrollHistoryCSV } from '../utils/export'

interface Props {
  payrollRuns: PayrollRun[]
  dadMode: boolean
  onNavigate: (page: Page) => void
  onViewRun: (run: PayrollRun) => void
}

export default function PastPayrolls({ payrollRuns, dadMode, onNavigate, onViewRun }: Props) {
  const sorted = [...payrollRuns].reverse()
  const ts = dadMode ? 'text-lg' : 'text-sm'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Past Payrolls</h2>
          {dadMode && <p className="text-gray-500 text-xl mt-1">Find old payroll weeks here.</p>}
        </div>
        {payrollRuns.length > 0 && (
          <button
            onClick={() => exportPayrollHistoryCSV(payrollRuns)}
            className={`bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors ${dadMode ? 'px-5 py-3 text-base' : 'px-4 py-2.5 text-sm'}`}
          >
            📥 Export History
          </button>
        )}
      </div>

      {payrollRuns.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <p className="text-4xl mb-3">📋</p>
          <p className={`text-gray-500 font-medium ${dadMode ? 'text-xl' : 'text-lg'}`}>No saved payrolls yet.</p>
          <p className="text-gray-400 text-base mt-1 mb-5">Enter this week's hours to get started.</p>
          <button
            onClick={() => onNavigate('enter-hours')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-6 font-semibold text-base transition-colors"
          >
            Enter This Week's Hours
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((run, i) => (
            <div key={run.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-bold text-gray-800 ${dadMode ? 'text-xl' : 'text-lg'}`}>
                        Week of {run.weekOf}
                      </p>
                      {i === 0 && (
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                          Most Recent
                        </span>
                      )}
                    </div>
                    <p className={`text-gray-400 mt-0.5 ${ts}`}>
                      Saved {run.dateSaved} · {run.employeeCount} employees
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-emerald-600 ${dadMode ? 'text-2xl' : 'text-xl'}`}>
                      ${run.totalAmount.toFixed(2)}
                    </p>
                    <button
                      onClick={() => onViewRun(run)}
                      className={`mt-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold transition-colors ${dadMode ? 'px-4 py-2 text-base' : 'px-3 py-1.5 text-sm'}`}
                    >
                      View / Print Again
                    </button>
                  </div>
                </div>
              </div>

              {/* Employee chips */}
              <div className="px-5 pb-4 flex flex-wrap gap-2">
                {run.entries.map(e => (
                  <span key={e.employeeId}
                    className={`bg-gray-100 rounded-lg px-3 py-1 text-gray-600 ${dadMode ? 'text-base' : 'text-sm'}`}>
                    {e.employeeName}: <strong>${e.netPay.toFixed(2)}</strong>
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
