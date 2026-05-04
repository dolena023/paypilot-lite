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

const emptyForm: FormState = {
  name: '',
  payType: 'hourly',
  hourlyRate: '',
  weeklySalary: '',
  notes: '',
}

export default function EmployeeList({ employees, onSave, dadMode }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<string[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const activeEmployees = employees.filter(e => e.active)
  const inactiveEmployees = employees.filter(e => !e.active)

  const textSize = dadMode ? 'text-xl' : 'text-base'
  const btnBase = `rounded-xl font-semibold transition-colors ${dadMode ? 'px-5 py-3 text-lg' : 'px-4 py-2 text-base'}`
  const inputClass = `w-full border-2 border-gray-300 rounded-xl px-4 focus:outline-none focus:border-blue-500 ${dadMode ? 'py-4 text-xl' : 'py-3 text-lg'}`

  function validate(): string[] {
    const errs: string[] = []
    if (!form.name.trim()) errs.push('Employee name is required.')
    if (form.payType === 'hourly') {
      const rate = parseFloat(form.hourlyRate)
      if (!form.hourlyRate || isNaN(rate) || rate <= 0)
        errs.push('Hourly rate must be a positive number.')
    } else {
      const sal = parseFloat(form.weeklySalary)
      if (!form.weeklySalary || isNaN(sal) || sal <= 0)
        errs.push('Weekly salary must be a positive number.')
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

    let updated: Employee[]
    if (editingId) {
      updated = employees.map(e => e.id === editingId ? { ...e, ...data } : e)
    } else {
      updated = [...employees, { id: Date.now().toString(), ...data }]
    }
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
  }

  function handleCancel() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setErrors([])
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className={`font-bold text-gray-800 ${dadMode ? 'text-4xl' : 'text-3xl'}`}>Employee List</h2>
          {dadMode && <p className="text-gray-500 text-xl mt-1">Add and manage your workers here.</p>}
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm) }}
            className={`bg-green-600 hover:bg-green-700 text-white ${btnBase}`}
          >
            + Add Employee
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className={`font-bold text-gray-800 mb-5 ${dadMode ? 'text-2xl' : 'text-xl'}`}>
            {editingId ? 'Edit Employee' : 'New Employee'}
          </h3>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              {errors.map((e, i) => (
                <p key={i} className="text-red-700 text-lg">{e}</p>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className={`block font-semibold text-gray-700 mb-1 ${textSize}`}>Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className={inputClass}
                placeholder="Employee full name"
              />
            </div>

            <div>
              <label className={`block font-semibold text-gray-700 mb-2 ${textSize}`}>Pay Type *</label>
              <div className="flex gap-6">
                {(['hourly', 'salary'] as const).map(pt => (
                  <label key={pt} className={`flex items-center gap-3 cursor-pointer ${textSize}`}>
                    <input
                      type="radio"
                      name="payType"
                      value={pt}
                      checked={form.payType === pt}
                      onChange={() => setForm(f => ({ ...f, payType: pt }))}
                      className="w-5 h-5"
                    />
                    {pt === 'hourly' ? 'Hourly' : 'Salary (Weekly)'}
                  </label>
                ))}
              </div>
            </div>

            {form.payType === 'hourly' ? (
              <div>
                <label className={`block font-semibold text-gray-700 mb-1 ${textSize}`}>Hourly Rate ($) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.hourlyRate}
                  onChange={e => setForm(f => ({ ...f, hourlyRate: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. 15.00"
                />
              </div>
            ) : (
              <div>
                <label className={`block font-semibold text-gray-700 mb-1 ${textSize}`}>Weekly Salary ($) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.weeklySalary}
                  onChange={e => setForm(f => ({ ...f, weeklySalary: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. 800.00"
                />
              </div>
            )}

            <div>
              <label className={`block font-semibold text-gray-700 mb-1 ${textSize}`}>Notes (optional)</label>
              <input
                type="text"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className={inputClass}
                placeholder="Any notes about this employee"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleSubmit} className={`bg-blue-600 hover:bg-blue-700 text-white ${btnBase}`}>
                {editingId ? 'Save Changes' : 'Add Employee'}
              </button>
              <button onClick={handleCancel} className={`bg-gray-200 hover:bg-gray-300 text-gray-700 ${btnBase}`}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {activeEmployees.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <p className={`text-gray-500 ${dadMode ? 'text-xl' : 'text-lg'}`}>
            No employees yet. Click "+ Add Employee" to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeEmployees.map(emp => (
            <div key={emp.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className={`font-bold text-gray-800 ${dadMode ? 'text-2xl' : 'text-xl'}`}>{emp.name}</p>
                  <p className={`text-gray-500 mt-0.5 ${dadMode ? 'text-lg' : 'text-base'}`}>
                    {emp.payType === 'hourly'
                      ? `$${emp.hourlyRate.toFixed(2)}/hr`
                      : `$${emp.weeklySalary.toFixed(2)}/week (salary)`}
                    {emp.notes && ` · ${emp.notes}`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(emp)}
                    className={`bg-blue-100 hover:bg-blue-200 text-blue-700 ${btnBase}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onSave(employees.map(e => e.id === emp.id ? { ...e, active: false } : e))}
                    className={`bg-yellow-100 hover:bg-yellow-200 text-yellow-700 ${btnBase}`}
                  >
                    Make Inactive
                  </button>
                  {deleteConfirm === emp.id ? (
                    <>
                      <button
                        onClick={() => { onSave(employees.filter(e => e.id !== emp.id)); setDeleteConfirm(null) }}
                        className={`bg-red-600 hover:bg-red-700 text-white ${btnBase}`}
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className={`bg-gray-200 hover:bg-gray-300 text-gray-700 ${btnBase}`}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(emp.id)}
                      className={`bg-red-100 hover:bg-red-200 text-red-700 ${btnBase}`}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {inactiveEmployees.length > 0 && (
        <div className="mt-8">
          <h3 className={`font-semibold text-gray-500 mb-3 ${dadMode ? 'text-xl' : 'text-lg'}`}>
            Inactive Employees
          </h3>
          <div className="space-y-2">
            {inactiveEmployees.map(emp => (
              <div
                key={emp.id}
                className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-200"
              >
                <p className={`text-gray-500 ${dadMode ? 'text-xl' : 'text-lg'}`}>{emp.name}</p>
                <button
                  onClick={() => onSave(employees.map(e => e.id === emp.id ? { ...e, active: true } : e))}
                  className={`bg-green-100 hover:bg-green-200 text-green-700 ${btnBase}`}
                >
                  Make Active
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
