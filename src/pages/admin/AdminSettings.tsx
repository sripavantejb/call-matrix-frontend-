import { useEffect, useState } from 'react'
import { apiGet, apiPatch, getStoredToken } from '../../lib/api'
import './admin-layout.css'
import './admin.css'

export function AdminSettings() {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!getStoredToken()) {
      setLoading(false)
      return
    }
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const config = await apiGet<Record<string, unknown>>('/admin/settings')
        if (!cancelled) {
          setText(JSON.stringify(config, null, 2))
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load settings')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSave() {
    setSaved(null)
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(text) as Record<string, unknown>
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setError('Settings must be a JSON object.')
        return
      }
    } catch {
      setError('Invalid JSON. Fix syntax before saving.')
      return
    }

    setSaving(true)
    setError(null)
    try {
      const merged = await apiPatch<Record<string, unknown>>('/admin/settings', parsed)
      setText(JSON.stringify(merged, null, 2))
      setSaved('Saved.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (!getStoredToken()) {
    return (
      <p className="adminTokenHint">
        No JWT — sign in from <a href="/admin/login">/admin/login</a>.
      </p>
    )
  }

  return (
    <>
      <p className="adminPageSub">GET /admin/settings · PATCH /admin/settings (merge into platform JSON)</p>
      {loading && <p className="adminPageSub">Loading…</p>}
      {error && (
        <p className="adminTokenHint" role="alert">
          {error}
        </p>
      )}
      {saved && (
        <p className="adminTokenHint" role="status">
          {saved}
        </p>
      )}
      {!loading && (
        <>
          <textarea
            className="textarea-field"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={18}
            spellCheck={false}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}
          />
          <div className="adminToolbar" style={{ marginTop: 16 }}>
            <button type="button" className="btn-primary" disabled={saving} onClick={() => void handleSave()}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </>
      )}
    </>
  )
}
