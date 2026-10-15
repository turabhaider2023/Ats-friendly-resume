export function clean(value) {
  return (value || '').replace(/\s+/g, ' ').trim()
}

export function splitList(value) {
  const seen = new Set()
  const items = []
  for (const part of (value || '').split(/[,;\n|]/)) {
    const item = part.replace(/^[-•*]\s*/, '').trim()
    if (!item) continue
    const key = item.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    items.push(item)
  }
  return items
}

export function splitLines(value) {
  return (value || '')
    .split(/\n/)
    .map((line) => line.replace(/^[-•*▪]\s*/, '').trim())
    .filter(Boolean)
}

export function formatDates(job) {
  const start = clean(job.start)
  const end = job.current ? 'Present' : clean(job.end)
  if (start && end) return `${start} - ${end}`
  return start || end || ''
}

function hasJobContent(job) {
  return Boolean(clean(job.title) || clean(job.company) || splitLines(job.bulletText).length)
}

function hasSchoolContent(school) {
  return Boolean(clean(school.degree) || clean(school.school) || clean(school.details))
}

function hasProjectContent(project) {
  return Boolean(clean(project.name) || splitLines(project.bulletText).length)
}

export function resumeDocument(resume) {
  const contact = [resume.location, resume.phone, resume.email, resume.linkedin, resume.website]
    .map(clean)
    .filter(Boolean)

  return {
    name: clean(resume.fullName),
    role: clean(resume.targetRole),
    contact,
    summary: (resume.summary || '').trim(),
    skills: splitList(resume.skillsText),
    experience: (resume.experience || []).filter(hasJobContent).map((job) => ({
      title: clean(job.title),
      company: clean(job.company),
      location: clean(job.location),
      dates: formatDates(job),
      bullets: splitLines(job.bulletText),
    })),
    education: (resume.education || []).filter(hasSchoolContent).map((school) => ({
      degree: clean(school.degree),
      school: clean(school.school),
      location: clean(school.location),
      year: clean(school.year),
      details: clean(school.details),
    })),
    projects: (resume.projects || []).filter(hasProjectContent).map((project) => ({
      name: clean(project.name),
      link: clean(project.link),
      bullets: splitLines(project.bulletText),
    })),
    certifications: splitLines(resume.certificationsText),
  }
}

export function resumeToPlainText(resume) {
  const doc = resumeDocument(resume)
  const lines = []

  if (doc.name) lines.push(doc.name.toUpperCase())
  if (doc.role) lines.push(doc.role)
  if (doc.contact.length) lines.push(doc.contact.join(' | '))
  if (lines.length) lines.push('')

  if (doc.summary) {
    lines.push('PROFESSIONAL SUMMARY')
    lines.push(doc.summary)
    lines.push('')
  }

  if (doc.skills.length) {
    lines.push('SKILLS')
    lines.push(doc.skills.join(', '))
    lines.push('')
  }

  if (doc.experience.length) {
    lines.push('EXPERIENCE')
    for (const job of doc.experience) {
      if (job.title) lines.push(job.title)
      const meta = [job.company, job.location].filter(Boolean).join(' | ')
      if (meta) lines.push(meta)
      if (job.dates) lines.push(job.dates)
      for (const bullet of job.bullets) lines.push(`- ${bullet}`)
      lines.push('')
    }
  }

  if (doc.education.length) {
    lines.push('EDUCATION')
    for (const school of doc.education) {
      if (school.degree) lines.push(school.degree)
      const meta = [school.school, school.location].filter(Boolean).join(' | ')
      if (meta) lines.push(meta)
      if (school.year) lines.push(school.year)
      if (school.details) lines.push(school.details)
      lines.push('')
    }
  }

  if (doc.projects.length) {
    lines.push('PROJECTS')
    for (const project of doc.projects) {
      const title = [project.name, project.link].filter(Boolean).join(' | ')
      if (title) lines.push(title)
      for (const bullet of project.bullets) lines.push(`- ${bullet}`)
      lines.push('')
    }
  }

  if (doc.certifications.length) {
    lines.push('CERTIFICATIONS')
    for (const item of doc.certifications) lines.push(`- ${item}`)
    lines.push('')
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

export function fileBaseName(fullName) {
  const base = clean(fullName).replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
  return base || 'ATS-Resume'
}
