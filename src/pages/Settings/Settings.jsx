import { useState, useRef, useCallback } from 'react'
import { useSettings } from '../../contexts/SettingsContext'
import Header from '../../components/Header/Header'
import Toast from '../../components/Toast/Toast'
import ConfirmSheet from '../../components/ConfirmSheet/ConfirmSheet'
import styles from './Settings.module.css'

// ─────────────────────────────────────────────────────────────
// Invoice template previews (unchanged from original)
// ─────────────────────────────────────────────────────────────

function EditableTemplate() {
  return (
    <div className={styles.pBase}>
      <div className={styles.pHeader}>
        <div className={styles.pBrandCenter}>
          <div className={styles.pBrandName}>Your Company Name</div>
          <div className={styles.pBrandSub}>123 Street Address, City, State, Zip Code</div>
        </div>
        <div className={styles.pLargeTitleCenter}>INVOICE</div>
      </div>
      <div className={styles.pBody}>
        <div className={styles.pMetaRow}>
          <div><strong>BILL TO:</strong><br />Customer Name<br />Street Address<br />City, State, Zip</div>
          <div style={{ textAlign: 'right' }}>
            Invoice #: <strong>0000001</strong><br />
            Issue Date: <strong>Date Field</strong><br />
            Due Date: <strong>Date Field</strong>
          </div>
        </div>
        <div className={styles.pTableModern}>
          <div className={styles.pTHead}><span>Description</span><span>Price</span><span>QTY</span><span>Total</span></div>
          {[1, 2, 3].map(i => (
            <div key={i} className={styles.pTRow}><span>Line Item & Description</span><span>$0.00</span><span>1</span><span>$0.00</span></div>
          ))}
        </div>
        <div className={styles.pSummary}>
          <div className={styles.pSumRow}><span>Subtotal</span><span>$0.00</span></div>
          <div className={styles.pSumRow}><span>Tax</span><span>$0.00</span></div>
          <div className={`${styles.pSumRow} ${styles.pBold}`}><span>Total Due</span><span>$0.00</span></div>
        </div>
      </div>
      <div className={styles.pFooter}>
        <div className={styles.pFootSection}><strong>Payment Terms:</strong><br />Add your payment terms such as bank details.</div>
        <div className={styles.pFootSection}><strong>Notes:</strong><br />Add any additional notes.</div>
      </div>
    </div>
  )
}

function PrintableTemplate() {
  return (
    <div className={styles.pBase}>
      <div className={styles.pGoldBarFull} />
      <div className={styles.pHeaderSplit}>
        <div className={styles.pLargeTitle}>INVOICE</div>
        <div className={styles.pMetaRight}>
          <div>ISSUE DATE: <strong>Date Field</strong></div>
          <div>DUE DATE: <strong>Date Field</strong></div>
          <div>INVOICE #: <strong>0000001</strong></div>
        </div>
      </div>
      <div className={styles.pBody}>
        <div className={styles.pMetaRow} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          <div><strong>BILL FROM:</strong><br />Your Company Name<br />Street Address<br />Phone Number</div>
          <div style={{ textAlign: 'right' }}><strong>BILL TO:</strong><br />Customer Name<br />Street Address<br />City, State, Zip</div>
        </div>
        <div className={styles.pTableModern} style={{ marginTop: '20px' }}>
          <div className={styles.pTHead}><span>Description</span><span>Price</span><span>QTY</span><span>Total</span></div>
          {[1, 2, 3].map(i => (
            <div key={i} className={styles.pTRow}><span>Line Item & Description</span><span>$0.00</span><span>1</span><span>$0.00</span></div>
          ))}
        </div>
        <div className={styles.pSummarySide}>
          <div className={styles.pSumRow}><span>Subtotal</span><span>$0.00</span></div>
          <div className={styles.pSumRow}><span>Tax</span><span>$0.00</span></div>
          <div className={`${styles.pSumRow} ${styles.pTotalBox}`}><span>Total Due</span><span>$0.00</span></div>
        </div>
      </div>
      <div className={styles.pFooter}>
        <div className={styles.pFootSection}><strong>Payment Terms:</strong><br />Bank Name, Account #</div>
      </div>
    </div>
  )
}

function CustomTemplate() {
  return (
    <div className={styles.pBase} style={{ padding: 0 }}>
      <div className={styles.pPurpleBanner}>
        <div className={styles.pLogoBoxWhite}>Place logo here</div>
        <div className={styles.pLargeTitleWhite}>INVOICE</div>
        <div className={styles.pWhiteNo}>0000001</div>
      </div>
      <div className={styles.pBody} style={{ padding: '20px' }}>
        <div className={styles.pMetaRow}>
          <div><strong>BILL FROM:</strong><br />Your Company Name</div>
          <div><strong>BILL TO:</strong><br />Customer Name</div>
          <div style={{ textAlign: 'right' }}><strong>DATE:</strong><br />Date Field</div>
        </div>
        <div className={styles.pTableModern} style={{ marginTop: '20px' }}>
          <div className={styles.pTHead}><span>Description</span><span>Price</span><span>QTY</span><span>Total</span></div>
          {[1, 2].map(i => (
            <div key={i} className={styles.pTRow}><span>Line Item & Description</span><span>$0.00</span><span>1</span><span>$0.00</span></div>
          ))}
        </div>
        <div className={styles.pSummary}>
          <div className={styles.pSumRow}><span>Subtotal</span><span>$0.00</span></div>
          <div className={`${styles.pSumRow} ${styles.pBold}`}><span>Total Due</span><span>$0.00</span></div>
        </div>
      </div>
      <div className={styles.pPurpleBottom}>
        <div className={styles.pFootSectionWhite}><strong>Payment Terms:</strong> Add details here</div>
      </div>
    </div>
  )
}

function FreeTemplate() {
  return (
    <div className={styles.pBase}>
      <div className={styles.pHeaderFree}>
        <div className={styles.pTitleBlock}>
          <div className={styles.pLargeTitle}>INVOICE</div>
          <div className={styles.pSubNo}>0000001</div>
        </div>
        <div className={styles.pLogoPlaceholderBig}>ADD YOUR LOGO</div>
      </div>
      <div className={styles.pFreeGrid}>
        <div className={styles.pFreeBox}><strong>BILL FROM:</strong><br />Your Company Name<br />Address<br />Phone</div>
        <div className={styles.pFreeBox}><strong>BILL TO:</strong><br />Customer Name<br />Address</div>
        <div className={styles.pFreeBox}><strong>DETAILS:</strong><br />Issue: Date<br />Due: Date</div>
      </div>
      <div className={styles.pBody}>
        <div className={styles.pTableModern}>
          <div className={styles.pTHead}><span>Description</span><span>Price</span><span>QTY</span><span>Total</span></div>
          {[1, 2, 3].map(i => (
            <div key={i} className={styles.pTRow}><span>Line Item & Description</span><span>$0.00</span><span>1</span><span>$0.00</span></div>
          ))}
        </div>
        <div className={styles.pSummary}>
          <div className={styles.pSumRow}><span>Subtotal</span><span>$0.00</span></div>
          <div className={`${styles.pSumRow} ${styles.pBold}`}><span>Total Due</span><span>$0.00</span></div>
        </div>
      </div>
      <div className={styles.pFooterGray}>Thank you for your business!</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────

function SectionHeader({ icon, label }) {
  return (
    <div className={styles.sectionHeader}>
      <span className="mi" style={{ fontSize: '1rem', color: 'var(--text3)' }}>{icon}</span>
      <span className={styles.sectionLabel}>{label}</span>
    </div>
  )
}

function SettingRow({ icon, label, sub, value, children, onClick, chevron, divider = true }) {
  return (
    <div
      className={`${styles.row} ${onClick ? styles.rowTappable : ''}`}
      onClick={onClick}
      style={!divider ? { borderBottom: 'none' } : {}}
    >
      <div className={styles.rowIcon}>
        <span className="mi" style={{ fontSize: '1.15rem' }}>{icon}</span>
      </div>
      <div className={styles.rowText}>
        <div className={styles.rowLabel}>{label}</div>
        {sub && <div className={styles.rowSub}>{sub}</div>}
      </div>
      <div className={styles.rowRight}>
        {value && <span className={styles.rowValue}>{value}</span>}
        {children}
        {chevron && <span className="mi" style={{ fontSize: '1rem', color: 'var(--text3)', marginLeft: 6 }}>chevron_right</span>}
      </div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button
      className={`${styles.toggle} ${value ? styles.toggleOn : ''}`}
      onClick={() => onChange(!value)}
      role="switch"
      aria-checked={value}
    >
      <span className={styles.toggleThumb} />
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// Segment control
// ─────────────────────────────────────────────────────────────

function SegmentControl({ options, value, onChange }) {
  return (
    <div className={styles.segment}>
      {options.map(opt => (
        <button
          key={opt.value}
          className={`${styles.segBtn} ${value === opt.value ? styles.segActive : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Full-screen slide-in modal shell
// ─────────────────────────────────────────────────────────────

function FullModal({ title, onBack, onSave, children }) {
  return (
    <div className={styles.fullOverlay}>
      <div className={styles.fullHeader}>
        <button className={styles.backBtn} onClick={onBack}>
          <span className="mi">arrow_back</span>
        </button>
        <span className={styles.fullTitle}>{title}</span>
        {onSave && (
          <button className={styles.fullSave} onClick={onSave}>Save</button>
        )}
      </div>
      <div className={styles.fullContent}>{children}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Field wrappers used inside modals
// ─────────────────────────────────────────────────────────────

function FieldGroup({ children }) {
  return <div className={styles.fieldGroup}>{children}</div>
}

function Field({ label, hint, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      className={styles.textInput}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      className={styles.textarea}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// MODAL: Invoice Template Picker
// ─────────────────────────────────────────────────────────────

function TemplateModal({ isOpen, currentTemplate, onClose, onSelect }) {
  const [selected, setSelected] = useState(currentTemplate || 'editable')

  const TEMPLATES = [
    { id: 'editable',   label: 'Editable Clothing Store',   Component: EditableTemplate },
    { id: 'printable',  label: 'Printable Clothing Store',  Component: PrintableTemplate },
    { id: 'custom',     label: 'Custom Clothing Store',     Component: CustomTemplate },
    { id: 'free',       label: 'Free Clothing Store',       Component: FreeTemplate },
  ]

  if (!isOpen) return null

  return (
    <div className={styles.fullOverlay}>
      <div className={styles.fullHeader}>
        <button className={styles.backBtn} onClick={onClose}>
          <span className="mi">arrow_back</span>
        </button>
        <span className={styles.fullTitle}>Invoice Templates</span>
        <button className={styles.fullSave} onClick={() => { onSelect(selected); onClose() }}>Select</button>
      </div>
      <div className={styles.fullContent}>
        {TEMPLATES.map(t => (
          <div key={t.id} className={styles.templateWrapper} onClick={() => setSelected(t.id)}>
            <div className={`${styles.fullPreviewContainer} ${selected === t.id ? styles.fullPreviewActive : ''}`}>
              <t.Component />
            </div>
            <div className={styles.templateInfo}>
              <div className={`${styles.radio} ${selected === t.id ? styles.radioActive : ''}`} />
              <span className={styles.templateLabel}>{t.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MODAL: Brand & Business
// ─────────────────────────────────────────────────────────────

function BrandModal({ onBack, showToast }) {
  const { settings, updateMany } = useSettings()
  const logoInputRef = useRef()

  const [local, setLocal] = useState({
    brandName:    settings.brandName,
    brandTagline: settings.brandTagline,
    brandColour:  settings.brandColour,
    brandLogo:    settings.brandLogo,
    brandPhone:   settings.brandPhone,
    brandEmail:   settings.brandEmail,
    brandAddress: settings.brandAddress,
    brandWebsite: settings.brandWebsite,
  })

  const set = key => val => setLocal(p => ({ ...p, [key]: val }))

  const handleLogoChange = useCallback(e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setLocal(p => ({ ...p, brandLogo: ev.target.result }))
    reader.readAsDataURL(file)
  }, [])

  const save = () => {
    updateMany(local)
    showToast('Brand info saved')
    onBack()
  }

  return (
    <FullModal title="Brand & Business" onBack={onBack} onSave={save}>

      <FieldGroup>
        <Field label="Brand Logo" hint="PNG or JPG. Appears on invoice headers.">
          {local.brandLogo ? (
            <div className={styles.logoPreviewWrap}>
              <img src={local.brandLogo} alt="Brand logo" className={styles.logoPreview} />
              <button
                className={styles.logoRemove}
                onClick={() => setLocal(p => ({ ...p, brandLogo: null }))}
              >
                <span className="mi" style={{ fontSize: 15 }}>close</span> Remove
              </button>
            </div>
          ) : (
            <button className={styles.logoUploadBtn} onClick={() => logoInputRef.current?.click()}>
              <span className="mi">add_photo_alternate</span>
              Upload Logo
            </button>
          )}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleLogoChange}
          />
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field label="Shop / Brand Name">
          <TextInput value={local.brandName} onChange={set('brandName')} placeholder="e.g. Stitched by Amara" />
        </Field>
        <Field label="Tagline" hint="Short line shown under your name on some templates.">
          <TextInput value={local.brandTagline} onChange={set('brandTagline')} placeholder="e.g. Crafted with love, fitted for you" />
        </Field>
        <Field label="Brand Colour" hint="Used for headers and accents on coloured invoice templates.">
          <div className={styles.colourRow}>
            <input
              type="color"
              className={styles.colourPicker}
              value={local.brandColour}
              onChange={e => set('brandColour')(e.target.value)}
            />
            <TextInput value={local.brandColour} onChange={set('brandColour')} placeholder="#D4AF37" />
          </div>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field label="Phone Number">
          <TextInput value={local.brandPhone} onChange={set('brandPhone')} placeholder="+234 800 000 0000" type="tel" />
        </Field>
        <Field label="Email Address">
          <TextInput value={local.brandEmail} onChange={set('brandEmail')} placeholder="shop@email.com" type="email" />
        </Field>
        <Field label="Address">
          <Textarea value={local.brandAddress} onChange={set('brandAddress')} placeholder="12 Tailor Street, Ikeja, Lagos" rows={2} />
        </Field>
        <Field label="Website / Social">
          <TextInput value={local.brandWebsite} onChange={set('brandWebsite')} placeholder="instagram.com/yourbrand" />
        </Field>
      </FieldGroup>

    </FullModal>
  )
}

// ─────────────────────────────────────────────────────────────
// MODAL: Invoice Settings
// ─────────────────────────────────────────────────────────────

function InvoiceSettingsModal({ onBack, showToast }) {
  const { settings, updateMany } = useSettings()

  const [local, setLocal] = useState({
    invoicePrefix:   settings.invoicePrefix,
    invoiceCurrency: settings.invoiceCurrency,
    invoiceDueDays:  settings.invoiceDueDays,
    invoiceShowTax:  settings.invoiceShowTax,
    invoiceTaxRate:  settings.invoiceTaxRate,
    invoiceFooter:   settings.invoiceFooter,
  })

  const set = key => val => setLocal(p => ({ ...p, [key]: val }))

  const save = () => {
    updateMany(local)
    showToast('Invoice settings saved')
    onBack()
  }

  return (
    <FullModal title="Invoice Settings" onBack={onBack} onSave={save}>

      <FieldGroup>
        <Field label="Invoice Number Prefix" hint="Shown before the number, e.g. INV-0042.">
          <TextInput value={local.invoicePrefix} onChange={set('invoicePrefix')} placeholder="INV" />
        </Field>
        <Field label="Currency">
          <SegmentControl
            options={[
              { label: '₦ Naira',  value: '₦' },
              { label: '$ Dollar', value: '$' },
              { label: '£ Pound',  value: '£' },
              { label: '€ Euro',   value: '€' },
            ]}
            value={local.invoiceCurrency}
            onChange={set('invoiceCurrency')}
          />
        </Field>
        <Field label="Default Due Period" hint="Days after issue date the invoice is due.">
          <SegmentControl
            options={[
              { label: '3 days',  value: 3 },
              { label: '7 days',  value: 7 },
              { label: '14 days', value: 14 },
              { label: '30 days', value: 30 },
            ]}
            value={local.invoiceDueDays}
            onChange={set('invoiceDueDays')}
          />
        </Field>
      </FieldGroup>

      <FieldGroup>
        <div className={styles.row} style={{ borderBottom: local.invoiceShowTax ? '1px solid var(--border)' : 'none' }}>
          <div className={styles.rowIcon}>
            <span className="mi" style={{ fontSize: '1.15rem' }}>percent</span>
          </div>
          <div className={styles.rowText}>
            <div className={styles.rowLabel}>Show Tax Line</div>
            <div className={styles.rowSub}>Add a VAT / tax row to invoice totals</div>
          </div>
          <div className={styles.rowRight}>
            <Toggle value={local.invoiceShowTax} onChange={v => set('invoiceShowTax')(v)} />
          </div>
        </div>
        {local.invoiceShowTax && (
          <Field label="Tax Rate (%)" hint="e.g. 7.5 for 7.5% VAT">
            <TextInput
              type="number"
              value={String(local.invoiceTaxRate)}
              onChange={v => set('invoiceTaxRate')(parseFloat(v) || 0)}
              placeholder="7.5"
            />
          </Field>
        )}
      </FieldGroup>

      <FieldGroup>
        <Field label="Invoice Footer Text" hint="Printed at the bottom of every invoice.">
          <Textarea
            value={local.invoiceFooter}
            onChange={set('invoiceFooter')}
            placeholder="Thank you for your patronage 🙏"
            rows={3}
          />
        </Field>
      </FieldGroup>

    </FullModal>
  )
}

// ─────────────────────────────────────────────────────────────
// MODAL: Measurements
// ─────────────────────────────────────────────────────────────

function MeasurementModal({ onBack, showToast }) {
  const { settings, updateMany } = useSettings()
  const [local, setLocal] = useState({
    measureUnit:   settings.measureUnit,
    measureFormat: settings.measureFormat,
  })
  const set = key => val => setLocal(p => ({ ...p, [key]: val }))
  const save = () => { updateMany(local); showToast('Saved'); onBack() }

  return (
    <FullModal title="Measurements" onBack={onBack} onSave={save}>
      <FieldGroup>
        <Field label="Default Unit">
          <SegmentControl
            options={[
              { label: 'Inches (in)', value: 'in' },
              { label: 'Centimetres (cm)', value: 'cm' },
              { label: 'Yards (yd)', value: 'yd' },
            ]}
            value={local.measureUnit}
            onChange={set('measureUnit')}
          />
        </Field>
        <Field label="Number Format">
          <SegmentControl
            options={[
              { label: '12.5  Decimal',  value: 'decimal' },
              { label: '12½  Fraction', value: 'fraction' },
            ]}
            value={local.measureFormat}
            onChange={set('measureFormat')}
          />
        </Field>
      </FieldGroup>
    </FullModal>
  )
}

// ─────────────────────────────────────────────────────────────
// MODAL: Orders
// ─────────────────────────────────────────────────────────────

function OrdersModal({ onBack, showToast }) {
  const { settings, updateMany } = useSettings()
  const [local, setLocal] = useState({
    defaultDepositPercent:        settings.defaultDepositPercent,
    autoArchiveCompletedOrders:   settings.autoArchiveCompletedOrders,
  })
  const set = key => val => setLocal(p => ({ ...p, [key]: val }))
  const save = () => { updateMany(local); showToast('Saved'); onBack() }

  return (
    <FullModal title="Orders" onBack={onBack} onSave={save}>
      <FieldGroup>
        <Field label="Default Deposit %" hint="Percentage of total collected when an order is placed.">
          <SegmentControl
            options={[
              { label: '25%',  value: 25 },
              { label: '50%',  value: 50 },
              { label: '75%',  value: 75 },
              { label: '100%', value: 100 },
            ]}
            value={local.defaultDepositPercent}
            onChange={set('defaultDepositPercent')}
          />
        </Field>
        <div className={styles.row} style={{ borderBottom: 'none' }}>
          <div className={styles.rowIcon}>
            <span className="mi" style={{ fontSize: '1.15rem' }}>archive</span>
          </div>
          <div className={styles.rowText}>
            <div className={styles.rowLabel}>Auto-archive Completed Orders</div>
            <div className={styles.rowSub}>Move to archive once marked Completed</div>
          </div>
          <div className={styles.rowRight}>
            <Toggle
              value={local.autoArchiveCompletedOrders}
              onChange={v => set('autoArchiveCompletedOrders')(v)}
            />
          </div>
        </div>
      </FieldGroup>
    </FullModal>
  )
}

// ─────────────────────────────────────────────────────────────
// MODAL: Display & Date
// ─────────────────────────────────────────────────────────────

function DisplayModal({ onBack, showToast }) {
  const { settings, updateMany } = useSettings()
  const [local, setLocal] = useState({
    theme:      settings.theme,
    dateFormat: settings.dateFormat,
  })
  const set = key => val => setLocal(p => ({ ...p, [key]: val }))
  const save = () => { updateMany(local); showToast('Display saved'); onBack() }

  return (
    <FullModal title="Display & Date" onBack={onBack} onSave={save}>
      <FieldGroup>
        <Field label="Theme">
          <SegmentControl
            options={[
              { label: '☀️ Light',  value: 'light' },
              { label: '🌙 Dark',   value: 'dark' },
              { label: '⚙️ System', value: 'system' },
            ]}
            value={local.theme}
            onChange={set('theme')}
          />
        </Field>
        <Field label="Date Format">
          <SegmentControl
            options={[
              { label: 'DD/MM/YYYY',  value: 'DD/MM/YYYY' },
              { label: 'MM/DD/YYYY',  value: 'MM/DD/YYYY' },
              { label: 'YYYY-MM-DD',  value: 'YYYY-MM-DD' },
            ]}
            value={local.dateFormat}
            onChange={set('dateFormat')}
          />
        </Field>
      </FieldGroup>
    </FullModal>
  )
}

// ─────────────────────────────────────────────────────────────
// Active modal registry
// ─────────────────────────────────────────────────────────────

const MODAL_MAP = {
  template:    null, // handled separately via templateModal boolean
  brand:       BrandModal,
  invoice:     InvoiceSettingsModal,
  measurement: MeasurementModal,
  orders:      OrdersModal,
  display:     DisplayModal,
}

// ─────────────────────────────────────────────────────────────
// Main Settings page
// ─────────────────────────────────────────────────────────────

export default function Settings({ onMenuClick }) {
  const { settings, updateSetting, resetSettings } = useSettings()

  const [toastMsg,       setToastMsg]       = useState('')
  const [templateModal,  setTemplateModal]  = useState(false)
  const [activeModal,    setActiveModal]    = useState(null)  // key in MODAL_MAP
  const [clearConfirm,   setClearConfirm]   = useState(false)
  const [resetConfirm,   setResetConfirm]   = useState(false)
  const toastTimer = useRef(null)

  const showToast = useCallback(msg => {
    setToastMsg(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(''), 2400)
  }, [])

  const open  = key => () => setActiveModal(key)
  const close = () => setActiveModal(null)

  const ModalComponent = activeModal ? MODAL_MAP[activeModal] : null

  const themeLabel = { light: '☀️ Light', dark: '🌙 Dark', system: '⚙️ System' }[settings.theme]
  const unitLabel  = { in: 'Inches', cm: 'Centimetres', yd: 'Yards' }[settings.measureUnit]

  return (
    <div className={styles.page}>
      <Header onMenuClick={onMenuClick} />

      <div className={styles.scrollArea}>

        {/* ── APPEARANCE ── */}
        <SectionHeader icon="palette" label="Appearance" />
        <div className={styles.card}>
          <SettingRow
            icon="contrast"
            label="Theme & Date"
            sub={themeLabel}
            value={settings.dateFormat}
            onClick={open('display')}
            chevron
            divider={false}
          />
        </div>

        {/* ── BRAND & BUSINESS ── */}
        <SectionHeader icon="storefront" label="Brand & Business" />
        <div className={styles.card}>
          <SettingRow
            icon="badge"
            label="Brand Identity"
            sub={settings.brandName || 'Name, logo, colour, tagline, contact'}
            onClick={open('brand')}
            chevron
          />
          <SettingRow
            icon="receipt_long"
            label="Invoice Settings"
            sub={`${settings.invoiceCurrency} · ${settings.invoicePrefix} · Due ${settings.invoiceDueDays}d`}
            onClick={open('invoice')}
            chevron
          />
          <SettingRow
            icon="description"
            label="Invoice Template"
            sub="Choose your preferred invoice design"
            value={settings.invoiceTemplate}
            onClick={() => setTemplateModal(true)}
            chevron
            divider={false}
          />
        </div>

        {/* ── MEASUREMENTS ── */}
        <SectionHeader icon="straighten" label="Measurements" />
        <div className={styles.card}>
          <SettingRow
            icon="square_foot"
            label="Default Unit & Format"
            sub={unitLabel}
            onClick={open('measurement')}
            chevron
            divider={false}
          />
        </div>

        {/* ── ORDERS ── */}
        <SectionHeader icon="shopping_bag" label="Orders" />
        <div className={styles.card}>
          <SettingRow
            icon="payments"
            label="Deposit & Archiving"
            sub={`${settings.defaultDepositPercent}% default deposit`}
            onClick={open('orders')}
            chevron
            divider={false}
          />
        </div>

        {/* ── NOTIFICATIONS ── */}
        <SectionHeader icon="notifications" label="Notifications" />
        <div className={styles.card}>
          <SettingRow icon="alarm" label="Overdue Tasks" sub="Alert when tasks pass their due date">
            <Toggle
              value={settings.notifyOverdueTasks}
              onChange={v => updateSetting('notifyOverdueTasks', v)}
            />
          </SettingRow>
          <SettingRow icon="cake" label="Customer Birthdays" sub="Remind you a day before">
            <Toggle
              value={settings.notifyUpcomingBirthdays}
              onChange={v => updateSetting('notifyUpcomingBirthdays', v)}
            />
          </SettingRow>
          <SettingRow icon="money_off" label="Unpaid Invoices" sub="Alert for invoices past due date" divider={false}>
            <Toggle
              value={settings.notifyUnpaidInvoices}
              onChange={v => updateSetting('notifyUnpaidInvoices', v)}
            />
          </SettingRow>
        </div>

        {/* ── DATA ── */}
        <SectionHeader icon="storage" label="Data" />
        <div className={styles.card}>
          <SettingRow
            icon="restart_alt"
            label="Reset All Settings"
            sub="Restore defaults. Your customers and orders are safe."
            onClick={() => setResetConfirm(true)}
            chevron
          />
          <SettingRow
            icon="delete_forever"
            label="Clear All Data"
            sub="Permanently delete everything"
            onClick={() => setClearConfirm(true)}
            chevron
            divider={false}
          />
        </div>

        <div style={{ height: 32 }} />
      </div>

      {/* ── Template picker modal ── */}
      <TemplateModal
        isOpen={templateModal}
        currentTemplate={settings.invoiceTemplate}
        onClose={() => setTemplateModal(false)}
        onSelect={v => { updateSetting('invoiceTemplate', v); showToast('Template selected') }}
      />

      {/* ── Sub-page modals ── */}
      {ModalComponent && <ModalComponent onBack={close} showToast={showToast} />}

      {/* ── Confirmation sheets ── */}
      <ConfirmSheet
        open={clearConfirm}
        title="Delete All Data?"
        onConfirm={() => { localStorage.clear(); setClearConfirm(false); showToast('Cleared') }}
        onCancel={() => setClearConfirm(false)}
      />
      <ConfirmSheet
        open={resetConfirm}
        title="Reset All Settings?"
        onConfirm={() => { resetSettings(); setResetConfirm(false); showToast('Settings reset') }}
        onCancel={() => setResetConfirm(false)}
      />

      <Toast message={toastMsg} />
    </div>
  )
}
