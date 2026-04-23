
import { Template1 } from "../templates/invoiceTemplates/Template1"
import { Template2 } from "../templates/invoiceTemplates/Template2"
import { Template3 } from "../templates/invoiceTemplates/Template3"
import { Template4 } from "../templates/invoiceTemplates/Template4"
import { Template5 } from "../templates/invoiceTemplates/Template5"
import { Template6 } from "../templates/invoiceTemplates/Template6"
import { Template7 } from "../templates/invoiceTemplates/Template7"
import { Template8 } from "../templates/invoiceTemplates/Template8"
import { Template9 } from "../templates/invoiceTemplates/Template9"
import { Template10 } from "../templates/invoiceTemplates/Template10"
import { Template11 } from "../templates/invoiceTemplates/Template11"

export const TEMPLATE_GROUPS = [
  {
    groupLabel: 'Simple and Clean',
    groupDesc: 'Light, open layouts that are easy to read',
    groupIcon: 'article',
    templates: [
      { id:'Centered Balance',  label:'1. Centered Balance',    desc:'Business name in the middle with a line on each side',  Component:Template1 },
      { id:'Triple-Box Info Bar',      label:'2. Triple-Box Info Bar', desc:'Three side-by-side boxes showing contact details',       Component:Template2 },
      { id:'Dual-Column Compact', label:'3. Dual-Column Compact', desc:'From and To details placed side by side',                Component:Template4 },
    ],
  },
  {
    groupLabel: 'Bold Blocks',
    groupDesc: 'Strong designs that use solid colour sections',
    groupIcon: 'widgets',
    templates: [
      { id:'Full-Bleed Banner',       label:'4. Full-Bleed Banner',    desc:'Big colour header at the top with a logo space',     Component:Template3},
      { id:'Solid Top and Bottom',        label:'5. Solid Top and Bottom', desc:'Colour fills both the top header and the base',      Component:Template5 },
      { id:'Slanted Header', label:'6. Slanted Header',      desc:'Header cuts diagonally with a matching corner fill', Component:Template10 },
    ],
  },
  {
    groupLabel: 'Clear Labels',
    groupDesc: 'Every section has a bold label so nothing is confusing',
    groupIcon: 'format_list_bulleted',
    templates: [
      { id:'Full Field Labels',     label:'7. Full Field Labels',     desc:'Sender and receiver details listed with bold labels',  Component:Template7 },
      { id:'Side Summary Box', label:'8. Side Summary Box',      desc:'A dedicated box on the side holds totals and client details', Component:Template8 },
    ],
  },
  {
    groupLabel: 'Info Strip',
    groupDesc: 'Packs in your business details without clutter',
    groupIcon: 'table_rows',
    templates: [
      { id:'Three-Column Details',    label:'9. Three-Column Details', desc:'Payment, delivery, and billing info in one row',      Component:Template6 },
      { id:'Strip and Signature', label:'10. Strip and Signature',  desc:'Slim info bar at the top with a sign line at the base', Component:Template9 },
    ],
  },
  {
    groupLabel: 'Payment Options',
    groupDesc: 'Shows all the ways your customer can pay you',
    groupIcon: 'payments',
    templates: [
      { id:'Payment Tiles', label:'11. Payment Tiles', desc:'Separate boxes for bank transfer, mobile money, and cash', Component:Template11 },
    ],
  },
]
