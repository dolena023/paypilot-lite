import type { Employee, PayrollEntry } from '../types'

export function calculateRegularPay(employee: Employee, regularHours: number): number {
  if (employee.payType === 'salary') return employee.weeklySalary
  return Math.max(0, Math.min(regularHours, 40)) * employee.hourlyRate
}

export function calculateOvertimePay(employee: Employee, overtimeHours: number): number {
  if (employee.payType === 'salary') return 0
  return Math.max(0, overtimeHours) * employee.hourlyRate * 1.5
}

export function calculateGrossPay(regularPay: number, overtimePay: number, bonus: number): number {
  return regularPay + overtimePay + Math.max(0, bonus)
}

export function calculateNetPay(grossPay: number, deduction: number): number {
  return Math.max(0, grossPay - Math.max(0, deduction))
}

export function calculatePayrollTotals(entries: PayrollEntry[]): number {
  return entries.reduce((sum, e) => sum + e.netPay, 0)
}

export function buildEntry(
  employee: Employee,
  fields: { regularHours: number; overtimeHours: number; bonus: number; deduction: number }
): PayrollEntry {
  const regularPay = calculateRegularPay(employee, fields.regularHours)
  const overtimePay = calculateOvertimePay(employee, fields.overtimeHours)
  const grossPay = calculateGrossPay(regularPay, overtimePay, fields.bonus)
  const netPay = calculateNetPay(grossPay, fields.deduction)
  return {
    employeeId: employee.id,
    employeeName: employee.name,
    payType: employee.payType,
    hourlyRate: employee.hourlyRate,
    weeklySalary: employee.weeklySalary,
    regularHours: fields.regularHours,
    overtimeHours: fields.overtimeHours,
    bonus: fields.bonus,
    deduction: fields.deduction,
    regularPay,
    overtimePay,
    grossPay,
    netPay,
  }
}

export function mergeEntries(employees: Employee[], existingEntries: PayrollEntry[]): PayrollEntry[] {
  return employees
    .filter(e => e.active)
    .map(emp => {
      const existing = existingEntries.find(e => e.employeeId === emp.id)
      if (existing) {
        return buildEntry(emp, {
          regularHours: existing.regularHours,
          overtimeHours: existing.overtimeHours,
          bonus: existing.bonus,
          deduction: existing.deduction,
        })
      }
      return buildEntry(emp, { regularHours: 0, overtimeHours: 0, bonus: 0, deduction: 0 })
    })
}
