import type { ConversationRow } from '../data/callMatrixMock'

function escapeCell(v: string): string {
  const s = String(v)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function formatIso(d: Date) {
  return d.toISOString()
}

export function downloadConversationsCsv(rows: ConversationRow[], filename = 'call-matrix-export.csv') {
  const headers = [
    'Date & time (ISO)',
    'Phone',
    'Agent',
    'Tags',
    'Duration (sec)',
    'Status',
    'Campaign',
    'Call type',
  ]
  const lines = [
    headers.join(','),
    ...rows.map((r) =>
      [
        escapeCell(formatIso(r.startedAt)),
        escapeCell(r.phone),
        escapeCell(r.agent),
        escapeCell(r.tags ?? ''),
        escapeCell(String(r.durationSec)),
        escapeCell(r.status),
        escapeCell(r.campaign),
        escapeCell(r.callType),
      ].join(','),
    ),
  ]
  const bom = '\uFEFF'
  const blob = new Blob([bom + lines.join('\r\n')], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
