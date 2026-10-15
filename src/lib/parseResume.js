import { emptyResume, uid } from './resumeModel.js'

const HEADINGS = [
  ['summary', /^(professional\s+summary|career\s+summary|summary|profile|professional\s+profile|objective|career\s+objective|about(?:\s+me)?)$/i],
  ['experience', /^(work\s+experience|professional\s+experience|employment(?:\s+history)?|work\s+history|experience)$/i],
  ['education', /^(education|academic\s+background|academics)$/i],
  ['skills', /^(technical\s+skills|key\s+skills|core\s+competencies|competencies|skills|technologies|technical\s+proficiencies)$/i],
  ['projects', /^(projects|personal\s+projects|selected\s+projects|academic\s+projects)$/i],
  ['certifications', /^(certifications?|certificates|licenses(?:\s+(?:&|and)\s+certifications)?)$/i],
]

const DATE_RANGE_RE =
  /((?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[.]?\s+\d{4}|\d{1,2}[./-]\d{4}|(?:19|20)\d{2})\s*(?:-|–|—|to)\s*((?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[.]?\s+\d{4}|\d{1,2}[./-]\d{4}|(?:19|20)\d{2}|present|current|now)/i

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
const PHONE_PATTERNS = [
  /(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]\d{4}\b/,
  /(?:\+91[\s.-]?)?[6-9]\d{4}[\s.-]?\d{5}\b/,
  /(?:\+91[\s.-]?)?[6-9]\d{9}\b/,
]

export function normalizeHeading(line) {
  return (line || '')
    .trim()
    .replace(/^[#*\-•]+\s*/, '')
    .replace(/[:|]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function headingKey(line) {
  const cleaned = normalizeHeading(line)
  if (!cleaned || cleaned.length > 48) return null
  for (const [key, pattern] of HEADINGS) {
    if (pattern.test(cleaned)) return key
  }
  return null
}

function isBullet(line) {
  return /^([-•*▪]|\d+[.)])\s+\S/.test(line.trim())
}

function stripBullet(line) {
  return line.replace(/^([-•*▪]|\d+[.)])\s+/, '').trim()
}

function hasDateRange(line) {
  return DATE_RANGE_RE.test(line)
}

function isDateLine(line) {
  const value = line.trim()
  if (!value || value.length > 70 || isBullet(value)) return false
  if (hasDateRange(value)) return true
  return /^(?:19|20)\d{2}$/.test(value)
}

function tidyDate(value) {
  const text = value.trim()
  if (/present|current|now/i.test(text)) return 'Present'
  return text.replace(/\s+/g, ' ')
}

function extractDates(line) {
  const match = line.match(DATE_RANGE_RE)
  if (match) {
    const end = tidyDate(match[2])
    const rest = `${line.slice(0, match.index)} ${line.slice(match.index + match[0].length)}`
      .replace(/[|•]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^[-–,]+|[-–,]+$/g, '')
      .trim()
    return {
      start: tidyDate(match[1]),
      end: end === 'Present' ? '' : end,
      current: end === 'Present',
      rest,
    }
  }
  const year = line.match(/\b(?:19|20)\d{2}\b/)
  if (year && line.trim().length < 46) {
    return {
      start: year[0],
      end: '',
      current: false,
      rest: line.replace(year[0], '').replace(/[|•–—-]+/g, ' ').replace(/\s+/g, ' ').trim(),
    }
  }
  return { start: '', end: '', current: false, rest: line.trim() }
}

function looksLikeJobStart(lines, index) {
  const line = lines[index]
  if (!line || isBullet(line)) return false
  if (hasDateRange(line) || isDateLine(line)) return true
  if (line.length > 70 || /[.!?]$/.test(line)) return false
  for (let step = 1; step <= 3 && index + step < lines.length; step += 1) {
    if (hasDateRange(lines[index + step]) || isDateLine(lines[index + step])) return true
  }
  return false
}

function buildJob(headerLines, dateInfo, bullets) {
  const header = headerLines.map((line) => line.trim()).filter(Boolean)
  if (dateInfo.rest) header.push(dateInfo.rest)

  let title = ''
  let company = ''
  let location = ''

  if (header.length === 1) {
    const parts = header[0].split(/\s*(?:\||–|—)\s*|\s+-\s+/)
    title = parts[0] || ''
    company = parts[1] || ''
    location = parts.slice(2).join(' | ')
  } else if (header.length >= 2) {
    title = header[0]
    const parts = header[1].split(/\s*\|\s*/)
    company = parts[0] || ''
    location = parts[1] || header[2] || ''
  }

  return {
    id: uid(),
    title: title.trim(),
    company: company.trim(),
    location: location.trim(),
    start: dateInfo.start,
    end: dateInfo.end,
    current: dateInfo.current,
    bulletText: bullets.map((bullet) => bullet.trim()).filter(Boolean).join('\n'),
  }
}

function parseExperience(rawLines) {
  const lines = rawLines.map((line) => line.trim()).filter(Boolean)
  const jobs = []
  const preface = []
  let index = 0

  while (index < lines.length && isBullet(lines[index])) {
    preface.push(stripBullet(lines[index]))
    index += 1
  }

  while (index < lines.length) {
    let dateOffset = -1
    for (let step = 0; step < 4 && index + step < lines.length; step += 1) {
      if (hasDateRange(lines[index + step]) || isDateLine(lines[index + step])) {
        dateOffset = step
        break
      }
    }

    if (dateOffset === -1) {
      const rest = lines.slice(index).map(stripBullet).filter(Boolean)
      if (jobs.length === 0) {
        jobs.push(buildJob([], { start: '', end: '', current: false, rest: '' }, [...preface, ...rest]))
      } else {
        const previous = jobs[jobs.length - 1]
        previous.bulletText = [previous.bulletText, ...rest].filter(Boolean).join('\n')
      }
      break
    }

    const header = lines.slice(index, index + dateOffset).filter((line) => !isBullet(line))
    const dateInfo = extractDates(lines[index + dateOffset])
    index += dateOffset + 1
    const bullets = []

    while (index < lines.length && !looksLikeJobStart(lines, index)) {
      bullets.push(stripBullet(lines[index]))
      index += 1
    }

    const job = buildJob(header, dateInfo, bullets)
    if (jobs.length === 0 && preface.length) {
      job.bulletText = [...preface, ...job.bulletText.split('\n')].filter(Boolean).join('\n')
    }
    jobs.push(job)
  }

  return jobs
}

function parseEducation(rawLines) {
  const lines = rawLines.map((line) => line.trim()).filter(Boolean)
  if (!lines.length) return []

  const schoolRe = /university|college|institute|school/i
  const degreeRe = /bachelor|master|b\.?\s?tech|m\.?\s?tech|b\.?\s?e\b|m\.?\s?e\b|ph\.?\s?d|diploma|associate|b\.?\s?sc|m\.?\s?sc|mba|b\.?\s?com|m\.?\s?com|bca|mca|\bba\b|\bbs\b|\bms\b|\bma\b|degree/i
  const chunks = []
  let current = []

  for (const line of lines) {
    const startsEntry = current.length >= 2 && !isBullet(line) && (degreeRe.test(line) || schoolRe.test(line))
    if (startsEntry) {
      chunks.push(current)
      current = [line]
    } else {
      current.push(line)
    }
  }
  if (current.length) chunks.push(current)

  return chunks.map((chunk) => {
    const yearMatch = chunk.join(' ').match(/(?:19|20)\d{2}(?:\s*(?:-|–|—|to)\s*(?:(?:19|20)\d{2}|present))?/i)
    const year = yearMatch ? yearMatch[0].replace(/\s*(?:–|—|to)\s*/i, ' - ') : ''
    const stripped = chunk.map((line) => (year ? line.replace(yearMatch[0], '').trim() : line))
    let first = stripped[0] || ''
    let second = stripped[1] || ''
    if (schoolRe.test(first) && degreeRe.test(second)) {
      const swap = first
      first = second
      second = swap
    }
    const [school, location] = second.split(/\s*\|\s*/)
    return {
      id: uid(),
      degree: first.replace(/[|–—-]+$/g, '').trim(),
      school: (school || '').trim(),
      location: (location || '').trim(),
      year,
      details: stripped.slice(2).map(stripBullet).filter(Boolean).join(' '),
    }
  })
}

function parseSkills(lines) {
  const seen = new Set()
  const skills = []
  for (const line of lines) {
    for (const part of line.split(/[,;|•]/)) {
      const skill = stripBullet(part).trim()
      if (!skill || skill.length > 42) continue
      const key = skill.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      skills.push(skill)
    }
  }
  return skills.join(', ')
}

function parseProjects(rawLines) {
  const lines = rawLines.map((line) => line.trim()).filter(Boolean)
  const projects = []
  let current = null

  const push = () => {
    if (current && (current.name || current.bulletText)) projects.push(current)
  }

  for (const line of lines) {
    const link = (line.match(/https?:\/\/\S+|www\.\S+/i) || [])[0] || ''
    if (!current || (!isBullet(line) && current.bulletText)) {
      push()
      current = {
        id: uid(),
        name: stripBullet(line).replace(link, '').replace(/[|]+$/g, '').trim(),
        link,
        bulletText: '',
      }
      continue
    }
    if (link && !current.link) current.link = link
    const text = stripBullet(line).replace(link, '').trim()
    if (text && text !== current.name) {
      current.bulletText = [current.bulletText, text].filter(Boolean).join('\n')
    }
  }
  push()
  return projects
}

function joinProse(lines) {
  const parts = []
  let buffer = []
  const flush = () => {
    if (buffer.length) parts.push(buffer.join(' '))
    buffer = []
  }
  for (const line of lines) {
    if (!line.trim()) flush()
    else buffer.push(line.trim())
  }
  flush()
  return parts.join('\n\n').trim()
}

function looksLikeName(line) {
  const value = line.trim()
  if (!value || value.length > 60 || /@|https?:|www\.|\d{3}/.test(value)) return false
  const words = value.split(/\s+/)
  if (words.length < 2 || words.length > 5) return false
  return words.every((word) => /^[A-Za-z][A-Za-z.'’-]*$/.test(word))
}

function readableName(value) {
  if (value && value === value.toUpperCase()) {
    return value.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
  }
  return value
}

function isContactLine(line) {
  return EMAIL_RE.test(line) || Boolean(findPhone(line)) || /https?:|www\.|linkedin\.com|github\.com/i.test(line)
}

function findEmail(text) {
  return (text.match(EMAIL_RE) || [])[0] || ''
}

export function findPhone(text) {
  for (const pattern of PHONE_PATTERNS) {
    const match = text.match(pattern)
    if (match) return match[0].trim()
  }
  return ''
}

function findLinkedIn(text) {
  const match = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s)|]+/i)
  return match ? match[0].replace(/[.,]$/, '') : ''
}

function findWebsite(text) {
  const matches = text.match(/https?:\/\/[^\s)|]+|www\.[^\s)|]+/gi) || []
  const site = matches.find((url) => !/linkedin\.com/i.test(url))
  return site ? site.replace(/[.,]$/, '') : ''
}

function splitSections(text) {
  const sections = { preamble: [] }
  let current = 'preamble'
  for (const line of text.replace(/\r/g, '').split('\n')) {
    const key = headingKey(line)
    if (key) {
      current = key
      if (!sections[current]) sections[current] = []
      continue
    }
    if (!sections[current]) sections[current] = []
    sections[current].push(line)
  }
  return sections
}

export function parseResumeText(text) {
  const source = (text || '').replace(/\r/g, '').slice(0, 50000)
  const warnings = []
  const readable = source.trim()
  if (readable.length < 40) {
    warnings.push('Very little text could be read. If this was a scanned PDF, paste the text instead.')
  }

  const sections = splitSections(source)
  const preamble = sections.preamble.map((line) => line.trim()).filter(Boolean)
  let fullName = ''
  const used = new Set()
  preamble.forEach((line, index) => {
    if (!fullName && looksLikeName(line)) {
      fullName = readableName(line)
      used.add(index)
    }
  })

  let location = ''
  preamble.forEach((line, index) => {
    if (location || used.has(index)) return
    const parts = line.split('|').map((part) => part.trim())
    const located = parts.find((part) => part.length < 48 && /,/.test(part) && !isContactLine(part))
    if (located) location = located
  })

  let targetRole = ''
  let passedName = false
  for (let index = 0; index < preamble.length; index += 1) {
    const line = preamble[index]
    if (used.has(index)) {
      passedName = true
      continue
    }
    if (!passedName || targetRole) continue
    const parts = line.split('|').map((part) => part.trim())
    if (parts.length > 1 || isContactLine(line) || line === location) continue
    if (line.length > 50 || /[.!?]$/.test(line)) break
    targetRole = line
  }

  const resume = emptyResume()
  resume.fullName = fullName
  resume.targetRole = targetRole
  resume.email = findEmail(source)
  resume.phone = findPhone(source)
  resume.location = location
  resume.linkedin = findLinkedIn(source)
  resume.website = findWebsite(source)
  resume.summary = joinProse(sections.summary || [])
  resume.skillsText = parseSkills(sections.skills || [])
  resume.certificationsText = (sections.certifications || []).map((line) => stripBullet(line.trim())).filter(Boolean).join('\n')

  const jobs = parseExperience(sections.experience || [])
  if (jobs.length) resume.experience = jobs

  const schools = parseEducation(sections.education || [])
  if (schools.length) resume.education = schools

  resume.projects = parseProjects(sections.projects || [])

  const foundCore = ['summary', 'experience', 'education', 'skills'].filter((key) => sections[key])
  if (foundCore.length === 0 && readable.length >= 40) {
    warnings.push('Standard headings were not found. Review the fields and move text into Experience, Education, and Skills.')
    const leftover = preamble.filter((line, index) => !used.has(index) && !isContactLine(line) && line !== location)
    if (!resume.summary) resume.summary = joinProse(leftover).slice(0, 1200)
  } else if (foundCore.length < 3) {
    warnings.push('Some standard sections were missing. Check the form before you download.')
  }

  return { resume, warnings }
}
