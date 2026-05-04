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
  employees,
  currentEntries,
  weekOf,
  dadMode,
  onEntriesChange,
  onWeekOfChange,
  onNavigate,
}: Props) {
  const activeEmployees = employees.filter(e => e.active)
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

  const inputClass = `border-2 border-gray-300 rounded-xl text-center focus:outline-none focus:border-blue-500 ${
    dadMode ? 'py-3 text-xl w-24' : 'py-2 text-lg w-20'
  }`

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className={`font-bold text-gray-800 ${dadMode ? 'text-4xl' : 'text-3xl'}`}>Enter Hours</h2>
        {dadMode && (
          <p className="text-gray-500 text-xl mt-1">Type each person's hours. The app will do the math.</p>
        )}
      </div>

      {/* Week picker */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center gap-4">
        <label className={`font-semibold text-gray-700 ${dadMode ? 'text-xl' : 'text-lg'}`}>Week of:</label>
        <input
          type="date"
          value={weekOf}
          onChange={e => onWeekOfChange(e.target.value)}
          className={`border-2 border-gray-300 rounded-xl px-4 focus:outline-none focus:border-blue-500 ${
            dadMode ? 'py-3 text-xl' : 'py-2 text-lg'
          }`}
        />
      </div>

      {activeEmployees.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <p className={`text-yellow-800 ${dadMode ? 'text-xl' : 'text-lg'}`}>
            No active employees found. Please add employees first.
          </p>
          <button
            onClick={() => onNavigate('employees')}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl py-3 px-6 font-semibold text-lg"
          >
            Go to Employee List
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className={`text-left px-5 py-4 font-semibold text-gray-600 ${dadMode ? 'text-xl' : 'text-base'}`}>
                      Employee
                    </th>
                    <th className={`text-center px-4 py-4 font-semibold text-gray-600 ${dadMode ? 'text-xl' : 'text-base'}`}>
                      Regular Hrs
                    </th>
                    <th className={`text-center px-4 py-4 font-semibold text-gray-600 ${dadMode ? 'text-xl' : 'text-base'}`}>
                      Overtime Hrs
                    </th>
                    <th className={`text-center px-4 py-4 font-semibold text-gray-600 ${dadMode ? 'text-xl' : 'text-base'}`}>
                      Bonus ($)
                    </th>
                    <th className={`text-center px-4 py-4 font-semibold text-gray-600 ${dadMode ? 'text-xl' : 'text-base'}`}>
                      Deduction ($)
                    </th>
                    <th className={`text-right px-5 py-4 font-semibold text-gray-600 ${dadMode ? 'text-xl' : 'text-base'}`}>
                      Total Check
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentEntries.map((entry, i) => (
                    <tr key={entry.employeeId} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className={`font-semibold text-gray-800 ${dadMode ? 'text-xl' : 'text-lg'}`}>
                          {entry.employeeName}
                        </p>
                        {entry.payType === 'salary' && (
                          <p className="text-gray-400 text-sm">Salary: ${entry.weeklySalary.toFixed(2)}/wk</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {entry.payType === 'salary' ? (
                          <span className="text-gray-400 text-lg">—</span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={entry.regularHours || ''}
                            onChange={e => updateEntry(i, 'regularHours', e.target.value)}
                            className={inputClass}
                            placeholder="0"
                          />
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {entry.payType === 'salary' ? (
                          <span className="text-gray-400 text-lg">—</span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={entry.overtimeHours || ''}
                            onChange={e => updateEntry(i, 'overtimeHours', e.target.value)}
                            className={inputClass}
                            placeholder="0"
                          />
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={entry.bonus || ''}
                          onChange={e => updateEntry(i, 'bonus', e.target.value)}
                          className={inputClass}
                          placeholder="0"
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={entry.deduction || ''}
                          onChange={e => updateEntry(i, 'deduction', e.target.value)}
                          className={inputClass}
                          placeholder="0"
                        />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`font-bold text-green-600 ${dadMode ? 'text-2xl' : 'text-xl'}`}>
                          ${entry.netPay.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-green-50 border-t-2 border-green-200">
                  <tr>
                    <td
                      colSpan={5}
                      className={`px-5 py-4 font-bold text-gray-700 ${dadMode ? 'text-2xl' : 'text-xl'}`}
                    >
                      Total to Write Checks For:
                    </td>
                    <td className={`px-5 py-4 text-right font-bold text-green-700 ${dadMode ? 'text-3xl' : 'text-2xl'}`}>
                      ${total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('review-print')}
              className={`bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-md transition-colors ${
                dadMode ? 'text-2xl py-5 px-8' : 'text-xl py-4 px-6'
              }`}
            >
              Review & Print →
            </button>
            <button
              onClick={() => onNavigate('home')}
              className={`bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-2xl font-semibold transition-colors ${
                dadMode ? 'text-xl py-5 px-6' : 'text-lg py-4 px-5'
              }`}
            >
              ← Back to Home
            </button>
          </div>
        </>
      )}
    </div>
  )
}
