import styles from "./SegmentControl.module.css"

export function SegmentControl({ options, value, onChange }) {
  return (
    <div className={styles.segment}>
      {options.map(opt=>(
        <button key={opt.value} className={`${styles.segBtn} ${value===opt.value?styles.segActive:''}`} onClick={()=>onChange(opt.value)}>{opt.label}</button>
      ))}
    </div>
  )
}