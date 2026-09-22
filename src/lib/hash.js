// SHA-256 helpers backing the "With Blockchain" mode. Real Web Crypto
// hashing, no external library, so the chain in the demo is genuine.

export const GENESIS_HASH = '0'.repeat(64)

export async function sha256Hex(input) {
  const data = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function computeEntryHashes({ payload, previousHash, timestamp, actor }) {
  const payloadHash = await sha256Hex(JSON.stringify(payload))
  const entryHash = await sha256Hex(payloadHash + previousHash + timestamp + actor)
  return { payloadHash, entryHash }
}

export function truncateHash(hash, length = 8) {
  if (!hash) return '—'
  return `${hash.slice(0, length)}…`
}
