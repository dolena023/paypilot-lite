import { supabase } from '../lib/supabase'
import type { Employee, PayrollRun, BusinessInfo } from '../types'

// ── Employees ────────────────────────────────────────────────────────────────

export async function fetchEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(r => ({
    id: r.id,
    name: r.name,
    payType: r.pay_type,
    hourlyRate: r.hourly_rate,
    weeklySalary: r.weekly_salary,
    notes: r.notes,
    active: r.active,
  }))
}

export async function persistEmployees(employees: Employee[]): Promise<void> {
  const { data: existing } = await supabase.from('employees').select('id')
  const existingIds = (existing ?? []).map(r => r.id as string)
  const keepIds = new Set(employees.map(e => e.id))

  // Delete removed employees
  for (const id of existingIds) {
    if (!keepIds.has(id)) {
      await supabase.from('employees').delete().eq('id', id)
    }
  }

  // Upsert current list
  if (employees.length > 0) {
    const { error } = await supabase.from('employees').upsert(
      employees.map(e => ({
        id: e.id,
        name: e.name,
        pay_type: e.payType,
        hourly_rate: e.hourlyRate,
        weekly_salary: e.weeklySalary,
        notes: e.notes,
        active: e.active,
      }))
    )
    if (error) throw error
  }
}

// ── Payroll Runs ─────────────────────────────────────────────────────────────

export async function fetchPayrollRuns(): Promise<PayrollRun[]> {
  const { data, error } = await supabase
    .from('payroll_runs')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(r => ({
    id: r.id,
    weekOf: r.week_of,
    dateSaved: r.date_saved,
    entries: r.entries,
    totalAmount: r.total_amount,
    employeeCount: r.employee_count,
  }))
}

export async function persistPayrollRun(run: PayrollRun): Promise<void> {
  const { error } = await supabase.from('payroll_runs').insert({
    id: run.id,
    week_of: run.weekOf,
    date_saved: run.dateSaved,
    entries: run.entries,
    total_amount: run.totalAmount,
    employee_count: run.employeeCount,
  })
  if (error) throw error
}

// ── Business Info ─────────────────────────────────────────────────────────────

export async function fetchBusinessInfo(): Promise<BusinessInfo> {
  const { data, error } = await supabase
    .from('business_info')
    .select('*')
    .eq('id', 1)
    .single()
  if (error) return { businessName: '', ownerName: '', dadMode: true }
  return {
    businessName: data.business_name,
    ownerName: data.owner_name,
    dadMode: data.dad_mode,
  }
}

export async function persistBusinessInfo(info: BusinessInfo): Promise<void> {
  const { error } = await supabase.from('business_info').upsert({
    id: 1,
    business_name: info.businessName,
    owner_name: info.ownerName,
    dad_mode: info.dadMode,
  })
  if (error) throw error
}
