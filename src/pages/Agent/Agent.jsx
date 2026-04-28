import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import BottomNav from '../../components/BottomNav/BottomNav'
import styles from './Agent.module.css'

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const ONBOARD_KEY = 'tf_agent_onboard_dismissed'

const TABS = [
  { id: 'today',    label: 'Today'    },
  { id: 'history',  label: 'History'  },
  { id: 'upcoming', label: 'Coming Up'},
]

const COMMAND_SUGGESTIONS = [
  { icon: 'chat',           text: 'Send pickup reminder' },
  { icon: 'pause_circle',   text: 'Pause for today'      },
  { icon: 'summarize',      text: 'Summarise this week'  },
]

const MOCK_LOG = [
  {
    id: 'log1',
    icon: 'chat',
    iconVariant: 'wa',
    action: 'Pickup Reminder Sent',
    time: '6:30 AM',
    channel: 'WhatsApp',
    mode: 'Auto',
    outcome: 'replied',
    outcomeLabel: 'Replied',
    confidence: 'high',
    thread: [
      { dir: 'out', avatar: 'A', text: 'Hi Miss Ngozi, your outfit is ready for pickup! Let us know when you\'re coming. TailorFlow', meta: 'To: Miss Ngozi Abia · 6:30 AM', status: 'read', date: 'Today' },
      { dir: 'in',  avatar: 'N', text: '"Okay I\'ll come today by 2pm"', meta: 'From: Miss Ngozi · 7:12 AM', status: null, date: 'Today' },
    ],
    reasoning: 'Ngozi\'s order has been ready since Apr 24 with no pickup. My rule is to send a WhatsApp reminder after 2 days of no pickup. This is a low-risk routine message so I sent it automatically.',
  },
  {
    id: 'log2',
    icon: 'chat',
    iconVariant: 'wa',
    action: 'Pickup Reminder Sent',
    time: '6:31 AM',
    channel: 'WhatsApp',
    mode: 'Auto',
    outcome: 'replied',
    outcomeLabel: 'Replied',
    confidence: 'high',
    thread: [
      { dir: 'out', avatar: 'A', text: 'Hello Mr. Emeka, your suit is ready and waiting. When can you come for pickup? TailorFlow', meta: 'To: Mr. Emeka Duru · 6:31 AM', status: 'read', date: 'Today' },
      { dir: 'in',  avatar: 'E', text: '"Coming Saturday, thank you"', meta: 'From: Mr. Emeka · 8:04 AM', status: null, date: 'Today' },
    ],
    reasoning: 'Emeka\'s suit has been ready for 4 days with no pickup. Same 2-day rule applied. Sent automatically.',
  },
  {
    id: 'log3',
    icon: 'warning',
    iconVariant: 'alert',
    action: 'Payment Reminder Escalated',
    time: '6:32 AM',
    channel: 'WhatsApp',
    mode: 'Auto',
    outcome: 'failed',
    outcomeLabel: 'No reply',
    confidence: 'low',
    thread: [
      { dir: 'out', avatar: 'A', text: 'Hi Mrs. Adaeze, your order is ready for pickup. Kindly arrange a convenient time. TailorFlow', meta: 'Apr 23 · Read', status: 'read', date: 'Apr 23' },
      { dir: 'out', avatar: 'A', text: 'Gentle reminder, your balance of 45,000 is now overdue. Please get in touch. TailorFlow', meta: 'Apr 25 · Read, no reply', status: 'read', date: 'Apr 25' },
    ],
    threadNote: { type: 'warn', text: 'This was her 2nd reminder with no response. Escalated to you.' },
    reasoning: 'Adaeze has been overdue for 7 days. First reminder on Apr 23 was ignored. My rule is after 2 ignored messages, I stop and escalate so I do not keep messaging without your knowledge.',
  },
  {
    id: 'log4',
    icon: 'receipt',
    iconVariant: 'inv',
    action: 'Invoice Generated and Sent',
    time: '12:04 AM',
    channel: 'Email + WA',
    mode: 'Auto',
    outcome: 'ok',
    outcomeLabel: 'Delivered',
    confidence: 'high',
    invoiceDetail: {
      ref: 'INV-048',
      customer: 'Mr. Chidi Eze',
      description: 'Ankara Senator suit x 1',
      amount: '28,500',
      due: 'May 3, 2025',
    },
    reasoning: 'You marked Chidi\'s order complete at 11:58 PM. Auto-invoice is turned on so I generated and sent it immediately so payment tracking does not slip.',
  },
  {
    id: 'log5',
    icon: 'calendar_today',
    iconVariant: 'auto',
    action: 'Deadline Alerts Added',
    time: '11:52 PM',
    channel: 'Calendar',
    mode: 'Auto',
    outcome: 'ok',
    outcomeLabel: '3 added',
    confidence: 'high',
    deadlines: [
      { name: 'Kaftan for Mrs. Bola',   due: 'Apr 28' },
      { name: 'Agbada for Mr. Tunde',   due: 'Apr 29' },
      { name: '2-piece for Miss Amara', due: 'Apr 29' },
    ],
    reasoning: 'Detected 3 orders with deadlines within 48 hours. Added calendar reminders and marked them high priority.',
  },
]

const INITIAL_APPROVALS = [
  {
    id: 'ap1',
    icon: 'chat',
    iconVariant: 'wa',
    title: 'New Customer Enquiry',
    desc: '+234 803 471 xxxx · 11:17 PM · Details saved as a draft order.',
    urgency: 'Best confirmed within 6 hrs · May 10 deadline',
    thread: [
      { dir: 'in', avatar: 'C', text: '"Good evening, I saw your work on Instagram. Can you make a 3-piece kaftan with gold embroidery before May 10? How much?"', meta: 'Customer · 11:17 PM', status: null, date: 'Today' },
    ],
    threadNote: { type: 'info', text: 'Saved as Draft Order #DO-12 and waiting for your approval before I reply' },
    actions: [
      { label: 'Confirm order',  variant: 'primary',   toast: 'Draft order #DO-12 created', destructive: false },
      { label: 'Edit first',     variant: 'secondary', toast: 'Opening draft editor...', destructive: false },
      { label: 'Dismiss',        variant: 'ghost',     toast: 'Enquiry dismissed', destructive: true },
    ],
  },
  {
    id: 'ap2',
    icon: 'warning',
    iconVariant: 'alert',
    title: 'Customer Not Responding',
    desc: '7 days overdue · 45,000 outstanding · 2 reminders ignored',
    urgency: null,
    peekCustomer: {
      name: 'Mrs. Adaeze Okafor',
      phone: '+234 802 xxx xxxx',
      since: 'Jan 2024',
      orders: 6,
      balance: '45k',
      overdue: '7 days',
      currentOrders: [
        { name: 'Ankara gown + head-tie', detail: '45,000 · Ready Apr 19', status: 'Ready' },
        { name: 'Lace blouse set',        detail: '22,000 · Due May 15',  status: 'In progress' },
      ],
    },
    thread: [
      { dir: 'out', avatar: 'A', text: 'Hi Mrs. Adaeze, your order is ready for pickup. Kindly arrange a convenient time. TailorFlow', meta: 'Apr 23 · Read', status: 'read', date: 'Apr 23' },
      { dir: 'out', avatar: 'A', text: 'Gentle reminder, your balance of 45,000 is now overdue. TailorFlow', meta: 'Apr 25 · Read, no reply', status: 'read', date: 'Apr 25' },
    ],
    threadNote: { type: 'warn', text: '2 messages sent, both read, no replies' },
    actions: [
      { label: 'Send final notice', variant: 'primary',   toast: 'Final notice sent to Mrs. Adaeze', destructive: true },
      { label: "I'll call her",     variant: 'secondary', toast: 'Call reminder set for today', destructive: false },
      { label: 'Snooze 1 day',      variant: 'ghost',     toast: 'Snoozed until tomorrow', destructive: false },
    ],
  },
]

const HISTORY_DATA = {
  16: { headline: '3 things handled', narr: 'Sent <strong>2 payment reminders</strong>. One customer confirmed. Logged 1 pending pickup.', actions: 3, msgs: 2, invoiced: 0, needYou: 0 },
  17: { headline: '5 things handled', narr: 'Generated <strong>Invoice #045</strong> for Miss Tola. Sent 3 messages. No escalations needed.', actions: 5, msgs: 3, invoiced: 1, needYou: 0 },
  19: { headline: '2 things handled', narr: 'Quiet Saturday. Sent <strong>1 pickup reminder</strong> to Mr. Babs, no reply yet. Monitored all deadlines.', actions: 2, msgs: 1, invoiced: 0, needYou: 1 },
  21: { headline: '6 things handled', narr: 'Busy Monday. Sent <strong>4 reminders</strong>, 3 confirmed. Auto-invoiced Miss Caro for <strong>35,000</strong>.', actions: 6, msgs: 4, invoiced: 1, needYou: 0 },
  22: { headline: '4 things handled', narr: 'Flagged <strong>2 upcoming deadlines</strong>. Sent reminders. Intercepted 1 new enquiry from Instagram DM.', actions: 4, msgs: 2, invoiced: 0, needYou: 0 },
  24: { headline: '7 things handled', narr: 'Heavy day. Sent <strong>5 messages</strong>, auto-generated <strong>Invoice #047</strong>. Mrs. Bola paid, 18,000 received.', actions: 7, msgs: 5, invoiced: 1, needYou: 0 },
  25: { headline: '2 things handled', narr: 'Light day. Sent <strong>1 final notice</strong> to a late customer. Flagged 3 orders due this week.', actions: 2, msgs: 1, invoiced: 0, needYou: 1 },
  26: { headline: '5 things handled', narr: 'Sent <strong>3 reminders</strong>. New portfolio enquiry saved as draft. <strong>1 payment received</strong> for 28,500.', actions: 5, msgs: 3, invoiced: 0, needYou: 0 },
  27: { headline: '7 things handled', narr: 'Sent <strong>3 pickup reminders</strong>, 2 confirmed. Auto-sent <strong>Invoice #048</strong>. Adaeze still overdue.', actions: 7, msgs: 4, invoiced: 1, needYou: 2 },
}

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
// HELPERS
// ─────────────────────────────────────────────────────────────

function haptic(type = 'light') {
  if (!navigator.vibrate) return
  if (type === 'light')       navigator.vibrate(10)
  else if (type === 'medium') navigator.vibrate(20)
  else if (type === 'heavy')  navigator.vibrate([10, 60, 10])
}

function getBriefingEyebrow() {
  const h = new Date().getHours()
  if (h >= 6  && h < 12) return 'Morning Briefing'
  if (h >= 12 && h < 18) return 'Afternoon Briefing'
  if (h >= 18 && h < 21) return 'Evening Briefing'
  return 'Overnight Summary'
}

// ─────────────────────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────

function AgentAvatar({ size = 'md', live = true }) {
  return (
    <div className={`${styles.agentAvatar} ${styles[`avatar${size}`]}`}>
      <span className="mi" style={{ fontSize: size === 'lg' ? '1.5rem' : '1.1rem' }}>smart_toy</span>
      {live && <span className={styles.avatarLiveDot} />}
    </div>
  )
}

function MIcon({ name, size = '1.2rem', color }) {
  return (
    <span className="mi" style={{ fontSize: size, color: color || 'inherit', lineHeight: 1, display: 'flex', alignItems: 'center' }}>{name}</span>
  )
}

// ─────────────────────────────────────────────────────────────
// THREAD WITH DATE SEPARATORS
// ─────────────────────────────────────────────────────────────

function ThreadMessage({ msg }) {
  const isOut = msg.dir === 'out'
  return (
    <div className={`${styles.threadMsg} ${isOut ? styles.threadMsgOut : ''}`}>
      <div className={`${styles.threadAv} ${isOut ? styles.threadAvAgent : styles.threadAvCustomer}`}>
        {isOut ? <MIcon name="smart_toy" size="0.7rem" /> : msg.avatar}
      </div>
      <div className={styles.threadBubbleWrap}>
        <div className={`${styles.threadBubble} ${isOut ? styles.threadBubbleOut : styles.threadBubbleIn}`}>
          {msg.text}
        </div>
        <div className={`${styles.threadMeta} ${isOut ? styles.threadMetaOut : ''}`}>
          {isOut && msg.status === 'read' && (
            <span className={styles.readCheck}><MIcon name="done_all" size="0.7rem" /></span>
          )}
          {msg.meta}
        </div>
      </div>
    </div>
  )
}

function Thread({ messages, note, label = 'Conversation' }) {
  // inject date separators when date changes between messages
  const withSeparators = []
  let lastDate = null
  messages.forEach((msg, i) => {
    if (msg.date && msg.date !== lastDate) {
      withSeparators.push({ type: 'sep', date: msg.date, key: `sep-${i}` })
      lastDate = msg.date
    }
    withSeparators.push({ type: 'msg', msg, key: `msg-${i}` })
  })

  return (
    <div className={styles.thread}>
      {label && <div className={styles.threadLabel}>{label}</div>}
      {withSeparators.map(item =>
        item.type === 'sep'
          ? <div key={item.key} className={styles.dateSep}><span className={styles.dateSepText}>{item.date}</span></div>
          : <ThreadMessage key={item.key} msg={item.msg} />
      )}
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
    { n: msgs,     label: 'Messages', danger: false },
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

function ConfidenceBadge({ confidence }) {
  if (!confidence) return null
  const isHigh = confidence === 'high'
  return (
    <span className={`${styles.badge} ${isHigh ? styles.badgeConfHigh : styles.badgeConfLow}`}>
      <MIcon name={isHigh ? 'verified' : 'help_outline'} size="0.6rem" />
      {isHigh ? 'High confidence' : 'Low confidence'}
    </span>
  )
}

function SectionDivider({ title, count }) {
  return (
    <div className={styles.secDivider}>
      <span className={styles.secTitle}>{title}</span>
      {count !== undefined && <span className={styles.secCount}>{count}</span>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SKELETON LOADER
// ─────────────────────────────────────────────────────────────

function SkeletonCard({ lines = 2 }) {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonRow}>
        <div className={`${styles.skeletonBox} ${styles.skeletonIcon}`} />
        <div className={styles.skeletonLines}>
          <div className={`${styles.skeletonBox} ${styles.skeletonLine} ${styles.skeletonLineLong}`} />
          {lines > 1 && <div className={`${styles.skeletonBox} ${styles.skeletonLine} ${styles.skeletonLineShort}`} />}
        </div>
      </div>
    </div>
  )
}

function SkeletonView() {
  return (
    <div className={styles.skeletonWrap}>
      <SkeletonCard lines={3} />
      <SkeletonCard lines={2} />
      <SkeletonCard lines={2} />
    </div>
  )
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
          <button className={styles.peekClose} onClick={onClose}>
            <MIcon name="close" size="1rem" />
          </button>
        </div>
        <div className={styles.peekBody}>
          <div className={styles.peekStats}>
            <div className={styles.peekStat}>
              <div className={styles.peekStatLabel}>Orders</div>
              <div className={styles.peekStatVal}>{customer.orders}</div>
            </div>
            <div className={styles.peekStat}>
              <div className={styles.peekStatLabel}>Balance</div>
              <div className={`${styles.peekStatVal} ${styles.peekStatDanger}`}>{customer.balance}</div>
            </div>
            <div className={styles.peekStat}>
              <div className={styles.peekStatLabel}>Overdue</div>
              <div className={`${styles.peekStatVal} ${styles.peekStatDanger}`}>{customer.overdue}</div>
            </div>
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
            <button className={`${styles.peekCta} ${styles.peekCtaCall}`} onClick={() => haptic('medium')}>
              <MIcon name="call" size="1rem" />
              Call Now
            </button>
            <button className={`${styles.peekCta} ${styles.peekCtaMsg}`} onClick={() => haptic('light')}>
              <MIcon name="chat" size="1rem" />
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SWIPEABLE APPROVAL CARD
// ─────────────────────────────────────────────────────────────

function ApprovalCard({ approval, onApprove, onToast }) {
  const [peekOpen, setPeekOpen]   = useState(false)
  const [swipeDx, setSwipeDx]     = useState(0)
  const [swiping, setSwiping]     = useState(false)
  const startX = useRef(null)
  const cardRef = useRef(null)

  const SWIPE_THRESHOLD = 80

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX
    setSwiping(true)
  }
  const onTouchMove = (e) => {
    if (startX.current === null) return
    const dx = e.touches[0].clientX - startX.current
    setSwipeDx(Math.max(-140, Math.min(140, dx)))
  }
  const onTouchEnd = () => {
    if (swipeDx > SWIPE_THRESHOLD) {
      haptic('medium')
      handleAction(approval.actions[0])
    } else if (swipeDx < -SWIPE_THRESHOLD) {
      haptic('light')
      handleAction(approval.actions.find(a => a.variant === 'ghost') || approval.actions[approval.actions.length - 1])
    } else {
      setSwipeDx(0)
    }
    setSwiping(false)
    startX.current = null
  }

  const handleAction = (action) => {
    haptic(action.destructive ? 'heavy' : 'light')
    onToast(action.toast, action.destructive ? () => onApprove(approval.id) : null, action.destructive)
    if (!action.destructive) onApprove(approval.id)
  }

  const swipeProgress = Math.abs(swipeDx) / SWIPE_THRESHOLD
  const showRight = swipeDx > 20
  const showLeft  = swipeDx < -20

  return (
    <>
      <div className={styles.swipeWrap} ref={cardRef}>
        {/* Swipe hint backgrounds */}
        <div className={`${styles.swipeBg} ${styles.swipeBgRight}`} style={{ opacity: showRight ? Math.min(swipeProgress, 1) : 0 }}>
          <MIcon name="check_circle" size="1.4rem" color="#fff" />
          <span>Confirm</span>
        </div>
        <div className={`${styles.swipeBg} ${styles.swipeBgLeft}`} style={{ opacity: showLeft ? Math.min(swipeProgress, 1) : 0 }}>
          <span>Dismiss</span>
          <MIcon name="cancel" size="1.4rem" color="#fff" />
        </div>

        <div
          className={styles.apCard}
          style={{
            transform: `translateX(${swipeDx}px)`,
            transition: swiping ? 'none' : 'transform 0.3s cubic-bezier(0.3,0.72,0,1)',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className={`${styles.apStripe} ${approval.iconVariant === 'alert' ? styles.apStripeUrgent : ''}`} />
          <div className={styles.apInner}>
            <div className={styles.apHeader}>
              <div className={`${styles.apIconWrap} ${styles[`apIcon_${approval.iconVariant}`]}`}>
                <MIcon name={approval.icon} size="1.1rem" />
              </div>
              <div className={styles.apMeta}>
                <div className={styles.apTitle}>{approval.title}</div>
                <div className={styles.apDesc}>{approval.desc}</div>
                {approval.urgency && (
                  <div className={styles.apUrgency}>
                    <MIcon name="schedule" size="0.7rem" />
                    {approval.urgency}
                  </div>
                )}
                {approval.peekCustomer && (
                  <button className={styles.peekLink} onClick={() => setPeekOpen(true)}>
                    View profile and order history
                    <MIcon name="arrow_forward" size="0.7rem" />
                  </button>
                )}
              </div>
            </div>
            <Thread
              messages={approval.thread}
              note={approval.threadNote}
              label={approval.peekCustomer ? 'Message history' : 'Conversation'}
            />
            <div className={styles.swipeHint}>
              <MIcon name="swipe" size="0.75rem" color="var(--text3)" />
              <span>Swipe to confirm or dismiss</span>
            </div>
            <div className={styles.apActions}>
              {approval.actions.map((action, i) => (
                <button
                  key={i}
                  className={`${styles.apBtn} ${styles[`apBtn_${action.variant}`]} ${action.destructive ? styles.apBtnDestructive : ''}`}
                  onClick={() => handleAction(action)}
                >
                  {action.label}
                </button>
              ))}
            </div>
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

function LogItem({ log, defaultOpen = false }) {
  const [expanded, setExpanded] = useState(defaultOpen)
  const isFailed = log.outcome === 'failed'

  return (
    <div className={`${styles.logItem} ${isFailed ? styles.logItemFailed : ''} ${expanded ? styles.logItemExpanded : ''}`}>
      <div className={styles.logHeader}>
        <div className={`${styles.logIcon} ${styles[`logIcon_${log.iconVariant}`]}`}>
          <MIcon name={log.icon} size="1rem" />
        </div>
        <div className={styles.logHeaderBody}>
          <div className={styles.logTopRow}>
            <div className={styles.logAction}>{log.action}</div>
            <div className={styles.logTime}>{log.time}</div>
          </div>
          <div className={styles.logBadges}>
            <span className={`${styles.badge} ${styles.badgeChannel}`}>{log.channel}</span>
            <span className={`${styles.badge} ${styles.badgeAuto}`}>{log.mode}</span>
            <OutcomeBadge outcome={log.outcome} label={log.outcomeLabel} />
            <ConfidenceBadge confidence={log.confidence} />
          </div>
        </div>
      </div>

      {log.thread && (
        <div className={styles.logThreadWrap}>
          <Thread messages={log.thread} note={log.threadNote} label={null} />
        </div>
      )}

      {log.invoiceDetail && (
        <div className={styles.logThreadWrap}>
          <div className={styles.thread}>
            <div className={styles.threadLabel}>Invoice sent</div>
            <div className={styles.invoiceDetail}>
              <span className={styles.invRef}>{log.invoiceDetail.ref}</span> · {log.invoiceDetail.customer}<br />
              {log.invoiceDetail.description} <span className={styles.invAmount}>N{log.invoiceDetail.amount}</span><br />
              Due: {log.invoiceDetail.due} ·{' '}
              <span className={styles.invSent}>WA delivered</span> ·{' '}
              <span className={styles.invSent}>Email delivered</span>
            </div>
          </div>
        </div>
      )}

      {log.deadlines && (
        <div className={styles.deadlineList}>
          {log.deadlines.map((d, i) => (
            <div key={i} className={styles.deadlineRow}>
              <div className={styles.deadlineRowInner}>
                <MIcon name="event" size="0.85rem" color="var(--text3)" />
                <span className={styles.deadlineName}>{d.name}</span>
              </div>
              <span className={styles.deadlineDue}>{d.due}</span>
            </div>
          ))}
        </div>
      )}

      <button className={styles.reasoningToggle} onClick={() => { setExpanded(v => !v); haptic('light') }}>
        <MIcon name="lightbulb" size="0.9rem" color="#d97706" />
        <span className={styles.reasoningLabel}>Why did I do this?</span>
        <MIcon name={expanded ? 'expand_less' : 'expand_more'} size="1rem" color="var(--text3)" />
      </button>
      {expanded && <div className={styles.reasoningBody}>{log.reasoning}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// BRIEFING HERO
// ─────────────────────────────────────────────────────────────

function BriefingHero({ headline, narr, actions, msgs, invoiced, needYou, eyebrow, awayText, isLive }) {
  const label = eyebrow || getBriefingEyebrow()
  return (
    <div className={styles.briefingHero}>
      <div className={styles.briefingEyebrow}>
        <div className={styles.briefingEyebrowLine} />
        {label}
        <div className={styles.briefingEyebrowLine} />
      </div>
      {awayText && (
        <div className={styles.briefingAway}>
          <span className={styles.briefingAwayDot} />
          {awayText}
        </div>
      )}
      {isLive && (
        <div className={styles.liveTaskBanner}>
          <span className={styles.liveTaskDot} />
          Running 1 task now · Sending invoice to Mr. Chidi
        </div>
      )}
      <h2 className={styles.briefingHeadline}>{headline}</h2>
      <p className={styles.briefingNarr} dangerouslySetInnerHTML={{ __html: narr }} />
      <StatStrip actions={actions} msgs={msgs} invoiced={invoiced} needYou={needYou} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ALL CLEAR EMPTY STATE
// ─────────────────────────────────────────────────────────────

function AllClearState() {
  return (
    <div className={styles.allClear}>
      <div className={styles.allClearIcon}>
        <MIcon name="check_circle" size="2rem" color="#22c55e" />
      </div>
      <div className={styles.allClearTitle}>All clear</div>
      <div className={styles.allClearSub}>Nothing needs your attention right now. The agent is running quietly in the background.</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// COMING UP VIEW
// ─────────────────────────────────────────────────────────────

const UPCOMING_ACTIONS = [
  { id: 'cu1', time: '2:00 PM', action: 'Check if Ngozi picked up',   detail: 'If she has not come, I will send one more message.', mode: 'auto'    },
  { id: 'cu2', time: '5:00 PM', action: '3rd reminder for INV-045',   detail: 'Mrs. Bola · N18,000 · 3 days overdue',               mode: 'auto'    },
  { id: 'cu3', time: '6:00 PM', action: 'Follow up with Adaeze',      detail: 'Waiting for your decision on the approval above',     mode: 'waiting' },
  { id: 'cu4', time: '9:00 PM', action: 'Daily revenue snapshot',     detail: 'Sent to your personal WhatsApp',                     mode: 'auto'    },
]

function ComingUpView({ onToast }) {
  const [pausedIds, setPausedIds]   = useState([])
  const [pauseTarget, setPauseTarget] = useState(null)

  const deadlines = [
    { time: 'Apr 28', action: 'Kaftan for Mrs. Bola',   detail: 'Due tomorrow, currently in progress', mode: 'at-risk'  },
    { time: 'Apr 29', action: 'Agbada for Mr. Tunde',   detail: '2 days remaining',                   mode: 'on-track' },
    { time: 'Apr 29', action: '2-piece for Miss Amara', detail: '2 days remaining',                   mode: 'on-track' },
  ]

  const modeIcon = (mode) => {
    if (mode === 'auto')     return 'bolt'
    if (mode === 'waiting')  return 'pause_circle'
    if (mode === 'at-risk')  return 'error_outline'
    if (mode === 'paused')   return 'pause_circle'
    return 'check_circle_outline'
  }

  const handlePause = (item) => {
    haptic('medium')
    setPausedIds(prev => [...prev, item.id])
    setPauseTarget(null)
    onToast(`"${item.action}" paused — I'll wait for your go-ahead`)
  }

  const handleResume = (id) => {
    haptic('light')
    setPausedIds(prev => prev.filter(x => x !== id))
    onToast('Action resumed')
  }

  return (
    <div className={styles.viewContent}>
      <BriefingHero
        eyebrow="Scheduled Today"
        headline="4 actions planned for today"
        narr="One is blocked waiting on your decision about Adaeze. Tap any action to pause it before it fires."
        actions={4} msgs={0} invoiced={0} needYou={1}
      />
      <SectionDivider title="Today's queue" count={4} />
      <div className={styles.cuCard}>
        {UPCOMING_ACTIONS.map((item) => {
          const isPaused = pausedIds.includes(item.id)
          const effectiveMode = isPaused ? 'paused' : item.mode
          return (
            <div key={item.id} className={styles.cuRow}>
              <div className={`${styles.cuTime} ${item.mode === 'at-risk' ? styles.cuTimeDanger : ''} ${isPaused ? styles.cuTimePaused : ''}`}>{item.time}</div>
              <div className={styles.cuContent}>
                <div className={`${styles.cuAction} ${isPaused ? styles.cuActionPaused : ''}`}>{item.action}</div>
                <div className={styles.cuDetail}>{isPaused ? 'Paused — waiting for your go-ahead' : item.detail}</div>
              </div>
              <div className={styles.cuBadgeGroup}>
                <span className={`${styles.cuBadge} ${
                  isPaused           ? styles.cuBadgePaused :
                  item.mode === 'waiting' || item.mode === 'at-risk' ? styles.cuBadgeWait :
                  styles.cuBadgeAuto
                }`}>
                  <MIcon name={modeIcon(effectiveMode)} size="0.7rem" />
                  {isPaused ? 'Paused' : item.mode === 'auto' ? 'Auto' : item.mode === 'waiting' ? 'Waiting' : item.mode === 'at-risk' ? 'At risk' : 'On track'}
                </span>
                {!isPaused && item.mode === 'auto' && (
                  <button className={styles.cuPauseBtn} onClick={() => { haptic('light'); setPauseTarget(item) }} title="Pause this action">
                    <MIcon name="pause" size="0.75rem" color="var(--text3)" />
                  </button>
                )}
                {isPaused && (
                  <button className={styles.cuResumeBtn} onClick={() => handleResume(item.id)} title="Resume this action">
                    <MIcon name="play_arrow" size="0.75rem" color="#15803d" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
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
              <MIcon name={modeIcon(item.mode)} size="0.7rem" />
              {item.mode === 'at-risk' ? 'At risk' : 'On track'}
            </span>
          </div>
        ))}
      </div>

      {/* Pause confirmation sheet */}
      {pauseTarget && (
        <div className={styles.peekOverlay} onClick={() => setPauseTarget(null)}>
          <div className={styles.peekSheet} onClick={e => e.stopPropagation()} style={{ maxHeight: '40%' }}>
            <div className={styles.peekHandle} onClick={() => setPauseTarget(null)}><div className={styles.peekHandleBar} /></div>
            <div className={styles.peekTop}>
              <div>
                <div className={styles.peekName} style={{ fontSize: '0.92rem' }}>Pause this action?</div>
                <div className={styles.peekPhone}>"{pauseTarget.action}" at {pauseTarget.time}</div>
              </div>
            </div>
            <div className={styles.peekBody} style={{ paddingTop: 16 }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 16 }}>
                The agent will hold this action and wait for you to resume it. You can resume from this screen at any time.
              </p>
              <div className={styles.peekCtas}>
                <button className={`${styles.peekCta} ${styles.peekCtaCall}`} onClick={() => handlePause(pauseTarget)}>
                  <MIcon name="pause_circle" size="1rem" />
                  Yes, pause it
                </button>
                <button className={`${styles.peekCta} ${styles.peekCtaMsg}`} onClick={() => setPauseTarget(null)}>
                  Keep scheduled
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// HISTORY VIEW
// ─────────────────────────────────────────────────────────────

function HistoryView({ selectedDay, onSelectDay }) {
  const dayRailRef = useRef(null)

  useEffect(() => {
    if (!dayRailRef.current) return
    const active = dayRailRef.current.querySelector(`.${styles.dayChipActive}`)
    if (active) active.scrollIntoView({ inline: 'center', behavior: 'smooth' })
  }, [])

  // find week context around selected day
  const selectedIdx = HISTORY_DAYS.findIndex(d => d.n === selectedDay)
  const weekStart = Math.max(0, selectedIdx - 3)
  const weekEnd   = Math.min(HISTORY_DAYS.length - 1, selectedIdx + 3)
  const weekNums  = HISTORY_DAYS.slice(weekStart, weekEnd + 1).map(d => d.n)

  const data = HISTORY_DATA[selectedDay]

  return (
    <div className={styles.historyViewWrap}>
      <div className={styles.dayRailWrap}>
        <div className={styles.dayRailHeader}>
          <span className={styles.dayRailTitle}>Activity log</span>
          <span className={styles.dayRailMonth}>April 2025</span>
        </div>
        <div className={styles.dayRail} ref={dayRailRef}>
          {HISTORY_DAYS.map(day => (
            <button
              key={day.n}
              className={`
                ${styles.dayChip}
                ${day.acts === 0 ? styles.dayChipEmpty : styles.dayChipActive2}
                ${selectedDay === day.n ? styles.dayChipActive : ''}
                ${weekNums.includes(day.n) && selectedDay !== day.n ? styles.dayChipWeek : ''}
              `}
              onClick={() => { onSelectDay(day.n); haptic('light') }}
            >
              <span className={styles.dayChipWd}>{day.wd}</span>
              <span className={styles.dayChipNum}>{day.n}</span>
              <span className={styles.dayChipPip} />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.viewContent}>
        {!data ? (
          <div className={styles.historyEmpty}>
            <MIcon name="nights_stay" size="2.5rem" color="var(--border2)" />
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
              <MIcon name="inventory_2" size="1.5rem" color="var(--text3)" />
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
  { icon: 'chat',           name: 'Send WhatsApp',    desc: 'Pickup reminders, payment nudges, order confirmations', defaultOn: true  },
  { icon: 'sms',            name: 'Send SMS',          desc: 'Fallback when WhatsApp fails',                         defaultOn: true  },
  { icon: 'receipt_long',   name: 'Auto-invoice',      desc: 'Fires when you mark an order complete',               defaultOn: true  },
  { icon: 'calendar_today', name: 'Calendar access',   desc: 'Deadline flags and pickup reminders',                  defaultOn: true  },
  { icon: 'mail',           name: 'Send emails',       desc: 'Invoice copies to customer email',                     defaultOn: false },
  { icon: 'bar_chart',      name: 'Weekly digest',     desc: 'Monday morning revenue summary to your WhatsApp',      defaultOn: true  },
]

const DEFAULT_RULES = [
  { id: 'r1', icon: 'repeat',  name: 'Max reminders before escalation', value: '2x',      desc: 'Stop and notify you after N ignored messages', editable: false },
  { id: 'r2', icon: 'bedtime', name: 'Quiet hours',                     value: '9PM–7AM', desc: 'No customer messages during this window',       editable: false },
]

function ToggleSwitch({ on, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      className={`${styles.toggle} ${on ? styles.toggleOn : styles.toggleOff}`}
      onClick={() => { onChange(!on); haptic('light') }}
    />
  )
}

function SettingsPanel({ open, onClose, onToast }) {
  const [perms, setPerms] = useState(() =>
    PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.name]: p.defaultOn }), {})
  )
  const [customRules, setCustomRules] = useState([])
  const [newRule, setNewRule] = useState('')
  const [addingRule, setAddingRule] = useState(false)

  const toggle = (name, val) => {
    setPerms(prev => ({ ...prev, [name]: val }))
    onToast(val ? 'Permission enabled' : 'Permission disabled')
  }

  const addRule = () => {
    const trimmed = newRule.trim()
    if (!trimmed) return
    setCustomRules(prev => [...prev, { id: Date.now(), text: trimmed }])
    setNewRule('')
    setAddingRule(false)
    haptic('medium')
    onToast('New rule saved')
  }

  const removeRule = (id) => {
    setCustomRules(prev => prev.filter(r => r.id !== id))
    haptic('light')
    onToast('Rule removed')
  }

  return (
    <div className={`${styles.settingsPanel} ${open ? styles.settingsPanelOpen : ''}`}>
      <div className={styles.settingsTopbar}>
        <button className={styles.settingsBack} onClick={onClose}>
          <MIcon name="arrow_back" size="1.2rem" />
        </button>
        <div className={styles.settingsTitle}>Agent Settings</div>
        <div className={styles.settingsSaved}>
          <MIcon name="check_circle" size="0.8rem" color="#22c55e" />
          Saved
        </div>
      </div>
      <div className={styles.settingsScroll}>

        <div className={styles.settingsSection}>
          <div className={styles.settingsSectionTitle}>Permissions</div>
          <div className={styles.settingsSectionDesc}>Choose what the agent is allowed to do automatically</div>
          {PERMISSIONS.map(p => (
            <div key={p.name} className={styles.settingsRow}>
              <span className={styles.settingsRowIconWrap}>
                <MIcon name={p.icon} size="1.1rem" color="var(--text2)" />
              </span>
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
          <div className={styles.settingsSectionDesc}>Limits and behaviours that keep the agent in check</div>

          {DEFAULT_RULES.map(r => (
            <div key={r.id} className={styles.settingsRow}>
              <span className={styles.settingsRowIconWrap}>
                <MIcon name={r.icon} size="1.1rem" color="var(--text2)" />
              </span>
              <div className={styles.settingsRowInfo}>
                <div className={styles.settingsRowName}>{r.name}</div>
                <div className={styles.settingsRowDesc}>{r.desc}</div>
              </div>
              <span className={styles.settingsRuleVal}>{r.value}</span>
            </div>
          ))}

          {/* Custom rules */}
          {customRules.map(r => (
            <div key={r.id} className={`${styles.settingsRow} ${styles.settingsRowCustom}`}>
              <span className={styles.settingsRowIconWrap}>
                <MIcon name="edit_note" size="1.1rem" color="var(--text2)" />
              </span>
              <div className={styles.settingsRowInfo}>
                <div className={styles.settingsRowName} style={{ fontSize: '0.78rem' }}>{r.text}</div>
                <div className={styles.settingsRowDesc}>Custom rule</div>
              </div>
              <button className={styles.ruleRemoveBtn} onClick={() => removeRule(r.id)}>
                <MIcon name="close" size="0.9rem" color="var(--text3)" />
              </button>
            </div>
          ))}

          {/* Add custom rule */}
          {addingRule ? (
            <div className={styles.addRuleBox}>
              <input
                className={styles.addRuleInput}
                placeholder="e.g. Never message on Sundays"
                value={newRule}
                onChange={e => setNewRule(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addRule(); if (e.key === 'Escape') { setAddingRule(false); setNewRule('') } }}
                autoFocus
              />
              <div className={styles.addRuleActions}>
                <button className={`${styles.apBtn} ${styles['apBtn_primary']}`} style={{ fontSize: '0.75rem', padding: '7px 14px' }} onClick={addRule}>Save rule</button>
                <button className={`${styles.apBtn} ${styles['apBtn_ghost']}`} style={{ fontSize: '0.75rem', padding: '7px 14px' }} onClick={() => { setAddingRule(false); setNewRule('') }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className={styles.addRuleBtn} onClick={() => { setAddingRule(true); haptic('light') }}>
              <MIcon name="add" size="1rem" color="var(--text3)" />
              Add a custom rule in plain language
            </button>
          )}
        </div>

        <div className={styles.settingsSection}>
          <div className={`${styles.settingsSectionTitle} ${styles.settingsSectionDanger}`}>Danger zone</div>
          <button className={styles.dangerRow} onClick={() => { haptic('heavy'); onToast('Agent paused — resume anytime') }}>
            <span className={styles.dangerIconWrap}>
              <MIcon name="pause_circle" size="1.2rem" color="var(--danger, #ef4444)" />
            </span>
            <div>
              <div className={styles.dangerName}>Pause agent</div>
              <div className={styles.dangerDesc}>Stop all automatic actions until resumed</div>
            </div>
            <MIcon name="chevron_right" size="1.2rem" color="var(--danger, #ef4444)" />
          </button>
          <button className={styles.dangerRow} onClick={() => { haptic('heavy'); onToast('Activity log cleared') }}>
            <span className={styles.dangerIconWrap}>
              <MIcon name="delete_outline" size="1.2rem" color="var(--danger, #ef4444)" />
            </span>
            <div>
              <div className={styles.dangerName}>Clear activity log</div>
              <div className={styles.dangerDesc}>Remove all logged actions from this session</div>
            </div>
            <MIcon name="chevron_right" size="1.2rem" color="var(--danger, #ef4444)" />
          </button>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TOAST WITH UNDO
// ─────────────────────────────────────────────────────────────

function ToastContainer({ toasts, onUndo }) {
  return (
    <div className={styles.toastArea} aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`${styles.toast} ${t.undoable ? styles.toastUndoable : ''}`}>
          <MIcon name="check_circle" size="1rem" color="rgba(255,255,255,0.7)" />
          <span className={styles.toastText}>{t.text}</span>
          {t.undoable && (
            <button className={styles.toastUndo} onClick={() => onUndo(t.id)}>
              Undo
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN AGENT PAGE
// ─────────────────────────────────────────────────────────────

function Agent({ onMenuClick }) {
  const navigate = useNavigate()

  const [activeTab,        setActiveTab]        = useState('today')
  const [approvals,        setApprovals]        = useState(INITIAL_APPROVALS)
  const [onboardDismissed, setOnboardDismissed] = useState(
    () => localStorage.getItem(ONBOARD_KEY) === 'true'
  )
  const [settingsOpen,     setSettingsOpen]     = useState(false)
  const [toasts,           setToasts]           = useState([])
  const [inputValue,       setInputValue]       = useState('')
  const [selectedDay,      setSelectedDay]      = useState(27)
  const [tabLoading,       setTabLoading]       = useState(false)
  const [isLive,           setIsLive]           = useState(true)
  const scrollRef   = useRef(null)
  const inputRef    = useRef(null)
  const undoTimers  = useRef({})

  // simulate live task finishing after 8s
  useEffect(() => {
    const t = setTimeout(() => setIsLive(false), 8000)
    return () => clearTimeout(t)
  }, [])

  const showToast = useCallback((text, onUndoCallback = null, undoable = false) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, text, undoable: undoable && !!onUndoCallback, onUndo: onUndoCallback }])

    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
      delete undoTimers.current[id]
    }, undoable ? 5000 : 3000)

    undoTimers.current[id] = timer
  }, [])

  const handleUndo = useCallback((toastId) => {
    const toast = toasts.find(t => t.id === toastId)
    if (toast?.onUndo) toast.onUndo()
    clearTimeout(undoTimers.current[toastId])
    delete undoTimers.current[toastId]
    setToasts(prev => prev.filter(t => t.id !== toastId))
    haptic('medium')
  }, [toasts])

  const dismissOnboard = () => {
    setOnboardDismissed(true)
    localStorage.setItem(ONBOARD_KEY, 'true')
  }

  const dismissApproval = (id) => {
    setApprovals(prev => prev.filter(a => a.id !== id))
  }

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return
    haptic('light')
    setTabLoading(true)
    setActiveTab(tabId)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    setTimeout(() => setTabLoading(false), 400)
  }

  const handleSend = () => {
    const v = inputValue.trim()
    if (!v) return
    haptic('light')
    setInputValue('')
    const replies = ['On it.', 'Added to my queue.', "Done, I'll escalate if needed.", "Will handle it quietly."]
    showToast(replies[Math.floor(Math.random() * replies.length)])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  const handleSuggestion = (text) => {
    haptic('light')
    setInputValue(text)
    inputRef.current?.focus()
  }

  const handleBulkDismiss = () => {
    haptic('medium')
    const ids = approvals.map(a => a.id)
    showToast(`${approvals.length} items dismissed`, () => {
      setApprovals(INITIAL_APPROVALS)
    }, true)
    setApprovals([])
  }

  const headerActions = [
    { icon: 'settings', onClick: () => setSettingsOpen(true), color: 'var(--text2)' },
  ]

  const eyebrow = getBriefingEyebrow()

  return (
    <div className={styles.pageWrapper}>
      <Header
        type="back"
        title="Agent"
        subtitle="Active · monitoring your shop"
        onBackClick={() => navigate('/')}
        customActions={headerActions}
      />

      <main className={styles.main} ref={scrollRef}>

        {/* ── SEGMENTED TAB BAR ── */}
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

        {/* ── TAB CONTENT ── */}
        {tabLoading ? (
          <SkeletonView />
        ) : (
          <>
            {/* TODAY */}
            {activeTab === 'today' && (
              <div className={styles.viewContent}>

                {!onboardDismissed && (
                  <div className={styles.onboardBlock}>
                    <div className={styles.onboardTopRow}>
                      <div>
                        <div className={styles.onboardEyebrow}>First time here</div>
                        <div className={styles.onboardTitle}>Your shop assistant that never sleeps</div>
                      </div>
                      <button className={styles.onboardClose} onClick={dismissOnboard}>
                        <MIcon name="close" size="0.9rem" color="rgba(255,255,255,0.5)" />
                      </button>
                    </div>
                    <p className={styles.onboardBody}>
                      The agent does <strong>real work</strong> while your phone is off, sending messages, generating invoices, tracking deadlines. It always tells you what it did and asks before anything sensitive.
                    </p>
                    <div className={styles.onboardPills}>
                      {[
                        { icon: 'chat',     label: 'Sends messages'  },
                        { icon: 'receipt',  label: 'Auto-invoices'   },
                        { icon: 'inbox',    label: 'Reads enquiries' },
                        { icon: 'schedule', label: 'Works overnight' },
                      ].map(p => (
                        <span key={p.label} className={styles.onboardPill}>
                          <MIcon name={p.icon} size="0.75rem" color="rgba(255,255,255,0.5)" />
                          {p.label}
                        </span>
                      ))}
                    </div>
                    <button className={styles.onboardDismiss} onClick={dismissOnboard}>
                      Got it, show me what it did
                    </button>
                  </div>
                )}

                <BriefingHero
                  eyebrow={eyebrow}
                  headline="7 things handled while you were away"
                  narr="Sent <strong>3 pickup reminders</strong>, 2 confirmed and 1 silent. Auto-dispatched <strong>Invoice #048</strong> for Mr. Chidi. Saved a WhatsApp enquiry as a draft order. <strong>Mrs. Adaeze</strong> is 7 days overdue with no reply."
                  actions={7} msgs={4} invoiced={1} needYou={2}
                  awayText="Away for 14h 22m · Sun 27 Apr, 8:10 AM"
                  isLive={isLive}
                />

                {approvals.length > 0 ? (
                  <div className={styles.attentionZone}>
                    <div className={styles.attentionHeader}>
                      <div className={styles.attentionTitle}>
                        <span className={styles.attentionDot} />
                        Needs your attention
                      </div>
                      <div className={styles.attentionHeaderRight}>
                        {approvals.length >= 2 && (
                          <button className={styles.bulkDismissBtn} onClick={handleBulkDismiss}>
                            Dismiss all
                          </button>
                        )}
                        <span className={styles.attentionCount}>{approvals.length}</span>
                      </div>
                    </div>
                    {approvals.map(ap => (
                      <ApprovalCard
                        key={ap.id}
                        approval={ap}
                        onApprove={dismissApproval}
                        onToast={showToast}
                      />
                    ))}
                  </div>
                ) : (
                  <AllClearState />
                )}

                <SectionDivider title="What I did today" count={`${MOCK_LOG.length} actions`} />
                {MOCK_LOG.map((log, i) => (
                  <LogItem key={log.id} log={log} defaultOpen={i === 0} />
                ))}

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
          </>
        )}

      </main>

      {/* ── COMMAND BAR — sticky above bottom nav ── */}
      <div className={styles.commandBarWrap}>
        <div className={styles.commandSuggestions}>
          {COMMAND_SUGGESTIONS.map(s => (
            <button key={s.text} className={styles.suggestionChip} onClick={() => handleSuggestion(s.text)}>
              <MIcon name={s.icon} size="0.75rem" color="var(--text3)" />
              {s.text}
            </button>
          ))}
        </div>
        <div className={styles.commandBar}>
          <div className={styles.commandWrap}>
            <MIcon name="smart_toy" size="0.9rem" color="var(--text3)" />
            <input
              ref={inputRef}
              className={styles.commandInput}
              placeholder="Tell the agent what to do..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className={styles.commandSend} onClick={handleSend} aria-label="Send">
              <MIcon name="arrow_upward" size="0.9rem" color="var(--bg)" />
            </button>
          </div>
        </div>
      </div>

      <BottomNav />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onToast={showToast}
      />

      <ToastContainer toasts={toasts} onUndo={handleUndo} />
    </div>
  )
}

export default Agent