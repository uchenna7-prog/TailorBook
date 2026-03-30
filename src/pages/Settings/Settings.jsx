import { useState, useRef, useCallback } from 'react'
import { useSettings } from '../../contexts/SettingsContext'
import Header from '../../components/Header/Header'
import Toast from '../../components/Toast/Toast'
import ConfirmSheet from '../../components/ConfirmSheet/ConfirmSheet'
import styles from './Settings.module.css'

// ── SMALL REUSABLE COMPONENTS ──

function SectionHeader({ icon, label }) {
  return (
    <div className={styles.sectionHeader}>
      <span className="mi" style={{ fontSize: '1rem', color: 'var(--text3)' }}>{icon}</span>
      <span className={styles.sectionLabel}>{label}</span>
    </div>
  )
}

function SettingRow({ icon, label, sub, children, onClick, chevron }) {
  return (
    <div className={`${styles.row} ${onClick ? styles.rowTappable : ''}`} onClick={onClick}>
      <div className={styles.rowIcon}>
        <span className="mi" style={{ fontSize: '1.15rem' }}>{icon}</span>
      </div>
      <div className={styles.rowText}>
        {label && <div className={styles.rowLabel}>{label}</div>}
        {sub && <div className={styles.rowSub}>{sub}</div>}
      </div>
      <div className={styles.rowRight}>
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
          {opt.icon && <span className="mi" style={{ fontSize: '1rem' }}>{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ── MAIN PAGE ──
export default function Settings({ onMenuClick }) {
  const { settings, updateSetting, resetSettings } = useSettings()
  const [toastMsg, setToastMsg]   = useState('')
  const [clearConfirm, setClearConfirm]   = useState(false)
  const [resetConfirm, setResetConfirm]   = useState(false)
  const toastTimer = useRef(null)

  const showToast = useCallback((msg) => {
    setToastMsg(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(''), 2400)
  }, [])

  const handleClearData = () => {
    const keys = Object.keys(localStorage).filter(k => k !== 'tailorbook_settings')
    keys.forEach(k => localStorage.removeItem(k))
    setClearConfirm(false)
    showToast('All data cleared')
  }

  const handleResetSettings = () => {
    resetSettings()
    setResetConfirm(false)
    showToast('Settings reset to defaults')
  }

  const handleExportData = () => {
    try {
      const data = {}
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('tailorbook')) data[k] = JSON.parse(localStorage.getItem(k))
      })
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `tailorbook-backup-${new Date().toISOString().slice(0,10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast('Data exported ✓')
    } catch {
      showToast('Export failed')
    }
  }

  const THEME_OPTIONS = [
    { value: 'dark', label: 'Dark', icon: 'dark_mode' },
    { value: 'light', label: 'Light', icon: 'light_mode' },
    { value: 'system', label: 'System', icon: 'brightness_auto' },
  ]

  const TEMPLATE_OPTIONS = [
    { value: 'classic', label: 'Classic' },
    { value: 'modern', label: 'Modern' },
    { value: 'minimal', label: 'Minimal' },
  ]

  return (
    <div className={styles.page}>
      <Header onMenuClick={onMenuClick} />

      <div className={styles.scrollArea}>

        {/* ── APPEARANCE ── */}
        <SectionHeader icon="palette" label="Appearance" />
        <div className={styles.card}>
          <SettingRow icon="dark_mode">
            <SegmentControl
              options={THEME_OPTIONS}
              value={settings.theme}
              onChange={v => { updateSetting('theme', v); showToast(`${v} mode`) }}
            />
          </SettingRow>
        </div>

        {/* ── INVOICE ── */}
        <SectionHeader icon="receipt_long" label="Invoice" />
        <div className={styles.card}>

          <SettingRow icon="dashboard_customize" label="Invoice Template">
            <SegmentControl
              options={TEMPLATE_OPTIONS}
              value={settings.invoiceTemplate || 'classic'}
              onChange={v => { updateSetting('invoiceTemplate', v); showToast('Template updated ✓') }}
            />
          </SettingRow>

          <div className={styles.divider} />

          <SettingRow
            icon="tag"
            label="Invoice Prefix"
            sub={`Invoices will be numbered ${settings.invoicePrefix}-001...`}
          >
            <span className={styles.rowValue}>{settings.invoicePrefix}</span>
          </SettingRow>
        </div>

        {/* ── DATA ── */}
        <SectionHeader icon="storage" label="Data Management" />
        <div className={styles.card}>
          <SettingRow icon="download" label="Export Data" onClick={handleExportData} chevron />
          <div className={styles.divider} />
          <SettingRow icon="restart_alt" label="Reset Settings" onClick={() => setResetConfirm(true)} chevron />
          <div className={styles.divider} />
          <SettingRow icon="delete_forever" label="Clear All Data" onClick={() => setClearConfirm(true)} chevron>
            <span style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 700 }}>Danger</span>
          </SettingRow>
        </div>

        <div style={{ height: 40 }} />
      </div>

      <ConfirmSheet
        open={clearConfirm}
        title="Clear All Data?"
        message="This cannot be undone."
        onConfirm={handleClearData}
        onCancel={() => setClearConfirm(false)}
      />

      <ConfirmSheet
        open={resetConfirm}
        title="Reset Settings?"
        message="All settings will return to defaults."
        onConfirm={handleResetSettings}
        onCancel={() => setResetConfirm(false)}
      />

      <Toast message={toastMsg} />
    </div>
  )
}