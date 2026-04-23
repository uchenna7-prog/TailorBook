import { useEffect } from 'react'
import styles from './FullModal.module.css'
import Header from '../../../../components/Header/Header'

export function FullModal({ title, onBack, onSave, children }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onBack() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onBack])

  return (
    <div className={styles.fullOverlay}>
      <div className={styles.modalCard}>
        <Header
          type="back"
          title={title}
          onBackClick={onBack}
          backIcon="close"
          customActions={onSave ? [{ label: 'Save', onClick: onSave }] : []}
        />
        <div className={styles.fullContent}>
          {children}
        </div>
      </div>
    </div>
  )
}