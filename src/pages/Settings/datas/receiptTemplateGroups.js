import { ReceiptTemplate1 } from "../../../components/Templates/ReceiptTemplates/Template1"
import { ReceiptTemplate2 } from "../../../components/Templates/ReceiptTemplates/Template2"
import { ReceiptTemplate3 } from "../../../components/Templates/ReceiptTemplates/Template3"
import { ReceiptTemplate4 } from "../../../components/Templates/ReceiptTemplates/Template4"
import { ReceiptTemplate5 } from "../../../components/Templates/ReceiptTemplates/Template5"
import { ReceiptTemplate6 } from "../../../components/Templates/ReceiptTemplates/Template6"
import { ReceiptTemplate7 } from "../../../components/Templates/ReceiptTemplates/Template7"
import { ReceiptTemplate8 } from "../../../components/Templates/ReceiptTemplates/Template8"
import { ReceiptTemplate9 } from "../../../components/Templates/ReceiptTemplates/Template9"
import { ReceiptTemplate10 } from "../../../components/Templates/ReceiptTemplates/Template10"
import { ReceiptTemplate11 } from "../../../components/Templates/ReceiptTemplates/Template11"

export const RECEIPT_TEMPLATE_GROUPS = [
  {
    groupLabel: 'Simple and Clean',
    groupDescription: 'Light, open layouts that are easy to read',
    templates: [
      { 
        id:'Centered Balance',
        label:'1. Centered Balance',
        description:'Business name in the middle with a line on each side',
        Component: ReceiptTemplate1 },
      { 
        id:'Triple-Box Info Bar',      
        label:'2. Triple-Box Info Bar', 
        description:'Three side-by-side boxes showing contact details',       
        Component:ReceiptTemplate2 
      },
      { 
        id:'Dual-Column Compact', 
        label:'3. Dual-Column Compact', 
        description:'From and To details placed side by side',                
        Component: ReceiptTemplate4 
      },
    ],
  },
  {
    groupLabel: 'Bold Blocks',
    groupDescription: 'Strong designs that use solid colour sections',
    templates: [
      { 
        id:'Full-Bleed Banner',       
        label:'4. Full-Bleed Banner',    
        description:'Big colour header at the top with a logo space',     
        Component: ReceiptTemplate3 },
      { 
        id:'Solid Top and Bottom',        
        label:'5. Solid Top and Bottom', 
        description:'Colour fills both the top header and the base',      
        Component: ReceiptTemplate5 },
      { 
        id:'Slanted Header', 
        label:'6. Slanted Header',      
        description:'Header cuts diagonally with a matching corner fill', 
        Component: ReceiptTemplate10 
      },
    ],
  },
  {
    groupLabel: 'Clear Labels',
    groupDescription: 'Every section has a bold label so nothing is confusing',
    templates: [
      { 
        id:'Full Field Labels',     
        label:'7. Full Field Labels',    
        description:'Sender and receiver details listed with bold labels',       
        Component: ReceiptTemplate7 },
      { 
        id:'Side Summary Box', label:'8. Side Summary Box',     
        description:'A dedicated box on the side holds totals and client details', 
        Component: ReceiptTemplate8 
      },
    ],
  },
  {
    groupLabel: 'Info Strip',
    groupDescription: 'Packs in your business details without clutter',
    templates: [
      { 
        id:'Three-Column Details',    
        label:'9. Three-Column Details', 
        description:'Payment, delivery, and billing info in one row',       
        Component: ReceiptTemplate6 
      },
      { 
        id:'Strip and Signature', 
        label:'10. Strip and Signature',  
        description:'Slim info bar at the top with a sign line at the base', 
        Component: ReceiptTemplate9 
      },
    ],
  },
  {
    groupLabel: 'Payment Options',
    groupDescription: 'Shows all the ways your customer can pay you',
    templates: [
      { 
        id:'Payment Tiles', 
        label:'11. Payment Tiles', 
        description:'Separate boxes for bank transfer, mobile money, and cash', 
        Component: ReceiptTemplate11 
      },
    ],
  },
]
