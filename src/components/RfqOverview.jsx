import { RFQ, VENDORS } from '../data/scenario'

export default function RfqOverview({ entries }) {
  const submittedVendorIds = new Set(
    entries.filter((entry) => entry.type === 'BID_SUBMITTED').map((entry) => entry.payload.vendorId),
  )

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
        <div className="mb-1 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
          {RFQ.reference}
        </div>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">{RFQ.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{RFQ.description}</p>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-medium text-slate-500">Reference</dt>
            <dd className="mt-1 text-slate-900">{RFQ.reference}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Close date</dt>
            <dd className="mt-1 text-slate-900">{RFQ.closeDate}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Vendor status</h3>
        <ul className="mt-4 space-y-3">
          {VENDORS.map((vendor) => {
            const submitted = submittedVendorIds.has(vendor.id)
            return (
              <li key={vendor.id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">{vendor.name}</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                    submitted
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                      : 'bg-slate-100 text-slate-500 ring-slate-500/20'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${submitted ? 'bg-emerald-500' : 'bg-slate-400'}`}
                  />
                  {submitted ? 'Submitted' : 'Not submitted'}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
