import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import styles from './Home.module.css'

const QUICK_ACTIONS = [
  { icon: 'person_add', label: 'New Client', path: '/customers' },
  { icon: 'shopping_bag', label: 'View Orders', path: '/orders' },
  { icon: 'add_task', label: 'New Task', path: '/tasks' },
  { icon: 'receipt_long', label: 'View Invoice', path: '/invoices' },
]

const RECENT_ORDERS = [
  { name: 'Senator Wear - David', due: 'Pickup: March 30', status: 'Ready' },
  { name: 'Wedding Gown - Amaka', due: 'Pickup: April 2', status: 'In Progress' },
]

function Home({ onMenuClick }) {
  const navigate = useNavigate()

  return (
    <>
      <Header onMenuClick={onMenuClick} />

      <main className={styles.main}>
        {/* Greeting */}
        <section className={styles.section}>
          <p className={styles.greetSub}>Welcome back ✨</p>
          <h1 className={styles.greetTitle}>Uchenna</h1>
          <p className={styles.greetDesc}>
            Your atelier is active today with new clients and premium orders.
          </p>
        </section>

        {/* Overview */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Business Overview</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statVal}>24</span>
              <span className={styles.statLabel}>Clients</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statVal}>8</span>
              <span className={styles.statLabel}>Active Orders</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statVal}>₦120k</span>
              <span className={styles.statLabel}>Revenue</span>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* Quick Actions */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <div
                key={action.path}
                className={styles.actionBox}
                onClick={() => navigate(action.path)}
              >
                <span className={`mi ${styles.icon}`}>{action.icon}</span>
                <span>{action.label}</span>
              </div>
            ))}
          </div>
        </section>

        <hr className={styles.divider} />

        {/* Recent Orders */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Orders</h2>

          {RECENT_ORDERS.map((order) => (
            <div key={order.name} className={styles.taskCard}>
              <div className={styles.taskInfo}>
                <div className={styles.taskName}>{order.name}</div>
                <div className={styles.taskDate}>{order.due}</div>
              </div>

              <div className={styles.statusChip}>
                {order.status}
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  )
}

export default Home