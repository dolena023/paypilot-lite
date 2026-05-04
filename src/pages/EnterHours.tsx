import type { Employee, PayrollEntry, Page } from '../types'
import { buildEntry, calculatePayrollTotals } from '../utils/payroll'

interface Props {
  employees: Employee[]
  currentEntries: PayrollEntry[]
  weekOf: string
  dadMode: boolean
  onEntriesChange: (entries: PayrollEntry[]) => void
  onWeekOfChange: (weekOf: string) => void
  onNavigate: (page: Page) => void
}

export default function EnterHours({
  employees, currentEntries, weekOf, dadMode,
  onEntriesChange, onWeekOfChange, onNavigate,
}: Props) {
  const active = employees.filter(e => e.active)
  const total = calculatePayrollTotals(currentEntries)

  function updateEntry(
    index: number,
    field: 'regularHours' | 'overtimeHours' | 'bonus' | 'deduction',
    rawValue: string
  ) {
    const value = Math.max(0, parseFloat(rawValue) || 0)
    const entry = currentEntries[index]
    const employee = employees.find(e => e.id === entry.employeeId)
    if (!employee) return
    const updated = [...currentEntries]
    updated[index] = buildEntry(employee, {
      regularHours: field === 'regularHours' ? value : entry.regularHours,
      overtimeHours: field === 'overtimeHours' ? value : entry.overtimeHours,
      bonus: field === 'bonus' ? value : entry.bonus,
      deduction: field === 'deduction' ? value : entry.deduction,
    })
    onEntriesChange(updated)
  }

  const inputCls = `border-2 border-gray-200 rounded-xl text-center focus:outline-none focus:border-emerald-500 transition-colors bg-gray-50 focus:bg-white ${dadMode ? 'py-3 text-xl w-24' : 'py-2 text-base w-20'}`

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Enter Hours</h2>
        {dadMode && <p className="text-gray-500 text-xl mt-1">Type each person's hours. The app does the math.</p>}
      </div>

      {/* Week picker */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
        <label className={`font-semibold text-gray-700 ${dadMode ? 'text-xl' : 'text-base'}`}>Week of:</label>
        <input
          type="date"
          value={weekOf}
          onChange={e => onWeekOfChange(e.target.value)}
          className={`border-2 border-gray-200 rounded-xl px-4 bg-gray-50 focus:outline-none focus:border-emerald-500 transition-colors ${dadMode ? 'py-3 text-xl' : 'py-2 text-base'}`}
        />
      </div>

      {active.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className={`text-amber-800 ${dadMode ? 'text-xl' : 'text-lg'}`}>No active employees. Please add employees first.</p>
          <button onClick={() => onNavigate('employees')}
            className="mt-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-3 px-5 font-semibold text-base transition-colors">
            Go to Employee List
          </button>
        </div>
      ) : (
        <>
          {/* Hours table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className={`text-left px-5 py-4 font-semibold text-gray-500 ${dadMode ? 'text-base' : 'text-sm'}`}>Employee</th>
                    <th className={`text-center px-3 py-4 font-semibold text-gray-500 ${dadMode ? 'text-base' : 'text-sm'}`}>Reg. Hrs</th>
                    <th className={`text-center px-3 py-4 font-semibold text-gray-500 ${dadMode ? 'text-base' : 'text-sm'}`}>OT Hrs</th>
                    <th className={`text-center px-3 py-4 font-semibold text-gray-500 ${dadMode ? 'text-base' : 'text-sm'}`}>Bonus ($)</th>
                    <th className={`text-center px-3 py-4 font-semibold text-gray-500 ${dadMode ? 'text-base' : 'text-sm'}`}>Deduct ($)</th>
                    <th className={`text-right px-5 py-4 font-semibold text-gray-500 ${dadMode ? 'text-base' : 'text-sm'}`}>Total Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentEntries.map((entry, i) => {
                    const hasOT = entry.overtimeHours > 0
                    return (
                      <tr key={entry.employeeId} className={hasOT ? 'bg-amber-50/40' : 'hover:bg-gray-50/60'}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700 text-sm flex-shrink-0">
                              {entry.employeeName.charAt(0)}
                            </div>
                            <div>
                              <p className={`font-semibold text-gray-800 ${dadMode ? 'text-lg' : 'text-base'}`}>{entry.employeeName}</p>
                              {entry.payType === 'salary'
                                ? <p className="text-gray-400 text-xs">Salary · ${entry.weeklySalary.toFixed(2)}/wk</p>
                                : <p className="text-gray-400 text-xs">${entry.hourlyRate.toFixed(2)}/hr</p>
                              }
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-center">
                          {entry.payType === 'salary' ? (
                            <span className="text-gray-300 text-sm">—</span>
                          ) : (
                            <input type="number" min="0" step="0.5"
                              value={entry.regularHours || ''}
                              onChange={e => updateEntry(i, 'regularHours', e.target.value)}
                              className={inputCls} placeholder="0" />
                          )}
                        </td>
                        <td className="px-3 py-4 text-center">
                          {entry.payType === 'salary' ? (
                            <span className="text-gray-300 text-sm">—</span>
                          ) : (
                            <input type="number" min="0" step="0.5"
                              value={entry.overtimeHours || ''}
                              onChange={e => updateEntry(i, 'overtimeHours', e.target.value)}
                              className={`${inputCls} ${hasOT ? 'border-amber-400 bg-amber-50 focus:border-amber-500' : ''}`}
                              placeholder="0" />
                          )}
                        </td>
                        <td className="px-3 py-4 text-center">
                          <input type="number" min="0" step="0.01"
                            value={entry.bonus || ''}
                            onChange={e => updateEntry(i, 'bonus', e.target.value)}
                            className={inputCls} placeholder="0" />
                        </td>
                        <td className="px-3 py-4 text-center">
                          <input type="number" min="0" step="0.01"
                            value={entry.deduction || ''}
                            onChange={e => updateEntry(i, 'deduction', e.target.value)}
                            className={inputCls} placeholder="0" />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className={`font-bold text-emerald-600 ${dadMode ? 'text-2xl' : 'text-xl'}`}>
                            ${entry.netPay.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className={`text-gray-500 ${dadMode ? 'text-lg' : 'text-base'}`}>Total to Write Checks For</p>
                <p className={`font-bold text-emerald-600 ${dadMode ? 'text-4xl' : 'text-3xl'}`}>
                  ${total.toFixed(2)}
                </p>
                <p className="text-gray-400 text-sm mt-0.5">{currentEntries.length} employees</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('review-print')}
                  className={`bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors ${dadMode ? 'py-4 px-7 text-xl' : 'py-3 px-6 text-base'}`}
                >
                  Review & Print →
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className={`bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors ${dadMode ? 'py-4 px-5 text-lg' : 'py-3 px-4 text-base'}`}
                >
                  ← Home
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
