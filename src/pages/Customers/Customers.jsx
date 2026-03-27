import { useState, useRef } from 'react'
import styles from './Customers.module.css'

function Customers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const photoInputRef = useRef(null)

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  const openForm = () => setFormOpen(true)
  const closeForm = () => {
    setFormOpen(false)
    setName('')
    setPhone('')
    setPhoto(null)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) setPhoto(URL.createObjectURL(file))
  }

  const addCustomer = () => {
    if (!name) return
    setCustomers(prev => [...prev, { id: Date.now(), name, phone, photo }])
    closeForm()
  }

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id))
  }

  return (
    <>
      {/* SEARCH */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <span className="mi" style={{ color: 'var(--text3)', fontSize: '1.1rem' }}>search</span>
          <input
            type="text"
            placeholder="Search clients…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* SECTION LABEL */}
      <div className={styles.sectionLabel}>All Clients</div>

      {/* CUSTOMER LIST */}
      <div className={styles.scrollArea}>
        {filteredCustomers.length === 0 && customers.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👤</div>
            <p>No clients yet.</p>
            <span>Tap + to add your first client</span>
          </div>
        )}
        {filteredCustomers.length === 0 && customers.length > 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <p>No matches found.</p>
            <span>Try a different name or number</span>
          </div>
        )}
        {filteredCustomers.map(c => (
          <div key={c.id} className={styles.customerCard}>
            <div className={styles.custAvatar}>
              {c.photo ? <img src={c.photo} alt={c.name} /> : c.name[0]}
            </div>
            <div className={styles.custInfo}>
              <div className={styles.custName}>{c.name}</div>
              <div className={styles.custMeta}>{c.phone}</div>
            </div>
            <button
              className={styles.custDeleteBtn}
              onClick={() => deleteCustomer(c.id)}
            >✕</button>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button className={styles.fab} onClick={openForm}>
        <span className="mi">add</span>
      </button>

      {/* ADD CUSTOMER FORM */}
      <div className={`${styles.formOverlay} ${formOpen ? styles.open : ''}`}>
        <div className={styles.formHeader}>
          <button
            className="mi"
            onClick={closeForm}
            style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: '1.8rem', cursor: 'pointer' }}
          >arrow_back</button>
          <div className={styles.formHeaderTitle}>New Client</div>
          <div style={{ width: '36px' }} />
        </div>
        <div className={styles.formBody}>
          <div className={styles.photoPicker} onClick={() => photoInputRef.current.click()}>
            {!photo && <div className={styles.photoPickerInitials}>+</div>}
            {photo && <img src={photo} alt="Profile" />}
            <div className={styles.camBadge}><span className="mi" style={{ fontSize: '0.9rem' }}>photo_camera</span></div>
            <input type="file" accept="image/*" hidden ref={photoInputRef} onChange={handlePhotoChange} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Name</label>
            <input
              className={styles.formInput}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Phone</label>
            <input
              className={styles.formInput}
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+234 801 234 5678"
            />
          </div>
        </div>
        <div className={styles.formSaveBar}>
          <button className={styles.btnSave} onClick={addCustomer}>Add Client</button>
        </div>
      </div>
    </>
  )
}

export default Customers