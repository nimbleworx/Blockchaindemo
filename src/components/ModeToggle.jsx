export default function ModeToggle({ isBlockchain, onChange }) {
  return (
    <div className="flex flex-col items-center gap-2 sm:items-end">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Demo mode
      </span>
      <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            !isBlockchain
              ? 'bg-slate-700 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Without Blockchain
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            isBlockchain ? 'bg-emerald-700 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          With Blockchain
        </button>
      </div>
    </div>
  )
}
