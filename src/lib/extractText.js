import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = workerUrl

const MAX_BYTES = 8 * 1024 * 1024

function pageText(items) {
  const rows = []
  for (const item of items) {
    if (!item.str) continue
    const y = item.transform ? item.transform[5] : 0
    const x = item.transform ? item.transform[4] : 0
    let row = rows.find((entry) => Math.abs(entry.y - y) < 3)
    if (!row) {
      row = { y, parts: [] }
      rows.push(row)
    }
    row.parts.push({ x, str: item.str })
  }
  rows.sort((a, b) => b.y - a.y)
  return rows
    .map((row) =>
      row.parts
        .sort((a, b) => a.x - b.x)
        .map((part) => part.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(Boolean)
    .join('\n')
}

async function extractPdf(file) {
  const data = new Uint8Array(await file.arrayBuffer())
  let doc
  try {
    doc = await getDocument({ data }).promise
  } catch (error) {
    if (error?.name === 'PasswordException') {
      throw new Error('This PDF is password protected. Remove the password, or paste the text.')
    }
    throw new Error('This PDF could not be read. Try DOCX or paste the text.')
  }

  const pages = []
  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
    const page = await doc.getPage(pageNumber)
    const content = await page.getTextContent()
    pages.push(pageText(content.items))
  }
  return pages.join('\n\n')
}

export async function extractTextFromFile(file) {
  if (!file) throw new Error('Choose a file first.')
  if (file.size > MAX_BYTES) throw new Error('Use a file smaller than 8 MB.')

  const name = file.name || 'resume'
  const extension = name.split('.').pop()?.toLowerCase()

  if (extension === 'txt') {
    return { text: await file.text(), kind: 'txt', fileName: name }
  }

  if (extension === 'docx') {
    const mammoth = await import('mammoth')
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return { text: result.value || '', kind: 'docx', fileName: name }
  }

  if (extension === 'pdf') {
    const text = await extractPdf(file)
    return { text, kind: 'pdf', fileName: name }
  }

  throw new Error('Use a PDF, DOCX, or TXT file. Save older .doc files as DOCX first.')
}
