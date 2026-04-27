import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrders }      from '../../contexts/OrdersContext'
import { useCustomers }   from '../../contexts/CustomerContext'
import { useInvoices }    from '../../contexts/InvoiceContext'
import { usePayments }    from '../../contexts/PaymentContext'
import { useAuth }        from '../../contexts/AuthContext'
import Header             from '../../components/Header/Header'
import BottomNav          from '../../components/BottomNav/BottomNav'
import styles             from './Agent.module.css'

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const ONBOARD_KEY   = 'tf_agent_onboard_dismissed'
const BRIEFING_KEY  = 'tf_agent_last_briefing'

const TABS = [
  { id: 'today',    label: 'Today'     },
  { id: 'history',  label: 'History'   },
  { id: 'upcoming', label: 'Coming Up' },
]

// Mock activity log entries — in production these come from Firestore
// collection: agents/{userId}/activity
const MOCK_LOG = [
  {
    id: 'log1',
    icon: '💬',
    iconVariant: 'wa',
    action: 'Pickup Reminder Sent',
    time: '6:30 AM',
    channel: 'WhatsApp',
    mode: 'Auto',
    outcome: 'replied',
    outcomeLabel: 'Replied',
    thread: [
      { dir: 'out', avatar: 'A', text: 'Hi Miss Ngozi, your outfit is ready for pickup! Let us know when you\'re coming. — TailorFlow', meta: 'To: Miss Ngozi Abia · 6:30 AM', status: 'read' },
      { dir: 'in',  avatar: 'N', text: '"Okay I\'ll come today by 2pm 🙏"', meta: 'From: Miss Ngozi · 7:12 AM', status: null },
    ],
    reasoning: 'Ngozi\'s order has been ready since Apr 24 with no pickup. My rule: send a WhatsApp reminder after 2 days of no pickup. Low-risk routine message — sent automatically.',
  },
  {
    id: 'log2',
    icon: '💬',
    iconVariant: 'wa',
    action: 'Pickup Reminder Sent',
    time: '6:31 AM',
    channel: 'WhatsApp',
    mode: 'Auto',
    outcome: 'replied',
    outcomeLabel: 'Replied',
    thread: [
      { dir: 'out', avatar: 'A', text: 'Hello Mr. Emeka, your suit is ready and waiting. When can you come for pickup? — TailorFlow', meta: 'To: Mr. Emeka Duru · 6:31 AM', status: 'read' },
      { dir: 'in',  avatar: 'E', text: '"Coming Saturday, thank you"', meta: 'From: Mr. Emeka · 8:04 AM', status: null },
    ],
    reasoning: 'Emeka\'s suit has been ready for 4 days with no pickup. Same 2-day rule applied. Sent automatically.',
  },
  {
    id: 'log3',
    icon: '⚠️',
    iconVariant: 'alert',
    action: 'Payment Reminder — Escalated',
    time: '6:32 AM',
    channel: 'WhatsApp',
    mode: 'Auto',
    outcome: 'failed',
    outcomeLabel: 'No reply',
    thread: [
      { dir: 'out', avatar: 'A', text: 'Gentle reminder — your balance of ₦45,000 is now overdue. Please get in touch. — TailorFlow', meta: 'To: Mrs. Adaeze Okafor · 6:32 AM', status: 'read' },
    ],
    threadNote: { type: 'warn', text: 'This was her 2nd reminder. No response. Escalated to you.' },
    reasoning: 'Adaeze has been overdue for 7 days. First reminder on Apr 23 was ignored. My rule: after 2 ignored messages, stop and escalate — I should not keep messaging without your knowledge.',
  },
  {
    id: 'log4',
    icon: '🧾',
    iconVariant: 'inv',
    action: 'Invoice Auto-Generated & Sent',
    time: '12:04 AM',
    channel: 'Email + WA',
    mode: 'Auto',
    outcome: 'ok',
    outcomeLabel: 'Delivered',
    invoiceDetail: {
      ref: 'INV-048',
      customer: 'Mr. Chidi Eze',
      description: 'Ankara Senator suit × 1',
      amount: '₦28,500',
      due: 'May 3, 2025',
    },
    reasoning: 'You marked Chidi\'s order complete at 11:58 PM. Auto-invoice permission is on. Generated and sent immediately so payment tracking doesn\'t slip.',
  },
  {
    id: 'log5',
    icon: '📅',
    iconVariant: 'auto',
    action: 'Deadline Alerts Added',
    time: '11:52 PM',
    channel: 'Calendar',
    mode: 'Auto',
    outcome: 'ok',
    outcomeLabel: '3 added',
    deadlines: [
      { name: 'Kaftan — Mrs. Bola',   due: 'Apr 28' },
      { name: 'Agbada — Mr. Tunde',   due: 'Apr 29' },
      { name: '2-piece — Miss Amara', due: 'Apr 29' },
    ],
    reasoning: 'Detected 3 orders with deadlines within 48 hours. Added calendar reminders and marked them high priority.',
  },
]

// Mock pending approvals
const INITIAL_APPROVALS = [
  {
    id: 'ap1',
    icon: '💬',
    iconVariant: 'wa',
    title: 'WhatsApp Enquiry → Draft Order',
    desc: '+234 803 471 xxxx · 11:17 PM · Details parsed and saved.',
    urgency: 'Best confirmed within 6 hrs · May 10 deadline',
    thread: [
      { dir: 'in', avatar: 'C', text: '"Good evening, I saw your work on Instagram. Can you make a 3-piece kaftan with gold embroidery before May 10? How much?"', meta: 'Customer · 11:17 PM', status: null },
    ],
    threadNote: { type: 'info', text: '⚡ Saved as Draft Order #DO-12 — awaiting your approval to reply' },
    actions: [
      { label: 'Confirm order', variant: 'primary',   toast: '✓  Draft order #DO-12 created' },
      { label: 'Edit first',    variant: 'secondary', toast: '✏  Opening draft editor…' },
      { label: 'Ignore',        variant: 'ghost',     toast: '○  Dismissed' },
    ],
  },
  {
    id: 'ap2',
    icon: '⚠️',
    iconVariant: 'alert',
    title: 'Escalation — Mrs. Adaeze Okafor',
    desc: '7 days overdue · ₦45,000 outstanding · 2 reminders ignored',
    urgency: null,
    peekCustomer: { name: 'Mrs. Adaeze Okafor', phone: '+234 802 xxx xxxx', since: 'Jan 2024', orders: 6, balance: '₦45k', overdue: '7 days', currentOrders: [
      { name: 'Ankara gown + head-tie', detail: '₦45,000 · Ready Apr 19', status: 'Ready' },
      { name: 'Lace blouse set',        detail: '₦22,000 · Due May 15',  status: 'In progress' },
    ]},
    thread: [
      { dir: 'out', avatar: 'A', text: 'Hi Mrs. Adaeze, your order is ready for pickup. Kindly arrange a convenient time. — TailorFlow', meta: 'Apr 23 · Read', status: 'read' },
      { dir: 'out', avatar: 'A', text: 'Gentle reminder — your balance of ₦45,000 is now overdue. — TailorFlow', meta: 'Apr 25 · Read, no reply', status: 'read' },
    ],
    threadNote: { type: 'warn', text: '⚠ 2 sent · 2 read · 0 replies' },
    actions: [
      { label: 'Send final notice', variant: 'primary',   toast: '✓  Final notice sent' },
      { label: "I'll call her",     variant: 'secondary', toast: '📞  Call reminder set for today' },
      { label: 'Snooze 1 day',      variant: 'ghost',     toast: '○  Snoozed' },
    ],
  },
]

// Mock history data
const HISTORY_DATA = {
  16: { headline: '3 things handled.', narr: 'Sent <strong>2 payment reminders</strong>. One customer confirmed. Logged 1 pending pickup.', actions: 3, msgs: 2, invoiced: 0, needYou: 0 },
  17: { headline: '5 things handled.', narr: 'Generated <strong>Invoice #045</strong> for Miss Tola. Sent 3 messages. No escalations needed.', actions: 5, msgs: 3, invoiced: 1, needYou: 0 },
  19: { headline: '2 things handled.', narr: 'Quiet Saturday. Sent <strong>1 pickup reminder</strong> to Mr. Babs — no reply yet. Monitored all deadlines.', actions: 2, msgs: 1, invoiced: 0, needYou: 1 },
  21: { headline: '6 things handled.', narr: 'Busy Monday. Sent <strong>4 reminders</strong>, 3 confirmed. Auto-invoiced Miss Caro — <strong>₦35,000</strong>.', actions: 6, msgs: 4, invoiced: 1, needYou: 0 },
  22: { headline: '4 things handled.', narr: 'Flagged <strong>2 upcoming deadlines</strong>. Sent reminders. Intercepted 1 new enquiry from Instagram DM.', actions: 4, msgs: 2, invoiced: 0, needYou: 0 },
  24: { headline: '7 things handled.', narr: 'Heavy day. Sent <strong>5 messages</strong>, auto-generated <strong>Invoice #047</strong>. Mrs. Bola paid — ₦18,000 received.', actions: 7, msgs: 5, invoiced: 1, needYou: 0 },
  25: { headline: '2 things handled.', narr: 'Light day. Sent <strong>1 final notice</strong> to a late customer. Flagged 3 orders due this week.', actions: 2, msgs: 1, invoiced: 0, needYou: 1 },
  26: { headline: '5 things handled.', narr: 'Sent <strong>3 reminders</strong>. New portfolio enquiry saved as draft. <strong>1 payment received</strong> — ₦28,500.', actions: 5, msgs: 3, invoiced: 0, needYou: 0 },
  27: { headline: '7 things handled.', narr: 'Sent <strong>3 pickup reminders</strong> — 2 confirmed. Auto-sent <strong>Invoice #048</strong>. Adaeze still overdue.', actions: 7, msgs: 4, invoiced: 1, needYou: 2 },
}

// Days in the history rail
const HISTORY_DAYS = [
  { wd: 'Mon', n: 14, acts: 0 }, { wd: 'Tue', n: 15, acts: 0 },
  { wd: 'Wed', n: 16, acts: 3 }, { wd: 'Thu', n: 17, acts: 5 },
  { wd: 'Fri', n: 18, acts: 0 }, { wd: 'Sat', n: 19, acts: 2 },
  { wd: 'Sun', n: 20, acts: 0 }, { wd: 'Mon', n: 21, acts: 6 },
  { wd: 'Tue', n: 22, acts: 4 }, { wd: 'Wed', n: 23, acts: 0 },
  { wd: 'Thu', n: 24, acts: 7 }, { wd: 'Fri', n: 25, acts: 2 },
  { wd: 'Sat', n: 26, acts: 5 }, { wd: 'Sun', n: 27, acts: 7, today: true },
]

// ─────────────────────────────────────────────────────────────
// SMALL PURE COMPONENTS
// ─────────────────────────────────────────────────────────────

function AgentAvatar({ size = 'md' }) {
  return (
    <div className={`${styles.agentAvatar} ${styles[`avatar${size}`]}`}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="11" width="16" height="10" rx="3" fill="currentColor" />
        <rect x="7" y="14" width="2.5" height="2.5" rx=".5" fill="var(--bg)" />
        <rect x="14.5" y="14" width="2.5" height="2.5" rx=".5" fill="var(--bg)" />
        <path d="M9.5 18.5h5" stroke="var(--bg)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 11V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="6.5" r="1.8" fill="currentColor" />
        <line x1="4" y1="15" x2="2" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="20" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className={styles.avatarLiveDot} />
    </div>
  )
}

function ThreadMessage({ msg }) {
  const isOut = msg.dir === 'out'
  return (
    <div className={`${styles.threadMsg} ${isOut ? styles.threadMsgOut : ''}`}>
      <div className={`${styles.threadAv} ${isOut ? styles.threadAvAgent : styles.threadAvCustomer}`}>
        {msg.avatar}
      </div>
      <div className={styles.threadBubbleWrap}>
        <div className={`${styles.threadBubble} ${isOut ? styles.threadBubbleOut : styles.threadBubbleIn}`}>
          {msg.text}
        </div>
        <div className={`${styles.threadMeta} ${isOut ? styles.threadMetaOut : ''}`}>
          {isOut && msg.status === 'read' && (
            <span className={styles.readCheck}>✓✓</span>
          )}
          {msg.meta}
        </div>
      </div>
    </div>
  )
}

function Thread({ messages, note, label = 'Conversation' }) {
  return (
    <div className={styles.thread}>
      {label && <div className={styles.threadLabel}>{label}</div>}
      {messages.map((msg, i) => <ThreadMessage key={i} msg={msg} />)}
      {note && (
        <div className={`${styles.threadNote} ${note.type === 'warn' ? styles.threadNoteWarn : styles.threadNoteInfo}`}>
          {note.text}
        </div>
      )}
    </div>
  )
}

function StatStrip({ actions, msgs, invoiced, needYou }) {
  const items = [
    { n: actions,  label: 'Actions',  danger: false },
    { n: msgs,     label: 'Msgs sent', danger: false },
    { n: invoiced, label: 'Invoiced', danger: false },
    { n: needYou,  label: 'Need you', danger: needYou > 0 },
  ]
  return (
    <div className={styles.statStrip}>
      {items.map((item, i) => (
        <div key={i} className={styles.statPill}>
          <div className={`${styles.statPillNum} ${item.danger ? styles.statPillDanger : ''}`}>{item.n}</div>
          <div className={styles.statPillLabel}>{item.label}</div>
        </div>
      ))}
    </div>
  )
}

function OutcomeBadge({ outcome, label }) {
  const cls = outcome === 'replied' || outcome === 'ok'
    ? styles.badgeOk
    : outcome === 'failed'
    ? styles.badgeFail
    : styles.badgeNeutral
  return <span className={`${styles.badge} ${cls}`}><span className={styles.badgeDot} />{label}</span>
}

// ─────────────────────────────────────────────────────────────
// CUSTOMER PEEK SHEET
// ─────────────────────────────────────────────────────────────

function CustomerPeekSheet({ customer, onClose }) {
  if (!customer) return null
  return (
    <div className={styles.peekOverlay} onClick={onClose}>
      <div className={styles.peekSheet} onClick={e => e.stopPropagation()}>
        <div className={styles.peekHandle} onClick={onClose}><div className={styles.peekHandleBar} /></div>
        <div className={styles.peekTop}>
          <div>
            <div className={styles.peekName}>{customer.name}</div>
            <div className={styles.peekPhone}>{customer.phone} · Since {customer.since}</div>
          </div>
          <button className={styles.peekClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.peekBody}>
          <div className={styles.peekStats}>
            <div className={styles.peekStat}><div className={styles.peekStatLabel}>Orders</div><div className={styles.peekStatVal}>{customer.orders}</div></div>
            <div className={styles.peekStat}><div className={styles.peekStatLabel}>Balance</div><div className={`${styles.peekStatVal} ${styles.peekStatDanger}`}>{customer.balance}</div></div>
            <div className={styles.peekStat}><div className={styles.peekStatLabel}>Overdue</div><div className={`${styles.peekStatVal} ${styles.peekStatDanger}`}>{customer.overdue}</div></div>
          </div>
          <div className={styles.peekOrdersTitle}>Current orders</div>
          {customer.currentOrders.map((o, i) => (
            <div key={i} className={styles.peekOrderRow}>
              <div>
                <div className={styles.peekOrderName}>{o.name}</div>
                <div className={styles.peekOrderDetail}>{o.detail}</div>
              </div>
              <span className={`${styles.peekOrderBadge} ${o.status === 'Ready' ? styles.peekBadgeReady : styles.peekBadgeProgress}`}>{o.status}</span>
            </div>
          ))}
          <div className={styles.peekCtas}>
            <button className={`${styles.peekCta} ${styles.peekCtaCall}`}>📞 Call Now</button>
            <button className={`${styles.peekCta} ${styles.peekCtaMsg}`}>💬 Message</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// APPROVAL CARD
// ─────────────────────────────────────────────────────────────

function ApprovalCard({ approval, onApprove, onToast }) {
  const [peekOpen, setPeekOpen] = useState(false)

  const handleAction = (action) => {
    onToast(action.toast)
    onApprove(approval.id)
  }

  return (
    <>
      <div className={styles.apCard}>
        <div className={`${styles.apStripe} ${approval.iconVariant === 'alert' ? styles.apStripeUrgent : ''}`} />
        <div className={styles.apInner}>
          <div className={styles.apHeader}>
            <div className={`${styles.apIconWrap} ${styles[`apIcon_${approval.iconVariant}`]}`}>
              {approval.icon}
            </div>
            <div className={styles.apMeta}>
              <div className={styles.apTitle}>{approval.title}</div>
              <div className={styles.apDesc}>{approval.desc}</div>
              {approval.urgency && (
                <div className={styles.apUrgency}>⏱ {approval.urgency}</div>
              )}
              {approval.peekCustomer && (
                <button className={styles.peekLink} onClick={() => setPeekOpen(true)}>
                  View profile &amp; order history →
                </button>
              )}
            </div>
          </div>
          <Thread
            messages={approval.thread}
            note={approval.threadNote}
            label={approval.peekCustomer ? 'Message history' : 'Conversation'}
          />
          <div className={styles.apActions}>
            {approval.actions.map((action, i) => (
              <button
                key={i}
                className={`${styles.apBtn} ${styles[`apBtn_${action.variant}`]}`}
                onClick={() => handleAction(action)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {peekOpen && (
        <CustomerPeekSheet customer={approval.peekCustomer} onClose={() => setPeekOpen(false)} />
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// LOG ITEM
// ─────────────────────────────────────────────────────────────

function LogItem({ log }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`${styles.logItem} ${expanded ? styles.logItemExpanded : ''}`}>
      <div className={styles.logHeader}>
        <div className={`${styles.logIcon} ${styles[`logIcon_${log.iconVariant}`]}`}>{log.icon}</div>
        <div className={styles.logHeaderBody}>
          <div className={styles.logTopRow}>
            <div className={styles.logAction}>{log.action}</div>
            <div className={styles.logTime}>{log.time}</div>
          </div>
          <div className={styles.logBadges}>
            <span className={`${styles.badge} ${styles.badgeChannel}`}>{log.channel}</span>
            <span className={`${styles.badge} ${styles.badgeAuto}`}>{log.mode}</span>
            <OutcomeBadge outcome={log.outcome} label={log.outcomeLabel} />
          </div>
        </div>
      </div>

      {/* Thread */}
      {log.thread && (
        <div className={styles.logThreadWrap}>
          <Thread messages={log.thread} note={log.threadNote} label={null} />
        </div>
      )}

      {/* Invoice detail */}
      {log.invoiceDetail && (
        <div className={styles.logThreadWrap}>
          <div className={styles.thread}>
            <div className={styles.threadLabel}>Invoice dispatch</div>
            <div className={styles.invoiceDetail}>
              <span className={styles.invRef}>{log.invoiceDetail.ref}</span> · {log.invoiceDetail.customer}<br />
              {log.invoiceDetail.description} — <span className={styles.invAmount}>{log.invoiceDetail.amount}</span><br />
              Due: {log.invoiceDetail.due} ·{' '}
              <span className={styles.invSent}>✓ WA</span> ·{' '}
              <span className={styles.invSent}>✓ Email</span>
            </div>
          </div>
        </div>
      )}

      {/* Deadline list */}
      {log.deadlines && (
        <div className={styles.deadlineList}>
          {log.deadlines.map((d, i) => (
            <div key={i} className={styles.deadlineRow}>
              <span className={styles.deadlineName}>{d.name}</span>
              <span className={styles.deadlineDue}>Apr {d.due}</span>
            </div>
          ))}
        </div>
      )}

      {/* Reasoning toggle */}
      <button className={styles.reasoningToggle} onClick={() => setExpanded(v => !v)}>
        <span>💡</span>
        <span className={styles.reasoningLabel}>Why did I do this?</span>
        <span className={`${styles.reasoningArrow} ${expanded ? styles.reasoningArrowOpen : ''}`}>⌄</span>
      </button>
      {expanded && <div className={styles.reasoningBody}>{log.reasoning}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// BRIEFING HERO
// ─────────────────────────────────────────────────────────────

function BriefingHero({ headline, narr, actions, msgs, invoiced, needYou, eyebrow }) {
  return (
    <div className={styles.briefingHero}>
      <div className={styles.briefingEyebrow}>
        <div className={styles.briefingEyebrowLine} />
        {eyebrow}
        <div className={styles.briefingEyebrowLine} />
      </div>
      <div className={styles.briefingAway}>
        <span className={styles.briefingAwayDot} />
        Away for 14h 22m · Sun 27 Apr, 8:10 AM
      </div>
      <h2 className={styles.briefingHeadline}>
        {headline.split('<br/>').map((part, i) => (
          <span key={i}>{i > 0 && <br />}<span className={styles.briefingHeadlineDim}>{part}</span></span>
        ))}
      </h2>
      <p
        className={styles.briefingNarr}
        dangerouslySetInnerHTML={{ __html: narr }}
      />
      <StatStrip actions={actions} msgs={msgs} invoiced={invoiced} needYou={needYou} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION DIVIDER
// ─────────────────────────────────────────────────────────────

function SectionDivider({ title, count }) {
  return (
    <div className={styles.secDivider}>
      <span className={styles.secTitle}>{title}</span>
      {count !== undefined && <span className={styles.secCount}>{count}</span>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// COMING UP VIEW
// ─────────────────────────────────────────────────────────────

function ComingUpView({ onToast }) {
  const upcoming = [
    { time: '2:00 PM', action: 'Follow-up — Ngozi pickup',   detail: 'Check if she came. If not, send 1 more message.', mode: 'auto'    },
    { time: '5:00 PM', action: '3rd reminder — INV-045',     detail: 'Mrs. Bola · ₦18,000 · 3 days overdue',           mode: 'auto'    },
    { time: '6:00 PM', action: 'Adaeze escalation',          detail: 'Blocked until you decide on the approval above', mode: 'waiting' },
    { time: '9:00 PM', action: 'Daily revenue snapshot',     detail: 'Sent to your personal WhatsApp',                 mode: 'auto'    },
  ]
  const deadlines = [
    { time: 'Apr 28', action: 'Kaftan — Mrs. Bola',   detail: 'Due tomorrow · currently in progress', mode: 'at-risk'  },
    { time: 'Apr 29', action: 'Agbada — Mr. Tunde',   detail: '2 days remaining',                     mode: 'on-track' },
    { time: 'Apr 29', action: '2-piece — Miss Amara', detail: '2 days remaining',                     mode: 'on-track' },
  ]

  return (
    <div className={styles.viewContent}>
      <BriefingHero
        eyebrow="Scheduled · Today"
        headline="4 actions planned<br/>for today."
        narr="One is blocked waiting on your decision about Adaeze. You can intercept any AUTO action before it fires."
        actions={4} msgs={0} invoiced={0} needYou={1}
      />
      <SectionDivider title="Today's queue" count={4} />
      <div className={styles.cuCard}>
        {upcoming.map((item, i) => (
          <div key={i} className={styles.cuRow}>
            <div className={`${styles.cuTime} ${item.mode === 'at-risk' ? styles.cuTimeDanger : ''}`}>{item.time}</div>
            <div className={styles.cuContent}>
              <div className={styles.cuAction}>{item.action}</div>
              <div className={styles.cuDetail}>{item.detail}</div>
            </div>
            <span className={`${styles.cuBadge} ${item.mode === 'waiting' ? styles.cuBadgeWait : item.mode === 'at-risk' ? styles.cuBadgeWait : styles.cuBadgeAuto}`}>
              {item.mode === 'auto' ? 'Auto' : item.mode === 'waiting' ? 'Waiting' : item.mode === 'at-risk' ? 'At risk' : 'On track'}
            </span>
          </div>
        ))}
        <button
          className={styles.cuIntercept}
          onClick={() => onToast('⏸  Action paused — I\'ll wait for your go-ahead')}
        >
          ⏸ Intercept an action before it fires
        </button>
      </div>

      <SectionDivider title="Deadline watch" />
      <div className={`${styles.cuCard} ${styles.cuCardLast}`}>
        {deadlines.map((item, i) => (
          <div key={i} className={styles.cuRow}>
            <div className={`${styles.cuTime} ${item.mode === 'at-risk' ? styles.cuTimeDanger : ''}`}>{item.time}</div>
            <div className={styles.cuContent}>
              <div className={styles.cuAction}>{item.action}</div>
              <div className={styles.cuDetail}>{item.detail}</div>
            </div>
            <span className={`${styles.cuBadge} ${item.mode === 'at-risk' ? styles.cuBadgeWait : styles.cuBadgeAuto}`}>
              {item.mode === 'at-risk' ? 'At risk' : 'On track'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// HISTORY VIEW
// ─────────────────────────────────────────────────────────────

function HistoryView({ selectedDay, onSelectDay }) {
  const dayRailRef = useRef(null)

  // Scroll active day into view on mount
  useEffect(() => {
    if (!dayRailRef.current) return
    const active = dayRailRef.current.querySelector(`.${styles.dayChipActive}`)
    if (active) active.scrollIntoView({ inline: 'center', behavior: 'smooth' })
  }, [])

  const data = HISTORY_DATA[selectedDay]

  return (
    <div className={styles.historyViewWrap}>
      {/* Day rail */}
      <div className={styles.dayRailWrap}>
        <div className={styles.dayRailHeader}>
          <span className={styles.dayRailTitle}>Activity log</span>
          <span className={styles.dayRailMonth}>April 2025</span>
        </div>
        <div className={styles.dayRail} ref={dayRailRef}>
          {HISTORY_DAYS.map(day => (
            <button
              key={day.n}
              className={`${styles.dayChip} ${day.acts === 0 ? styles.dayChipEmpty : styles.dayChipActive2} ${selectedDay === day.n ? styles.dayChipActive : ''}`}
              onClick={() => onSelectDay(day.n)}
            >
              <span className={styles.dayChipWd}>{day.wd}</span>
              <span className={styles.dayChipNum}>{day.n}</span>
              <span className={styles.dayChipPip} />
            </button>
          ))}
        </div>
      </div>

      {/* History content */}
      <div className={styles.viewContent}>
        {!data ? (
          <div className={styles.historyEmpty}>
            <span className={styles.historyEmptyIcon}>🌙</span>
            <div className={styles.historyEmptyTitle}>No activity on Apr {selectedDay}</div>
            <div className={styles.historyEmptySub}>The agent was idle this day</div>
          </div>
        ) : (
          <>
            <div className={styles.briefingHero}>
              <div className={styles.briefingEyebrow}>
                <div className={styles.briefingEyebrowLine} />
                Briefing · April {selectedDay}
                <div className={styles.briefingEyebrowLine} />
              </div>
              <h2 className={styles.briefingHeadline}>{data.headline}</h2>
              <p className={styles.briefingNarr} dangerouslySetInnerHTML={{ __html: data.narr }} />
              <StatStrip actions={data.actions} msgs={data.msgs} invoiced={data.invoiced} needYou={data.needYou} />
            </div>
            <div className={styles.historyLogNote}>
              <span className={styles.historyLogNoteIcon}>📋</span>
              <div>
                <div className={styles.historyLogNoteTitle}>Full message log</div>
                <div className={styles.historyLogNoteSub}>Connect Firestore to see individual actions for this day</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SETTINGS PANEL
// ─────────────────────────────────────────────────────────────

const PERMISSIONS = [
  { icon: '💬', name: 'Send WhatsApp',     desc: 'Pickup reminders, payment nudges, order confirmations', defaultOn: true  },
  { icon: '📱', name: 'Send SMS',          desc: 'Fallback when WhatsApp fails',                         defaultOn: true  },
  { icon: '🧾', name: 'Auto-invoice',      desc: 'Fires when you mark an order complete',               defaultOn: true  },
  { icon: '📅', name: 'Calendar access',   desc: 'Deadline flags and pickup reminders',                  defaultOn: true  },
  { icon: '📧', name: 'Send emails',       desc: 'Invoice copies to customer email',                     defaultOn: false },
  { icon: '📊', name: 'Weekly digest',     desc: 'Monday morning revenue summary to your WhatsApp',      defaultOn: true  },
]

function ToggleSwitch({ on, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      className={`${styles.toggle} ${on ? styles.toggleOn : styles.toggleOff}`}
      onClick={() => onChange(!on)}
    />
  )
}

function SettingsPanel({ open, onClose, onToast }) {
  const [perms, setPerms] = useState(() =>
    PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.name]: p.defaultOn }), {})
  )

  const toggle = (name, val) => {
    setPerms(prev => ({ ...prev, [name]: val }))
    onToast(val ? '✅  Permission enabled' : '⏸  Permission disabled')
  }

  return (
    <div className={`${styles.settingsPanel} ${open ? styles.settingsPanelOpen : ''}`}>
      <div className={styles.settingsTopbar}>
        <button className={styles.settingsBack} onClick={onClose}>←</button>
        <div className={styles.settingsTitle}>Agent Settings</div>
      </div>
      <div className={styles.settingsScroll}>

        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionTitle}>Permissions</div>
          {PERMISSIONS.map(p => (
            <div key={p.name} className={styles.settingsRow}>
              <span className={styles.settingsRowIcon}>{p.icon}</span>
              <div className={styles.settingsRowInfo}>
                <div className={styles.settingsRowName}>{p.name}</div>
                <div className={styles.settingsRowDesc}>{p.desc}</div>
              </div>
              <ToggleSwitch on={perms[p.name]} onChange={val => toggle(p.name, val)} />
            </div>
          ))}
        </div>

        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionTitle}>Rules</div>
          <div className={styles.settingsRow}>
            <span className={styles.settingsRowIcon}>🔁</span>
            <div className={styles.settingsRowInfo}>
              <div className={styles.settingsRowName}>Max reminders before escalation</div>
              <div className={styles.settingsRowDesc}>Stop and notify you after N ignored messages</div>
            </div>
            <span className={styles.settingsRuleVal}>2×</span>
          </div>
          <div className={styles.settingsRow}>
            <span className={styles.settingsRowIcon}>🌙</span>
            <div className={styles.settingsRowInfo}>
              <div className={styles.settingsRowName}>Quiet hours</div>
              <div className={styles.settingsRowDesc}>No customer messages during this window</div>
            </div>
            <span className={styles.settingsRuleVal}>9PM–7AM</span>
          </div>
        </div>

        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionTitle}>Scheduled today</div>
          {[
            { time: '2:00 PM', text: 'Check if Ngozi picked up her order', mode: 'auto'    },
            { time: '5:00 PM', text: '3rd reminder — INV-045',             mode: 'auto'    },
            { time: '6:00 PM', text: 'Adaeze escalation (waiting)',        mode: 'waiting' },
            { time: '9:00 PM', text: 'Daily revenue snapshot',             mode: 'auto'    },
          ].map((s, i) => (
            <div key={i} className={styles.schRow}>
              <span className={styles.schTime}>{s.time}</span>
              <span className={styles.schText}>{s.text}</span>
              <span className={`${styles.schBadge} ${s.mode === 'waiting' ? styles.schBadgeWait : styles.schBadgeAuto}`}>
                {s.mode === 'auto' ? 'Auto' : 'Waiting'}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.settingsSection}>
          <div className={`${styles.settingsSectionTitle} ${styles.settingsSectionDanger}`}>Danger zone</div>
          <button className={styles.dangerRow} onClick={() => onToast('⏸  Agent paused — resume anytime')}>
            <span className={styles.dangerIcon}>⏸</span>
            <div>
              <div className={styles.dangerName}>Pause agent</div>
              <div className={styles.dangerDesc}>Stop all automatic actions until resumed</div>
            </div>
            <span className={styles.dangerArrow}>›</span>
          </button>
          <button className={styles.dangerRow} onClick={() => onToast('🗑  Activity log cleared')}>
            <span className={styles.dangerIcon}>🗑</span>
            <div>
              <div className={styles.dangerName}>Clear activity log</div>
              <div className={styles.dangerDesc}>Remove all logged actions from this session</div>
            </div>
            <span className={styles.dangerArrow}>›</span>
          </button>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────

function ToastContainer({ toasts }) {
  return (
    <div className={styles.toastArea} aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={styles.toast}>{t.text}</div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN AGENT PAGE
// ─────────────────────────────────────────────────────────────

function Agent({ onMenuClick }) {
  const navigate = useNavigate()

  // State
  const [activeTab,       setActiveTab]       = useState('today')
  const [approvals,       setApprovals]       = useState(INITIAL_APPROVALS)
  const [onboardDismissed, setOnboardDismissed] = useState(
    () => localStorage.getItem(ONBOARD_KEY) === 'true'
  )
  const [settingsOpen,    setSettingsOpen]    = useState(false)
  const [toasts,          setToasts]          = useState([])
  const [inputValue,      setInputValue]      = useState('')
  const [selectedDay,     setSelectedDay]     = useState(27)
  const scrollRef = useRef(null)

  // Toast helper
  const showToast = useCallback((text) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, text }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const dismissOnboard = () => {
    setOnboardDismissed(true)
    localStorage.setItem(ONBOARD_KEY, 'true')
  }

  const dismissApproval = (id) => {
    setApprovals(prev => prev.filter(a => a.id !== id))
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }

  const handleSend = () => {
    const v = inputValue.trim()
    if (!v) return
    setInputValue('')
    const replies = [
      'On it.',
      'Added to my queue.',
      "Done — I'll escalate if needed.",
      "Will handle it quietly.",
    ]
    showToast(`⚡  ${replies[Math.floor(Math.random() * replies.length)]}`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  // Header custom actions for the agent page
  const headerActions = [
    {
      icon: 'settings',
      onClick: () => setSettingsOpen(true),
      color: 'var(--text2)',
    },
  ]

  return (
    <div className={styles.pageWrapper}>
      <Header
        type="back"
        title="Agent"
        onBackClick={() => navigate('/')}
        customActions={headerActions}
      />

      <main className={styles.main} ref={scrollRef}>

        {/* ── AGENT IDENTITY BAR ── */}
        <div className={styles.identityBar}>
          <AgentAvatar size="Md" />
          <div className={styles.identityText}>
            <div className={styles.identityName}>TailorFlow Agent</div>
            <div className={styles.identityStatus}>
              <span className={styles.identityDot} />
              Active · monitoring your shop
            </div>
          </div>
        </div>

        {/* ── SEGMENTED CONTROL ── */}
        <div className={styles.segWrap}>
          <div className={styles.segControl}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`${styles.segItem} ${activeTab === tab.id ? styles.segItemActive : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
                {tab.id === 'today' && approvals.length > 0 && (
                  <span className={styles.segBadge}>{approvals.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── COMMAND BAR ── */}
        <div className={styles.commandBar}>
          <div className={styles.commandWrap}>
            <span className={styles.commandIcon}>⌘</span>
            <input
              className={styles.commandInput}
              placeholder="Search or instruct the agent…"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className={styles.commandSend} onClick={handleSend} aria-label="Send">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" stroke="none" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── TAB CONTENT ── */}

        {/* TODAY */}
        {activeTab === 'today' && (
          <div className={styles.viewContent}>

            {/* Onboarding — first time only */}
            {!onboardDismissed && (
              <div className={styles.onboardBlock}>
                <div className={styles.onboardTopRow}>
                  <div>
                    <div className={styles.onboardEyebrow}>First time here</div>
                    <div className={styles.onboardTitle}>This is not a chatbot.<br />It's an agent.</div>
                  </div>
                  <button className={styles.onboardClose} onClick={dismissOnboard}>✕</button>
                </div>
                <p className={styles.onboardBody}>
                  It does <strong>real work</strong> for you while your phone is off — sending messages,
                  generating invoices, monitoring deadlines. It always tells you what it did and asks
                  before anything sensitive.
                </p>
                <div className={styles.onboardPills}>
                  {['Sends messages', 'Auto-invoices', 'Reads enquiries', 'Works overnight'].map(p => (
                    <span key={p} className={styles.onboardPill}>{p}</span>
                  ))}
                </div>
                <button className={styles.onboardDismiss} onClick={dismissOnboard}>
                  Got it — show me what it did
                </button>
              </div>
            )}

            {/* Briefing hero */}
            <BriefingHero
              eyebrow="Morning Briefing"
              headline="7 things handled<br/>while you were away."
              narr="Sent <strong>3 pickup reminders</strong> — 2 confirmed, 1 silent. Auto-dispatched <strong>Invoice #048</strong> for Mr. Chidi. Saved a WhatsApp enquiry as a draft order. <strong>Mrs. Adaeze</strong> is 7 days overdue with no reply."
              actions={7} msgs={4} invoiced={1} needYou={2}
            />

            {/* Approvals */}
            {approvals.length > 0 && (
              <>
                <SectionDivider title="Needs approval" count={approvals.length} />
                {approvals.map(ap => (
                  <ApprovalCard
                    key={ap.id}
                    approval={ap}
                    onApprove={dismissApproval}
                    onToast={showToast}
                  />
                ))}
              </>
            )}

            {/* Activity log */}
            <SectionDivider title="Activity log" count={`${MOCK_LOG.length} actions`} />
            {MOCK_LOG.map(log => <LogItem key={log.id} log={log} />)}

          </div>
        )}

        {/* HISTORY */}
        {activeTab === 'history' && (
          <HistoryView selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        )}

        {/* COMING UP */}
        {activeTab === 'upcoming' && (
          <ComingUpView onToast={showToast} />
        )}

      </main>

      <BottomNav />

      {/* Settings panel */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onToast={showToast}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </div>
  )
}

export default Agent