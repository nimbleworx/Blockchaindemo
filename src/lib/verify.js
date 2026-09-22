import { GENESIS_HASH, computeEntryHashes } from './hash'

// Recomputes every entry's hash from its CURRENT payload and compares it
// against the hash recorded at submission time. This is what an independent
// auditor would do; it never trusts the stored payloadHash/entryHash fields.
export async function verifyEntries(entries) {
  const results = []
  let expectedPreviousHash = GENESIS_HASH

  for (const entry of entries) {
    const { payloadHash, entryHash } = await computeEntryHashes({
      payload: entry.payload,
      previousHash: entry.previousHash,
      timestamp: entry.timestamp,
      actor: entry.actor,
    })

    const selfValid = payloadHash === entry.payloadHash && entryHash === entry.entryHash
    const linkValid = entry.previousHash === expectedPreviousHash

    results.push({
      entryId: entry.id,
      recomputedPayloadHash: payloadHash,
      recomputedEntryHash: entryHash,
      selfValid,
      linkValid,
    })

    expectedPreviousHash = entry.entryHash
  }

  const brokenFromIndex = results.findIndex((result) => !result.selfValid || !result.linkValid)

  return { results, brokenFromIndex }
}
