import { useState } from 'react'
import type { PayrollEntry, Page } from '../types'
import { calculatePayrollTotals } from '../utils/payroll'
import { exportWeeklyPayrollCSV } from '../utils/export'

interface Props {
  entries: PayrollEntry[]
  weekOf: string
  dadMode: boolean
  isHistorical: boolean
  onSavePayroll: (entries: PayrollEntry[], weekOf: string) => void
  onNavigate: (page: Page) => void
}

export default function ReviewPrint({
  entries,
  weekOf,
  dadMode,
  isHistorical,
  onSavePayroll,
  onNavigate,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [saved, setSaved] = useState(false)

  const total = calculatePayrollTotals(entries)

  function handleSave() {
    onSavePayroll(entries, weekOf)
    setSaved(true)
    setShowConfirm(false)
  }

  if (entries.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className={`font-bold text-gray-800 ${dadMode ? 'text-4xl' : 'text-3xl'}`}>Review & Print</h2>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <p className={`text-yellow-800 ${dadMode ? 'text-xl' : 'text-lg'}`}>
            No hours entered yet. Go to "Enter Hours" first.
          </p>
          <button
            onClick={() => onNavigate('enter-hours')}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl py-3 px-6 font-semibold text-lg"
          >
            Go to Enter Hours
          </button>
        </div>
      </div>
    )
  }

  const btnBase = `rounded-2xl font-bold shadow-md transition-colors ${dadMode ? 'text-xl py-4 px-6' : 'text-lg py-3 px-5'}`

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="no-print mb-6">
        <h2 className={`font-bold text-gray-800 ${dadMode ? 'text-4xl' : 'text-3xl'}`}>Review & Print</h2>
        {dadMode && (
          <p className="text-gray-500 text-xl mt-1">Print this page, then write the checks.</p>
        )}
      </div>

      {/* Save success banner */}
      {saved && (
        <div className="no-print bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
          <p className={`text-green-700 font-semibold ${dadMode ? 'text-xl' : 'text-lg'}`}>
            ✅ Payroll saved. You can print your check sheet now.
          </p>
        </div>
      )}

      {isHistorical && (
        <div className="no-print bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
          <p className={`text-blue-700 ${dadMode ? 'text-xl' : 'text-lg'}`}>
            Viewing saved payroll — Week of {weekOf}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="no-print flex flex-wrap gap-3 mb-6">
        <button onClick={() => window.print()} className={`bg-blue-600 hover:bg-blue-700 text-white ${btnBase}`}>
          🖨️ Print Check Sheet
        </button>
        {!isHistorical && !saved && (
          <button
            onClick={() => setShowConfirm(true)}
            className={`bg-green-600 hover:bg-green-700 text-white ${btnBase}`}
          >
            💾 Save Weekly Payroll
          </button>
        )}
        <button
          onClick={() => exportWeeklyPayrollCSV(entries, weekOf)}
          className={`bg-gray-600 hover:bg-gray-700 text-white ${btnBase}`}
        >
          📥 Export CSV
        </button>
        <button
          onClick={() => onNavigate(isHistorical ? 'past-payrolls' : 'enter-hours')}
          className={`bg-gray-200 hover:bg-gray-300 text-gray-700 ${btnBase}`}
        >
          ← {isHistorical ? 'Back to Past Payrolls' : 'Back to Edit Hours'}
        </button>
      </div>

      {/* Confirm save modal */}
      {showConfirm && (
        <div className="no-print fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h3 className={`font-bold text-gray-800 mb-3 ${dadMode ? 'text-2xl' : 'text-xl'}`}>
              Save This Payroll?
            </h3>
            <p className={`text-gray-600 mb-6 ${dadMode ? 'text-xl' : 'text-lg'}`}>
              Are you sure you want to save this week's payroll?
            </p>
            <p className={`text-gray-800 font-semibold mb-6 ${dadMode ? 'text-xl' : 'text-lg'}`}>
              Week of {weekOf} · {entries.length} employees · ${total.toFixed(2)} total
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className={`bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold ${dadMode ? 'py-4 px-6 text-xl' : 'py-3 px-5 text-lg'}`}
              >
                Yes, Save It
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className={`bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold ${dadMode ? 'py-4 px-6 text-xl' : 'py-3 px-5 text-lg'}`}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== PRINT AREA — CHECK SHEET ===== */}
      <div className="print-area bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-6 pb-5 border-b-2 border-gray-800">
          <h3 className="text-2xl font-bold text-gray-800">Payroll Check Sheet</h3>
          <p className="text-gray-600 text-lg mt-1">Week of: {weekOf}</p>
          <p className="text-gray-600 text-lg">
            {entries.length} employees &nbsp;·&nbsp; Total: ${total.toFixed(2)}
          </p>
        </div>

        <div className="space-y-0">
          {entries.map((entry, i) => (
            <div
              key={entry.employeeId}
              className={`flex items-center gap-3 py-5 ${i < entries.length - 1 ? 'border-b border-gray-200' : ''}`}
            >
              {/* Checkbox */}
              <div className="w-7 h-7 border-2 border-gray-800 rounded flex-shrink-0" />
              <span className="text-gray-600 font-medium text-lg flex-shrink-0">Paid</span>

              {/* Name */}
              <span className="font-bold text-gray-800 text-xl w-44 flex-shrink-0">{entry.employeeName}</span>

              {/* Amount */}
              <span className="font-bold text-green-700 text-2xl w-28 flex-shrink-0">
                ${entry.netPay.toFixed(2)}
              </span>

              {/* Check # */}
              <span className="text-gray-600 text-lg flex-shrink-0">Check #:</span>
              <div className="w-24 flex-shrink-0 border-b-2 border-gray-400" style={{ height: '26px' }} />

              {/* Notes */}
              <span className="text-gray-600 text-lg flex-shrink-0">Notes:</span>
              <div className="flex-1 border-b-2 border-gray-400" style={{ height: '26px' }} />
            </div>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t-2 border-gray-800 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">Total Checks:</span>
          <span className="text-3xl font-bold text-green-700">${total.toFixed(2)}</span>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            This app calculates payroll only. It does not file taxes or send payments.
          </p>
        </div>
      </div>
    </div>
  )
}
