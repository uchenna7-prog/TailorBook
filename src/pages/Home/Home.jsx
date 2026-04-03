import { useNavigate } from 'react-router-dom'
import { useCustomers } from '../../contexts/CustomerContext'
import { useOrders }    from '../../contexts/OrdersContext'
import { useTasks }     from '../../contexts/TaskContext'
import { useAuth }      from '../../contexts/AuthContext'
import Header from '../../components/Header/Header'
import styles from './Home.module.css'

// ── Helpers ───────────────────────────────────────────────────

function isTaskOverdue(task) {
  if (!task.dueDate || task.done) return false
  return new Date(task.dueDate + 'T23:59:59') < new Date()
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const PRIORITY_COLORS = {
  low:    '#94a3b8',
  normal: '#818cf8',
  high:   '#fb923c',
  urgent: '#ef4444',
}

const CATEGORY_ICONS = {
  general: 'assignment', sewing: 'content_cut', delivery: 'local_shipping',
  payment: 'payments',   fitting: 'checkroom',  shopping: 'shopping_cart',
}

function Home({ onMenuClick }) {
  const navigate = useNavigate()
  const { user }      = useAuth()
  const { customers } = useCustomers()
  const { allOrders } = useOrders()
  const { tasks }     = useTasks()

  // ── Second name logic ─────────────────────────────────────
  // "Uchendu Uchenna Daniel" → "Uchenna"
  // "Uchendu Daniel"         → "Daniel"
  // single name / email      → that name
  const displayName = (() => {
    const full = user?.displayName?.trim()
    if (full) {
      const parts = full.split(/\s+/)
      return parts.length >= 2 ? parts[1] : parts[0]
    }
    return user?.email?.split('@')[0] ?? 'there'
  })()

  // ── Stats ─────────────────────────────────────────────────
  const thisMonth = new Date()
  const newCustomersThisMonth = customers.filter(c => {
    if (!c.date) return false
    const d = new Date(c.date)
    return d.getMonth() === thisMonth.getMonth() && d.getFullYear() === thisMonth.getFullYear()
  }).length

  const pendingOrders  = allOrders.filter(o => !['completed', 'delivered', 'cancelled'].includes(o.status))
  const unpaidInvoices = allOrders.filter(o => o.paymentStatus !== 'Paid' && o.invoiceGenerated)
  const pendingTasks   = tasks.filter(t => !t.done && !isTaskOverdue(t))

  // ── Recent lists ──────────────────────────────────────────
  const recentOrders = [...pendingOrders].slice(0, 4)
  const recentTasks  = [...tasks].filter(t => !t.done).slice(0, 4)

  return (
    <div className={styles.pageWrapper}>
      <Header onMenuClick={onMenuClick} />

      <main className={styles.main}>

        {/* HERO */}
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Hey, <span>{displayName} 👋</span>
          </h1>
          <p className={styles.subtitle}>
            Here's what's happening in your shop today.
          </p>
        </section>

        {/* STATS */}
        <section className={styles.statsGrid}>
          {/* Customers */}
          <div className={styles.statCard} onClick={() => navigate('/customers')}>
            <div className={styles.statIconWrap}>
              <span className="mi" style={{ fontSize: '1.4rem', color: '#818cf8' }}>groups</span>
            </div>
            <div>
              <div className={styles.statValue}>{customers.length}</div>
              <div className={styles.statLabel}>Total Clients</div>
              {newCustomersThisMonth > 0 && (
                <div className={styles.statSub}>+{newCustomersThisMonth} this month</div>
              )}
            </div>
          </div>

          {/* Pending Orders */}
          <div className={styles.statCard} onClick={() => navigate('/orders')}>
            <div className={styles.statIconWrap}>
              <span className="mi" style={{ fontSize: '1.4rem', color: '#fb923c' }}>content_cut</span>
            </div>
            <div>
              <div className={styles.statValue}>{pendingOrders.length}</div>
              <div className={styles.statLabel}>Pending Orders</div>
            </div>
          </div>

          {/* Unpaid Invoices */}
          <div className={styles.statCard} onClick={() => navigate('/invoices')}>
            <div className={styles.statIconWrap}>
              <span className="mi" style={{ fontSize: '1.4rem', color: '#ef4444' }}>receipt_long</span>
            </div>
            <div>
              <div className={styles.statValue}>{unpaidInvoices.length}</div>
              <div className={styles.statLabel}>Unpaid Invoices</div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className={styles.statCard} onClick={() => navigate('/tasks')}>
            <div className={styles.statIconWrap}>
              <span className="mi" style={{ fontSize: '1.4rem', color: '#22c55e' }}>task_alt</span>
            </div>
            <div>
              <div className={styles.statValue}>{pendingTasks.length}</div>
              <div className={styles.statLabel}>Pending Tasks</div>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Quick Actions</h3>
          <div className={styles.actionList}>
            <button onClick={() => navigate('/customers')}>
              <span className="mi">person_add</span> Add Customer
            </button>
            <button onClick={() => navigate('/tasks')}>
              <span className="mi">add_task</span> Manage Tasks
            </button>
            <button onClick={() => navigate('/customers')}>
              <span className="mi">arrow_forward</span> View All Customers
            </button>
          </div>
        </section>

        {/* RECENT ORDERS */}
        {recentOrders.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Recent Orders</h3>
              <button className={styles.seeAllBtn} onClick={() => navigate('/orders')}>See all</button>
            </div>

            <div className={styles.listSection}>
              <div className={styles.listDivider} />
              {recentOrders.map((order, idx) => {
                const isLast = idx === recentOrders.length - 1
                const priceStr = order.price !== null && order.price !== undefined
                  ? `₦${Number(order.price).toLocaleString()}` : '—'
                return (
                  <div key={order.id} className={`${styles.listItem} ${isLast ? styles.listItemLast : ''}`}>
                    <div className={styles.listOuter}>
                      <div className={styles.listInner}>
                        <span className="mi" style={{ fontSize: '1.3rem', color: 'var(--text3)' }}>content_cut</span>
                      </div>
                    </div>
                    <div className={styles.listInfo}>
                      <div className={styles.listDesc}>{order.desc ?? 'Order'}</div>
                      <div className={styles.listMeta}>
                        <span className="mi" style={{ fontSize: '0.78rem', color: 'var(--text3)', verticalAlign: 'middle' }}>person</span>
                        <span className={styles.listMetaText}>{order.customerName || '—'}</span>
                      </div>
                      <div className={styles.listMeta}>
                        <span className="mi" style={{ fontSize: '0.78rem', color: 'var(--text3)', verticalAlign: 'middle' }}>autorenew</span>
                        <span className={styles.listMetaText}>{order.status || 'Pending'}</span>
                      </div>
                      {order.due && (
                        <div className={styles.listDue}>Due On {order.due}</div>
                      )}
                    </div>
                    <div className={styles.listRight}>
                      <div className={styles.listPrice}>{priceStr}</div>
                      {order.qty > 1 && <div className={styles.listQty}>×{order.qty}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* RECENT TASKS */}
        {recentTasks.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Recent Tasks</h3>
              <button className={styles.seeAllBtn} onClick={() => navigate('/tasks')}>See all</button>
            </div>

            <div className={styles.listSection}>
              <div className={styles.listDivider} />
              {recentTasks.map((task, idx) => {
                const isLast    = idx === recentTasks.length - 1
                const overdue   = isTaskOverdue(task)
                const iconColor = overdue ? '#ef4444' : (PRIORITY_COLORS[task.priority] || '#818cf8')
                const catIcon   = CATEGORY_ICONS[task.category] || 'assignment'
                return (
                  <div key={task.id} className={`${styles.listItem} ${isLast ? styles.listItemLast : ''}`}>
                    <div className={styles.listOuter} style={overdue ? { borderColor: 'rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.05)' } : {}}>
                      <div className={styles.listInner}>
                        <span className="mi" style={{ fontSize: '1.3rem', color: iconColor }}>{catIcon}</span>
                      </div>
                    </div>
                    <div className={styles.listInfo}>
                      <div className={styles.listDesc}>{task.desc}</div>
                      {task.customerName && (
                        <div className={styles.listMeta}>
                          <span className="mi" style={{ fontSize: '0.78rem', color: 'var(--text3)', verticalAlign: 'middle' }}>person</span>
                          <span className={styles.listMetaText}>{task.customerName}</span>
                        </div>
                      )}
                      <div className={styles.listMeta}>
                        <span className="mi" style={{ fontSize: '0.78rem', color: 'var(--text3)', verticalAlign: 'middle' }}>autorenew</span>
                        <span className={styles.listMetaText} style={{ color: overdue ? '#ef4444' : undefined }}>
                          {overdue ? 'Overdue' : (task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Normal')}
                        </span>
                      </div>
                      {task.dueDate && (
                        <div className={styles.listDue} style={{ color: overdue ? '#ef4444' : undefined }}>
                          Due On {formatDate(task.dueDate)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

      </main>
    </div>
  )
}

export default Home
