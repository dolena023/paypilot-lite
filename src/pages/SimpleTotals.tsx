import type { PayrollRun } from '../types'

interface Props {
  payrollRuns: PayrollRun[]
  dadMode: boolean
}

export default function SimpleTotals({ payrollRuns, dadMode }: Props) {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  const monthName = now.toLocaleString('default', { month: 'long' })

  const monthRuns = payrollRuns.filter(r => {
    const d = new Date(r.dateSaved)
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear
  })
  const yearRuns = payrollRuns.filter(r => new Date(r.dateSaved).getFullYear() === thisYear)

  const totalMonth = monthRuns.reduce((s, r) => s + r.totalAmount, 0)
  const totalYear = yearRuns.reduce((s, r) => s + r.totalAmount, 0)
  const otMonth = monthRuns.reduce((s, r) => s + r.entries.reduce((a, e) => a + e.overtimePay, 0), 0)
  const bonusMonth = monthRuns.reduce((s, r) => s + r.entries.reduce((a, e) => a + e.bonus, 0), 0)

  const cards = [
    { label: `Total Paid in ${monthName}`, value: totalMonth, sub: `${monthRuns.length} payroll runs`, emoji: '💵', color: 'bg-emerald-50 border-emerald-100', numColor: 'text-emerald-700' },
    { label: `Total Paid in ${thisYear}`, value: totalYear, sub: `${yearRuns.length} payroll runs`, emoji: '📅', color: 'bg-blue-50 border-blue-100', numColor: 'text-blue-700' },
    { label: `Overtime in ${monthName}`, value: otMonth, sub: 'overtime pay only', emoji: '⏱️', color: 'bg-amber-50 border-amber-100', numColor: 'text-amber-700' },
    { label: `Bonuses in ${monthName}`, value: bonusMonth, sub: 'bonus pay only', emoji: '🎁', color: 'bg-purple-50 border-purple-100', numColor: 'text-purple-700' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Simple Totals</h2>
        {dadMode && <p className="text-gray-500 text-xl mt-1">A quick look at what you've paid out.</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(card => (
          <div key={card.label} className={`rounded-2xl p-6 border ${card.color}`}>
            <div className="flex items-start justify-between mb-3">
              <p className={`text-gray-600 font-medium leading-snug ${dadMode ? 'text-lg' : 'text-base'}`}>{card.label}</p>
              <span className="text-2xl">{card.emoji}</span>
            </div>
            <p className={`font-bold ${card.numColor} ${dadMode ? 'text-4xl' : 'text-3xl'}`}>
              ${card.value.toFixed(2)}
            </p>
            <p className="text-gray-400 text-sm mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {payrollRuns.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <p className="text-4xl mb-3">📊</p>
          <p className={`text-gray-500 ${dadMode ? 'text-xl' : 'text-lg'}`}>No payroll data yet.</p>
          <p className="text-gray-400 text-base mt-1">Totals will appear here after your first saved payroll.</p>
        </div>
      )}
    </div>
  )
}
