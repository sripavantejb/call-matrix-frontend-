import { BadgeCheck, Filter, Search, Upload } from 'lucide-react'
import { useMemo, useState } from 'react'
import { UploadDocumentsModal } from '../../components/knowledge/UploadDocumentsModal'
import '../../components/agents/agents.css'
import '../../components/knowledge/knowledge.css'

type KbDoc = {
  id: string
  name: string
  updatedAt: Date
  createdBy: string
}

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function KnowledgeBasePage() {
  const [docs, setDocs] = useState<KbDoc[]>([])
  const [q, setQ] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return docs
    return docs.filter((d) => d.name.toLowerCase().includes(s))
  }, [docs, q])

  const handleUploaded = (files: File[]) => {
    const now = new Date()
    setDocs((prev) => [
      ...files.map((f, i) => ({
        id: `${now.getTime()}-${i}-${f.name}`,
        name: f.name,
        updatedAt: now,
        createdBy: 'You',
      })),
      ...prev,
    ])
  }

  return (
    <>
      <div className="agentsPageHeader">
        <div>
          <h1 className="agentsPageTitle">Knowledge Base</h1>
          <p className="agentsPageSub">
            Manage uploaded documents that power your agents.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setModalOpen(true)}
        >
          <Upload size={18} strokeWidth={2} aria-hidden />
          Upload Documents
        </button>
      </div>

      <div className="kbToolbar">
        <div className="agentsSearchCard">
          <Search size={20} strokeWidth={1.75} color="var(--text-secondary)" aria-hidden />
          <input
            type="search"
            placeholder="Search documents..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search documents"
          />
        </div>
        <button type="button" className="btn-outline">
          <Filter size={18} strokeWidth={1.75} aria-hidden />
          Filters
        </button>
      </div>

      <div className="agentsStatRow" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
        <div className="agentsStatCard kbStatSingle">
          <div className="agentsStatIcon kbStatIconPurple" aria-hidden>
            <BadgeCheck size={22} strokeWidth={1.75} />
          </div>
          <div>
            <p className="agentsStatLabel">Total Documents</p>
            <p className="agentsStatValue">{docs.length}</p>
          </div>
        </div>
      </div>

      <div className="agentsTableCard">
        <h2 className="agentsTableTitle">Documents</h2>
        <div className="tableScroll">
        <table className="agentsTable">
          <thead>
            <tr>
              <th>Document name</th>
              <th>Last updated</th>
              <th>Created by</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="kbEmptyCell">
                  No documents yet
                </td>
              </tr>
            ) : (
              filtered.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {formatDate(d.updatedAt)}
                  </td>
                  <td>{d.createdBy}</td>
                  <td>
                    <div className="kbTableActions">
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={() =>
                          setDocs((prev) => prev.filter((x) => x.id !== d.id))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      <UploadDocumentsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpload={handleUploaded}
      />
    </>
  )
}
