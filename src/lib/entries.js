import { RFQ, VENDORS } from '../data/scenario'
import { GENESIS_HASH, computeEntryHashes } from './hash'

let idCounter = 0
function nextId() {
  idCounter += 1
  return `entry-${idCounter}`
}

// Fixed base timestamps so the demo tells the same story on every reset,
// instead of showing "just now" for everything.
const BASE_TIME = new Date('2026-09-15T09:00:00Z').getTime()
const MINUTE = 60 * 1000

export async function createEntry({ type, actor, timestamp, payload, previousHash, isBlockchain }) {
  if (!isBlockchain) {
    return {
      id: nextId(),
      type,
      actor,
      timestamp,
      payload,
      payloadHash: '',
      previousHash: '',
      entryHash: '',
      locked: false,
    }
  }

  const { payloadHash, entryHash } = await computeEntryHashes({
    payload,
    previousHash,
    timestamp,
    actor,
  })

  return {
    id: nextId(),
    type,
    actor,
    timestamp,
    payload,
    payloadHash,
    previousHash,
    entryHash,
    locked: true,
  }
}

export async function buildInitialEntries(isBlockchain) {
  idCounter = 0
  const entries = []
  let previousHash = GENESIS_HASH

  const rfqEntry = await createEntry({
    type: 'RFQ_ISSUED',
    actor: 'Buyer',
    timestamp: new Date(BASE_TIME).toISOString(),
    payload: {
      title: RFQ.title,
      reference: RFQ.reference,
      closeDate: RFQ.closeDate,
    },
    previousHash,
    isBlockchain,
  })
  entries.push(rfqEntry)
  previousHash = rfqEntry.entryHash

  for (const [index, vendor] of VENDORS.entries()) {
    const entry = await createEntry({
      type: 'BID_SUBMITTED',
      actor: vendor.name,
      timestamp: new Date(BASE_TIME + (index + 1) * 45 * MINUTE).toISOString(),
      payload: {
        vendorId: vendor.id,
        vendorName: vendor.name,
        price: vendor.price,
        delivery: vendor.delivery,
        note: vendor.note,
      },
      previousHash,
      isBlockchain,
    })
    entries.push(entry)
    previousHash = entry.entryHash
  }

  return entries
}
