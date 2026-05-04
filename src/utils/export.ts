import type { PayrollEntry, PayrollRun } from '../types'

function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportWeeklyPayrollCSV(entries: PayrollEntry[], weekOf: string): void {
  const headers = [
    'Employee',
    'Pay Type',
    'Regular Hours',
    'Overtime Hours',
    'Regular Pay',
    'Overtime Pay',
    'Bonus',
    'Deduction',
    'Total Check',
  ]
  const rows = entries.map(e => [
    e.employeeName,
    e.payType,
    e.payType === 'hourly' ? e.regularHours : 'Salary',
    e.payType === 'hourly' ? e.overtimeHours : '0',
    e.regularPay.toFixed(2),
    e.overtimePay.toFixed(2),
    e.bonus.toFixed(2),
    e.deduction.toFixed(2),
    e.netPay.toFixed(2),
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  downloadCSV(csv, `payroll-week-of-${weekOf}.csv`)
}

export function exportPayrollHistoryCSV(runs: PayrollRun[]): void {
  const headers = ['Week Of', 'Date Saved', 'Number of Employees', 'Total Paid']
  const rows = runs.map(r => [r.weekOf, r.dateSaved, r.employeeCount, r.totalAmount.toFixed(2)])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  downloadCSV(csv, 'payroll-history.csv')
}
