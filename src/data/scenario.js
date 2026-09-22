// Hardcoded demo scenario. Identical in both modes so the only variable
// between "Without Blockchain" and "With Blockchain" is the integrity layer.

export const RFQ = {
  reference: 'RFQ-2026-014',
  title: 'Supply of Conveyor Belt Components',
  description:
    'Procurement of replacement conveyor belt components (rollers, idlers, and splice kits) for the site materials handling upgrade. Vendors were asked to confirm delivery lead time and quote a landed price in AUD.',
  closeDate: '2026-09-30',
}

export const VENDORS = [
  {
    id: 'vendor-a',
    name: 'Vendor A',
    price: 184000,
    delivery: '6 weeks ex-works',
    note: 'Includes 12-month warranty on all rollers.',
  },
  {
    id: 'vendor-b',
    name: 'Vendor B',
    price: 176500,
    delivery: '8 weeks ex-works',
    note: 'Lowest price quoted; longer lead time due to offshore manufacturing.',
  },
  {
    id: 'vendor-c',
    name: 'Vendor C',
    price: 191200,
    delivery: '4 weeks ex-works',
    note: 'Premium-grade components and the fastest delivery of the four bids.',
  },
  {
    id: 'vendor-d',
    name: 'Vendor D',
    price: 179900,
    delivery: '5 weeks ex-works',
    note: 'Incumbent supplier with an existing site relationship.',
  },
]
