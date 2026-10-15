import { useState } from 'react'
import Logo from './Logo.jsx'

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'score', label: 'Score resume' },
  { id: 'build', label: 'Build resume' },
  { id: 'make', label: 'Make my resume' },
  { id: 'guide', label: 'How it works' },
]

export default function SiteHeader({ active, onHome, onScore, onBuild, onMake, onGuide }) {
  const [open, setOpen] = useState(false)

  const actions = {
    home: onHome,
    score: onScore,
    build: onBuild,
    make: onMake,
    guide: onGuide,
  }

  function choose(id) {
    setOpen(false)
    actions[id]()
  }

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo onClick={() => choose('home')} />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => choose(link.id)}
              aria-current={active === link.id ? 'page' : undefined}
              className={`rounded-full px-3 py-2 text-sm font-semibold ${
                active === link.id ? 'bg-moss text-white' : 'text-ink hover:bg-sand'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => choose('make')}
            aria-current={active === 'make' ? 'page' : undefined}
            className="rounded-full bg-moss px-3 py-2 text-sm font-semibold text-white hover:bg-moss-deep md:hidden"
          >
            Make my resume
          </button>
          <button
            type="button"
            onClick={() => choose('score')}
            className="hidden rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold lg:inline-flex"
          >
            Check a file
          </button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="flex w-4 flex-col gap-1">
              <span className={`block h-0.5 w-full bg-ink transition ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-full bg-ink transition ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-full bg-ink transition ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-card px-4 py-3 md:hidden" aria-label="Mobile">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => choose(link.id)}
                className={`rounded-xl px-3 py-3 text-left text-sm font-semibold ${
                  active === link.id ? 'bg-moss text-white' : 'hover:bg-sand'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
