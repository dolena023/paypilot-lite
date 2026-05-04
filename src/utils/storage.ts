import type { Employee, PayrollRun, BusinessInfo } from '../types'

const KEYS = {
  EMPLOYEES: 'paypilot_employees',
  PAYROLL_RUNS: 'paypilot_payroll_runs',
  BUSINESS_INFO: 'paypilot_business_info',
}

// ── Employees ─────────────────────────────────────────────────────────────────

export async function fetchEmployees(): Promise<Employee[]> {
  const data = localStorage.getItem(KEYS.EMPLOYEES)
  return data ? (JSON.parse(data) as Employee[]) : []
}

export async function persistEmployees(employees: Employee[]): Promise<void> {
  localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees))
}

// ── Payroll Runs ──────────────────────────────────────────────────────────────

export async function fetchPayrollRuns(): Promise<PayrollRun[]> {
  const data = localStorage.getItem(KEYS.PAYROLL_RUNS)
  return data ? (JSON.parse(data) as PayrollRun[]) : []
}

export async function persistPayrollRun(run: PayrollRun): Promise<void> {
  const existing = await fetchPayrollRuns()
  localStorage.setItem(KEYS.PAYROLL_RUNS, JSON.stringify([...existing, run]))
}

// ── Business Info ─────────────────────────────────────────────────────────────

export async function fetchBusinessInfo(): Promise<BusinessInfo> {
  const data = localStorage.getItem(KEYS.BUSINESS_INFO)
  return data
    ? (JSON.parse(data) as BusinessInfo)
    : { businessName: '', ownerName: '', dadMode: true }
}

export async function persistBusinessInfo(info: BusinessInfo): Promise<void> {
  localStorage.setItem(KEYS.BUSINESS_INFO, JSON.stringify(info))
}
