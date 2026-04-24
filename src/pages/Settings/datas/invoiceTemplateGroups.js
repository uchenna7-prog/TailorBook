import { InvoiceTemplate1 } from "../templates/invoiceTemplates/Template1"
import { InvoiceTemplate2 } from "../templates/invoiceTemplates/Template2"
import { InvoiceTemplate3 } from "../templates/invoiceTemplates/Template3"
import { InvoiceTemplate4 } from "../templates/invoiceTemplates/Template4"
import { InvoiceTemplate5 } from "../templates/invoiceTemplates/Template5"
import { InvoiceTemplate6 } from "../templates/invoiceTemplates/Template6"
import { InvoiceTemplate7 } from "../templates/invoiceTemplates/Template7"
import { InvoiceTemplate8 } from "../templates/invoiceTemplates/Template8"
import { InvoiceTemplate9 } from "../templates/invoiceTemplates/Template9"
import { InvoiceTemplate10 } from "../templates/invoiceTemplates/Template10"
import { InvoiceTemplate11 } from "../templates/invoiceTemplates/Template11"

export const TEMPLATE_GROUPS = [
  {
    groupLabel: 'Simple and Clean',
    templates: [
      { id: 'invoiceTemplate1',  label: '1. Centered Balance',    desc: 'Business name in the middle with a line on each side',  Component: InvoiceTemplate1 },
      { id: 'invoiceTemplate2',  label: '2. Triple-Box Info Bar', desc: 'Three side-by-side boxes showing contact details',       Component: InvoiceTemplate2 },
      { id: 'invoiceTemplate3',  label: '3. Dual-Column Compact', desc: 'From and To details placed side by side',                Component: InvoiceTemplate3 },
    ],
  },
  {
    groupLabel: 'Bold Blocks',
    templates: [
      { id: 'invoiceTemplate4',  label: '4. Full-Bleed Banner',    desc: 'Big colour header at the top with a logo space',     Component: InvoiceTemplate4 },
      { id: 'invoiceTemplate5',  label: '5. Solid Top and Bottom', desc: 'Colour fills both the top header and the base',      Component: InvoiceTemplate5 },
      { id: 'invoiceTemplate6',  label: '6. Slanted Header',       desc: 'Header cuts diagonally with a matching corner fill', Component: InvoiceTemplate6 },
    ],
  },
  {
    groupLabel: 'Clear Labels',
    templates: [
      { id: 'invoiceTemplate7',  label: '7. Full Field Labels',  desc: 'Sender and receiver details listed with bold labels',         Component: InvoiceTemplate7 },
      { id: 'invoiceTemplate8',  label: '8. Side Summary Box',   desc: 'A dedicated box on the side holds totals and client details', Component: InvoiceTemplate8 },
    ],
  },
  {
    groupLabel: 'Info Strip',
    templates: [
      { id: 'invoiceTemplate9',  label: '9. Three-Column Details', desc: 'Payment, delivery, and billing info in one row',         Component: InvoiceTemplate9  },
      { id: 'invoiceTemplate10', label: '10. Strip and Signature', desc: 'Slim info bar at the top with a sign line at the base',  Component: InvoiceTemplate10 },
    ],
  },
  {
    groupLabel: 'Payment Options',
    templates: [
      { id: 'invoiceTemplate11', label: '11. Payment Tiles', desc: 'Separate boxes for bank transfer, mobile money, and cash', Component: InvoiceTemplate11 },
    ],
  },
]