import { Upload, X } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import './knowledge.css'

type UploadDocumentsModalProps = {
  open: boolean
  onClose: () => void
  onUpload: (files: File[]) => void
}

function formatTypesHint() {
  return 'PDF, DOCX, HTML, TXT, CSV'
}

export function UploadDocumentsModal({
  open,
  onClose,
  onUpload,
}: UploadDocumentsModalProps) {
  const titleId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    if (!open) {
      setFiles([])
      setDragOver(false)
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

  const addFiles = useCallback((list: FileList | File[]) => {
    const next = Array.from(list).filter(Boolean)
    if (next.length === 0) return
    setFiles((prev) => {
      const seen = new Set(prev.map((f) => `${f.name}-${f.size}`))
      const merged = [...prev]
      for (const f of next) {
        const k = `${f.name}-${f.size}`
        if (!seen.has(k)) {
          seen.add(k)
          merged.push(f)
        }
      }
      return merged
    })
  }, [])

  const removeAt = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  if (!open) return null

  const canUpload = files.length > 0

  return (
    <div
      className="modalOverlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modalPanel modalPanelXl"
        style={{ maxWidth: 520 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modalHeader">
          <h2 id={titleId} className="modalTitle">
            Upload Documents
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
        <p className="modalHint">
          Add PDFs, DOCX, HTML, CSV or text files to your knowledge base.
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.html,.htm,.txt,.csv,text/plain,text/html"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files)
            e.target.value = ''
          }}
        />

        <div
          className={`kbDropZone${dragOver ? ' kbDropZoneKb' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setDragOver(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setDragOver(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setDragOver(false)
            if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
          }}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Choose files to upload or drag and drop here"
        >
          <div className="kbDropZoneIcon" aria-hidden>
            <Upload size={26} strokeWidth={1.75} />
          </div>
          <p className="kbDropZoneTitle">Click to upload or drag and drop</p>
          <p className="kbDropZoneHint">{formatTypesHint()}</p>
        </div>

        {files.length > 0 ? (
          <ul className="kbFileList" aria-label="Selected files">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`}>
                <span className="truncate" title={f.name}>
                  {f.name}
                </span>
                <button
                  type="button"
                  className="kbFileRemove"
                  aria-label={`Remove ${f.name}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    removeAt(i)
                  }}
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="kbMutedCount" style={{ marginTop: 8 }}>
            No files selected
          </p>
        )}

        <div className="kbModalFooterSplit">
          <p className="kbMutedCount">
            {files.length} file{files.length === 1 ? '' : 's'} selected
          </p>
          <div className="kbModalFooterActions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={!canUpload}
              onClick={() => {
                onUpload(files)
                onClose()
              }}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
