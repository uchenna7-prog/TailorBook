
export const TAILOR_ROWS = [
  ['Custom Agbada Sewing',     '₦8,500',  '1', '₦8,500'],
  ['Senator Suit Stitching',   '₦6,200',  '2', '₦12,400'],
  ['Ankara Dress Alteration',  '₦2,500',  '3', '₦7,500'],
  ['Bridal Gown Fitting',      '₦15,000', '1', '₦15,000'],
  ['Trouser Hemming',          '₦1,200',  '4', '₦4,800'],
  ['Kaftan Embroidery',        '₦4,000',  '2', '₦8,000'],
]

export const NUMBERED_ROWS = [
  ['1', 'Custom Agbada Sewing',    '1', '₦8,500',  '₦8,500'],
  ['2', 'Senator Suit Stitching',  '2', '₦6,200',  '₦12,400'],
  ['3', 'Ankara Dress Alteration', '3', '₦2,500',  '₦7,500'],
  ['4', 'Bridal Gown Fitting',     '1', '₦15,000', '₦15,000'],
  ['5', 'Trouser Hemming',         '4', '₦1,200',  '₦4,800'],
]

export const items = [
    { desc: 'Custom Agbada Sewing',    price: '₦8,500',  qty: 1, total: '₦8,500'  },
    { desc: 'Senator Suit Stitching',  price: '₦6,200',  qty: 2, total: '₦12,400' },
    { desc: 'Ankara Dress Alteration', price: '₦2,500',  qty: 3, total: '₦7,500'  },
    { desc: 'Bridal Gown Fitting',     price: '₦15,000', qty: 1, total: '₦15,000' },
    { desc: 'Trouser Hemming',         price: '₦1,200',  qty: 4, total: '₦4,800'  },
    { desc: 'Kaftan Embroidery',       price: '₦4,000',  qty: 2, total: '₦8,000'  },
  ]

// ─────────────────────────────────────────────────────────────
// Receipt sample data
// ─────────────────────────────────────────────────────────────

export const RECEIPT_SAMPLE = {
  number: 'RCP-0001',
  date: '12 Apr 2025',
  orderDesc: 'Custom Agbada Sewing',
  orderPrice: '56200',
  items: [
    { name: 'Custom Agbada Sewing', price: '8500' },
    { name: 'Senator Suit Stitching', price: '6200' },
    { name: 'Ankara Dress Alteration', price: '2500' },
    { name: 'Bridal Gown Fitting', price: '15000' },
    { name: 'Trouser Hemming', price: '1200' },
  ],
  payments: [
    { date: '10 Apr 2025', amount: '28100', method: 'transfer' },
    { date: '12 Apr 2025', amount: '28100', method: 'cash' },
  ],
  cumulativePaid: '56200',
}

export const RECEIPT_SAMPLE_CUSTOMER = {
  name: 'Mrs. Chidinma Okafor',
  phone: '+234 801 234 5678',
  address: '22 Akin Adesola St, Victoria Island',
}

export const RECEIPT_BRAND_SAMPLE = {
  name: 'Adeola Stitches',
  ownerName: 'Adeola Fashola',
  tagline: 'Crafted with love, fitted for you',
  address: '14 Bode Thomas St, Surulere, Lagos',
  phone: '+234 801 234 5678',
  email: 'info@adeolacouture.ng',
  website: 'adeolacouture.ng',
  currency: '₦',
  footer: 'Thank you for your payment!',
  showTax: false,
  taxRate: 0,
}
