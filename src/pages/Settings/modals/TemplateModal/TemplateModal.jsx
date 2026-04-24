import { useState, useRef } from "react"
import { useBrandTokens } from "../../../../hooks/useBrandTokens"
import Header from "../../../../components/Header/Header"
import styles from "./TemplateModal.module.css"
import { TEMPLATE_GROUPS } from "../../datas/invoiceTemplateGroups"
import { RECEIPT_TEMPLATE_GROUPS } from "../../datas/receiptTemplateGroups"

export function TemplateModal({ isOpen, currentTemplate, colourId, onClose, onSelect }) {
  const [selected, setSelected] = useState(currentTemplate || 'template1')
  const [activeTab, setActiveTab] = useState('invoice')
  const modalRef = useRef(null)
  useBrandTokens(colourId, modalRef)

  if (!isOpen) return null

  const groups = activeTab === 'invoice' ? TEMPLATE_GROUPS : RECEIPT_TEMPLATE_GROUPS

  return (
    <div className={styles.fullOverlay} ref={modalRef}>
      <Header
        type="back"
        title="Templates"
        onBackClick={onClose}
        customActions={[{ label: 'Select', onClick: () => { onSelect(selected); onClose() } }]}
      />
      <div className={styles.tabBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'invoice' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('invoice')}
        >
          <span className="mi" style={{ fontSize: '1rem' }}>receipt_long</span>
          Invoice
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'receipt' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('receipt')}
        >
          <span className="mi" style={{ fontSize: '1rem' }}>payments</span>
          Receipt
        </button>
      </div>
      <div className={styles.fullContent}>
        {groups.map((group, groupIndex) => (
          <div key={group.groupLabel}>
            <div className={`${styles.groupHeader} ${groupIndex === 0 ? styles.groupHeaderFirst : ''}`}>
              <div className={styles.groupHeaderInner}>
                <span className={styles.groupLabel}>{group.groupLabel}</span>
                {group.groupDesc && <span className={styles.groupDesc}>{group.groupDesc}</span>}
              </div>
            </div>
            <div className={styles.groupTemplates}>
              {group.templates.map(t => (
                <div key={t.id} className={styles.templateWrapper} onClick={() => setSelected(t.id)}>
                  <div className={`${styles.fullPreviewContainer} ${selected === t.id ? styles.fullPreviewActive : ''}`}>
                    <t.Component />
                  </div>
                  <div className={styles.templateInfo}>
                    <div className={`${styles.radio} ${selected === t.id ? styles.radioActive : ''}`} />
                    <div className={styles.templateLabelGroup}>
                      <span className={styles.templateLabel}>{t.label}</span>
                      {t.desc && <span className={styles.templateDesc}>{t.desc}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}