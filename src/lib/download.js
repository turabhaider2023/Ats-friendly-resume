import { fileBaseName, resumeToPlainText } from './plainText.js'

export function downloadName(fullName, extension) {
  return `${fileBaseName(fullName)}.${extension}`
}

export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function downloadPlainText(resume) {
  const blob = new Blob([`${resumeToPlainText(resume)}\n`], { type: 'text/plain;charset=utf-8' })
  saveBlob(blob, downloadName(resume.fullName, 'txt'))
}
