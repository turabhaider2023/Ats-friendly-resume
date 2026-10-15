const ROLE_KEYWORDS = [
  {
    match: ['business analyst'],
    keywords: ['requirements', 'user stories', 'stakeholder', 'UAT', 'SQL', 'process', 'BRD', 'Agile', 'Jira', 'Excel', 'Power BI'],
  },
  {
    match: ['civil engineer', 'site engineer', 'structural engineer', 'bridge inspector', 'bridge engineer'],
    keywords: ['AutoCAD', 'site', 'quantity', 'safety', 'concrete', 'drawing', 'MS Project', 'quality'],
  },
  {
    match: ['mechanical engineer', 'electrical engineer'],
    keywords: ['AutoCAD', 'maintenance', 'quality', 'safety', 'testing', 'drawings'],
  },
  {
    match: ['software', 'developer', 'frontend', 'front-end', 'backend', 'back-end', 'full stack', 'fullstack', 'web developer'],
    keywords: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'API', 'Git', 'SQL', 'testing', 'Agile'],
  },
  {
    match: ['data scientist', 'machine learning', 'ml engineer'],
    keywords: ['Python', 'SQL', 'machine learning', 'statistics', 'experimentation', 'pandas'],
  },
  {
    match: ['data analyst', 'product analyst', 'bi analyst', 'business intelligence'],
    keywords: ['SQL', 'Excel', 'Python', 'Tableau', 'dashboard', 'A/B testing', 'data visualization', 'stakeholder'],
  },
  {
    match: ['product manager', 'product owner'],
    keywords: ['roadmap', 'stakeholders', 'user research', 'Agile', 'KPIs', 'prioritization'],
  },
  {
    match: ['project manager', 'program manager', 'scrum master'],
    keywords: ['stakeholder', 'timeline', 'budget', 'risk', 'Agile', 'cross-functional'],
  },
  {
    match: ['designer', 'ui', 'ux'],
    keywords: ['Figma', 'user research', 'wireframes', 'prototyping', 'design system', 'accessibility'],
  },
  {
    match: ['marketing', 'seo'],
    keywords: ['SEO', 'campaigns', 'analytics', 'content', 'conversion', 'Google Analytics'],
  },
  {
    match: ['accountant', 'finance', 'accounting', 'auditor'],
    keywords: ['Excel', 'reconciliation', 'financial reporting', 'forecasting', 'compliance'],
  },
  {
    match: ['sales', 'account executive', 'business development'],
    keywords: ['pipeline', 'quota', 'CRM', 'Salesforce', 'negotiation', 'revenue'],
  },
  {
    match: ['nurse', 'clinical', 'healthcare'],
    keywords: ['patient care', 'EMR', 'clinical documentation', 'triage', 'care plans'],
  },
  {
    match: ['teacher', 'educator', 'tutor', 'professor'],
    keywords: ['curriculum', 'lesson planning', 'classroom management', 'assessment', 'student outcomes'],
  },
  {
    match: ['human resources', 'recruiter', 'hr'],
    keywords: ['recruiting', 'onboarding', 'employee relations', 'HRIS', 'compliance'],
  },
  {
    match: ['customer support', 'customer success', 'support'],
    keywords: ['customer support', 'ticketing', 'retention', 'SLA', 'communication'],
  },
]

function roleMatches(role, word) {
  const needle = word.trim().toLowerCase()
  if (!needle) return false
  if (needle.length <= 3) return new RegExp(`\\b${needle}\\b`, 'i').test(role)
  return role.includes(needle)
}

function textHasTerm(text, term) {
  const needle = term.toLowerCase()
  if (needle.includes(' ')) return text.toLowerCase().includes(needle)
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?:^|[^a-z])${escaped}`, 'i').test(text)
}

function keywordGroup(targetRole) {
  const role = (targetRole || '').toLowerCase().trim()
  if (!role) return null
  let best = null
  let bestLen = 0
  for (const item of ROLE_KEYWORDS) {
    for (const word of item.match) {
      const length = word.trim().length
      if (roleMatches(role, word) && length > bestLen) {
        best = item
        bestLen = length
      }
    }
  }
  return best
}

export function keywordCoverage(targetRole, resumeText) {
  const group = keywordGroup(targetRole)
  if (!group) return null
  const text = resumeText || ''
  const found = group.keywords.filter((word) => textHasTerm(text, word))
  const missing = group.keywords.filter((word) => !textHasTerm(text, word))
  return { total: group.keywords.length, found: found.length, missing }
}

export function hasKeywordList(targetRole) {
  return Boolean(keywordGroup(targetRole))
}

export function keywordSuggestions(targetRole, resumeText) {
  const coverage = keywordCoverage(targetRole, resumeText)
  return coverage ? coverage.missing : []
}
