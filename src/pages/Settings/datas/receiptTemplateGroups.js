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
      { id: 'receiptTemplate1',  
        label: '1. Centered Balance',    
        description: 'Business name in the middle with a line on each side',  
        Component: ReceiptTemplate1
      },
      { 
        id: 'receiptTemplate2',  
        label: '2. Triple-Box Info Bar', 
        description: 'Three side-by-side boxes showing contact details',       
        Component: ReceiptTemplate2 },
      { 
        id: 'receiptTemplate3',  
        label: '3. Dual-Column Compact', 
        description: 'From and To details placed side by side',                
        Component: ReceiptTemplate3 
      },
    ],
  },
  {
    groupLabel: 'Bold Blocks',
    groupDescription: 'Strong designs that use solid colour sections',
    templates: [
      { 
        id: 'receiptTemplate4',  
        label: '4. Full-Bleed Banner',    
        description: 'Big colour header at the top with a logo space',     
        Component: ReceiptTemplate4
      },
      { 
        id: 'receiptTemplate5',  
        label: '5. Solid Top and Bottom', 
        description: 'Colour fills both the top header and the base',      
        Component: ReceiptTemplate5 
      },
      { 
        id: 'receiptTemplate6',  
        label: '6. Slanted Header',       
        description: 'Header cuts diagonally with a matching corner fill', 
        Component: ReceiptTemplate6
      },
    ],
  },
  {
    groupLabel: 'Clear Labels',
    groupDescription: 'Every section has a bold label so nothing is confusing',
    templates: [
      { 
        id: 'receiptTemplate7',  
        label: '7. Full Field Labels',  
        description: 'Sender and receiver details listed with bold labels',         
        Component: ReceiptTemplate7 
      },
      { 
        id: 'receiptTemplate8',  
        label: '8. Side Summary Box',   
        description: 'A dedicated box on the side holds totals and client details', 
        Component: ReceiptTemplate8 
      },
    ],
  },
  {
    groupLabel: 'Info Strip',
    groupDescription: 'Packs in your business details without clutter',
    templates: [
      { 
        id: 'receiptTemplate9',  
        label: '9. Three-Column Details', 
        description: 'Payment, delivery, and billing info in one row',         
        Component: ReceiptTemplate9 
      },
      { 
        id: 'receiptTemplate10', 
        label: '10. Strip and Signature', 
        description: 'Slim info bar at the top with a sign line at the base',  
        Component: ReceiptTemplate10
      },
    ],
  },
  {
    groupLabel: 'Payment Options',
    groupDescription: 'Shows all the ways your customer can pay you',
    templates: [
      { 
        id: 'receiptTemplate11', 
        label: '11. Payment Tiles', 
        description: 'Separate boxes for bank transfer, mobile money, and cash', 
        Component: ReceiptTemplate11 
      },
    ],
  },
]