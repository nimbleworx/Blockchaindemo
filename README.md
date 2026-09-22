# Procurement Integrity Demo

A single-page React app that demonstrates the difference between a normal
eRFQ (procurement) process and one protected by a tamper-evident, hash-chained
record. The same RFQ, the same four vendors, and the same bid prices run in
both modes so the contrast is obvious.

This is a generic demo built on dummy data only — no real client data is
involved.

## What it shows

Every event in the procurement process (RFQ issued, each vendor bid
submitted, the final decision) becomes a log **Entry**.

- **Without Blockchain** — entries are plain data. They can be edited at any
  time, silently, with no trace that a change happened.
- **With Blockchain** — each entry is hashed with SHA-256 (via the Web Crypto
  API), chained to the previous entry's hash, and locked once submitted. The
  **Tamper Demo** lets you force an edit anyway to see exactly how that shows
  up as a broken chain in the Timeline and gets pinpointed in the Auditor
  View.

## Tech stack

- React (functional components, hooks)
- Vite
- Tailwind CSS v4
- Web Crypto API for real SHA-256 hashing — no external hashing library
- No backend; all state lives in React state for this demo (see the note in
  `src/index.css` for a v2 localStorage option)

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

The build output in `dist/` is a static site — no server required — and is
ready to deploy on Netlify or any static host.

## Project structure

```
src/
  data/scenario.js       Hardcoded RFQ + vendor bid data (identical in both modes)
  lib/hash.js             SHA-256 hashing helpers (Web Crypto API)
  lib/entries.js           Builds the initial chained/unchained entry log
  lib/verify.js             Recomputes and verifies the hash chain
  lib/format.js              Currency/date formatting helpers
  components/
    ModeToggle.jsx            Without/With Blockchain switch
    RfqOverview.jsx            RFQ summary + vendor submission status
    VendorBidsTable.jsx         Bid table + the tamper demo interaction
    DecisionPanel.jsx            Side-by-side bid comparison + decision form
    Timeline.jsx                  Chronological audit log
    AuditorView.jsx                 Independent hash re-verification (blockchain mode)
  App.jsx                            Top-level state and layout
```
