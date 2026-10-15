import { useState } from 'react'
import { readPhotoFile } from '../lib/photo.js'
import { emptyJob, emptyProject, emptySchool } from '../lib/resumeModel.js'

const fieldClass =
  'mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-[#a39888] focus:border-moss focus:ring-2 focus:ring-moss/20'

function Field({ label, children }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
      {label}
      {children}
    </label>
  )
}

function TextField({ label, value, onChange, placeholder, type = 'text', disabled = false }) {
  return (
    <Field label={label}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClass} disabled:bg-sand`}
      />
    </Field>
  )
}

function AreaField({ label, value, onChange, placeholder, rows = 4, hint }) {
  return (
    <Field label={label}>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
      {hint && <span className="mt-1 block text-[11px] font-medium normal-case tracking-normal text-muted">{hint}</span>}
    </Field>
  )
}

function Card({ title, action, children }) {
  return (
    <section className="rounded-3xl border border-line bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function TextButton({ children, onClick }) {
  return (
    <button type="button" onClick={onClick} className="text-sm font-semibold text-moss-deep hover:underline">
      {children}
    </button>
  )
}

export default function ResumeForm({ resume, onChange, onExample }) {
  const [photoError, setPhotoError] = useState('')

  function update(partial) {
    onChange({ ...resume, ...partial })
  }

  function updateItem(key, id, partial) {
    onChange({
      ...resume,
      [key]: resume[key].map((item) => (item.id === id ? { ...item, ...partial } : item)),
    })
  }

  function removeItem(key, id) {
    onChange({
      ...resume,
      [key]: resume[key].filter((item) => item.id !== id),
    })
  }

  return (
    <div className="space-y-4">
      <Card
        title="Your details"
        action={<TextButton onClick={onExample}>Load an example</TextButton>}
      >
        <div className="mb-4 flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-sand text-[11px] font-semibold text-muted">
            {resume.photo ? <img src={resume.photo} alt="" className="h-full w-full object-cover" /> : 'Photo'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-card">
                Upload photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={async (event) => {
                    const file = event.target.files?.[0]
                    event.target.value = ''
                    if (!file) return
                    try {
                      const photo = await readPhotoFile(file)
                      setPhotoError('')
                      update({ photo })
                    } catch (error) {
                      setPhotoError(error.message || 'That photo could not be added.')
                    }
                  }}
                />
              </label>
              {resume.photo && (
                <button type="button" onClick={() => update({ photo: '' })} className="text-sm font-semibold text-moss-deep">
                  Remove photo
                </button>
              )}
            </div>
            <p className="mt-1 text-xs leading-5 text-muted">JPG, PNG, or WEBP. The photo stays in this browser. For an ATS file, skip the photo and print with Classic.</p>
            {photoError && <p className="mt-1 text-xs text-clay">{photoError}</p>}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label="Full name" value={resume.fullName} onChange={(fullName) => update({ fullName })} placeholder="Meera Kapoor" />
          <TextField
            label="Target role"
            value={resume.targetRole}
            onChange={(targetRole) => update({ targetRole })}
            placeholder="Product Analyst"
          />
          <TextField label="Email" type="email" value={resume.email} onChange={(email) => update({ email })} placeholder="name@email.com" />
          <TextField label="Phone" value={resume.phone} onChange={(phone) => update({ phone })} placeholder="+91 98765 43210" />
          <TextField label="Location" value={resume.location} onChange={(location) => update({ location })} placeholder="Bengaluru, India" />
          <TextField label="LinkedIn" value={resume.linkedin} onChange={(linkedin) => update({ linkedin })} placeholder="linkedin.com/in/your-name" />
          <div className="sm:col-span-2">
            <TextField label="Website" value={resume.website} onChange={(website) => update({ website })} placeholder="https://yoursite.com" />
          </div>
        </div>
      </Card>

      <Card title="Summary">
        <AreaField
          label="Professional summary"
          value={resume.summary}
          onChange={(summary) => update({ summary })}
          placeholder="Role, years of experience, what you do, and one proof point."
          hint="Two to four sentences in plain text. Skip tables, icons, and text boxes."
        />
      </Card>

      <Card title="Skills">
        <AreaField
          label="Skills, separated by commas"
          value={resume.skillsText}
          rows={3}
          onChange={(skillsText) => update({ skillsText })}
          placeholder="SQL, Excel, stakeholder communication"
        />
      </Card>

      <Card
        title="Experience"
        action={<TextButton onClick={() => update({ experience: [...resume.experience, emptyJob()] })}>Add experience</TextButton>}
      >
        <div className="space-y-5">
          {resume.experience.map((job, index) => (
            <div key={job.id} className="rounded-2xl border border-line bg-white p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Role {index + 1}</p>
                <TextButton onClick={() => removeItem('experience', job.id)}>Remove</TextButton>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Job title" value={job.title} onChange={(title) => updateItem('experience', job.id, { title })} />
                <TextField label="Company" value={job.company} onChange={(company) => updateItem('experience', job.id, { company })} />
                <TextField label="Location" value={job.location} onChange={(location) => updateItem('experience', job.id, { location })} />
                <TextField label="Start" value={job.start} onChange={(start) => updateItem('experience', job.id, { start })} placeholder="Jan 2022" />
                <TextField
                  label="End"
                  value={job.current ? 'Present' : job.end}
                  disabled={job.current}
                  onChange={(end) => updateItem('experience', job.id, { end })}
                  placeholder="Dec 2024"
                />
                <label className="flex items-end gap-2 pb-2 text-sm font-medium normal-case tracking-normal text-ink">
                  <input
                    type="checkbox"
                    checked={job.current}
                    onChange={(event) => updateItem('experience', job.id, { current: event.target.checked, end: '' })}
                  />
                  I currently work here
                </label>
                <div className="sm:col-span-2">
                  <AreaField
                    label="Achievements"
                    value={job.bulletText}
                    onChange={(bulletText) => updateItem('experience', job.id, { bulletText })}
                    placeholder={'Led a team of 4 and cut review time by 30%'}
                    hint="One achievement per line. Start with a verb and add a number when you can."
                  />
                </div>
              </div>
            </div>
          ))}
          {resume.experience.length === 0 && (
            <button
              type="button"
              onClick={() => update({ experience: [emptyJob()] })}
              className="text-sm font-semibold text-moss-deep"
            >
              Add experience
            </button>
          )}
        </div>
      </Card>

      <Card
        title="Education"
        action={<TextButton onClick={() => update({ education: [...resume.education, emptySchool()] })}>Add education</TextButton>}
      >
        <div className="space-y-5">
          {resume.education.map((school, index) => (
            <div key={school.id} className="rounded-2xl border border-line bg-white p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">School {index + 1}</p>
                <TextButton onClick={() => removeItem('education', school.id)}>Remove</TextButton>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Degree" value={school.degree} onChange={(degree) => updateItem('education', school.id, { degree })} />
                <TextField label="School" value={school.school} onChange={(schoolName) => updateItem('education', school.id, { school: schoolName })} />
                <TextField label="Location" value={school.location} onChange={(location) => updateItem('education', school.id, { location })} />
                <TextField label="Year" value={school.year} onChange={(year) => updateItem('education', school.id, { year })} placeholder="2019 - 2023" />
                <div className="sm:col-span-2">
                  <TextField label="Details" value={school.details} onChange={(details) => updateItem('education', school.id, { details })} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Projects"
        action={<TextButton onClick={() => update({ projects: [...resume.projects, emptyProject()] })}>Add a project</TextButton>}
      >
        {resume.projects.length === 0 && <p className="text-sm text-muted">Optional. Add a project if it shows work the job needs.</p>}
        <div className="space-y-5">
          {resume.projects.map((project, index) => (
            <div key={project.id} className="rounded-2xl border border-line bg-white p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Project {index + 1}</p>
                <TextButton onClick={() => removeItem('projects', project.id)}>Remove</TextButton>
              </div>
              <div className="grid gap-3">
                <TextField label="Project name" value={project.name} onChange={(name) => updateItem('projects', project.id, { name })} />
                <TextField label="Link" value={project.link} onChange={(link) => updateItem('projects', project.id, { link })} />
                <AreaField
                  label="Details"
                  value={project.bulletText}
                  rows={3}
                  onChange={(bulletText) => updateItem('projects', project.id, { bulletText })}
                  placeholder="One detail per line"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Certifications">
        <AreaField
          label="One certification per line"
          value={resume.certificationsText}
          rows={3}
          onChange={(certificationsText) => update({ certificationsText })}
          placeholder="Google Data Analytics Certificate, 2023"
        />
      </Card>
    </div>
  )
}
