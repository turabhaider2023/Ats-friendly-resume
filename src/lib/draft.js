import { emptyResume } from './resumeModel.js'
import { templateId } from './templates.js'

const KEY = 'ats-friendly-resume-draft'

export function loadDraft() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data?.resume || typeof data.resume !== 'object') return null
    const base = emptyResume()
    return {
      view: ['studio', 'guide', 'make'].includes(data.view) ? data.view : 'home',
      showUploader: Boolean(data.showUploader),
      resume: {
        ...base,
        ...data.resume,
        experience: Array.isArray(data.resume.experience) && data.resume.experience.length
          ? data.resume.experience
          : base.experience,
        education: Array.isArray(data.resume.education) && data.resume.education.length
          ? data.resume.education
          : base.education,
        projects: Array.isArray(data.resume.projects) ? data.resume.projects : [],
        photo: typeof data.resume.photo === 'string' && data.resume.photo.startsWith('data:image') ? data.resume.photo : '',
        template: templateId(data.resume.template),
      },
      origin: data.origin?.text
        ? {
            fileName: data.origin.fileName || 'Uploaded resume',
            kind: data.origin.kind || 'txt',
            text: String(data.origin.text).slice(0, 50000),
            warnings: Array.isArray(data.origin.warnings) ? data.origin.warnings : [],
          }
        : null,
    }
  } catch {
    return null
  }
}

export function saveDraft(draft) {
  try {
    const payload = {
      view: draft.view,
      showUploader: draft.showUploader,
      resume: draft.resume,
      origin: draft.origin
        ? {
            fileName: draft.origin.fileName,
            kind: draft.origin.kind,
            text: String(draft.origin.text || '').slice(0, 50000),
            warnings: draft.origin.warnings || [],
          }
        : null,
    }
    localStorage.setItem(KEY, JSON.stringify(payload))
  } catch {
    // A full browser storage quota should not block editing.
  }
}

export function clearDraft() {
  localStorage.removeItem(KEY)
}

export function draftHasContent(draft) {
  if (!draft) return false
  if (draft.origin?.text) return true
  const resume = draft.resume || {}
  return Boolean(
    resume.fullName ||
      resume.summary ||
      resume.skillsText ||
      resume.email ||
      (resume.experience || []).some((job) => job.title || job.company || job.bulletText),
  )
}
