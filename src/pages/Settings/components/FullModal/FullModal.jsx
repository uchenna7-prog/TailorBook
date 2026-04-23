import styles from './FullModal.module.css'
import Header from '../../../../components/Header/Header'

export function FullModal({ title, onBack, onSave, children }) {
  return (
    <div className={styles.fullOverlay}>
      <div className={styles.modalCard}>
        <Header
          type="back"
          title={title}
          onBackClick={onBack}
          customActions={onSave ? [{ label: 'Save', onClick: onSave }] : []}
        />
        <div className={styles.fullContent}>
          {children}
        </div>
      </div>
    </div>
  )
}