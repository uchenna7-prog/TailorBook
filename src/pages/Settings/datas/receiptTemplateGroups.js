import { RTemplate1 } from "../templates/receiptTemplates/Template1"
import { RTemplate2 } from "../templates/receiptTemplates/Template2"
import { RTemplate3 } from "../templates/receiptTemplates/Template3"
import { RTemplate4 } from "../templates/receiptTemplates/Template4"
import { RTemplate5 } from "../templates/receiptTemplates/Template5"
import { RTemplate6 } from "../templates/receiptTemplates/Template6"
import { RTemplate7 } from "../templates/receiptTemplates/Template7"
import { RTemplate8 } from "../templates/receiptTemplates/Template8"
import { RTemplate9 } from "../templates/receiptTemplates/Template9"
import { RTemplate10 } from "../templates/receiptTemplates/Template10"
import { RTemplate11 } from "../templates/receiptTemplates/Template11"

export const RECEIPT_TEMPLATE_GROUPS = [
  {
    groupLabel: 'Simple and Clean',
    groupDesc: 'Light, open layouts that are easy to read',
    templates: [
      { id:'Centered Balance',  label:'1. Centered Balance',    desc:'Business name in the middle with a line on each side',  Component: RTemplate1 },
      { id:'Triple-Box Info Bar',      label:'2. Triple-Box Info Bar', desc:'Three side-by-side boxes showing contact details',       Component:RTemplate2 },
      { id:'Dual-Column Compact', label:'3. Dual-Column Compact', desc:'From and To details placed side by side',                Component: RTemplate4 },
    ],
  },
  {
    groupLabel: 'Bold Blocks',
    groupDesc: 'Strong designs that use solid colour sections',
    templates: [
      { id:'Full-Bleed Banner',       label:'4. Full-Bleed Banner',    desc:'Big colour header at the top with a logo space',     Component: RTemplate3 },
      { id:'Solid Top and Bottom',        label:'5. Solid Top and Bottom', desc:'Colour fills both the top header and the base',      Component: RTemplate5 },
      { id:'Slanted Header', label:'6. Slanted Header',      desc:'Header cuts diagonally with a matching corner fill', Component: RTemplate10 },
    ],
  },
  {
    groupLabel: 'Clear Labels',
    groupDesc: 'Every section has a bold label so nothing is confusing',
    templates: [
      { id:'Full Field Labels',     label:'7. Full Field Labels',    desc:'Sender and receiver details listed with bold labels',       Component: RTemplate7 },
      { id:'Side Summary Box', label:'8. Side Summary Box',     desc:'A dedicated box on the side holds totals and client details', Component: RTemplate8 },
    ],
  },
  {
    groupLabel: 'Info Strip',
    groupDesc: 'Packs in your business details without clutter',
    templates: [
      { id:'Three-Column Details',    label:'9. Three-Column Details', desc:'Payment, delivery, and billing info in one row',       Component: RTemplate6 },
      { id:'Strip and Signature', label:'10. Strip and Signature',  desc:'Slim info bar at the top with a sign line at the base', Component: RTemplate9 },
    ],
  },
  {
    groupLabel: 'Payment Options',
    groupDesc: 'Shows all the ways your customer can pay you',
    templates: [
      { id:'Payment Tiles', label:'11. Payment Tiles', desc:'Separate boxes for bank transfer, mobile money, and cash', Component: RTemplate11 },
    ],
  },
]
