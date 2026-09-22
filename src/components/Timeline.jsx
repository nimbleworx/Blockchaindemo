import EntryTypeBadge from './EntryTypeBadge'
import { currency, formatDateTime } from '../lib/format'
import { truncateHash } from '../lib/hash'

function describePayload(entry) {
  switch (entry.type) {
    case 'RFQ_ISSUED':
      return `${entry.payload.reference} — ${entry.payload.title}`
    case 'BID_SUBMITTED':
      return `${entry.payload.vendorName} submitted ${currency.format(entry.payload.price)}, ${entry.payload.delivery}`
    case 'DECISION_MADE':
      return `Awarded to ${entry.payload.winnerVendorName} — "${entry.payload.justification}"`
    default:
      return ''
  }
}

export default function Timeline({ entries, isBlockchain, verification }) {
  const brokenFromIndex = verification?.brokenFromIndex ?? -1

  return (
    <div className="space-y-4">
      {isBlockchain && brokenFromIndex !== -1 && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">
            Tamper detected: entry #{brokenFromIndex + 1} no longer matches its recorded hash.
          </p>
          <p className="mt-1 text-sm text-red-700">
            Every entry from #{brokenFromIndex + 1} onward can no longer be trusted as an unbroken record.
          </p>
        </div>
      )}

      <ol className="space-y-3">
        {entries.map((entry, index) => {
          const broken = isBlockchain && brokenFromIndex !== -1 && index >= brokenFromIndex
          return (
            <li
              key={entry.id}
              className={`rounded-xl border p-4 shadow-sm ${
                broken ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">#{index + 1}</span>
                  <EntryTypeBadge type={entry.type} />
                  <span className="text-sm font-medium text-slate-800">{entry.actor}</span>
                </div>
                <span className="text-xs text-slate-500">{formatDateTime(entry.timestamp)}</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{describePayload(entry)}</p>

              {isBlockchain && (
                <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-xs font-mono text-slate-500">
                  <span>hash: {truncateHash(entry.entryHash)}</span>
                  <span>prev: {truncateHash(entry.previousHash)}</span>
                  {entry.locked && <span className="font-sans font-medium text-slate-400">🔒 locked</span>}
                  <span
                    className={`ml-auto font-sans font-semibold ${broken ? 'text-red-600' : 'text-emerald-600'}`}
                  >
                    {broken ? '❌ Chain broken' : '✅ Chain intact'}
                  </span>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
