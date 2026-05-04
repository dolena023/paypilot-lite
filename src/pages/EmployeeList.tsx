import { useState } from 'react'
import type { Employee } from '../types'

interface Props {
  employees: Employee[]
  onSave: (employees: Employee[]) => void
  dadMode: boolean
}

interface FormState {
  name: string
  payType: 'hourly' | 'salary'
  hourlyRate: string
  weeklySalary: string
  notes: string
}

const emptyForm: FormState = { name: '', payType: 'hourly', hourlyRate: '', weeklySalary: '', notes: '' }

export default function EmployeeList({ employees, onSave, dadMode }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<string[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const active = employees.filter(e => e.active)
  const inactive = employees.filter(e => !e.active)

  const ts = dadMode ? 'text-xl' : 'text-base'
  const inputCls = `w-full border-2 border-gray-200 rounded-xl px-4 focus:outline-none focus:border-emerald-500 transition-colors bg-gray-50 focus:bg-white ${dadMode ? 'py-4 text-xl' : 'py-3 text-base'}`
  const btnSm = `rounded-lg font-semibold transition-colors text-sm px-3 py-2`

  function validate(): string[] {
    const errs: string[] = []
    if (!form.name.trim()) errs.push('Employee name is required.')
    if (form.payType === 'hourly') {
      const r = parseFloat(form.hourlyRate)
      if (!form.hourlyRate || isNaN(r) || r <= 0) errs.push('Hourly rate must be a positive number.')
    } else {
      const s = parseFloat(form.weeklySalary)
      if (!form.weeklySalary || isNaN(s) || s <= 0) errs.push('Weekly salary must be a positive number.')
    }
    return errs
  }

  function handleSubmit() {
    const errs = validate()
    if (errs.length > 0) { setErrors(errs); return }
    setErrors([])
    const data = {
      name: form.name.trim(),
      payType: form.payType,
      hourlyRate: parseFloat(form.hourlyRate) || 0,
      weeklySalary: parseFloat(form.weeklySalary) || 0,
      notes: form.notes.trim(),
      active: true,
    }
    const updated = editingId
      ? employees.map(e => e.id === editingId ? { ...e, ...data } : e)
      : [...employees, { id: Date.now().toString(), ...data }]
    onSave(updated)
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  function handleEdit(emp: Employee) {
    setEditingId(emp.id)
    setForm({
      name: emp.name,
      payType: emp.payType,
      hourlyRate: emp.hourlyRate > 0 ? emp.hourlyRate.toString() : '',
      weeklySalary: emp.weeklySalary > 0 ? emp.weeklySalary.toString() : '',
      notes: emp.notes,
    })
    setErrors([])
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancel() {
    setShowForm(false); setEditingId(null); setForm(emptyForm); setErrors([])
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Employee List</h2>
          {dadMode && <p className={`text-gray-500 mt-1 ${ts}`}>Add and manage your workers here.</p>}
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm) }}
            className={`bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors ${dadMode ? 'px-5 py-3 text-lg' : 'px-4 py-2.5 text-base'}`}
          >
            + Add Employee
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className={`font-bold text-gray-800 mb-5 ${dadMode ? 'text-2xl' : 'text-xl'}`}>
            {editingId ? '✏️ Edit Employee' : '➕ New Employee'}
          </h3>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              {errors.map((e, i) => <p key={i} className={`text-red-700 ${ts}`}>{e}</p>)}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className={`block font-semibold text-gray-700 mb-1.5 ${ts}`}>Full Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className={inputCls} placeholder="Employee full name" />
            </div>

            <div>
              <label className={`block font-semibold text-gray-700 mb-2 ${ts}`}>Pay Type *</label>
              <div className="flex gap-4">
                {(['hourly', 'salary'] as const).map(pt => (
                  <label key={pt} className={`flex items-center gap-3 cursor-pointer ${ts}`}>
                    <input type="radio" name="payType" value={pt} checked={form.payType === pt}
                      onChange={() => setForm(f => ({ ...f, payType: pt }))} className="w-5 h-5 accent-emerald-600" />
                    {pt === 'hourly' ? 'Hourly' : 'Weekly Salary'}
                  </label>
                ))}
              </div>
            </div>

            {form.payType === 'hourly' ? (
              <div>
                <label className={`block font-semibold text-gray-700 mb-1.5 ${ts}`}>Hourly Rate ($) *</label>
                <input type="number" min="0" step="0.01" value={form.hourlyRate}
                  onChange={e => setForm(f => ({ ...f, hourlyRate: e.target.value }))}
                  className={inputCls} placeholder="e.g. 15.00" />
              </div>
            ) : (
              <div>
                <label className={`block font-semibold text-gray-700 mb-1.5 ${ts}`}>Weekly Salary ($) *</label>
                <input type="number" min="0" step="0.01" value={form.weeklySalary}
                  onChange={e => setForm(f => ({ ...f, weeklySalary: e.target.value }))}
                  className={inputCls} placeholder="e.g. 800.00" />
              </div>
            )}

            <div>
              <label className={`block font-semibold text-gray-700 mb-1.5 ${ts}`}>Notes (optional)</label>
              <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className={inputCls} placeholder="Any notes about this employee" />
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={handleSubmit}
                className={`bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors ${dadMode ? 'px-6 py-3.5 text-lg' : 'px-5 py-2.5 text-base'}`}>
                {editingId ? 'Save Changes' : 'Add Employee'}
              </button>
              <button onClick={cancel}
                className={`bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors ${dadMode ? 'px-6 py-3.5 text-lg' : 'px-5 py-2.5 text-base'}`}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active employees */}
      {active.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <p className="text-4xl mb-3">👥</p>
          <p className={`text-gray-500 ${dadMode ? 'text-xl' : 'text-lg'}`}>No employees yet.</p>
          <p className="text-gray-400 text-base mt-1">Click "+ Add Employee" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map(emp => (
            <div key={emp.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700 text-lg flex-shrink-0">
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-gray-800 ${dadMode ? 'text-xl' : 'text-lg'}`}>{emp.name}</p>
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">Active</span>
                    </div>
                    <p className={`text-gray-500 ${dadMode ? 'text-base' : 'text-sm'}`}>
                      {emp.payType === 'hourly' ? `$${emp.hourlyRate.toFixed(2)}/hr` : `$${emp.weeklySalary.toFixed(2)}/week (salary)`}
                      {emp.notes && ` · ${emp.notes}`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleEdit(emp)} className={`bg-blue-50 hover:bg-blue-100 text-blue-700 ${btnSm}`}>Edit</button>
                  <button onClick={() => onSave(employees.map(e => e.id === emp.id ? { ...e, active: false } : e))}
                    className={`bg-amber-50 hover:bg-amber-100 text-amber-700 ${btnSm}`}>Make Inactive</button>
                  {deleteConfirm === emp.id ? (
                    <>
                      <button onClick={() => { onSave(employees.filter(e => e.id !== emp.id)); setDeleteConfirm(null) }}
                        className={`bg-red-600 hover:bg-red-700 text-white ${btnSm}`}>Yes, Delete</button>
                      <button onClick={() => setDeleteConfirm(null)}
                        className={`bg-gray-100 hover:bg-gray-200 text-gray-600 ${btnSm}`}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => setDeleteConfirm(emp.id)}
                      className={`bg-red-50 hover:bg-red-100 text-red-700 ${btnSm}`}>Delete</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inactive employees */}
      {inactive.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Inactive Employees</p>
          <div className="space-y-2">
            {inactive.map(emp => (
              <div key={emp.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm">
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={`text-gray-500 font-medium ${dadMode ? 'text-lg' : 'text-base'}`}>{emp.name}</p>
                    <span className="bg-gray-200 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">Inactive</span>
                  </div>
                </div>
                <button onClick={() => onSave(employees.map(e => e.id === emp.id ? { ...e, active: true } : e))}
                  className={`bg-emerald-100 hover:bg-emerald-200 text-emerald-700 ${btnSm}`}>Make Active</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
