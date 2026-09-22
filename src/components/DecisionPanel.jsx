import { useState } from 'react'
import { currency, formatDateTime } from '../lib/format'

export default function DecisionPanel({ entries, onSubmitDecision }) {
  const bidEntries = entries.filter((entry) => entry.type === 'BID_SUBMITTED')
  const decisionEntries = entries.filter((entry) => entry.type === 'DECISION_MADE')
  const latestDecision = decisionEntries[decisionEntries.length - 1]

  const [selectedVendorId, setSelectedVendorId] = useState(latestDecision?.payload.winnerVendorId ?? '')
  const [justification, setJustification] = useState('')

  const canSubmit = selectedVendorId && justification.trim().length > 0

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!canSubmit) return
    const winner = bidEntries.find((entry) => entry.payload.vendorId === selectedVendorId)
    onSubmitDecision({
      winnerVendorId: winner.payload.vendorId,
      winnerVendorName: winner.payload.vendorName,
      justification: justification.trim(),
    })
    setJustification('')
  }

  return (
    <div className="space-y-6">
      {latestDecision && (
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">Current decision</p>
          <p className="mt-1 text-sm font-semibold text-purple-900">
            Awarded to {latestDecision.payload.winnerVendorName}
          </p>
          <p className="mt-1 text-sm text-purple-800">&ldquo;{latestDecision.payload.justification}&rdquo;</p>
          <p className="mt-2 text-xs text-purple-500">
            Recorded {formatDateTime(latestDecision.timestamp)}
            {decisionEntries.length > 1 ? ` · revision ${decisionEntries.length}` : ''}
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Vendor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Delivery
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Note
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bidEntries.map((entry) => {
                const isSelected = selectedVendorId === entry.payload.vendorId
                return (
                  <tr key={entry.id} className={isSelected ? 'bg-purple-50' : undefined}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {entry.payload.vendorName}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">{currency.format(entry.payload.price)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{entry.payload.delivery}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{entry.payload.note}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedVendorId(entry.payload.vendorId)}
                        className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                          isSelected
                            ? 'bg-purple-700 text-white'
                            : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select as winner'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Record decision</h3>
        <p className="mt-1 text-sm text-slate-500">
          Select a winner above, then add a short justification for the audit record.
        </p>
        <textarea
          value={justification}
          onChange={(event) => setJustification(event.target.value)}
          rows={3}
          placeholder="e.g. Best balance of price and delivery lead time for this scope."
          className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-4 rounded-md bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {latestDecision ? 'Record revised decision' : 'Record decision'}
        </button>
      </form>
    </div>
  )
}
