import './admin-layout.css'
import './admin.css'

type Props = {
  title: string
  description: string
}

export function AdminSectionPlaceholder({ title, description }: Props) {
  return (
    <>
      <h2 className="adminSectionTitle">{title}</h2>
      <p className="adminPageSub">{description}</p>
      <p className="adminTokenHint">
        Wire this UI to the corresponding <code className="adminCode">GET/POST/PATCH</code> admin
        routes when you are ready. Ensure <code className="adminCode">VITE_API_URL</code> and a
        stored JWT are set.
      </p>
    </>
  )
}
