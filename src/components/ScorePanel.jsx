function toneClass(tone) {
  if (tone === 'good') return 'text-moss'
  if (tone === 'mid') return 'text-amber'
  return 'text-clay'
}

function ringColor(tone) {
  if (tone === 'good') return '#3157f5'
  if (tone === 'mid') return '#c47b12'
  return '#f07820'
}

function ScoreRing({ score, tone }) {
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28 shrink-0" role="img" aria-label={`${score} out of 100`}>
      <circle cx="60" cy="60" r={radius} fill="none" stroke="#e4e8f5" strokeWidth="8" />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke={ringColor(tone)}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="58" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize="28" fill="#1b1914">
        {score}
      </text>
      <text x="60" y="76" textAnchor="middle" fontFamily="Outfit, sans-serif" fontSize="11" fill="#6b6458">
        / 100
      </text>
    </svg>
  )
}

export default function ScorePanel({ current, original, gains, suggestions, onAddKeyword, hasRole, knownRole }) {
  const fixes = [...current.checks].filter((check) => !check.passed).sort((a, b) => b.max - b.earned - (a.max - a.earned))

  return (
    <section className="rounded-3xl border border-line bg-card p-5">
      <div className="flex items-center gap-4">
        <ScoreRing score={current.score} tone={current.tone} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">ATS version</p>
          <h2 className={`font-display text-3xl ${toneClass(current.tone)}`}>{current.label}</h2>
          <p className="mt-1 text-sm text-muted">{current.words} words in the rebuilt resume.</p>
          {original && (
            <p className="mt-2 text-sm">
              Uploaded file: <span className="font-semibold">{original.score}%</span>
              <span className="text-muted"> · rebuilt </span>
              <span className="font-semibold">{current.score}%</span>
            </p>
          )}
        </div>
      </div>

      {original && current.score + 4 < original.score && (
        <p className="mt-4 rounded-2xl bg-sand px-3 py-2 text-sm text-ink">
          The rebuilt draft is lower because some original text did not land in a field. Put that detail back into the form.
        </p>
      )}

      {gains.length > 0 && (
        <p className="mt-4 text-sm text-moss-deep">
          The clean layout improved {gains.length} {gains.length === 1 ? 'check' : 'checks'} from the uploaded file.
        </p>
      )}

      {fixes.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold">Highest-impact fixes</h3>
          <ul className="mt-2 space-y-2">
            {fixes.slice(0, 4).map((check) => (
              <li key={check.id} className="rounded-2xl bg-white px-3 py-2 text-sm">
                <span className="font-semibold">{check.label}</span>
                <span className="text-muted"> · {check.earned}/{check.max}</span>
                <p className="text-muted">{check.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5">
        <h3 className="text-sm font-semibold">All {current.checks.length} checks</h3>
        <ul className="mt-2 space-y-2">
          {current.checks.map((check) => (
            <li key={check.id} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-sm">
              <span className="font-medium">{check.label}</span>
              <span className={check.passed ? 'text-moss' : 'text-clay'}>
                {check.earned}/{check.max}
              </span>
              <span className="col-span-2 text-muted">{check.detail}</span>
              <span className="col-span-2 h-1 overflow-hidden rounded-full bg-sand">
                <span
                  className={`block h-full ${check.passed ? 'bg-moss' : 'bg-clay'}`}
                  style={{ width: `${(check.earned / check.max) * 100}%` }}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-2xl bg-white p-3">
        <h3 className="text-sm font-semibold">Keyword ideas</h3>
        <p className="mt-1 text-sm text-muted">Add a keyword only when it is true for you. Missing words lower the role-keyword check.</p>
        {hasRole && suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => onAddKeyword(word)}
                className="rounded-full border border-line bg-card px-3 py-1 text-sm hover:border-moss"
              >
                Add {word}
              </button>
            ))}
          </div>
        )}
        {hasRole && knownRole && suggestions.length === 0 && (
          <p className="mt-2 text-sm text-muted">Common words for this role already show up in the resume.</p>
        )}
        {hasRole && !knownRole && (
          <p className="mt-2 text-sm text-muted">There is no word list for this title. The keyword check then uses how specific the skills are.</p>
        )}
        {!hasRole && (
          <p className="mt-2 text-sm text-muted">Type a target role to see common words for that kind of job.</p>
        )}
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">
        This score checks contact details, summary specificity, education, role keywords, bullets, dates, and plain text. It is not a guarantee that a specific employer ATS will pass the file.
      </p>
    </section>
  )
}
