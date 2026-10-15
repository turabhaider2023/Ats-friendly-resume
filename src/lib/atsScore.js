import { keywordCoverage } from './keywords.js'
import { findPhone, headingKey } from './parseResume.js'

const ACTION_VERBS = [
  'led', 'built', 'created', 'designed', 'developed', 'launched', 'managed', 'improved',
  'increased', 'reduced', 'delivered', 'owned', 'implemented', 'automated', 'analyzed',
  'analysed', 'coordinated', 'mentored', 'negotiated', 'resolved', 'streamlined',
  'optimized', 'optimised', 'migrated', 'architected', 'shipped', 'drove', 'established',
  'facilitated', 'generated', 'introduced', 'maintained', 'organized', 'organised',
  'planned', 'produced', 'redesigned', 'saved', 'scaled', 'simplified', 'supported',
  'trained', 'transformed', 'wrote', 'collaborated', 'conducted', 'configured',
  'deployed', 'documented', 'executed', 'grew', 'handled', 'identified', 'integrated',
  'partnered', 'presented', 'prioritized', 'prioritised', 'published', 'recruited',
  'researched', 'tested', 'updated', 'automated', 'cut', 'lifted', 'mapped',
]

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
const URL_RE = /(https?:\/\/|www\.|linkedin\.com\/|github\.com\/)/i
const LOCATION_RE = /\b[A-Za-z][A-Za-z .'-]{1,40},\s*[A-Za-z]/
const DATE_RANGE_RE =
  /(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[.]?\s+\d{4}|\d{1,2}[./-]\d{4}|(?:19|20)\d{2}\s*(?:-|–|—|to)\s*(?:(?:19|20)\d{2}|present|current|now)/i

function sectionBodies(text) {
  const lines = text.split('\n')
  const marks = []
  lines.forEach((line, index) => {
    const key = headingKey(line)
    if (key) marks.push({ key, index })
  })
  const bodies = {}
  for (let i = 0; i < marks.length; i += 1) {
    const start = marks[i].index + 1
    const end = i + 1 < marks.length ? marks[i + 1].index : lines.length
    const body = lines.slice(start, end).join('\n').trim()
    bodies[marks[i].key] = bodies[marks[i].key] ? `${bodies[marks[i].key]}\n${body}` : body
  }
  return bodies
}

function bulletLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^([-•*▪]|\d+[.)])\s+\S/.test(line))
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length
}

function clamp(value, max) {
  return Math.max(0, Math.min(max, value))
}

export function countActionVerbs(text) {
  const lines = bulletLines(text || '')
  const verbSource = lines.length ? lines.join('\n') : text || ''
  const verbText = ` ${verbSource.toLowerCase()} `
  const verbHits = new Set()
  for (const verb of ACTION_VERBS) {
    if (verbText.includes(` ${verb} `) || verbText.includes(` ${verb}s `) || verbText.includes(` ${verb}ed `) || verbText.includes(` ${verb}d `)) {
      verbHits.add(verb)
    }
  }
  return verbHits.size
}

export function scoreBand(score) {
  if (score >= 85) return { label: 'ATS ready', tone: 'good' }
  if (score >= 70) return { label: 'Strong', tone: 'good' }
  if (score >= 40) return { label: 'Needs stronger content', tone: 'mid' }
  return { label: 'Hard for an ATS to read', tone: 'low' }
}

const FILLER_PHRASES = [
  'a small team',
  'a result that can be counted',
  'a clear piece of work',
  'plain numbers',
  'short note',
  'long meeting',
  'comfortable owning',
]

const DEGREE_RE =
  /\b(b\.?\s?tech|b\.?\s?sc|b\.?\s?com|b\.?\s?des|b\.?\s?arch|b\.?\s?ed|b\.e|b\.a|m\.e|m\.a|m\.?\s?tech|m\.?\s?sc|m\.?\s?com|ll\.?\s?b|ll\.?\s?m|mbbs|mba|ph\.d|phd|bachelor|masters?|diploma|associate|bca|mca|bba|bcom|mcom)\b/i
const SCHOOL_ONLY_RE = /\b(10th|12th|ssc|hsc|intermediate|high school|secondary|matriculation|matric)\b/i
const GENERIC_SKILL_RE = /^(communication|teamwork|hard work|hardworking|leadership|team player|ms office|microsoft office|positive attitude|interpersonal skills|problem solving|time management)$/i

function hasDegree(text) {
  return DEGREE_RE.test(text || '')
}

export function scoreResume(text, targetRole = '') {
  const raw = (text || '').replace(/\r/g, '').trim()
  const bodies = sectionBodies(raw)
  const bullets = bulletLines(raw)
  const checks = []

  const add = (id, label, max, earned, detail) => {
    const points = clamp(Math.round(earned), max)
    checks.push({
      id,
      label,
      max,
      earned: points,
      detail,
      passed: points >= max,
    })
  }

  const firstLine = raw.split('\n').map((line) => line.trim()).find(Boolean) || ''
  const nameWords = firstLine.split(/\s+/)
  const sameAsRole = Boolean(targetRole) && firstLine.toLowerCase() === String(targetRole).trim().toLowerCase()
  const hasName =
    !sameAsRole &&
    !headingKey(firstLine) &&
    nameWords.length >= 2 &&
    nameWords.length <= 5 &&
    firstLine.length <= 60 &&
    !/@|https?:|www\./i.test(firstLine) &&
    nameWords.every((word) => /^[A-Za-z][A-Za-z.'’-]*$/.test(word.replace(/[.,]$/, '')))
  add(
    'name',
    'Name at the top',
    4,
    hasName ? 4 : 0,
    hasName ? 'The first line reads as a person\'s name.' : 'Put your name alone on the first line.',
  )

  add(
    'email',
    'Email address',
    9,
    EMAIL_RE.test(raw) ? 9 : 0,
    EMAIL_RE.test(raw) ? 'An email address is in the text.' : 'Add a plain email address in the contact line.',
  )

  const hasPhone = Boolean(findPhone(raw))
  add(
    'phone',
    'Phone number',
    7,
    hasPhone ? 7 : 0,
    hasPhone ? 'A phone number is in the text.' : 'Add a phone number with digits only, spaces, or dashes.',
  )

  const hasReach = URL_RE.test(raw) || LOCATION_RE.test(raw) || /\bremote\b/i.test(raw)
  add(
    'reach',
    'Location or profile link',
    4,
    hasReach ? 4 : 0,
    hasReach
      ? 'A location or a LinkedIn/website link is present.'
      : 'Add a city, or a LinkedIn or portfolio link.',
  )

  const skillPieces = (bodies.skills || '').split(/[,;|\n]/).map((item) => item.trim()).filter((item) => item.length > 1)
  const summaryBody = bodies.summary || ''
  const summaryLower = summaryBody.toLowerCase()
  const fillerHits = FILLER_PHRASES.filter((phrase) => summaryLower.includes(phrase)).length
  const roleTokens = String(targetRole || '').toLowerCase().split(/\s+/).filter((word) => word.length > 3)
  const mentionsWork = roleTokens.some((word) => summaryLower.includes(word)) || skillPieces.some((skill) => skill.length > 3 && summaryLower.includes(skill.toLowerCase()))
  let summaryPoints = 0
  let summaryDetail = 'Add a Professional Summary heading and 2 to 4 plain sentences.'
  if (summaryBody.length >= 80) {
    summaryPoints = 5
    summaryDetail = 'The summary has enough text. Add the kind of work you do and one result.'
  } else if (summaryBody.length >= 40) {
    summaryPoints = 4
    summaryDetail = 'The summary is short. Add the kind of work you do and one result.'
  } else if (bodies.summary != null) {
    summaryPoints = 2
    summaryDetail = 'The summary heading is there. Add 2 to 4 sentences under it.'
  }
  if (summaryPoints > 0 && (mentionsWork || /\d/.test(summaryBody))) {
    summaryPoints += 5
    summaryDetail = 'The summary names the work and a concrete detail.'
  }
  if (fillerHits >= 2) {
    summaryPoints = Math.min(summaryPoints, 4)
    summaryDetail = 'The summary uses generic lines. Name the work you do and one measured result.'
  }
  add('summary', 'Professional summary', 10, summaryPoints, summaryDetail)

  const experienceBody = bodies.experience || ''
  const experienceBullets = bulletLines(experienceBody)
  const dateHits = raw.match(new RegExp(DATE_RANGE_RE.source, 'gi')) || []
  let experiencePoints = 0
  let experienceDetail = 'Add an Experience heading, job titles, dates, and bullets.'
  if (experienceBody.length >= 80 && experienceBullets.length >= 3 && dateHits.length >= 1) {
    experiencePoints = 12
    experienceDetail = 'Experience has a role, dates, and result bullets.'
  } else if (experienceBody.length >= 80) {
    experiencePoints = 8
    experienceDetail = 'Experience is present. Add at least 3 bullets with a date on the role.'
  } else if (bodies.experience != null && experienceBody.length > 0) {
    experiencePoints = 5
    experienceDetail = 'Experience has a heading. Add role details and bullets.'
  } else if (dateHits.length >= 1 && bullets.length >= 2) {
    experiencePoints = 4
    experienceDetail = 'Jobs are detectable from dates. Add a heading named Experience.'
  }
  add('experience', 'Work experience', 12, experiencePoints, experienceDetail)

  const educationBody = bodies.education || ''
  const degree = hasDegree(educationBody)
  const schoolOnly = SCHOOL_ONLY_RE.test(educationBody) && !degree
  let educationPoints = 0
  let educationDetail = 'Add an Education heading with the degree, college, and year.'
  if (degree && educationBody.length >= 12) {
    educationPoints = 10
    educationDetail = 'A degree and school are listed.'
  } else if (degree) {
    educationPoints = 7
    educationDetail = 'A degree is listed. Add the college and year.'
  } else if (schoolOnly) {
    educationPoints = 3
    educationDetail = 'Only secondary school is listed. Add a degree or diploma, with the college and year, if you have one.'
  } else if (educationBody.length >= 12) {
    educationPoints = 5
    educationDetail = 'Education is listed. Add the degree name, not only the school.'
  } else if (bodies.education != null) {
    educationPoints = 2
    educationDetail = 'Add the degree and school under Education.'
  }
  add('education', 'Education', 10, educationPoints, educationDetail)

  const commaHeavy = (raw.match(/,/g) || []).length >= 5
  let skillsPoints = 0
  let skillsDetail = 'Add a Skills heading and list skills separated by commas.'
  if (skillPieces.length >= 5) {
    skillsPoints = 5
    skillsDetail = 'Skills are listed as plain text.'
  } else if (skillPieces.length >= 3) {
    skillsPoints = 3
    skillsDetail = 'Add a few more skills under the Skills heading.'
  } else if (skillPieces.length >= 1) {
    skillsPoints = 2
    skillsDetail = 'Add more skills, separated by commas, under the Skills heading.'
  } else if (commaHeavy) {
    skillsPoints = 1
    skillsDetail = 'Skills may be present. Put them under a heading named Skills.'
  }
  add('skills', 'Skills section', 5, skillsPoints, skillsDetail)

  const coverage = keywordCoverage(targetRole, raw)
  const specificSkills = skillPieces.filter((skill) => !GENERIC_SKILL_RE.test(skill))
  let keywordPoints = 0
  let keywordDetail = 'Add a target role so the score can check words for that job.'
  if (coverage && coverage.total > 0) {
    keywordPoints = Math.round((12 * coverage.found) / coverage.total)
    keywordDetail = coverage.missing.length
      ? `Role keywords cover ${coverage.found} of ${coverage.total}. Still missing: ${coverage.missing.slice(0, 5).join(', ')}.`
      : 'Common words for this role already appear in the resume.'
  } else if (specificSkills.length >= 5) {
    keywordPoints = 9
    keywordDetail = 'There is no word list for this title. The skills listed are specific enough to read.'
  } else if (specificSkills.length >= 3) {
    keywordPoints = 6
    keywordDetail = 'There is no word list for this title. Add more specific skills than general words.'
  } else if (specificSkills.length >= 1) {
    keywordPoints = 3
    keywordDetail = 'There is no word list for this title. Most of the skill line is still general.'
  } else if (String(targetRole || '').trim()) {
    keywordDetail = 'There is no word list for this title, and the skills are too general to score.'
  }
  add('keywords', 'Role keywords', 12, keywordPoints, keywordDetail)

  let bulletPoints = 0
  let bulletDetail = 'Start achievements with a hyphen so parsers see separate bullets.'
  if (bullets.length >= 3) {
    bulletPoints = 5
    bulletDetail = `${bullets.length} bullets are easy to separate.`
  } else if (bullets.length >= 1) {
    bulletPoints = 2
    bulletDetail = 'Add at least 3 bullets that each describe a result.'
  }
  add('bullets', 'Bullet achievements', 5, bulletPoints, bulletDetail)

  const verbCount = countActionVerbs(raw)
  let verbPoints = 0
  let verbDetail = 'Start bullets with verbs such as led, built, improved, or reduced.'
  if (verbCount >= 3) {
    verbPoints = 4
    verbDetail = 'Bullets lead with action verbs.'
  } else if (verbCount >= 1) {
    verbPoints = 2
    verbDetail = 'Add more bullets that start with a clear action verb.'
  }
  add('verbs', 'Action verbs', 4, verbPoints, verbDetail)

  const metricSource = bullets.length ? bullets : raw.split('\n')
  const metricCount = metricSource.filter((line) => /\d/.test(line) && /%|\$|₹|\b\d+\b/.test(line)).length
  let metricPoints = 0
  let metricDetail = 'Add numbers: percentages, time saved, team size, or revenue.'
  if (metricCount >= 3) {
    metricPoints = 8
    metricDetail = 'Several lines include measurable results.'
  } else if (metricCount >= 1) {
    metricPoints = 4
    metricDetail = 'Add numbers to at least 3 bullets.'
  }
  add('metrics', 'Measurable results', 8, metricPoints, metricDetail)

  const fullRange = /(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[.]?\s+\d{4}\s*(?:-|–|—|to)\s*(?:present|current|now|(?:19|20)\d{2})/i.test(raw)
  let datePoints = 0
  let dateDetail = 'Use dates like Jan 2022 - Present on each role.'
  if (dateHits.length >= 2 || fullRange) {
    datePoints = 6
    dateDetail = 'Each role shows a start and an end, or Present.'
  } else if (dateHits.length === 1) {
    datePoints = 3
    dateDetail = 'Add a start and end date for each role.'
  }
  add('dates', 'Dates', 6, datePoints, dateDetail)

  const words = wordCount(raw)
  const tableLines = raw.split('\n').filter((line) => (line.match(/\|/g) || []).length >= 3).length
  const junk = (raw.match(/[□■█░▒▓]/g) || []).length
  let cleanPoints = 0
  let cleanDetail = 'Use a text-based PDF, DOCX, or TXT. Scans and text boxes are hard to read.'
  if (raw.length >= 100 && tableLines <= 1 && junk < 3 && words >= 120 && words <= 1600) {
    cleanPoints = 4
    cleanDetail = `${words} words of plain text is a readable length.`
  } else if (raw.length >= 100 && tableLines <= 1 && junk < 3) {
    cleanPoints = 3
    cleanDetail = `${words} words is short for a full resume, or long enough to need a tighter edit.`
  } else if (raw.length >= 100 && tableLines <= 4) {
    cleanPoints = 2
    cleanDetail = 'Some layout marks are in the text. A single column will parse more cleanly.'
  }
  add('clean', 'Plain, parseable text', 4, cleanPoints, cleanDetail)

  const earned = checks.reduce((sum, check) => sum + check.earned, 0)
  const score = clamp(earned, 100)
  return {
    score,
    ...scoreBand(score),
    checks,
    words,
  }
}

export function scoreDelta(before, after) {
  if (!before || !after) return []
  return after.checks.filter((check) => {
    const previous = before.checks.find((item) => item.id === check.id)
    return check.earned > (previous?.earned || 0)
  })
}
