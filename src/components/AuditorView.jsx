import EntryTypeBadge from './EntryTypeBadge'
import { truncateHash } from '../lib/hash'

export default function AuditorView({ entries, verification }) {
  const { results, brokenFromIndex } = verification
  const chainIntact = brokenFromIndex === -1

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Independent verification
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Every entry&rsquo;s hash is recomputed here from its current payload and compared against the hash
          recorded at submission time. This view trusts nothing it hasn&rsquo;t recalculated itself.
        </p>
      </div>

      <div
        className={`rounded-xl border p-5 text-sm font-semibold ${
          chainIntact
            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
            : 'border-red-300 bg-red-50 text-red-800'
        }`}
      >
        {chainIntact
          ? '✅ Chain intact, no tampering detected.'
          : `❌ Tampering detected at entry #${brokenFromIndex + 1}.`}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Entry
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Recorded hash
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Recomputed hash
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Result
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry, index) => {
                const result = results[index]
                const pass = result?.selfValid
                return (
                  <tr key={entry.id} className={pass ? undefined : 'bg-red-50'}>
                    <td className="px-4 py-3 text-sm font-mono text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <EntryTypeBadge type={entry.type} />
                        <span className="text-sm text-slate-700">{entry.actor}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">
                      {truncateHash(entry.entryHash, 12)}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">
                      {truncateHash(result?.recomputedEntryHash, 12)}
                    </td>
                    <td className="px-4 py-3">
                      {pass ? (
                        <span className="text-sm font-semibold text-emerald-600">✅ Pass</span>
                      ) : (
                        <span className="text-sm font-semibold text-red-600">❌ Fail</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
