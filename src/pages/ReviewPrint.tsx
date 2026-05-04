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

export default function ReviewPrint({ entries, weekOf, dadMode, isHistorical, onSavePayroll, onNavigate }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [saved, setSaved] = useState(false)
  const total = calculatePayrollTotals(entries)

  function handleSave() {
    onSavePayroll(entries, weekOf)
    setSaved(true)
    setShowConfirm(false)
  }

  const btnBase = `rounded-xl font-semibold transition-colors ${dadMode ? 'py-3.5 px-6 text-lg' : 'py-2.5 px-5 text-base'}`

  if (entries.length === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <h2 className="text-3xl font-bold text-gray-800">Review & Print</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className={`text-amber-800 ${dadMode ? 'text-xl' : 'text-lg'}`}>
            No hours entered yet. Go to "Enter Hours" first.
          </p>
          <button onClick={() => onNavigate('enter-hours')}
            className="mt-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-3 px-5 font-semibold text-base transition-colors">
            Go to Enter Hours
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="no-print">
        <h2 className="text-3xl font-bold text-gray-800">Review & Print</h2>
        {dadMode && <p className="text-gray-500 text-xl mt-1">Print this page, then write the checks.</p>}
      </div>

      {/* Success banner */}
      {saved && (
        <div className="no-print bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <p className={`text-emerald-700 font-semibold ${dadMode ? 'text-xl' : 'text-lg'}`}>
            Payroll saved. You can print your check sheet now.
          </p>
        </div>
      )}

      {isHistorical && (
        <div className="no-print bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className={`text-blue-700 ${dadMode ? 'text-lg' : 'text-base'}`}>
            📋 Viewing saved payroll — Week of {weekOf}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="no-print flex flex-wrap gap-3">
        <button onClick={() => window.print()}
          className={`bg-blue-600 hover:bg-blue-700 text-white ${btnBase} shadow-sm`}>
          🖨️ Print Check Sheet
        </button>
        {!isHistorical && !saved && (
          <button onClick={() => setShowConfirm(true)}
            className={`bg-emerald-600 hover:bg-emerald-700 text-white ${btnBase} shadow-sm`}>
            💾 Save Weekly Payroll
          </button>
        )}
        <button onClick={() => exportWeeklyPayrollCSV(entries, weekOf)}
          className={`bg-gray-600 hover:bg-gray-700 text-white ${btnBase}`}>
          📥 Export CSV
        </button>
        <button onClick={() => onNavigate(isHistorical ? 'past-payrolls' : 'enter-hours')}
          className={`bg-gray-100 hover:bg-gray-200 text-gray-700 ${btnBase}`}>
          ← {isHistorical ? 'Back to Past Payrolls' : 'Back to Edit Hours'}
        </button>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="no-print fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h3 className={`font-bold text-gray-800 mb-2 ${dadMode ? 'text-2xl' : 'text-xl'}`}>Save This Payroll?</h3>
            <p className={`text-gray-500 mb-3 ${dadMode ? 'text-lg' : 'text-base'}`}>
              Are you sure you want to save this week's payroll?
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className={`text-gray-800 font-semibold ${dadMode ? 'text-lg' : 'text-base'}`}>
                📅 Week of {weekOf}<br />
                👥 {entries.length} employees<br />
                💵 ${total.toFixed(2)} total
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave}
                className={`bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold ${dadMode ? 'py-4 px-6 text-xl' : 'py-3 px-5 text-base'}`}>
                Yes, Save It
              </button>
              <button onClick={() => setShowConfirm(false)}
                className={`bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold ${dadMode ? 'py-4 px-6 text-xl' : 'py-3 px-5 text-base'}`}>
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== PRINT AREA ===== */}
      <div className="print-area bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Print header */}
        <div className="bg-slate-900 text-white px-8 py-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-2xl font-bold">Payroll Check Sheet</h3>
              <p className="text-slate-300 text-sm mt-0.5">Week of: {weekOf}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-300 text-sm">{entries.length} employees</p>
              <p className="text-2xl font-bold text-emerald-400">${total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Check rows */}
        <div className="divide-y divide-gray-100">
          {entries.map((entry, i) => (
            <div key={entry.employeeId} className={`px-6 py-5 flex items-center gap-4 flex-wrap ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
              <div className="w-6 h-6 border-2 border-gray-700 rounded flex-shrink-0" />
              <span className="text-gray-500 text-sm font-medium flex-shrink-0">Paid</span>
              <span className={`font-bold text-gray-800 w-40 flex-shrink-0 ${dadMode ? 'text-lg' : 'text-base'}`}>
                {entry.employeeName}
              </span>
              <span className={`font-bold text-emerald-700 w-24 flex-shrink-0 ${dadMode ? 'text-xl' : 'text-lg'}`}>
                ${entry.netPay.toFixed(2)}
              </span>
              <span className="text-gray-400 text-sm flex-shrink-0">Check #:</span>
              <div className="w-24 flex-shrink-0 border-b-2 border-gray-300" style={{ height: '24px' }} />
              <span className="text-gray-400 text-sm flex-shrink-0">Notes:</span>
              <div className="flex-1 min-w-[80px] border-b-2 border-gray-300" style={{ height: '24px' }} />
            </div>
          ))}
        </div>

        {/* Total row */}
        <div className="px-6 py-5 border-t-2 border-gray-800 bg-gray-50 flex justify-between items-center">
          <span className={`font-bold text-gray-800 ${dadMode ? 'text-xl' : 'text-lg'}`}>Total Checks:</span>
          <span className={`font-bold text-emerald-700 ${dadMode ? 'text-3xl' : 'text-2xl'}`}>${total.toFixed(2)}</span>
        </div>

        {/* Disclaimer */}
        <div className="px-6 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            This app calculates payroll only. It does not file taxes or send payments.
          </p>
        </div>
      </div>
    </div>
  )
}
