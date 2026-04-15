import '../components/dashboard/dashboard.css'

type PlaceholderPageProps = {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div>
      <h1
        className="greeting"
        style={{ marginBottom: 8 }}
      >
        {title}
      </h1>
      {description ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
          {description}
        </p>
      ) : (
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
          This section is coming soon.
        </p>
      )}
    </div>
  )
}
