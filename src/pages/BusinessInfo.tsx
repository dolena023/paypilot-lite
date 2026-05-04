import { useState } from 'react'
import type { BusinessInfo } from '../types'

interface Props {
  businessInfo: BusinessInfo
  onSave: (info: BusinessInfo) => void
  dadMode: boolean
}

export default function BusinessInfoPage({ businessInfo, onSave, dadMode }: Props) {
  const [form, setForm] = useState<BusinessInfo>({ ...businessInfo })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const ts = dadMode ? 'text-xl' : 'text-base'
  const inputCls = `w-full border-2 border-gray-200 rounded-xl px-4 bg-gray-50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors ${dadMode ? 'py-4 text-xl' : 'py-3 text-base'}`

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Business Info</h2>
        {dadMode && <p className="text-gray-500 text-xl mt-1">Your business details and app settings.</p>}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div>
          <label className={`block font-semibold text-gray-700 mb-1.5 ${ts}`}>Business Name</label>
          <input type="text" value={form.businessName}
            onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
            className={inputCls} placeholder="e.g. Smith's Landscaping" />
        </div>

        <div>
          <label className={`block font-semibold text-gray-700 mb-1.5 ${ts}`}>Your Name</label>
          <input type="text" value={form.ownerName}
            onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))}
            className={inputCls} placeholder="Your first and last name" />
          <p className="text-gray-400 text-sm mt-1">This shows as "Welcome, [Your Name]" in the header.</p>
        </div>

        {/* Dad Mode toggle */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`font-bold text-gray-800 ${dadMode ? 'text-xl' : 'text-lg'}`}>Dad Mode</p>
              <p className={`text-gray-500 mt-0.5 ${dadMode ? 'text-base' : 'text-sm'}`}>
                Bigger buttons, larger text, plain English
              </p>
            </div>
            <button
              onClick={() => setForm(f => ({ ...f, dadMode: !f.dadMode }))}
              aria-label="Toggle Dad Mode"
              className={`relative inline-flex items-center rounded-full flex-shrink-0 transition-colors focus:outline-none
                ${form.dadMode ? 'bg-emerald-600' : 'bg-gray-300'} w-16 h-9`}
            >
              <span className={`inline-block w-7 h-7 bg-white rounded-full shadow-sm transition-transform
                ${form.dadMode ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>
          <p className={`mt-3 font-medium ${form.dadMode ? 'text-emerald-600' : 'text-gray-400'} ${dadMode ? 'text-base' : 'text-sm'}`}>
            {form.dadMode ? '✅ Dad Mode is ON — large text, big buttons' : '⬜ Dad Mode is OFF'}
          </p>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-xl">✅</span>
            <p className={`text-emerald-700 font-semibold ${dadMode ? 'text-xl' : 'text-lg'}`}>Saved!</p>
          </div>
        )}

        <button
          onClick={handleSave}
          className={`bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors ${dadMode ? 'py-4 px-8 text-xl' : 'py-3 px-6 text-base'}`}
        >
          Save Business Info
        </button>
      </div>

      <div className="bg-gray-100 rounded-xl p-4">
        <p className={`text-gray-500 text-center ${dadMode ? 'text-base' : 'text-sm'}`}>
          This app helps you calculate and track payroll. It does not file taxes or send payments.
        </p>
      </div>
    </div>
  )
}
