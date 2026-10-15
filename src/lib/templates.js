export const TEMPLATES = [
  { id: 'classic', name: 'Classic', blurb: 'Plain single column' },
  { id: 'modern', name: 'Modern', blurb: 'Photo beside the name' },
  { id: 'sidebar', name: 'Sidebar', blurb: 'Contact on the left' },
  { id: 'executive', name: 'Executive', blurb: 'Centered header' },
  { id: 'compact', name: 'Compact', blurb: 'Tight, photo at right' },
  { id: 'band', name: 'Header band', blurb: 'Color bar on top' },
  { id: 'minimal', name: 'Minimal', blurb: 'Thin rules, quiet type' },
]

export function templateId(value) {
  return TEMPLATES.some((item) => item.id === value) ? value : 'classic'
}
