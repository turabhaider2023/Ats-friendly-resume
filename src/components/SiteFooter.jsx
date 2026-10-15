import Logo from './Logo.jsx'

const YEAR = new Date().getFullYear()

export default function SiteFooter({ onHome, onScore, onBuild, onMake, onGuide }) {
  const columns = [
    {
      title: 'Product',
      links: [
        ['Home', onHome],
        ['Score a resume', onScore],
        ['Build a resume', onBuild],
        ['Make my resume', onMake],
        ['How it works', onGuide],
      ],
    },
    {
      title: 'What the score checks',
      links: [
        ['Contact details', onGuide],
        ['Standard headings', onGuide],
        ['Bullets, dates, and numbers', onGuide],
      ],
    },
  ]

  return (
    <footer className="no-print mt-auto bg-moss-deep text-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-6 text-sand/80">
            A private studio for ATS-readable resumes. Parsing, scoring, and downloads stay in this browser.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sand/60">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.links.map(([label, action]) => (
                <li key={label}>
                  <button type="button" onClick={action} className="text-sm font-medium text-card hover:underline">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-sand/70">
          <p>© {YEAR} ATS Friendly Resume</p>
          <p>No account. No database. Nothing is uploaded.</p>
        </div>
      </div>
    </footer>
  )
}
