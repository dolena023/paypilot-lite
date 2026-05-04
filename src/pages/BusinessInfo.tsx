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

  const textSize = dadMode ? 'text-xl' : 'text-base'
  const inputClass = `w-full border-2 border-gray-300 rounded-xl px-4 focus:outline-none focus:border-blue-500 ${dadMode ? 'py-4 text-xl' : 'py-3 text-lg'}`

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className={`font-bold text-gray-800 ${dadMode ? 'text-4xl' : 'text-3xl'}`}>Business Info</h2>
        {dadMode && <p className="text-gray-500 text-xl mt-1">Your business details and app settings.</p>}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div>
          <label className={`block font-semibold text-gray-700 mb-1 ${textSize}`}>Business Name</label>
          <input
            type="text"
            value={form.businessName}
            onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
            className={inputClass}
            placeholder="e.g. Smith's Landscaping"
          />
        </div>

        <div>
          <label className={`block font-semibold text-gray-700 mb-1 ${textSize}`}>Owner Name</label>
          <input
            type="text"
            value={form.ownerName}
            onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))}
            className={inputClass}
            placeholder="Your name"
          />
        </div>

        {/* Dad Mode toggle */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`font-bold text-gray-800 ${dadMode ? 'text-2xl' : 'text-xl'}`}>Dad Mode</p>
              <p className={`text-gray-600 mt-1 ${dadMode ? 'text-lg' : 'text-base'}`}>
                Bigger buttons, larger text, plain language
              </p>
            </div>
            <button
              onClick={() => setForm(f => ({ ...f, dadMode: !f.dadMode }))}
              aria-label="Toggle Dad Mode"
              className={`relative inline-flex items-center rounded-full flex-shrink-0 transition-colors focus:outline-none ${
                form.dadMode ? 'bg-blue-600' : 'bg-gray-300'
              } w-16 h-9`}
            >
              <span
                className={`inline-block w-7 h-7 bg-white rounded-full shadow transition-transform ${
                  form.dadMode ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className={`mt-3 font-medium ${form.dadMode ? 'text-blue-600' : 'text-gray-400'} ${dadMode ? 'text-lg' : 'text-base'}`}>
            {form.dadMode ? '✅ Dad Mode is ON' : '⬜ Dad Mode is OFF'}
          </p>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className={`text-green-700 font-semibold ${dadMode ? 'text-xl' : 'text-lg'}`}>✅ Saved!</p>
          </div>
        )}

        <button
          onClick={handleSave}
          className={`bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors ${
            dadMode ? 'py-4 px-8 text-xl' : 'py-3 px-6 text-lg'
          }`}
        >
          Save Business Info
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-xl">
        <p className={`text-gray-500 text-center ${dadMode ? 'text-lg' : 'text-base'}`}>
          This app helps you calculate and track payroll. It does not file taxes or send payments.
        </p>
      </div>
    </div>
  )
}
