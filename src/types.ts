export type PayType = 'hourly' | 'salary'

export type Page =
  | 'home'
  | 'employees'
  | 'enter-hours'
  | 'review-print'
  | 'past-payrolls'
  | 'simple-totals'
  | 'business-info'

export interface Employee {
  id: string
  name: string
  payType: PayType
  hourlyRate: number
  weeklySalary: number
  notes: string
  active: boolean
}

export interface PayrollEntry {
  employeeId: string
  employeeName: string
  payType: PayType
  hourlyRate: number
  weeklySalary: number
  regularHours: number
  overtimeHours: number
  bonus: number
  deduction: number
  regularPay: number
  overtimePay: number
  grossPay: number
  netPay: number
}

export interface PayrollRun {
  id: string
  weekOf: string
  dateSaved: string
  entries: PayrollEntry[]
  totalAmount: number
  employeeCount: number
}

export interface BusinessInfo {
  businessName: string
  ownerName: string
  dadMode: boolean
}
