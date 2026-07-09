import { useState, useEffect, useCallback } from 'react'
import { cn } from '@utils/cn'
import { AdminService } from '@services/AdminService'

/**
 * Hidden admin dashboard. Reached only via the obscure path configured in
 * env.admin.path (matches the server's ADMIN_PATH_SECRET). Auth is a real
 * httpOnly session cookie — this page just reflects it.
 *
 * Sections: Login → Dashboard (analytics + inquiry table + detail drawer).
 */

const STATUSES = ['NEW', 'CONTACTED', 'PLANNING', 'COMPLETED', 'CANCELLED']
const PRIORITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

const STATUS_COLOR = {
  NEW: 'text-brand-600 bg-brand-50',
  CONTACTED: 'text-accent-700 bg-accent-50',
  PLANNING: 'text-indigo-700 bg-indigo-50',
  COMPLETED: 'text-green-700 bg-green-50',
  CANCELLED: 'text-red-700 bg-red-50',
}
const PRIORITY_COLOR = {
  CRITICAL: 'text-red-700 bg-red-50',
  HIGH: 'text-orange-700 bg-orange-50',
  MEDIUM: 'text-amber-700 bg-amber-50',
  LOW: 'text-gray-600 bg-gray-100',
}

const fmtDate = (iso) => {
  try { return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }
  catch { return iso }
}

// ─── Login ──────────────────────────────────────────────────────────────
function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (loading) return
    setError(null); setLoading(true)
    const res = await AdminService.login(email.trim(), password)
    setLoading(false)
    if (!res.ok) { setError(res.data?.message || 'Invalid email or password.'); return }
    onSuccess(res.data.admin)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-light text-white tracking-tight">HumSafar Admin</h1>
          <p className="mt-2 text-sm text-gray-500">Authorized access only.</p>
        </div>
        <div className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="username"
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-brand-500 transition-colors" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password"
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-brand-500 transition-colors" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading}
            className={cn('w-full py-3 rounded-lg text-sm font-medium transition-colors', loading ? 'bg-gray-800 text-gray-500' : 'bg-brand-500 text-white hover:bg-brand-400')}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Stat card ──────────────────────────────────────────────────────────
function Stat({ label, value, sub }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-xs uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-light text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  )
}

// ─── Mini bar chart (30-day) ────────────────────────────────────────────
function DailyChart({ daily }) {
  const max = Math.max(1, ...daily.map((d) => d.count))
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">Inquiries · last 30 days</p>
      <div className="flex items-end gap-1 h-24">
        {daily.map((d) => (
          <div key={d.date} className="flex-1 group relative">
            <div className="bg-brand-500/70 hover:bg-brand-400 rounded-sm transition-all" style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count ? '3px' : '0' }} />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block text-[10px] text-gray-300 whitespace-nowrap bg-gray-800 px-1.5 py-0.5 rounded">{d.count} · {d.date.slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Breakdown list ─────────────────────────────────────────────────────
function Breakdown({ title, rows, colorMap }) {
  const total = rows.reduce((s, r) => s + r.count, 0) || 1
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">{title}</p>
      <div className="space-y-2.5">
        {rows.length === 0 && <p className="text-sm text-gray-600">No data yet.</p>}
        {rows.map((r) => {
          const key = r.status || r.priority || r.type
          return (
            <div key={key} className="flex items-center gap-3">
              <span className={cn('text-[10px] uppercase tracking-wide font-medium px-2 py-0.5 rounded w-24 text-center', colorMap?.[key] || 'text-gray-300 bg-gray-800')}>{key}</span>
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-brand-500" style={{ width: `${(r.count / total) * 100}%` }} /></div>
              <span className="text-sm text-gray-400 w-8 text-right">{r.count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Detail drawer ──────────────────────────────────────────────────────
function DetailDrawer({ id, onClose, onChanged }) {
  const [inq, setInq] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ status: '', priority: '', notes: '', note: '' })

  const load = useCallback(async () => {
    setLoading(true)
    const res = await AdminService.getInquiry(id)
    setLoading(false)
    if (res.ok) {
      setInq(res.data.inquiry)
      setForm({ status: res.data.inquiry.status, priority: res.data.inquiry.priority, notes: res.data.inquiry.notes || '', note: '' })
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const save = async () => {
    setSaving(true)
    const patch = { status: form.status, priority: form.priority, notes: form.notes }
    if (form.note.trim()) patch.note = form.note.trim()
    const res = await AdminService.updateInquiry(id, patch)
    setSaving(false)
    if (res.ok) { onChanged?.(); load() }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-950 border-l border-gray-800 h-full overflow-y-auto">
        <div className="sticky top-0 bg-gray-950 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">Inquiry detail</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
        </div>
        {loading ? <p className="p-6 text-gray-500 text-sm">Loading…</p> : inq && (
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-brand-400 text-sm">{inq.reference}</span>
                <span className={cn('text-[10px] uppercase px-2 py-0.5 rounded', STATUS_COLOR[inq.status])}>{inq.status}</span>
              </div>
              <h3 className="text-lg text-white font-light">{inq.fullName}</h3>
              <p className="text-sm text-gray-400">{inq.email} · {inq.phone}</p>
            </div>

            <dl className="text-sm space-y-1.5 text-gray-400">
              {inq.journeyName && <div className="flex justify-between"><dt>Journey</dt><dd className="text-gray-200">{inq.journeyType} · {inq.journeyName}</dd></div>}
              {(inq.fromCity || inq.toCity) && <div className="flex justify-between"><dt>Route</dt><dd className="text-gray-200">{inq.fromCity} → {inq.toCity}</dd></div>}
              {inq.travelDate && <div className="flex justify-between"><dt>Travel date</dt><dd className="text-gray-200">{inq.travelDate}</dd></div>}
              <div className="flex justify-between"><dt>Passengers</dt><dd className="text-gray-200">{inq.passengers}</dd></div>
              {inq.journeyFare != null && <div className="flex justify-between"><dt>Est. fare</dt><dd className="text-gray-200">₹{inq.journeyFare?.toLocaleString('en-IN')}</dd></div>}
              {inq.preferredContactTime && <div className="flex justify-between"><dt>Contact time</dt><dd className="text-gray-200">{inq.preferredContactTime}</dd></div>}
              <div className="flex justify-between"><dt>Submitted</dt><dd className="text-gray-200">{fmtDate(inq.createdAt)}</dd></div>
            </dl>

            {inq.specialRequest && (
              <div><p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Special request</p><p className="text-sm text-gray-300">{inq.specialRequest}</p></div>
            )}

            {/* Abuse / audit metadata */}
            <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Audit / abuse trail</p>
              <dl className="text-xs space-y-1 text-gray-500">
                <div className="flex justify-between"><dt>IP</dt><dd className="text-gray-300 font-mono">{inq.ipAddress || '—'}</dd></div>
                <div className="flex justify-between"><dt>Location</dt><dd className="text-gray-300">{[inq.city, inq.country].filter(Boolean).join(', ') || '—'}</dd></div>
                <div className="flex justify-between gap-4"><dt>User agent</dt><dd className="text-gray-300 text-right break-all">{inq.userAgent || '—'}</dd></div>
              </dl>
            </div>

            {/* Editable workflow */}
            <div className="space-y-3 border-t border-gray-800 pt-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-500">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5">Priority</label>
                <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-500">
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5">Internal notes</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5">Status-change note (optional)</label>
                <input value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="e.g. Called, confirmed dates" className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-500" />
              </div>
              <button onClick={save} disabled={saving} className={cn('w-full py-2.5 rounded-lg text-sm font-medium transition-colors', saving ? 'bg-gray-800 text-gray-500' : 'bg-brand-500 text-white hover:bg-brand-400')}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>

            {/* History */}
            {inq.statusHistory?.length > 0 && (
              <div className="border-t border-gray-800 pt-5">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Status history</p>
                <ul className="space-y-2">
                  {[...inq.statusHistory].reverse().map((h) => (
                    <li key={h.id} className="text-xs text-gray-400"><span className="text-gray-200">{h.status}</span>{h.note ? ` — ${h.note}` : ''} <span className="text-gray-600">· {fmtDate(h.createdAt)}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Train manager ──────────────────────────────────────────────────────
const emptyClass = () => ({ type: '', fare: '', availability: 'Available' })
const emptyTrain = () => ({ fromCode: '', toCode: '', name: '', number: '', departure: '', arrival: '', duration: '', classes: [emptyClass()], active: true })

function TrainForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState(null)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const setClass = (i, k, v) => setForm((f) => ({ ...f, classes: f.classes.map((c, ci) => (ci === i ? { ...c, [k]: v } : c)) }))
  const addClass = () => setForm((f) => ({ ...f, classes: [...f.classes, emptyClass()] }))
  const removeClass = (i) => setForm((f) => ({ ...f, classes: f.classes.filter((_, ci) => ci !== i) }))

  const submit = () => {
    setError(null)
    // Normalize payload — fares to numbers, codes upper.
    const payload = {
      fromCode: form.fromCode.trim().toUpperCase(),
      toCode: form.toCode.trim().toUpperCase(),
      name: form.name.trim(),
      number: String(form.number).trim(),
      departure: form.departure.trim(),
      arrival: form.arrival.trim(),
      duration: form.duration.trim(),
      active: form.active,
      classes: form.classes
        .filter((c) => c.type.trim())
        .map((c) => ({ type: c.type.trim(), fare: Number(c.fare) || 0, availability: (c.availability || '').trim() || 'Available' })),
    }
    if (!payload.classes.length) { setError('Add at least one class with a type.'); return }
    onSave(payload, setError)
  }

  const inputCls = 'w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-500'
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">From code</label><input value={form.fromCode} onChange={(e) => set('fromCode', e.target.value)} placeholder="DEL" className={inputCls} /></div>
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">To code</label><input value={form.toCode} onChange={(e) => set('toCode', e.target.value)} placeholder="JAI" className={inputCls} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Train name</label><input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ajmer Shatabdi" className={inputCls} /></div>
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Number</label><input value={form.number} onChange={(e) => set('number', e.target.value)} placeholder="12015" className={inputCls} /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Departure</label><input value={form.departure} onChange={(e) => set('departure', e.target.value)} placeholder="06:10" className={inputCls} /></div>
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Arrival</label><input value={form.arrival} onChange={(e) => set('arrival', e.target.value)} placeholder="10:40" className={inputCls} /></div>
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Duration</label><input value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="4h 30m" className={inputCls} /></div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] uppercase tracking-wider text-gray-500">Classes &amp; fares</label>
          <button onClick={addClass} className="text-xs text-brand-400 hover:text-brand-300">+ Add class</button>
        </div>
        <div className="space-y-2">
          {form.classes.map((c, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={c.type} onChange={(e) => setClass(i, 'type', e.target.value)} placeholder="3AC" className={cn(inputCls, 'flex-1')} />
              <input value={c.fare} onChange={(e) => setClass(i, 'fare', e.target.value)} placeholder="₹ fare" inputMode="numeric" className={cn(inputCls, 'w-24')} />
              <input value={c.availability} onChange={(e) => setClass(i, 'availability', e.target.value)} placeholder="Available" className={cn(inputCls, 'w-28')} />
              <button onClick={() => removeClass(i)} disabled={form.classes.length <= 1} className={cn('text-lg leading-none px-1', form.classes.length <= 1 ? 'text-gray-700' : 'text-red-400 hover:text-red-300')}>×</button>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-300">
        <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} className="accent-brand-500" />
        Active (visible in search results)
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button onClick={submit} disabled={saving} className={cn('flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors', saving ? 'bg-gray-800 text-gray-500' : 'bg-brand-500 text-white hover:bg-brand-400')}>{saving ? 'Saving…' : 'Save train'}</button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-lg text-sm border border-gray-800 text-gray-300 hover:bg-gray-800">Cancel</button>
      </div>
    </div>
  )
}

function TrainManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // train object or 'new'
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await AdminService.listTrains(search ? { search } : {})
    setLoading(false)
    if (res.ok) setItems(res.data.items)
  }, [search])

  useEffect(() => { load() }, [load])

  const save = async (payload, setError) => {
    setSaving(true)
    const res = editing === 'new'
      ? await AdminService.createTrain(payload)
      : await AdminService.updateTrain(editing.id, payload)
    setSaving(false)
    if (res.ok) { setEditing(null); load() }
    else setError?.(res.data?.message || 'Could not save. Check the fields.')
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this train record permanently?')) return
    const res = await AdminService.deleteTrain(id)
    if (res.ok) load()
  }

  const toInitial = (t) => ({
    fromCode: t.fromCode, toCode: t.toCode, name: t.name, number: t.number,
    departure: t.departure, arrival: t.arrival, duration: t.duration,
    active: t.active, classes: (Array.isArray(t.classes) ? t.classes : []).map((c) => ({ ...c, fare: String(c.fare ?? '') })),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or number…"
          className="flex-1 min-w-[200px] bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500" />
        <button onClick={() => setEditing('new')} className="bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium rounded-lg px-4 py-2.5">+ Add train</button>
      </div>

      {editing && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm font-medium text-white mb-4">{editing === 'new' ? 'New train record' : `Edit · ${editing.name}`}</p>
          <TrainForm initial={editing === 'new' ? emptyTrain() : toInitial(editing)} onSave={save} onCancel={() => setEditing(null)} saving={saving} />
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-800">
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">Train</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Timing</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Classes</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-600">Loading…</td></tr>}
            {!loading && items.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-600">No train records yet. Add one to get started.</td></tr>}
            {!loading && items.map((t) => (
              <tr key={t.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                <td className="px-4 py-3 font-mono text-brand-400 text-xs">{t.fromCode} → {t.toCode}</td>
                <td className="px-4 py-3"><div className="text-white">{t.name}</div><div className="text-xs text-gray-500">#{t.number}</div></td>
                <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{t.departure}–{t.arrival} <span className="text-gray-600">· {t.duration}</span></td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell text-xs">{(Array.isArray(t.classes) ? t.classes : []).map((c) => `${c.type} ₹${c.fare}`).join(' · ')}</td>
                <td className="px-4 py-3"><span className={cn('text-[10px] uppercase px-2 py-0.5 rounded', t.active ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-800')}>{t.active ? 'Active' : 'Hidden'}</span></td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(t)} className="text-xs text-gray-300 hover:text-white border border-gray-800 rounded px-2 py-1 mr-1">Edit</button>
                  <button onClick={() => remove(t.id)} className="text-xs text-red-400 hover:text-red-300 border border-gray-800 rounded px-2 py-1">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Bus manager ────────────────────────────────────────────────────────
const emptyBus = () => ({ fromCode: '', toCode: '', operator: '', busType: '', departure: '', arrival: '', duration: '', fare: '', seats: '', active: true })

function BusForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState(null)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = () => {
    setError(null)
    const payload = {
      fromCode: form.fromCode.trim().toUpperCase(),
      toCode: form.toCode.trim().toUpperCase(),
      operator: form.operator.trim(),
      busType: form.busType.trim(),
      departure: form.departure.trim(),
      arrival: form.arrival.trim(),
      duration: form.duration.trim(),
      fare: Number(form.fare) || 0,
      seats: Number(form.seats) || 0,
      active: form.active,
    }
    if (!payload.operator) { setError('Operator name is required.'); return }
    if (!payload.busType) { setError('Bus type is required.'); return }
    onSave(payload, setError)
  }

  const inputCls = 'w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-500'
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">From code</label><input value={form.fromCode} onChange={(e) => set('fromCode', e.target.value)} placeholder="DEL" className={inputCls} /></div>
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">To code</label><input value={form.toCode} onChange={(e) => set('toCode', e.target.value)} placeholder="JAI" className={inputCls} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Operator</label><input value={form.operator} onChange={(e) => set('operator', e.target.value)} placeholder="RSRTC Volvo" className={inputCls} /></div>
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Bus type</label><input value={form.busType} onChange={(e) => set('busType', e.target.value)} placeholder="AC Sleeper" className={inputCls} /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Departure</label><input value={form.departure} onChange={(e) => set('departure', e.target.value)} placeholder="06:00" className={inputCls} /></div>
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Arrival</label><input value={form.arrival} onChange={(e) => set('arrival', e.target.value)} placeholder="11:30" className={inputCls} /></div>
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Duration</label><input value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="5h 30m" className={inputCls} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Fare (₹)</label><input value={form.fare} onChange={(e) => set('fare', e.target.value)} placeholder="750" inputMode="numeric" className={inputCls} /></div>
        <div><label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Seats available</label><input value={form.seats} onChange={(e) => set('seats', e.target.value)} placeholder="15" inputMode="numeric" className={inputCls} /></div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-300">
        <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} className="accent-brand-500" />
        Active (visible in search results)
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button onClick={submit} disabled={saving} className={cn('flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors', saving ? 'bg-gray-800 text-gray-500' : 'bg-brand-500 text-white hover:bg-brand-400')}>{saving ? 'Saving…' : 'Save bus'}</button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-lg text-sm border border-gray-800 text-gray-300 hover:bg-gray-800">Cancel</button>
      </div>
    </div>
  )
}

function BusManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // bus object or 'new'
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await AdminService.listBuses(search ? { search } : {})
    setLoading(false)
    if (res.ok) setItems(res.data.items)
  }, [search])

  useEffect(() => { load() }, [load])

  const save = async (payload, setError) => {
    setSaving(true)
    const res = editing === 'new'
      ? await AdminService.createBus(payload)
      : await AdminService.updateBus(editing.id, payload)
    setSaving(false)
    if (res.ok) { setEditing(null); load() }
    else setError?.(res.data?.message || 'Could not save. Check the fields.')
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this bus record permanently?')) return
    const res = await AdminService.deleteBus(id)
    if (res.ok) load()
  }

  const toInitial = (b) => ({
    fromCode: b.fromCode, toCode: b.toCode, operator: b.operator, busType: b.busType,
    departure: b.departure, arrival: b.arrival, duration: b.duration,
    fare: String(b.fare ?? ''), seats: String(b.seats ?? ''), active: b.active,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search operator or type…"
          className="flex-1 min-w-[200px] bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500" />
        <button onClick={() => setEditing('new')} className="bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium rounded-lg px-4 py-2.5">+ Add bus</button>
      </div>

      {editing && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm font-medium text-white mb-4">{editing === 'new' ? 'New bus record' : `Edit · ${editing.operator}`}</p>
          <BusForm initial={editing === 'new' ? emptyBus() : toInitial(editing)} onSave={save} onCancel={() => setEditing(null)} saving={saving} />
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-800">
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">Operator</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Timing</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Fare · Seats</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-600">Loading…</td></tr>}
            {!loading && items.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-600">No bus records yet. Add one to get started.</td></tr>}
            {!loading && items.map((b) => (
              <tr key={b.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                <td className="px-4 py-3 font-mono text-brand-400 text-xs">{b.fromCode} → {b.toCode}</td>
                <td className="px-4 py-3"><div className="text-white">{b.operator}</div><div className="text-xs text-gray-500">{b.busType}</div></td>
                <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{b.departure}–{b.arrival} <span className="text-gray-600">· {b.duration}</span></td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell text-xs">₹{b.fare?.toLocaleString('en-IN')} · {b.seats} seats</td>
                <td className="px-4 py-3"><span className={cn('text-[10px] uppercase px-2 py-0.5 rounded', b.active ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-800')}>{b.active ? 'Active' : 'Hidden'}</span></td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(b)} className="text-xs text-gray-300 hover:text-white border border-gray-800 rounded px-2 py-1 mr-1">Edit</button>
                  <button onClick={() => remove(b.id)} className="text-xs text-red-400 hover:text-red-300 border border-gray-800 rounded px-2 py-1">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Account (change password) ──────────────────────────────────────────
function AccountPanel({ admin, onLogout }) {

  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [ok, setOk] = useState(false)
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(null); setOk(false)
    if (next !== confirm) { setError('New passwords do not match.'); return }
    if (next.length < 8) { setError('New password must be at least 8 characters.'); return }
    setSaving(true)
    const res = await AdminService.changePassword(current, next)
    setSaving(false)
    if (!res.ok) { setError(res.data?.message || 'Could not change password.'); return }
    setOk(true); setCurrent(''); setNext(''); setConfirm('')
    // Server clears the session — sign out after a brief confirmation.
    setTimeout(() => onLogout(), 1500)
  }

  const inputCls = 'w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-brand-500'
  return (
    <div className="max-w-md">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <p className="text-sm font-medium text-white mb-1">Change password</p>
        <p className="text-xs text-gray-500 mb-5">Signed in as {admin.email}. You&apos;ll be signed out after changing it.</p>
        <form onSubmit={submit} className="space-y-3">
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Current password" autoComplete="current-password" className={inputCls} />
          <input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="New password (min 8, letters + numbers)" autoComplete="new-password" className={inputCls} />
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" autoComplete="new-password" className={inputCls} />
          {error && <p className="text-sm text-red-400">{error}</p>}
          {ok && <p className="text-sm text-green-400">Password updated. Signing out…</p>}
          <button type="submit" disabled={saving} className={cn('w-full py-3 rounded-lg text-sm font-medium transition-colors', saving ? 'bg-gray-800 text-gray-500' : 'bg-brand-500 text-white hover:bg-brand-400')}>{saving ? 'Updating…' : 'Update password'}</button>
        </form>
      </div>
    </div>
  )
}

// ─── Dashboard ──────────────────────────────────────────────────────────
function Dashboard({ admin, onLogout }) {
  const [tab, setTab] = useState('inquiries')

  const [analytics, setAnalytics] = useState(null)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ status: 'ALL', priority: 'ALL', search: '' })
  const [selectedId, setSelectedId] = useState(null)
  const pageSize = 20

  const loadAnalytics = useCallback(async () => {
    const res = await AdminService.analytics()
    if (res.ok) setAnalytics(res.data.analytics)
  }, [])

  const loadInquiries = useCallback(async () => {
    const res = await AdminService.listInquiries({ ...filters, page, pageSize })
    if (res.ok) { setItems(res.data.items); setTotal(res.data.total) }
  }, [filters, page])

  useEffect(() => { loadAnalytics() }, [loadAnalytics])
  useEffect(() => { loadInquiries() }, [loadInquiries])

  const refresh = () => { loadAnalytics(); loadInquiries() }

  const logout = async () => { await AdminService.logout(); onLogout() }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-gray-950 z-10">
        <div>
          <h1 className="text-lg font-light text-white">HumSafar Admin</h1>
          <p className="text-xs text-gray-500">Signed in as {admin.name}</p>
        </div>
        <button onClick={logout} className="text-xs uppercase tracking-wider text-gray-400 hover:text-white border border-gray-800 rounded-full px-4 py-2 transition-colors">Sign out</button>
      </header>

      {/* Tab navigation */}
      <nav className="border-b border-gray-800 px-6 flex gap-1 sticky top-[65px] bg-gray-950 z-10">
        {[
          { key: 'inquiries', label: 'Inquiries' },
          { key: 'trains', label: 'Train records' },
          { key: 'buses', label: 'Bus records' },
          { key: 'account', label: 'Account' },

        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
              tab === t.key ? 'border-brand-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300',
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'trains' && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          <TrainManager />
        </div>
      )}

      {tab === 'buses' && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          <BusManager />
        </div>
      )}


      {tab === 'account' && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          <AccountPanel admin={admin} onLogout={logout} />
        </div>
      )}

      {tab === 'inquiries' && (
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Analytics */}
        {analytics && (

          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Total inquiries" value={analytics.total} />
              <Stat label="Last 7 days" value={analytics.last7Count} />
              <Stat label="Conversion" value={`${analytics.conversionRate}%`} sub="completed / total" />
              <Stat label="Open" value={analytics.byStatus.filter((s) => ['NEW', 'CONTACTED', 'PLANNING'].includes(s.status)).reduce((a, b) => a + b.count, 0)} sub="not yet closed" />
            </div>
            <DailyChart daily={analytics.daily} />
            <div className="grid md:grid-cols-3 gap-4">
              <Breakdown title="By status" rows={analytics.byStatus} colorMap={STATUS_COLOR} />
              <Breakdown title="By priority" rows={analytics.byPriority} colorMap={PRIORITY_COLOR} />
              <Breakdown title="By type" rows={analytics.byType} />
            </div>
            {analytics.topRoutes.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">Top routes</p>
                <div className="flex flex-wrap gap-2">
                  {analytics.topRoutes.map((r, i) => (
                    <span key={i} className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full">{r.from} → {r.to} <span className="text-gray-500">· {r.count}</span></span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <input value={filters.search} onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, search: e.target.value })) }} placeholder="Search name, email, phone, ref…"
            className="flex-1 min-w-[200px] bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500" />
          <select value={filters.status} onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, status: e.target.value })) }} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500">
            <option value="ALL">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filters.priority} onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, priority: e.target.value })) }} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500">
            <option value="ALL">All priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-800">
                <th className="px-4 py-3 font-medium">Ref</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Route</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Priority</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-600">No inquiries found.</td></tr>}
              {items.map((it) => (
                <tr key={it.id} onClick={() => setSelectedId(it.id)} className="border-b border-gray-800/50 hover:bg-gray-800/40 cursor-pointer transition-colors">
                  <td className="px-4 py-3 font-mono text-brand-400 text-xs">{it.reference}</td>
                  <td className="px-4 py-3"><div className="text-white">{it.fullName}</div><div className="text-xs text-gray-500">{it.email}</div></td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{it.fromCity && it.toCity ? `${it.fromCity} → ${it.toCity}` : '—'}</td>
                  <td className="px-4 py-3"><span className={cn('text-[10px] uppercase px-2 py-0.5 rounded', STATUS_COLOR[it.status])}>{it.status}</span></td>
                  <td className="px-4 py-3 hidden sm:table-cell"><span className={cn('text-[10px] uppercase px-2 py-0.5 rounded', PRIORITY_COLOR[it.priority])}>{it.priority}</span></td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{fmtDate(it.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">{total} total · page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className={cn('px-3 py-1.5 rounded-lg text-xs border border-gray-800', page <= 1 ? 'text-gray-700' : 'text-gray-300 hover:bg-gray-800')}>Prev</button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className={cn('px-3 py-1.5 rounded-lg text-xs border border-gray-800', page >= totalPages ? 'text-gray-700' : 'text-gray-300 hover:bg-gray-800')}>Next</button>
          </div>
        </div>
      </div>
      )}

      {tab === 'inquiries' && selectedId && <DetailDrawer id={selectedId} onClose={() => setSelectedId(null)} onChanged={refresh} />}

    </div>
  )
}

// ─── Root ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [admin, setAdmin] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    (async () => {
      const res = await AdminService.me()
      if (res.ok) setAdmin(res.data.admin)
      setChecking(false)
    })()
  }, [])

  if (checking) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><div className="w-6 h-6 rounded-full border-2 border-gray-700 border-t-brand-500 animate-spin" /></div>
  if (!admin) return <LoginForm onSuccess={setAdmin} />
  return <Dashboard admin={admin} onLogout={() => setAdmin(null)} />
}
