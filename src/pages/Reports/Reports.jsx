// src/pages/Reports/Reports.jsx
// Improved: Total Orders (not sales) · Part Payments + Full Payments · Premium UI

import { useState, useMemo } from 'react'
import { useOrders }    from '../../contexts/OrdersContext'
import { useTasks }     from '../../contexts/TaskContext'
import { usePayments }  from '../../contexts/PaymentContext'
import { useCustomers } from '../../contexts/CustomerContext'
import Header from '../../components/Header/Header'
import styles from './Reports.module.css'

// ── Period helpers ────────────────────────────────────────────

const PERIODS = [
  { id: 'week',  label: 'This week'     },
  { id: 'month', label: 'This month'    },
  { id: '3mo',   label: 'Last 3 months' },
  { id: 'year',  label: 'This year'     },
  { id: 'all',   label: 'All time'      },
]

function periodStart(id) {
  const now = new Date()
  switch (id) {
    case 'week': {
      const d = new Date(now)
      d.setDate(d.getDate() - d.getDay())
      d.setHours(0,0,0,0)
      return d
    }
    case 'month':  return new Date(now.getFullYear(), now.getMonth(), 1)
    case '3mo':    return new Date(now.getFullYear(), now.getMonth() - 2, 1)
    case 'year':   return new Date(now.getFullYear(), 0, 1)
    default:       return null // all time
  }
}

function parseItemDate(item) {
  if (item.createdAt?.toDate) return item.createdAt.toDate()
  if (item.createdAt?.seconds) return new Date(item.createdAt.seconds * 1000)
  if (item.date) return new Date(item.date)
  return null
}

function inPeriod(item, start) {
  if (!start) return true
  const d = parseItemDate(item)
  if (!d) return false
  return d >= start
}

function fmt(amount) {
  const n = parseFloat(amount) || 0
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `₦${(n / 1_000).toFixed(1)}K`
  return `₦${n.toLocaleString('en-NG')}`
}

function pct(part, total) {
  if (!total) return 0
  return Math.round((part / total) * 100)
}

// ── Build payment bars ────────────────────────────────────────

function buildPaymentBars(installments, period) {
  const start = periodStart(period)

  if (period === 'week' || period === 'month') {
    const map = {}
    installments.forEach(inst => {
      const d = new Date(inst.date)
      if (!d || isNaN(d)) return
      if (start && d < start) return
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      map[key] = (map[key] || 0) + (parseFloat(inst.amount) || 0)
    })
    return Object.entries(map).map(([label, value]) => ({ label, value })).slice(-14)
  }

  if (period === '3mo' || period === 'year' || period === 'all') {
    const map = {}
    installments.forEach(inst => {
      const d = new Date(inst.date)
      if (!d || isNaN(d)) return
      if (start && d < start) return
      const key = d.toLocaleDateString('en-US', { month: 'short', year: period === 'all' ? '2-digit' : undefined })
      map[key] = (map[key] || 0) + (parseFloat(inst.amount) || 0)
    })
    return Object.entries(map).map(([label, value]) => ({ label, value }))
  }

  return []
}

// ── Donut Chart ───────────────────────────────────────────────

function DonutChart({ segments, centerLabel, centerSub }) {
  const R  = 52
  const CX = 64
  const CY = 64
  const circumference = 2 * Math.PI * R
  const gap = 2 // gap between segments in px

  const sum = segments.reduce((s, seg) => s + seg.value, 0)
  let offset = 0
  const arcs = segments.map(seg => {
    const pctVal = sum > 0 ? seg.value / sum : 0
    const dash   = Math.max(0, pctVal * circumference - gap)
    const arc    = { dash, gap: circumference - dash, offset: circumference - offset, color: seg.color }
    offset += pctVal * circumference
    return arc
  })

  return (
    <svg width="128" height="128" viewBox="0 0 128 128" className={styles.donutSvg}>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--border)" strokeWidth="14" />
      {sum === 0 ? (
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--border2)" strokeWidth="14" />
      ) : (
        arcs.map((arc, i) => arc.dash > 0 && (
          <circle
            key={i}
            cx={CX} cy={CY} r={R}
            fill="none"
            stroke={arc.color}
            strokeWidth="14"
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            strokeDashoffset={arc.offset}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dasharray 0.5s ease' }}
          />
        ))
      )}
      <text x={CX} y={CY - 7} textAnchor="middle" className={styles.donutNum}>{centerLabel}</text>
      <text x={CX} y={CY + 9} textAnchor="middle" className={styles.donutSub}>{centerSub}</text>
    </svg>
  )
}

// ── Horizontal Progress Bar ───────────────────────────────────

function HorizBar({ value, max, color }) {
  const w = max > 0 ? Math.max(2, (value / max) * 100) : 0
  return (
    <div className={styles.horizTrack}>
      <div className={styles.horizFill} style={{ width: `${w}%`, background: color }} />
    </div>
  )
}

// ── Bar Chart ─────────────────────────────────────────────────

function BarChart({ bars, color = 'var(--accent)' }) {
  if (!bars.length) return null
  const max = Math.max(...bars.map(b => b.value), 1)
  const avg = bars.reduce((s, b) => s + b.value, 0) / bars.length

  return (
    <div className={styles.barChartWrap}>
      {/* Average line hint */}
      <div className={styles.barAvgLine} style={{ bottom: `${Math.max(3, (avg / max) * 68)}px` }}>
        <span className={styles.barAvgLabel}>avg {fmt(avg)}</span>
      </div>
      <div className={styles.barChart}>
        {bars.map((bar, i) => (
          <div key={i} className={styles.barCol}>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ height: `${Math.max(3, (bar.value / max) * 100)}%`, background: color }}
                title={fmt(bar.value)}
              />
            </div>
            <div className={styles.barLabel}>{bar.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Mini Trend Sparkline ──────────────────────────────────────

function Sparkline({ bars, color }) {
  if (!bars || bars.length < 2) return null
  const max = Math.max(...bars.map(b => b.value), 1)
  const W = 60, H = 22
  const pts = bars.map((b, i) => {
    const x = (i / (bars.length - 1)) * W
    const y = H - (b.value / max) * H
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={W} height={H} className={styles.sparkline}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Period Selector ───────────────────────────────────────────

function PeriodSelector({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const current = PERIODS.find(p => p.id === value)
  return (
    <div className={styles.periodWrap}>
      <button className={styles.periodBtn} onClick={() => setOpen(p => !p)}>
        {current.label}
        <span className="mi" style={{ fontSize: '0.85rem' }}>expand_more</span>
      </button>
      {open && (
        <>
          <div className={styles.periodBackdrop} onClick={() => setOpen(false)} />
          <div className={styles.periodDropdown}>
            {PERIODS.map(p => (
              <button
                key={p.id}
                className={`${styles.periodOption} ${value === p.id ? styles.periodOptionActive : ''}`}
                onClick={() => { onChange(p.id); setOpen(false) }}
              >
                {p.label}
                {value === p.id && <span className="mi" style={{ fontSize: '0.85rem', marginLeft: 'auto', color: 'var(--accent)' }}>check</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Section Wrapper ───────────────────────────────────────────

function Section({ title, period, onPeriodChange, accent, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div className={styles.sectionTitle}>
          {accent && <span className={styles.sectionAccent} style={{ background: accent }} />}
          {title}
        </div>
        <PeriodSelector value={period} onChange={onPeriodChange} />
      </div>
      {children}
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color = 'var(--accent)', trend, sparkBars }) {
  const trendUp = trend > 0
  const trendDown = trend < 0
  return (
    <div className={styles.statCard}>
      <div className={styles.statTop}>
        <div className={styles.statIcon} style={{ background: `${color}18`, color }}>
          <span className="mi" style={{ fontSize: '1.2rem' }}>{icon}</span>
        </div>
        {sparkBars && <Sparkline bars={sparkBars} color={color} />}
      </div>
      <div className={styles.statInfo}>
        <div className={styles.statLabel}>{label}</div>
        <div className={styles.statValue}>{value}</div>
        {sub && (
          <div className={styles.statSub}>
            {trend !== undefined && (
              <span className={trendUp ? styles.trendUp : trendDown ? styles.trendDown : styles.trendFlat}>
                <span className="mi" style={{ fontSize: '0.7rem' }}>{trendUp ? 'arrow_upward' : trendDown ? 'arrow_downward' : 'remove'}</span>
                {Math.abs(trend)}%
              </span>
            )}
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Legend ────────────────────────────────────────────────────

function Legend({ items }) {
  return (
    <div className={styles.legend}>
      {items.map((item, i) => (
        <div key={i} className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: item.color }} />
          <div>
            <div className={styles.legendVal}>{item.value}</div>
            <div className={styles.legendLabel}>{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Payment Pill ──────────────────────────────────────────────

function PayPill({ label, value, color, icon, sub }) {
  return (
    <div className={styles.payPill} style={{ borderColor: `${color}28`, background: `${color}0d` }}>
      <div className={styles.payPillIcon} style={{ color, background: `${color}18` }}>
        <span className="mi" style={{ fontSize: '1rem' }}>{icon}</span>
      </div>
      <div className={styles.payPillBody}>
        <div className={styles.payPillVal} style={{ color }}>{value}</div>
        <div className={styles.payPillLabel}>{label}</div>
        {sub && <div className={styles.payPillSub}>{sub}</div>}
      </div>
    </div>
  )
}

// ── Order Status Row ──────────────────────────────────────────

function OrderRow({ label, count, total, color }) {
  return (
    <div className={styles.orderRow}>
      <div className={styles.orderRowLeft}>
        <div className={styles.orderDot} style={{ background: color }} />
        <span className={styles.orderRowLabel}>{label}</span>
      </div>
      <div className={styles.orderRowRight}>
        <span className={styles.orderRowCount} style={{ color }}>{count}</span>
        <HorizBar value={count} max={total} color={color} />
        <span className={styles.orderRowPct}>{pct(count, total)}%</span>
      </div>
    </div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────

export default function Reports({ onMenuClick }) {
  const { allOrders }   = useOrders()
  const { tasks }       = useTasks()
  const { allPayments } = usePayments()
  const { customers }   = useCustomers()

  const [perfPeriod,  setPerfPeriod]  = useState('month')
  const [orderPeriod, setOrderPeriod] = useState('month')
  const [taskPeriod,  setTaskPeriod]  = useState('month')
  const [payPeriod,   setPayPeriod]   = useState('month')
  const [custPeriod,  setCustPeriod]  = useState('month')

  // ── Orders stats ──────────────────────────────────────────
  const orderStats = useMemo(() => {
    const start    = periodStart(orderPeriod)
    const flat     = Array.isArray(allOrders) ? allOrders : []
    const filtered = flat.filter(o => inPeriod(o, start))
    const delivered  = filtered.filter(o => o.status === 'delivered').length
    const inProgress = filtered.filter(o => o.status === 'pending' || o.status === 'in_progress').length
    const completed  = filtered.filter(o => o.status === 'completed').length
    const overdue    = filtered.filter(o => {
      if (!o.due) return false
      return new Date(o.due + 'T23:59:59') < new Date() && o.status !== 'delivered' && o.status !== 'completed'
    }).length
    return { total: filtered.length, delivered, inProgress, completed, overdue }
  }, [allOrders, orderPeriod])

  // ── Tasks stats ───────────────────────────────────────────
  const taskStats = useMemo(() => {
    const start    = periodStart(taskPeriod)
    const filtered = tasks.filter(t => inPeriod(t, start))
    const done     = filtered.filter(t => t.done).length
    const pending  = filtered.filter(t => !t.done && new Date(t.dueDate + 'T23:59:59') >= new Date()).length
    const overdue  = filtered.filter(t => {
      if (!t.dueDate || t.done) return false
      return new Date(t.dueDate + 'T23:59:59') < new Date()
    }).length
    return { total: filtered.length, done, pending, overdue }
  }, [tasks, taskPeriod])

  // ── Payment stats ─────────────────────────────────────────
  const payStats = useMemo(() => {
    const start = periodStart(payPeriod)
    const installments = []
    allPayments.forEach(p => {
      ;(p.installments || []).forEach(inst => installments.push({ ...inst, paymentStatus: p.status }))
    })
    const filtered = installments.filter(inst => {
      const d = new Date(inst.date)
      return !isNaN(d) && (!start || d >= start)
    })
    const totalReceived  = filtered.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0)
    const unpaidCount    = allPayments.filter(p => p.status === 'not_paid').length
    const partCount      = allPayments.filter(p => p.status === 'part').length
    const fullCount      = allPayments.filter(p => p.status === 'paid').length  // ← "Full Payments"
    const bars           = buildPaymentBars(filtered, payPeriod)

    // Amount still outstanding from part-pay orders
    const outstanding = allPayments
      .filter(p => p.status === 'part')
      .reduce((s, p) => {
        const total = parseFloat(p.totalAmount) || 0
        const paid  = (p.installments || []).reduce((a, i) => a + (parseFloat(i.amount) || 0), 0)
        return s + Math.max(0, total - paid)
      }, 0)

    return { totalReceived, unpaidCount, partCount, fullCount, outstanding, bars }
  }, [allPayments, payPeriod])

  // ── Performance stats ─────────────────────────────────────
  const perfStats = useMemo(() => {
    const start   = periodStart(perfPeriod)
    const flat    = Array.isArray(allOrders) ? allOrders : []
    const filtered = flat.filter(o => inPeriod(o, start))

    // "Total Orders" = count of orders in period  (NOT a currency total)
    const totalOrders = filtered.length
    // Order value = sum of order prices (used as revenue estimate)
    const orderValue  = filtered.reduce((s, o) => s + (parseFloat(o.price) || 0), 0)

    let payReceived = 0
    const instStart = periodStart(perfPeriod)
    allPayments.forEach(p => {
      ;(p.installments || []).forEach(inst => {
        const d = new Date(inst.date)
        if (!isNaN(d) && (!instStart || d >= instStart)) {
          payReceived += parseFloat(inst.amount) || 0
        }
      })
    })

    const collectionRate = orderValue > 0 ? Math.round((payReceived / orderValue) * 100) : 0

    return { totalOrders, orderValue, payReceived, collectionRate }
  }, [allOrders, allPayments, perfPeriod])

  // ── Customer stats ────────────────────────────────────────
  const custStats = useMemo(() => {
    const start      = periodStart(custPeriod)
    const newClients = customers.filter(c => inPeriod(c, start)).length
    // Repeat = placed more than 1 order
    const orderCountPerCustomer = {}
    ;(Array.isArray(allOrders) ? allOrders : []).forEach(o => {
      if (o.customerId) orderCountPerCustomer[o.customerId] = (orderCountPerCustomer[o.customerId] || 0) + 1
    })
    const repeatCount = Object.values(orderCountPerCustomer).filter(c => c > 1).length
    return { total: customers.length, newClients, repeatCount }
  }, [customers, custPeriod, allOrders])

  return (
    <div className={styles.page}>
      <Header onMenuClick={onMenuClick} title="Reports" />

      <div className={styles.scrollArea}>

        {/* ── PERFORMANCE OVERVIEW ── */}
        <Section
          title="Performance"
          period={perfPeriod}
          onPeriodChange={setPerfPeriod}
          accent="#818cf8"
        >
          {/* Collection rate banner */}
          <div className={styles.collectionBanner}>
            <div className={styles.collectionLeft}>
              <div className={styles.collectionRate}>{perfStats.collectionRate}%</div>
              <div className={styles.collectionLabel}>Collection Rate</div>
            </div>
            <div className={styles.collectionBar}>
              <div className={styles.collectionFill} style={{ width: `${perfStats.collectionRate}%` }} />
            </div>
          </div>

          <div className={styles.statGrid}>
            <StatCard
              icon="receipt_long"
              label="Total Orders"
              value={perfStats.totalOrders}
              sub="in period"
              color="#818cf8"
            />
            <StatCard
              icon="payments"
              label="Order Value"
              value={fmt(perfStats.orderValue)}
              sub="est. revenue"
              color="#818cf8"
            />
            <StatCard
              icon="account_balance_wallet"
              label="Received"
              value={fmt(perfStats.payReceived)}
              color="#22c55e"
            />
            <StatCard
              icon="pending_actions"
              label="Outstanding"
              value={fmt(Math.max(0, perfStats.orderValue - perfStats.payReceived))}
              color="#fb923c"
            />
          </div>
        </Section>

        {/* ── ORDERS ── */}
        <Section
          title="Orders"
          period={orderPeriod}
          onPeriodChange={setOrderPeriod}
          accent="var(--accent)"
        >
          <div className={styles.chartCard}>
            <div className={styles.chartCardTop}>
              <DonutChart
                segments={[
                  { value: orderStats.delivered,  color: 'var(--accent)' },
                  { value: orderStats.inProgress, color: '#818cf8' },
                  { value: orderStats.completed,  color: '#22c55e' },
                  { value: orderStats.overdue,    color: '#ef4444' },
                ]}
                centerLabel={orderStats.total}
                centerSub="Total"
              />
              <div className={styles.orderRows}>
                <OrderRow label="Delivered"   count={orderStats.delivered}  total={orderStats.total} color="var(--accent)" />
                <OrderRow label="In Progress" count={orderStats.inProgress} total={orderStats.total} color="#818cf8" />
                <OrderRow label="Completed"   count={orderStats.completed}  total={orderStats.total} color="#22c55e" />
                <OrderRow label="Overdue"     count={orderStats.overdue}    total={orderStats.total} color="#ef4444" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── PAYMENTS ── */}
        <Section
          title="Payments"
          period={payPeriod}
          onPeriodChange={setPayPeriod}
          accent="#22c55e"
        >
          <div className={styles.chartCard}>
            {/* 3 payment pills: Part Payments · Full Payments · Unpaid */}
            <div className={styles.payPills}>
              <PayPill
                icon="splitscreen"
                label="Part Payments"
                value={payStats.partCount}
                color="#fb923c"
                sub={payStats.outstanding > 0 ? `${fmt(payStats.outstanding)} left` : null}
              />
              <PayPill
                icon="check_circle"
                label="Full Payments"
                value={payStats.fullCount}
                color="#22c55e"
              />
              <PayPill
                icon="cancel"
                label="Unpaid"
                value={payStats.unpaidCount}
                color="#ef4444"
              />
            </div>

            {/* Received amount hero */}
            <div className={styles.receivedHero}>
              <div className={styles.receivedLabel}>Total Received</div>
              <div className={styles.receivedVal}>{fmt(payStats.totalReceived)}</div>
            </div>

            {/* Bar chart */}
            {payStats.bars.length > 0 ? (
              <BarChart bars={payStats.bars} color="var(--accent)" />
            ) : (
              <div className={styles.noData}>No payment data for this period</div>
            )}
          </div>
        </Section>

        {/* ── TASKS ── */}
        <Section
          title="Tasks"
          period={taskPeriod}
          onPeriodChange={setTaskPeriod}
          accent="#fb923c"
        >
          <div className={styles.chartCard}>
            <div className={styles.chartCardTop}>
              <DonutChart
                segments={[
                  { value: taskStats.done,    color: '#22c55e' },
                  { value: taskStats.pending, color: '#818cf8' },
                  { value: taskStats.overdue, color: '#ef4444' },
                ]}
                centerLabel={`${pct(taskStats.done, taskStats.total)}%`}
                centerSub="Done"
              />
              <div className={styles.orderRows}>
                <OrderRow label="Completed"   count={taskStats.done}    total={taskStats.total} color="#22c55e" />
                <OrderRow label="In Progress" count={taskStats.pending} total={taskStats.total} color="#818cf8" />
                <OrderRow label="Overdue"     count={taskStats.overdue} total={taskStats.total} color="#ef4444" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── CUSTOMERS ── */}
        <Section
          title="Customers"
          period={custPeriod}
          onPeriodChange={setCustPeriod}
          accent="#818cf8"
        >
          <div className={styles.statGrid}>
            <StatCard
              icon="people"
              label="Total Clients"
              value={custStats.total}
              color="var(--accent)"
            />
            <StatCard
              icon="person_add"
              label="New This Period"
              value={custStats.newClients}
              color="#818cf8"
            />
            <StatCard
              icon="repeat"
              label="Repeat Clients"
              value={custStats.repeatCount}
              sub="2+ orders"
              color="#22c55e"
            />
            <StatCard
              icon="bar_chart"
              label="Avg Orders"
              value={custStats.total > 0 ? ((Array.isArray(allOrders) ? allOrders : []).length / custStats.total).toFixed(1) : '—'}
              sub="per client"
              color="#fb923c"
            />
          </div>
        </Section>

        <div style={{ height: 40 }} />
      </div>
    </div>
  )
}
