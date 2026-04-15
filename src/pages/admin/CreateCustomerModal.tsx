import { Wand2, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import '../../components/agents/agents.css'
import './admin.css'

const MIN_PASSWORD_LEN = 8

export type CreateCustomerPayload = {
  name: string
  email: string
  company: string
  plan: string
  /** If set, user logs into the main app with this password. Omit to let the API generate one. */
  password?: string
}

type CreateCustomerModalProps = {
  open: boolean
  onClose: () => void
  onCreate: (payload: CreateCustomerPayload) => Promise<void>
  /** Modal title */
  title?: string
  /** Primary submit button label */
  submitLabel?: string
}

const PLANS = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
] as const

function randomPassword(length = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => chars[b % chars.length]).join('')
}

export function CreateCustomerModal({
  open,
  onClose,
  onCreate,
  title = 'Create SaaS customer',
  submitLabel = 'Create customer',
}: CreateCustomerModalProps) {
  const titleId = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [plan, setPlan] = useState<string>('pro')
  const [password, setPassword] = useState('')
  const [modalError, setModalError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) {
      setName('')
      setEmail('')
      setCompany('')
      setPlan('pro')
      setPassword('')
      setModalError(null)
      setBusy(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const passwordTouched = password.length > 0
  const passwordOk = !passwordTouched || password.length >= MIN_PASSWORD_LEN

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().includes('@') &&
    company.trim().length > 0 &&
    plan.length > 0 &&
    passwordOk

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setModalError(null)

    if (passwordTouched && password.length < MIN_PASSWORD_LEN) {
      setModalError(`Password must be at least ${MIN_PASSWORD_LEN} characters.`)
      return
    }

    if (!canSubmit) return

    const payload: CreateCustomerPayload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company.trim(),
      plan,
      ...(passwordTouched ? { password } : {}),
    }

    setBusy(true)
    try {
      await onCreate(payload)
      onClose()
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="modalOverlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modalPanel"
        style={{ maxWidth: 480 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modalHeader">
          <h2 id={titleId} className="modalTitle">
            {title}
          </h2>
          <button type="button" className="modalClose" onClick={onClose} aria-label="Close">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="fieldStack" style={{ gap: 16 }}>
            <div>
              <label className="fieldLabel" htmlFor="admin-create-name">
                Name
              </label>
              <input
                id="admin-create-name"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label className="fieldLabel" htmlFor="admin-create-email">
                Email
              </label>
              <input
                id="admin-create-email"
                className="input-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="fieldLabel" htmlFor="admin-create-company">
                Company
              </label>
              <input
                id="admin-create-company"
                className="input-field"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                autoComplete="organization"
                required
              />
            </div>
            <div>
              <label className="fieldLabel" htmlFor="admin-create-plan">
                Plan
              </label>
              <select
                id="admin-create-plan"
                className="selectField"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              >
                {PLANS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="fieldLabel" htmlFor="admin-create-password">
                Password
              </label>
              <div className="adminPasswordRow">
                <input
                  id="admin-create-password"
                  className="input-field"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder={`Optional — min ${MIN_PASSWORD_LEN} chars, or leave blank to auto-generate`}
                />
                <button
                  type="button"
                  className="adminGhostBtn adminGeneratePwBtn"
                  onClick={() => {
                    setPassword(randomPassword())
                    setModalError(null)
                  }}
                >
                  <Wand2 size={16} strokeWidth={2} aria-hidden />
                  Generate random password
                </button>
              </div>
            </div>
            {modalError && (
              <p className="adminTokenHint" role="alert">
                {modalError}
              </p>
            )}
            <p className="adminModalFootnote">
              API keys are created for the tenant automatically. If the password field is empty, the API
              returns a generated password once — copy it from the confirmation after create.
            </p>
          </div>
          <div className="modalFooter" style={{ gap: 12, flexWrap: 'wrap' }}>
            <button type="button" className="btn-outline" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!canSubmit || busy}>
              {busy ? 'Creating…' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
