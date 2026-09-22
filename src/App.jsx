import { useEffect, useMemo, useState } from 'react'
import ModeToggle from './components/ModeToggle'
import RfqOverview from './components/RfqOverview'
import VendorBidsTable from './components/VendorBidsTable'
import DecisionPanel from './components/DecisionPanel'
import Timeline from './components/Timeline'
import AuditorView from './components/AuditorView'
import { buildInitialEntries, createEntry } from './lib/entries'
import { verifyEntries } from './lib/verify'
import { GENESIS_HASH } from './lib/hash'

const TABS = [
  { id: 'overview', label: 'RFQ Overview' },
  { id: 'bids', label: 'Vendor Bids' },
  { id: 'decision', label: 'Decision Panel' },
  { id: 'timeline', label: 'Timeline / Audit Log' },
  { id: 'auditor', label: 'Auditor View', blockchainOnly: true },
]

export default function App() {
  const [isBlockchain, setIsBlockchain] = useState(false)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [verification, setVerification] = useState({ results: [], brokenFromIndex: -1 })

  const resetDemo = (blockchainMode) => {
    setLoading(true)
    buildInitialEntries(blockchainMode).then((initial) => {
      setEntries(initial)
      setLoading(false)
    })
  }

  useEffect(() => {
    resetDemo(isBlockchain)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBlockchain])

  useEffect(() => {
    if (!isBlockchain || entries.length === 0) {
      setVerification({ results: [], brokenFromIndex: -1 })
      return
    }
    let cancelled = false
    verifyEntries(entries).then((result) => {
      if (!cancelled) setVerification(result)
    })
    return () => {
      cancelled = true
    }
  }, [entries, isBlockchain])

  useEffect(() => {
    if (!isBlockchain && activeTab === 'auditor') {
      setActiveTab('overview')
    }
  }, [isBlockchain, activeTab])

  const handleModeChange = (blockchainMode) => {
    if (blockchainMode === isBlockchain) return
    setIsBlockchain(blockchainMode)
  }

  const handleUpdatePrice = (entryId, newPrice, { force = false } = {}) => {
    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== entryId) return entry
        if (isBlockchain && entry.locked && !force) return entry
        return { ...entry, payload: { ...entry.payload, price: newPrice } }
      }),
    )
  }

  const handleSubmitDecision = async (decisionPayload) => {
    const lastEntry = entries[entries.length - 1]
    const previousHash = isBlockchain ? lastEntry?.entryHash ?? GENESIS_HASH : ''
    const entry = await createEntry({
      type: 'DECISION_MADE',
      actor: 'Buyer',
      timestamp: new Date().toISOString(),
      payload: decisionPayload,
      previousHash,
      isBlockchain,
    })
    setEntries((prev) => [...prev, entry])
  }

  const visibleTabs = useMemo(
    () => TABS.filter((tab) => !tab.blockchainOnly || isBlockchain),
    [isBlockchain],
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Procurement Integrity Demo</h1>
            <p className="mt-1 text-sm text-slate-500">
              Same RFQ, same vendors, same prices — with and without a tamper-evident record.
            </p>
          </div>
          <ModeToggle isBlockchain={isBlockchain} onChange={handleModeChange} />
        </div>
      </header>

      <div
        className={`border-b px-6 py-2 text-center text-xs font-semibold uppercase tracking-wide ${
          isBlockchain
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-slate-200 bg-slate-100 text-slate-500'
        }`}
      >
        {isBlockchain
          ? 'With Blockchain — entries are hashed, chained, and locked once submitted'
          : 'Without Blockchain — entries are plain data with no hash and no lock'}
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <nav className="mb-6 flex flex-wrap gap-2">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => resetDemo(isBlockchain)}
            className="ml-auto rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 ring-1 ring-inset ring-slate-300 hover:bg-slate-100"
          >
            Reset demo
          </button>
        </nav>

        {loading ? (
          <p className="text-sm text-slate-500">Loading demo data…</p>
        ) : (
          <>
            {activeTab === 'overview' && <RfqOverview entries={entries} />}
            {activeTab === 'bids' && (
              <VendorBidsTable
                entries={entries}
                isBlockchain={isBlockchain}
                verification={verification}
                onUpdatePrice={handleUpdatePrice}
              />
            )}
            {activeTab === 'decision' && (
              <DecisionPanel entries={entries} onSubmitDecision={handleSubmitDecision} />
            )}
            {activeTab === 'timeline' && (
              <Timeline entries={entries} isBlockchain={isBlockchain} verification={verification} />
            )}
            {activeTab === 'auditor' && isBlockchain && (
              <AuditorView entries={entries} verification={verification} />
            )}
          </>
        )}
      </main>
    </div>
  )
}
