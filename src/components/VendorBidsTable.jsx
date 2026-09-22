import { useState } from 'react'
import { currency, formatDateTime } from '../lib/format'

function HashStatus({ broken }) {
  if (broken) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-600">
        ❌ Broken
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
      ✅ Verified
    </span>
  )
}

function BidRow({ entry, entryIndex, isBlockchain, broken, onUpdatePrice }) {
  const [rowState, setRowState] = useState('idle') // idle | editing | blocked | force-editing
  const [draftPrice, setDraftPrice] = useState(String(entry.payload.price))

  const beginEdit = () => {
    setDraftPrice(String(entry.payload.price))
    if (isBlockchain && entry.locked) {
      setRowState('blocked')
    } else {
      setRowState('editing')
    }
  }

  const cancel = () => {
    setRowState('idle')
    setDraftPrice(String(entry.payload.price))
  }

  const save = (force) => {
    const parsed = Number(draftPrice)
    if (Number.isNaN(parsed) || parsed <= 0) return
    onUpdatePrice(entry.id, parsed, { force })
    setRowState('idle')
  }

  return (
    <>
      <tr className={broken ? 'bg-red-50' : undefined}>
        <td className="px-4 py-3 text-sm font-medium text-slate-900">{entry.payload.vendorName}</td>
        <td className="px-4 py-3 text-sm text-slate-900">{currency.format(entry.payload.price)}</td>
        <td className="px-4 py-3 text-sm text-slate-600">{entry.payload.delivery}</td>
        <td className="px-4 py-3 text-sm text-slate-600">{formatDateTime(entry.timestamp)}</td>
        <td className="px-4 py-3 text-sm text-slate-600">Submitted</td>
        {isBlockchain && (
          <td className="px-4 py-3">
            <HashStatus broken={broken} />
          </td>
        )}
        <td className="px-4 py-3 text-right">
          <button
            type="button"
            onClick={beginEdit}
            className="text-xs font-medium text-slate-500 underline decoration-dotted underline-offset-2 hover:text-slate-800"
          >
            Simulate buyer editing this price after submission
          </button>
        </td>
      </tr>

      {rowState !== 'idle' && (
        <tr className={broken ? 'bg-red-50' : 'bg-slate-50'}>
          <td colSpan={isBlockchain ? 7 : 6} className="px-4 py-4">
            {rowState === 'blocked' && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-800">
                  This entry is locked and chained. Editing it would break the chain.
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  Entry #{entryIndex + 1} was hashed and sealed when {entry.payload.vendorName} submitted this
                  bid. Its price cannot be changed in place without invalidating its recorded hash.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={cancel}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setRowState('force-editing')}
                    className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                    Force edit anyway (simulate an attack)
                  </button>
                </div>
              </div>
            )}

            {(rowState === 'editing' || rowState === 'force-editing') && (
              <div className="flex flex-wrap items-end gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500">New price (AUD)</span>
                  <input
                    type="number"
                    value={draftPrice}
                    onChange={(event) => setDraftPrice(event.target.value)}
                    className="w-40 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => save(rowState === 'force-editing')}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold text-white ${
                    rowState === 'force-editing'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {rowState === 'force-editing' ? 'Force save (will break the chain)' : 'Save edit'}
                </button>
                <button
                  type="button"
                  onClick={cancel}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                {rowState === 'force-editing' && (
                  <span className="text-xs font-medium text-red-600">
                    This bypasses the lock and will not recompute the entry&rsquo;s hash.
                  </span>
                )}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  )
}

export default function VendorBidsTable({ entries, isBlockchain, verification, onUpdatePrice }) {
  const bidEntries = entries
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => entry.type === 'BID_SUBMITTED')

  const brokenFromIndex = verification?.brokenFromIndex ?? -1

  return (
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
                Submitted At
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              {isBlockchain && (
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Hash Status
                </th>
              )}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bidEntries.map(({ entry, index }) => (
              <BidRow
                key={entry.id}
                entry={entry}
                entryIndex={index}
                isBlockchain={isBlockchain}
                broken={isBlockchain && brokenFromIndex !== -1 && index >= brokenFromIndex}
                onUpdatePrice={onUpdatePrice}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
