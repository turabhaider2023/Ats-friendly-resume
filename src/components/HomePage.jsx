import { useEffect, useState } from 'react'

const FRAMES = [
  { id: 'classic', label: 'Classic' },
  { id: 'sidebar', label: 'Sidebar' },
  { id: 'band', label: 'Header band' },
]

function motionOff() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useSampleMotion() {
  const [frame, setFrame] = useState(0)
  const [score, setScore] = useState(() => (motionOff() ? 87 : 0))

  useEffect(() => {
    if (motionOff()) return undefined
    const started = performance.now()
    let raf = 0
    const tick = (now) => {
      const progress = Math.min(1, (now - started) / 1100)
      setScore(Math.round(87 * (1 - (1 - progress) ** 3)))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const timer = window.setInterval(() => {
      setFrame((current) => (current + 1) % FRAMES.length)
    }, 3200)
    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(timer)
    }
  }, [])

  return { frame, score }
}

function Portrait() {
  return (
    <svg viewBox="0 0 64 64" className="mini-photo" aria-hidden="true">
      <rect width="64" height="64" fill="#dfe6ff" />
      <circle cx="32" cy="26" r="11" fill="#f0c2a0" />
      <path d="M14 60c1.2-14 8-21 18-21s16.8 7 18 21" fill="#3157f5" />
      <path d="M21 28c1-11 5.5-16 11-16s10 5 11 16c-3 2-6.5 3-11 3s-8-1-11-3z" fill="#2a211c" />
    </svg>
  )
}

function ResumeBody() {
  return (
    <div className="mini-main">
      <p className="mini-kicker">Summary</p>
      <p className="mini-copy">Product analyst with 4 years turning usage data into decisions for product and design teams.</p>
      <p className="mini-kicker">Experience</p>
      <p className="mini-job">Product Analyst</p>
      <p className="mini-meta">Northwind Labs · Jan 2022 – Present</p>
      <p className="mini-li">Built a retention dashboard used by 6 squads, cutting status meetings by 30%.</p>
      <p className="mini-li">Analyzed 18 launches and recommended shipping 11 features.</p>
      <p className="mini-kicker">Skills</p>
      <p className="mini-copy">SQL, Excel, Python, Tableau, A/B testing</p>
    </div>
  )
}

function SampleSheet({ frame }) {
  const layout = FRAMES[frame].id

  if (layout === 'sidebar') {
    return (
      <article key={layout} className="home-sheet" data-layout="sidebar">
        <div className="mini-side">
          <Portrait />
          <p className="mini-name">Meera Kapoor</p>
          <p className="mini-role">Product Analyst</p>
          <p className="mini-contact">Bengaluru, India<br />meera@email.com</p>
        </div>
        <ResumeBody />
      </article>
    )
  }

  if (layout === 'band') {
    return (
      <article key={layout} className="home-sheet" data-layout="band">
        <div className="mini-band">
          <Portrait />
          <div>
            <p className="mini-name">Meera Kapoor</p>
            <p className="mini-role">Product Analyst</p>
            <p className="mini-contact">Bengaluru · meera@email.com</p>
          </div>
        </div>
        <ResumeBody />
      </article>
    )
  }

  return (
    <article key={layout} className="home-sheet" data-layout="classic">
      <div className="mini-head">
        <Portrait />
        <div>
          <p className="mini-name">Meera Kapoor</p>
          <p className="mini-role">Product Analyst</p>
          <p className="mini-contact">Bengaluru, India · meera@email.com</p>
        </div>
      </div>
      <ResumeBody />
    </article>
  )
}

function ResumeStage() {
  const { frame, score } = useSampleMotion()
  const active = FRAMES[frame]
  const dash = 2 * Math.PI * 28
  const filled = dash * (score / 100)

  return (
    <div className="home-stage" role="region" aria-label="Sample resume preview">
      <div className="home-orb home-orb-a" />
      <div className="home-orb home-orb-b" />
      <div className="home-float">
        <SampleSheet frame={frame} />
      </div>
      <div className="home-badge" aria-hidden="true">
        <svg viewBox="0 0 72 72" className="home-ring">
          <circle cx="36" cy="36" r="28" />
          <circle
            cx="36"
            cy="36"
            r="28"
            className="home-ring-value"
            strokeDasharray={`${filled} ${dash}`}
          />
        </svg>
        <span>{score}</span>
      </div>
      <div className="home-switch">
        {FRAMES.map((item, index) => (
          <span key={item.id} className={index === frame ? 'is-on' : ''} aria-current={index === frame ? 'true' : undefined}>
            {item.label}
          </span>
        ))}
      </div>
      <p className="sr-only">{active.label} sample</p>
    </div>
  )
}

export default function HomePage({ onScore, onMake, onBlank, onContinue, hasDraft }) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8">
      <section className="home-hero">
        <div>
          <p className="home-rise text-sm font-semibold uppercase tracking-[0.18em] text-moss">Private resume studio</p>
          <h1 className="home-rise home-delay-1 mt-3 max-w-xl font-display text-5xl leading-[0.95] text-ink sm:text-6xl">
            See the <span className="text-iris">ATS score</span>. Then rebuild the resume in plain text.
          </h1>
          <p className="home-rise home-delay-2 mt-5 max-w-xl text-lg leading-7 text-muted">
            Upload the resume you already have, or give a name, a field, and a role. The page scores the text and writes a single-column resume with standard headings.
          </p>
          <div className="home-rise home-delay-3 mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={onMake} className="home-cta bg-moss text-white hover:bg-moss-deep">
              Make my resume
            </button>
            <button type="button" onClick={onScore} className="home-cta bg-clay text-white hover:brightness-105">
              Score a resume
            </button>
            <button type="button" onClick={onBlank} className="home-cta border border-transparent text-moss-deep hover:bg-sand">
              Start blank
            </button>
            {hasDraft && (
              <button type="button" onClick={onContinue} className="rounded-full px-4 py-2.5 text-sm font-semibold text-moss-deep underline">
                Continue saved draft
              </button>
            )}
          </div>
        </div>
        <ResumeStage />
      </section>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {[
          ['14', 'Checks in the score'],
          ['7', 'Resume templates'],
          ['0', 'Uploads sent to a server'],
        ].map(([value, label], index) => (
          <div key={label} className="home-stat" style={{ animationDelay: `${180 + index * 80}ms` }}>
            <p className="font-display text-3xl text-moss">{value}</p>
            <p className="mt-1 text-sm text-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <button type="button" onClick={onScore} className="home-card">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss">Already have a resume</p>
          <h2 className="mt-2 font-display text-3xl">Upload and score it</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Get the file's ATS percentage, then review a rebuilt version that uses one column and standard section names.
          </p>
        </button>
        <button type="button" onClick={onMake} className="home-card home-card-moss">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sand">Name, field, and role</p>
          <h2 className="mt-2 font-display text-3xl">Make my resume</h2>
          <p className="mt-2 text-sm leading-6 text-sand">
            Choose a field and role. The summary, skills, and experience are filled in, and you can edit every line.
          </p>
        </button>
        <button type="button" onClick={onBlank} className="home-card">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss">Start from fields</p>
          <h2 className="mt-2 font-display text-3xl">Build an ATS resume</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Type your details. The score updates as you go, and the preview stays in a layout parsers can read.
          </p>
        </button>
      </div>
    </main>
  )
}
