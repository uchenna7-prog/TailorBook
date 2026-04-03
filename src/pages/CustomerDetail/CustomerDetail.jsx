import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCustomers } from '../../contexts/CustomerContext'
import { usePremium }   from '../../contexts/PremiumContext'
import { useCustomerData } from '../../hooks/useCustomerData'
import { useOrders }    from '../../contexts/OrdersContext'
import Header from '../../components/Header/Header'
import Toast  from '../../components/Toast/Toast'
import MeasurementsTab from './tabs/MeasurementsTab'
import OrdersTab       from './tabs/OrdersTab'
import InvoiceTab      from './tabs/InvoiceTab'
import PaymentsTab     from './tabs/PaymentsTab'
import styles from './CustomerDetail.module.css'

function getInitials(name) {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getBirthday(birthday) {
  if (!birthday) return null
  const d = new Date(birthday)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const TABS = [
  { id: 'dress',    label: 'Dress Measurements' },
  { id: 'orders',   label: 'Orders'             },
  { id: 'payments', label: 'Payments'           },
  { id: 'invoice',  label: 'Invoice'            },
]

export default function CustomerDetail({ onMenuClick }) {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { getCustomer, deleteCustomer } = useCustomers()
  const { isPremium } = usePremium()
  const data         = useCustomerData(id)
  const { getOrders } = useOrders()

  const [activeTab,     setActiveTab]     = useState('dress')
  const [toastMsg,      setToastMsg]      = useState('')
  const [invoicesState, setInvoicesState] = useState([])
  const toastTimer = useRef(null)
  const fixedRef   = useRef(null)
  const tabsRef    = useRef(null)

  const orders = getOrders(id)

  useEffect(() => {
    if (data.invoices) setInvoicesState(data.invoices)
  }, [data.invoices])

  const showToast = useCallback((msg) => {
    setToastMsg(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(''), 2400)
  }, [])

  // ── UPDATED FUNCTION ───────────────────────────────────────
  const handleGenerateInvoice = useCallback(async (orderId) => {
    const existing = data.invoices.find(inv => String(inv.orderId) === String(orderId))
    if (existing) { showToast('Invoice already exists'); setActiveTab('invoice'); return }

    const order = orders.find(o => String(o.id) === String(orderId))
    if (!order) return

    let settingsSnap = {}
    try {
      settingsSnap = JSON.parse(localStorage.getItem('tailorbook_settings') || '{}')
    } catch {}

    const invNumber   = `INV-${String(data.invoices.length + 1).padStart(3, '0')}`
    const today       = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const ids         = order.measurementIds?.length ? order.measurementIds : (order.measurementId ? [order.measurementId] : [])
    const linkedNames = ids.map(mid => data.measurements.find(m => String(m.id) === String(mid))?.name).filter(Boolean)
    const items       = Array.isArray(order.items) ? order.items : []

    const newInvoice = {
      id:        Date.now() + Math.random(),
      orderId,
      number:    invNumber,
      orderDesc: order.desc,
      price:     order.price,
      qty:       order.qty,
      items,
      linkedNames,
      due:       order.due,
      notes:     order.notes,
      status:    'unpaid',
      date:      today,

      template: settingsSnap.invoiceTemplate || 'editable',

      brandSnapshot: {
        name:     settingsSnap.brandName     || '',
        tagline:  settingsSnap.brandTagline  || '',
        colour:   settingsSnap.brandColour   || '#D4AF37',
        phone:    settingsSnap.brandPhone    || '',
        email:    settingsSnap.brandEmail    || '',
        address:  settingsSnap.brandAddress  || '',
        footer:   settingsSnap.invoiceFooter || 'Thank you for your patronage 🙏',
        currency: settingsSnap.invoiceCurrency || '₦',
        showTax:  settingsSnap.invoiceShowTax  || false,
        taxRate:  settingsSnap.invoiceTaxRate  || 0,
        dueDays:  settingsSnap.invoiceDueDays  || 7,
      },
    }

    try {
      await data.saveInvoice(newInvoice)
      showToast(`${invNumber} generated ✓`)
      setActiveTab('invoice')
    } catch {
      showToast('Failed to save invoice. Try again.')
    }
  }, [data, orders, showToast])

  // ── Event listeners ───────────────────────────────────────
  useEffect(() => {
    const handleSwitch   = () => setActiveTab('invoice')
    const handleGenerate = (e) => handleGenerateInvoice(e.detail.orderId)

    document.addEventListener('switchToInvoiceTab', handleSwitch)
    document.addEventListener('generateInvoice',    handleGenerate)
    return () => {
      document.removeEventListener('switchToInvoiceTab', handleSwitch)
      document.removeEventListener('generateInvoice',    handleGenerate)
    }
  }, [handleGenerateInvoice])

  // ── Header height calc ────────────────────────────────────
  useEffect(() => {
    if (fixedRef.current) {
      const height = fixedRef.current.offsetHeight
      document.documentElement.style.setProperty('--total-fixed-height', `${height}px`)
    }
  }, [activeTab, data, isPremium])

  // ── UI ────────────────────────────────────────────────────
  if (!data.customer) return null

  return (
    <div className={styles.page}>
      <Header onMenuClick={onMenuClick} />

      <div ref={fixedRef} className={styles.fixedTop}>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            {getInitials(data.customer.name)}
          </div>

          <div>
            <h2>{data.customer.name}</h2>
            {data.customer.phone && <p>{data.customer.phone}</p>}
            {getBirthday(data.customer.birthday) && (
              <p>🎂 {getBirthday(data.customer.birthday)}</p>
            )}
          </div>
        </div>

        <div ref={tabsRef} className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === 'dress' && (
          <MeasurementsTab data={data} showToast={showToast} />
        )}

        {activeTab === 'orders' && (
          <OrdersTab
            data={data}
            showToast={showToast}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsTab
            data={data}
            orders={orders}
            showToast={showToast}
            onGenerateInvoice={handleGenerateInvoice}
          />
        )}

        {activeTab === 'invoice' && (
          <InvoiceTab
            data={data}
            invoices={invoicesState}
            showToast={showToast}
          />
        )}
      </div>

      {toastMsg && <Toast message={toastMsg} />}
    </div>
  )
}
