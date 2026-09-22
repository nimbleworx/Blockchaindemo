const STYLES = {
  RFQ_ISSUED: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  BID_SUBMITTED: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  DECISION_MADE: 'bg-purple-50 text-purple-700 ring-purple-600/20',
}

const LABELS = {
  RFQ_ISSUED: 'RFQ Issued',
  BID_SUBMITTED: 'Bid Submitted',
  DECISION_MADE: 'Decision Made',
}

export default function EntryTypeBadge({ type }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[type]}`}
    >
      {LABELS[type]}
    </span>
  )
}
