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

  const totalThisMonth = monthRuns.reduce((sum, r) => sum + r.totalAmount, 0)
  const totalThisYear = yearRuns.reduce((sum, r) => sum + r.totalAmount, 0)
  const overtimeThisMonth = monthRuns.reduce(
    (sum, r) => sum + r.entries.reduce((s, e) => s + e.overtimePay, 0),
    0
  )
  const bonusesThisMonth = monthRuns.reduce(
    (sum, r) => sum + r.entries.reduce((s, e) => s + e.bonus, 0),
    0
  )

  const cards = [
    {
      label: `Total Paid in ${monthName}`,
      value: totalThisMonth,
      color: 'text-green-700',
      bg: 'bg-green-50 border-green-100',
    },
    {
      label: `Total Paid in ${thisYear}`,
      value: totalThisYear,
      color: 'text-blue-700',
      bg: 'bg-blue-50 border-blue-100',
    },
    {
      label: `Overtime Paid in ${monthName}`,
      value: overtimeThisMonth,
      color: 'text-orange-700',
      bg: 'bg-orange-50 border-orange-100',
    },
    {
      label: `Bonuses Paid in ${monthName}`,
      value: bonusesThisMonth,
      color: 'text-purple-700',
      bg: 'bg-purple-50 border-purple-100',
    },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className={`font-bold text-gray-800 ${dadMode ? 'text-4xl' : 'text-3xl'}`}>Simple Totals</h2>
        {dadMode && <p className="text-gray-500 text-xl mt-1">A quick look at what you've paid out.</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(card => (
          <div key={card.label} className={`rounded-2xl p-6 border ${card.bg}`}>
            <p className={`text-gray-600 mb-2 ${dadMode ? 'text-xl' : 'text-lg'}`}>{card.label}</p>
            <p className={`font-bold ${card.color} ${dadMode ? 'text-4xl' : 'text-3xl'}`}>
              ${card.value.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {payrollRuns.length === 0 && (
        <div className="mt-6 bg-gray-100 rounded-2xl p-6 text-center">
          <p className={`text-gray-500 ${dadMode ? 'text-xl' : 'text-lg'}`}>
            Totals will appear here once you save your first payroll.
          </p>
        </div>
      )}
    </div>
  )
}
