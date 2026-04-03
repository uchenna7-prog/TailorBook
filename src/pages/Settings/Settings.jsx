import { useState, useRef, useCallback } from 'react'
import { useSettings } from '../../contexts/SettingsContext'
import Header from '../../components/Header/Header'
import Toast from '../../components/Toast/Toast'
import ConfirmSheet from '../../components/ConfirmSheet/ConfirmSheet'
import styles from './Settings.module.css'

// ─────────────────────────────────────────────────────────────
// Invoice template previews (Unchanged)
// ─────────────────────────────────────────────────────────────
function EditableTemplate() { /* ... existing code ... */ }
function PrintableTemplate() { /* ... existing code ... */ }
function CustomTemplate() { /* ... existing code ... */ }
function FreeTemplate() { /* ... existing code ... */ }

// ─────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────

function SectionHeader({ icon, label }) {
  return (
    <div className={styles.sectionHeader}>
      <span className="mi" style={{ fontSize: '1.2rem', color: 'var(--text)' }}>{icon}</span>
      <span className={styles.sectionLabel}>{label}</span>
    </div>
  )
}

function SettingRow({ icon, label, sub, children, onClick, divider = true, locked = false }) {
  return (
    <div
      className={`${styles.row} ${onClick && !locked ? styles.rowTappable : ''}`}
      onClick={locked ? undefined : onClick}
      style={!divider ? { borderBottom: 'none' } : {}}
    >
      <div className={styles.rowIcon}>
        <span className="mi" style={{ fontSize: '1.4rem' }}>{icon}</span>
      </div>
      <div className={styles.rowText}>
        <div className={styles.rowLabel}>{label}</div>
        {sub && <div className={styles.rowSub}>{sub}</div>}
      </div>
      <div className={styles.rowRight}>
        {children}
      </div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button
      className={`${styles.toggle} ${value ? styles.toggleOn : ''}`}
      onClick={(e) => { e.stopPropagation(); onChange(!value); }}
      role="switch"
    >
      <span className={styles.toggleThumb} />
    </button>
  )
}

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
// MODALS (InvoiceSettingsModal, TemplateModal - Logic Unchanged)
// ─────────────────────────────────────────────────────────────
/* ... Modal code remains identical to your previous version ... */

// ─────────────────────────────────────────────────────────────
// Main Settings page
// ─────────────────────────────────────────────────────────────

export default function Settings({ onMenuClick }) {
  const { settings, updateSetting, resetSettings } = useSettings()

  const [toastMsg, setToastMsg] = useState('')
  const [templateModal, setTemplateModal] = useState(false)
  const [invoiceModal, setInvoiceModal] = useState(false)
  const [clearConfirm, setClearConfirm] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)
  const toastTimer = useRef(null)

  const showToast = useCallback(msg => {
    setToastMsg(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(''), 2400)
  }, [])

  const isDark = settings.theme === 'dark'

  return (
    <div className={styles.page}>
      <Header onMenuClick={onMenuClick} title="Settings" />

      <div className={styles.scrollArea}>
        
        {/* ── SERVICES ── */}
        <SectionHeader icon="groups" label="Services Offered:" />
        <div className={styles.servicesRow}>
            <div className={styles.chip}><span className={styles.dot} /> Stitching</div>
            <div className={styles.chip}><span className={styles.dot} /> Material</div>
            <div className={styles.chip}><span className={styles.dot} /> Readymade</div>
        </div>

        <SettingRow icon="person" label="Cloth Pickup from Customer Site:">
          <Toggle value={settings.pickupEnabled} onChange={v => updateSetting('pickupEnabled', v)} />
        </SettingRow>

        <SettingRow icon="person" label="Measurement at Customer Site:">
          <Toggle value={settings.siteMeasurement} onChange={v => updateSetting('siteMeasurement', v)} />
        </SettingRow>

        <SettingRow icon="person" label="Accept Online Orders from Customer via TailorMate App:">
          <Toggle value={settings.onlineOrders} onChange={v => updateSetting('onlineOrders', v)} />
        </SettingRow>

        {/* ── MEASUREMENT ── */}
        <div className={styles.row}>
          <div className={styles.rowIcon}><span className="mi">straighten</span></div>
          <div className={styles.rowText}><div className={styles.rowLabel}>Measurement Unit :</div></div>
          <SegmentControl 
            options={[{label: 'Cms', value: 'cms'}, {label: 'Inch', value: 'inch'}]} 
            value={settings.unit || 'inch'} 
            onChange={v => updateSetting('unit', v)} 
          />
        </div>

        {/* ── TAX ── */}
        <SectionHeader icon="receipt" label="Tax Details:" />
        <SettingRow icon="person" label="VAT Bill">
          <Toggle value={settings.invoiceShowTax} onChange={v => updateSetting('invoiceShowTax', v)} />
        </SettingRow>

        {/* ── ORDER FORMAT ── */}
        <div className={styles.row}>
          <div className={styles.rowIcon}><span className="mi">format_list_numbered</span></div>
          <div className={styles.rowText}><div className={styles.rowLabel}>Order Number Format :</div></div>
          <SegmentControl 
            options={[{label: 'Random', value: 'random'}, {label: 'Serial', value: 'serial'}, {label: 'Custom', value: 'custom'}]} 
            value={settings.orderFormat || 'serial'} 
            onChange={v => updateSetting('orderFormat', v)} 
          />
        </div>

        {/* ── APP CUSTOMISATION ── */}
        <SectionHeader icon="list" label="App Customisation:" />
        
        <SettingRow icon="person" label="Customize when to send Message to Cu...">
           <Toggle value={false} onChange={() => {}} />
        </SettingRow>

        <SettingRow icon="person" label="Customize Terms on Bill:">
           <Toggle value={false} onChange={() => {}} />
        </SettingRow>

        <SettingRow icon="person" label="Customize Bill Number:">
           <Toggle value={false} onChange={() => {}} />
        </SettingRow>

        <SettingRow icon="person" label="Hide Standard Dress Items:">
           <Toggle value={false} onChange={() => {}} />
        </SettingRow>

        <div className={styles.row} onClick={() => {}}>
          <div className={styles.rowIcon}><span className="mi">person</span></div>
          <div className={styles.rowText}><div className={styles.rowLabel}>Default No. of Days to Show in Order List:</div></div>
          <div className={styles.rowRight}>
             <span className={styles.valueText}>90</span>
             <span className="mi" style={{fontSize: '1.1rem', marginLeft: 4}}>edit</span>
          </div>
        </div>

        {/* ── TEMPLATES ── */}
        <SectionHeader icon="grid_view" label="Templates:" />

        <div className={styles.row} onClick={() => setInvoiceModal(true)}>
          <div className={styles.rowIcon}><span className="mi">picture_as_pdf</span></div>
          <div className={styles.rowText}><div className={styles.rowLabel}>Invoice Format:</div></div>
          <div className={styles.rowRight}>
             <span className={styles.valueText}>Standard (A5)</span>
             <span className="mi" style={{fontSize: '1.1rem', marginLeft: 4}}>edit</span>
          </div>
        </div>

        <div className={styles.row} onClick={() => setTemplateModal(true)}>
          <div className={styles.rowIcon}><span className="mi">picture_as_pdf</span></div>
          <div className={styles.rowText}><div className={styles.rowLabel}>Order PDF Format:</div></div>
          <div className={styles.rowRight}>
             <span className={styles.valueText}>Quick Print (A5)</span>
             <span className="mi" style={{fontSize: '1.1rem', marginLeft: 4}}>edit</span>
          </div>
        </div>

        {/* ── ACTIONS ── */}
        <div className={styles.btnContainer}>
            <button className={styles.saveBtn}>Save Settings</button>
            <button className={styles.deleteBtn} onClick={() => setClearConfirm(true)}>Delete My Account</button>
        </div>

        <div style={{ height: 40 }} />
      </div>

      <ConfirmSheet
        open={clearConfirm}
        title="Delete Account?"
        onConfirm={() => { localStorage.clear(); setClearConfirm(false); showToast('Cleared') }}
        onCancel={() => setClearConfirm(false)}
      />
      <Toast message={toastMsg} />
    </div>
  )
}
