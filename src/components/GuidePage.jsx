import { useEffect, useState } from 'react'

const CHECKS = [
  ['Name at the top', 'The first line should read as a person’s name, alone.'],
  ['Email and phone', 'Put both in the contact line as plain text.'],
  ['Location or link', 'A city, LinkedIn, or portfolio helps the parser place you.'],
  ['Professional summary', 'Name the work and a result. Generic filler lines score lower.'],
  ['Experience', 'Job title, company, dates, and separate bullets.'],
  ['Education', 'A degree or diploma with the college. Only 10th or 12th scores lower.'],
  ['Skills', 'A plain list under a Skills heading, such as SQL | Excel | UAT.'],
  ['Role keywords', 'With a target role, common words for that job change the score. Add a word only when it is true.'],
  ['Bullets and verbs', 'Start each line with a hyphen and a verb such as led or built. Describe the result, not only the duty.'],
  ['Numbers', 'Percentages, time saved, team size, or revenue. Use a number only when you can explain it.'],
  ['Dates', 'A start and end, written like Jan 2022 - Present, and kept consistent.'],
  ['Plain text', 'One column of selectable text. Skip tables, text boxes, icons, and scans. Length follows experience: one page for a fresher, one or two pages after a few years.'],
]

const RULE_GROUPS = [
  {
    title: 'Formatting',
    rules: [
      ['Simple, clean layout', 'A single column is the best default. Extra columns and complex layouts can scramble the reading order. Classic is the plain column in this studio.'],
      ['Standard fonts', 'Use a readable face such as Arial, Calibri, Aptos, or Times New Roman. The resume here is set in Source Sans, which prints like Calibri.'],
      ['Readable type size', 'Body text stays around 10–12 pt. Section headings stay around 12–16 pt. The name can sit a little larger.'],
      ['Standard headings', 'Use Professional Summary, Skills, Experience, Education, Projects, and Certifications. Parsers look for those names.'],
      ['No tables or text boxes', 'Keep important text in the main column. Headers, footers, floating boxes, and decorative graphics are easy for a parser to skip.'],
      ['No photo, logos, or skill bars', 'A photo, company logo, progress bar, or star rating does not help an ATS. Write skills as text. Leave the photo off when the application asks for a plain file.'],
    ],
  },
  {
    title: 'File format',
    rules: [
      ['PDF or DOCX', 'Send the format the portal asks for. When it does not say, a text-based PDF or DOCX is the usual choice. This studio downloads DOCX and TXT, and Print PDF makes the PDF.'],
      ['Selectable text', 'The text should highlight and copy. An image-only or scanned PDF is hard to parse. If a scan comes in with almost no text, paste the words instead.'],
      ['Check the export', 'After you print or save, confirm spacing, dates, and headings still read in order.'],
      ['Standard margins', 'About 0.5–1 inch keeps the text readable. Print PDF uses a 0.5 inch margin on A4.'],
      ['Extraction test', 'Copy the whole PDF into Notepad. If the order is wrong, words are missing, or headings are broken, switch to Classic and print again. Copy text in the studio is the same check.'],
    ],
  },
  {
    title: 'Content',
    rules: [
      ['Tailor each application', 'One generic file is a weak match for every job. Set the target role, then keep the lines that fit that description.'],
      ['Use real keywords', 'If the role asks for SQL, UAT, stakeholder management, or requirements gathering and you have done that work, write those words in the summary, skills, or bullets.'],
      ['A short summary', 'Two to four lines: the experience, the kind of work, and one relevant result.'],
      ['A clear skills line', 'List skills so they can be read in one pass, for example SQL | Excel | Requirements gathering | UAT | Jira.'],
      ['Recent work first', 'Put the latest job at the top and the oldest job at the bottom.'],
      ['Complete job lines', 'Each role needs a title, company, location when it matters, and a start and end date.'],
      ['Achievements, not duties', '“Responsible for UAT” names a task. A stronger line says what you changed and what happened after.'],
      ['Numbers you can stand behind', '“Raised UAT feedback closure from 80% to 95%” is useful when the number is accurate.'],
      ['Consistent dates', 'Jan 2023 – Mar 2025 and January 2023 – March 2025 both parse. Pick one style and keep it.'],
      ['Spelling and contact', 'Check company names, job titles, the email, and the phone before you send the file.'],
      ['A true history', 'Keep overlapping dates explainable. Leave out skills you cannot discuss in an interview.'],
    ],
  },
  {
    title: 'Length and extra sections',
    rules: [
      ['Length follows experience', 'A fresher is usually one page. Two to five years is often one or two pages. A longer career can run to two pages or more when the achievements are relevant. These are guides, not a hard ATS cutoff.'],
      ['Projects and certifications', 'On a project, name your part, the tools, and the outcome. List certifications that match the job.'],
      ['Contact in the body', 'Name, phone, a professional email, city or country, and a LinkedIn link belong in the contact line. Do not leave them only in a page header or footer.'],
    ],
  },
]

const NUMBERED_GROUPS = (() => {
  let number = 0
  return RULE_GROUPS.map((group) => ({
    title: group.title,
    rules: group.rules.map(([title, copy]) => {
      number += 1
      return { number, title, copy }
    }),
  }))
})()

const CHECKLIST = [
  'Single-column, clean layout',
  'Readable font and consistent headings',
  'No unnecessary photo, graphics, or skill bars',
  'Text-based PDF or the requested DOCX',
  'PDF text extraction checked',
  'Job-specific keywords included naturally',
  'Relevant skills and tools listed honestly',
  'Achievements supported by real numbers',
  'Job titles, company names, and dates consistent',
  'Spelling, grammar, and contact details checked',
  'Education, projects, and certifications complete',
  'Resume tailored to the target job',
]

const CHECKLIST_KEY = 'ats-readiness-checklist'

function loadChecklist() {
  try {
    const raw = JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '[]')
    if (!Array.isArray(raw)) return CHECKLIST.map(() => false)
    return CHECKLIST.map((_, index) => Boolean(raw[index]))
  } catch {
    return CHECKLIST.map(() => false)
  }
}

function ReadinessChecklist() {
  const [done, setDone] = useState(loadChecklist)
  const [copied, setCopied] = useState(false)
  const [copyText, setCopyText] = useState('')
  const complete = done.filter(Boolean).length

  useEffect(() => {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(done))
  }, [done])

  function toggle(index) {
    setDone((current) => current.map((value, itemIndex) => (itemIndex === index ? !value : value)))
    setCopied(false)
    setCopyText('')
  }

  function reset() {
    setDone(CHECKLIST.map(() => false))
    setCopied(false)
    setCopyText('')
  }

  async function copy() {
    const lines = [
      'ATS readiness checklist',
      `${complete}/${CHECKLIST.length} complete`,
      '',
      ...CHECKLIST.map((item, index) => `${done[index] ? '[x]' : '[ ]'} ${item}`),
    ]
    const text = lines.join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setCopyText('')
      return
    } catch {
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.left = '-9999px'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      area.remove()
      setCopied(ok)
      setCopyText(ok ? '' : text)
    }
  }

  return (
    <section id="checklist" className="mt-14 rounded-3xl border border-line bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl">ATS readiness checklist</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">Use this before each application. It stays in this browser.</p>
        </div>
        <p className="font-display text-2xl text-moss">{complete}/{CHECKLIST.length} complete</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-sand" aria-hidden="true">
        <div className="h-full rounded-full bg-moss" style={{ width: `${(complete / CHECKLIST.length) * 100}%` }} />
      </div>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {CHECKLIST.map((item, index) => (
          <li key={item}>
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-white px-3 py-3 hover:border-ink">
              <input
                type="checkbox"
                checked={done[index]}
                onChange={() => toggle(index)}
                className="mt-1 h-4 w-4 accent-[#3157f5]"
              />
              <span className={done[index] ? 'text-sm leading-6 text-muted line-through' : 'text-sm leading-6'}>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-ink">
          Reset checklist
        </button>
        <button type="button" onClick={copy} className="rounded-full bg-moss px-4 py-2 text-sm font-semibold text-white hover:bg-moss-deep">
          {copied ? 'Copied' : 'Copy checklist'}
        </button>
      </div>
      {copyText && (
        <textarea
          readOnly
          value={copyText}
          rows={8}
          onFocus={(event) => event.target.select()}
          className="mt-4 w-full rounded-2xl border border-line bg-white p-3 text-sm leading-6"
          aria-label="Checklist text"
        />
      )}
    </section>
  )
}

export default function GuidePage({ onScore, onBuild, onMake }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">How it works</p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
        A score for structure, then a resume an ATS can read.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-muted">
        An applicant tracking system helps a recruiter organize, search, and evaluate resumes. This studio scores the text, then rebuilds it in one column with standard headings.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={onScore} className="rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-white hover:bg-moss-deep">
          Score a resume
        </button>
        <button type="button" onClick={onMake} className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-semibold hover:border-ink">
          Make my resume
        </button>
        <button type="button" onClick={onBuild} className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-semibold hover:border-ink">
          Build from fields
        </button>
      </div>

      <ol className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          ['1', 'Bring the resume', 'Upload a PDF, DOCX, or TXT, paste the text, or type the fields.'],
          ['2', 'Read the percentage', 'The uploaded file and the rebuilt version each get a score out of 100.'],
          ['3', 'Download the clean file', 'Save DOCX or TXT, or print a simple PDF. Review every line first.'],
        ].map(([step, title, copy]) => (
          <li key={step} className="rounded-3xl border border-line bg-card p-5">
            <span className="font-display text-3xl text-clay">{step}</span>
            <h2 className="mt-2 font-display text-2xl">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
          </li>
        ))}
      </ol>

      <section id="rules" className="mt-14">
        <h2 className="font-display text-3xl">25 rules for an ATS-friendly resume</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Make the file readable first. Then match the content to the job. A high score here is a structure check, not a promise that one employer will select the resume.
        </p>
        <div className="mt-6 space-y-8">
          {NUMBERED_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">{group.title}</h3>
              <ol className="mt-3 grid gap-3 sm:grid-cols-2">
                {group.rules.map((rule) => (
                  <li key={rule.number} className="rounded-2xl border border-line bg-white px-4 py-3">
                    <h4 className="font-semibold">
                      <span className="mr-2 text-clay">{rule.number}.</span>
                      {rule.title}
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-muted">{rule.copy}</p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <ReadinessChecklist />

      <section className="mt-14 rounded-3xl bg-ink px-6 py-8 text-card">
        <h2 className="font-display text-3xl">A clean file and a strong match are different</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-sand">
          Clean formatting helps the system read the resume. Relevant skills, matching experience, and achievements you can explain are what make the application strong. Each ATS scores in its own way. No single layout or keyword count guarantees a selection. Read the file first, then tailor it to the job description.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl">The checks behind the score</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {CHECKS.map(([title, copy]) => (
            <article key={title} className="rounded-2xl border border-line bg-white px-4 py-3">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="privacy" className="mt-14 rounded-3xl bg-ink px-6 py-8 text-card">
        <h2 className="font-display text-3xl">It stays on this device</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-sand">
          There is no account and no database. The file is read here, the draft is stored in this browser, and a download is created on your computer. A specific employer can still use extra rules beyond this score.
        </p>
      </section>
    </main>
  )
}
