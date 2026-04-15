import { Send, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import '../agents/agents.css'
import './dashboard.css'

type HelpTeamModalProps = {
  open: boolean
  onClose: () => void
}

export function HelpTeamModal({ open, onClose }: HelpTeamModalProps) {
  const titleId = useId()
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!open) setMessage('')
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

  const canSend = message.trim().length > 0

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
            Send Message to Our Team
          </h2>
          <button
            type="button"
            className="modalClose"
            aria-label="Close"
            onClick={onClose}
          >
            <X size={22} strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <textarea
          id="help-team-message"
          className="helpModalTextarea"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          aria-label="Message to our team"
        />

        <div className="helpModalFooter">
          <button
            type="button"
            className="btn-primary"
            disabled={!canSend}
            onClick={() => {
              onClose()
            }}
          >
            <Send size={18} strokeWidth={2} aria-hidden />
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
