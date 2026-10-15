import { useMemo, useState } from 'react'
import {
  FIELDS,
  buildDraftResume,
  fieldById,
  loadCustomRoles,
  saveCustomRoles,
  suggestedSkills,
} from '../lib/careerCatalog.js'

const fieldClass =
  'mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-[#a39888] focus:border-moss focus:ring-2 focus:ring-moss/20'

export default function MakeResume({ initialName = '', photo = '', template = 'classic', onCreate }) {
  const [fullName, setFullName] = useState(initialName)
  const [fieldId, setFieldId] = useState(FIELDS[0].id)
  const [roleName, setRoleName] = useState(FIELDS[0].roles[0].name)
  const [skillsInput, setSkillsInput] = useState(() => suggestedSkills(FIELDS[0].id, FIELDS[0].roles[0].name).join(', '))
  const [customInput, setCustomInput] = useState('')
  const [customs, setCustoms] = useState(loadCustomRoles)
  const [error, setError] = useState('')

  const career = fieldById(fieldId)
  const selectedCustom = (customs[fieldId] || []).some((name) => name.toLowerCase() === roleName.toLowerCase())
  const roles = useMemo(() => {
    const names = new Set(career.roles.map((item) => item.name.toLowerCase()))
    const extras = (customs[fieldId] || []).filter((name) => !names.has(name.toLowerCase()))
    return [
      ...career.roles.map((item) => ({ name: item.name, custom: false })),
      ...extras.map((name) => ({ name, custom: true })),
    ]
  }, [career, customs, fieldId])

  const preview = useMemo(
    () => buildDraftResume({
      fullName: fullName.trim() || 'Your Name',
      fieldId,
      roleName,
      skillsText: skillsInput,
    }),
    [fullName, fieldId, roleName, skillsInput],
  )

  function applyRole(nextFieldId, name) {
    setRoleName(name)
    setSkillsInput(suggestedSkills(nextFieldId, name).join(', '))
  }

  function chooseField(nextId) {
    const next = fieldById(nextId)
    const extras = customs[next.id] || []
    setFieldId(next.id)
    applyRole(next.id, extras[0] || next.roles[0].name)
    setError('')
  }

  function addCustomRole() {
    const name = customInput.trim().replace(/\s+/g, ' ')
    if (name.length < 2) {
      setError('Type the role you want to add.')
      return
    }
    if (name.length > 60) {
      setError('Keep the role name under 60 characters.')
      return
    }
    const existing = roles.find((item) => item.name.toLowerCase() === name.toLowerCase())
    if (existing) {
      setRoleName(existing.name)
      setCustomInput('')
      setError('')
      return
    }
    const next = {
      ...customs,
      [fieldId]: [name, ...(customs[fieldId] || [])].slice(0, 20),
    }
    setCustoms(next)
    saveCustomRoles(next)
    applyRole(fieldId, name)
    setCustomInput('')
    setError('')
  }

  function removeCustomRole(name) {
    const nextList = (customs[fieldId] || []).filter((item) => item.toLowerCase() !== name.toLowerCase())
    const next = { ...customs, [fieldId]: nextList }
    setCustoms(next)
    saveCustomRoles(next)
    if (roleName.toLowerCase() === name.toLowerCase()) {
      applyRole(fieldId, career.roles[0].name)
    }
    setError('')
  }

  function createResume() {
    const name = fullName.trim().replace(/\s+/g, ' ')
    const words = name.split(' ').filter(Boolean)
    if (words.length < 2) {
      setError('Add your first and last name. The resume starts with that line.')
      return
    }
    if (!roleName.trim()) {
      setError('Pick a role, or add your own.')
      return
    }
    const draft = buildDraftResume({
      fullName: name,
      fieldId,
      roleName,
      photo,
      template,
      skillsText: skillsInput,
    })
    onCreate(
      draft.resume,
      `Draft ready for ${draft.roleName} in ${draft.fieldName}. Company, college, city, dates, and numbers are starters. Replace them with your real work, then add your email and phone. Every field stays editable.`,
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">Make my resume</p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
        Your name, a field, and a role. The draft is filled in for you.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-muted">
        Pick a field the way job sites group them, then choose a role or add one of your own. Summary, skills, experience, education, and a project are written for that role. You can edit every line before you download.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <form
          className="rounded-3xl border border-line bg-card p-5"
          onSubmit={(event) => {
            event.preventDefault()
            createResume()
          }}
        >
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
            Full name
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Meera Kapoor"
              autoComplete="name"
              className={fieldClass}
            />
          </label>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
              Field
              <select
                value={fieldId}
                onChange={(event) => chooseField(event.target.value)}
                className={fieldClass}
              >
                {FIELDS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                Role
                <select
                  value={roleName}
                  onChange={(event) => applyRole(fieldId, event.target.value)}
                  className={fieldClass}
                >
                  {roles.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.custom ? `${item.name} (custom)` : item.name}
                    </option>
                  ))}
                </select>
              </label>
              {selectedCustom && (
                <button
                  type="button"
                  onClick={() => removeCustomRole(roleName)}
                  className="mt-2 text-sm font-semibold text-clay"
                >
                  Remove this role
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Roles in {career.name}
            </p>
            <div className="mt-2 flex flex-wrap gap-2" role="listbox" aria-label={`Roles in ${career.name}`}>
              {roles.map((item) => {
                const selected = item.name === roleName
                return (
                  <span
                    key={item.name}
                    className={`inline-flex items-center rounded-full border ${
                      selected ? 'border-moss bg-moss text-white' : 'border-line bg-white'
                    }`}
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => applyRole(fieldId, item.name)}
                      className="px-3 py-1.5 text-left text-sm font-semibold"
                    >
                      {item.name}
                      {item.custom ? <span className={selected ? 'text-sand' : 'text-muted'}> · custom</span> : null}
                    </button>
                    {item.custom && (
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeCustomRole(item.name)}
                        className={`mr-1.5 grid h-5 w-5 place-items-center rounded-full text-sm leading-none ${
                          selected ? 'bg-white/20 text-white' : 'bg-sand text-ink'
                        }`}
                      >
                        ×
                      </button>
                    )}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Add a custom role</p>
            <div className="mt-1 flex gap-2">
              <input
                value={customInput}
                onChange={(event) => setCustomInput(event.target.value)}
                placeholder="Role not in the list"
                className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
              />
              <button
                type="button"
                onClick={addCustomRole}
                className="shrink-0 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-ink"
              >
                Add role
              </button>
            </div>
          </div>

          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted">
            Skills for this role
            <textarea
              value={skillsInput}
              onChange={(event) => setSkillsInput(event.target.value)}
              rows={3}
              placeholder="SQL, Excel, stakeholder communication"
              className={fieldClass}
            />
          </label>
          <p className="mt-1 text-xs leading-5 text-muted">These words go into the summary and the skills line. Keep only skills you can explain.</p>

          {error && <p className="mt-4 text-sm font-medium text-clay">{error}</p>}

          <button type="submit" className="mt-5 rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-white hover:bg-moss-deep">
            Make my resume
          </button>
          <p className="mt-3 text-sm leading-6 text-muted">
            Company, college, city, dates, and numbers are placeholders. Swap them for your real work before you send the file. Email and phone stay empty until you add them.
          </p>
        </form>

        <aside className="rounded-3xl border border-line bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss">{career.name}</p>
          <h2 className="mt-2 font-display text-3xl">{roleName}</h2>
          <p className="mt-4 text-sm leading-6 text-ink">{preview.resume.summary}</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
            <li>{selectedCustom ? `The draft uses “${roleName}” as the title, in the summary, and in both jobs.` : 'The summary names this role, its tools, and one result.'}</li>
            <li>Edit the skills box to change the keywords in that summary.</li>
            <li>Two experience blocks with bullets, dates, and numbers you can rewrite.</li>
            <li>Education, one certification, and a project starter. One column, standard headings.</li>
          </ul>
          <p className="mt-5 text-sm leading-6">
            {FIELDS.length} fields are in the list, including IT Services, Civil Engineering, Banking, and Healthcare. Each field opens its own roles.
          </p>
        </aside>
      </div>
    </main>
  )
}
