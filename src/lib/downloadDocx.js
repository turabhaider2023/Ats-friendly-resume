import { AlignmentType, Document, ImageRun, Packer, Paragraph, TextRun } from 'docx'
import { downloadName, saveBlob } from './download.js'
import { resumeDocument } from './plainText.js'
import { templateId } from './templates.js'

function run(text, options = {}) {
  return new TextRun({
    text,
    font: 'Calibri',
    size: options.size ?? 21,
    bold: Boolean(options.bold),
    color: '1B1914',
  })
}

function paragraph(text, options = {}) {
  return new Paragraph({
    alignment: options.align,
    spacing: {
      before: options.before ?? 0,
      after: options.after ?? 80,
      line: 276,
    },
    children: [run(text, options)],
  })
}

function photoParagraph(dataUrl, align) {
  if (!dataUrl || !dataUrl.startsWith('data:image')) return null
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
  const binary = atob(base64)
  const data = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) data[index] = binary.charCodeAt(index)
  return new Paragraph({
    alignment: align,
    spacing: { after: 160 },
    children: [
      new ImageRun({
        type: 'jpg',
        data,
        transformation: { width: 84, height: 84 },
      }),
    ],
  })
}

export async function downloadDocx(resume) {
  const doc = resumeDocument(resume)
  const align = templateId(resume.template) === 'executive' ? AlignmentType.CENTER : undefined
  const children = []
  const photo = photoParagraph(resume.photo, align)
  if (photo) children.push(photo)

  if (doc.name) children.push(paragraph(doc.name.toUpperCase(), { size: 32, bold: true, after: 40, align }))
  if (doc.role) children.push(paragraph(doc.role, { size: 22, after: 40, align }))
  if (doc.contact.length) children.push(paragraph(doc.contact.join(' | '), { after: 160, align }))

  const heading = (label) => paragraph(label, { bold: true, size: 22, before: 200, after: 60 })

  if (doc.summary) {
    children.push(heading('PROFESSIONAL SUMMARY'))
    children.push(paragraph(doc.summary))
  }
  if (doc.skills.length) {
    children.push(heading('SKILLS'))
    children.push(paragraph(doc.skills.join(', ')))
  }
  if (doc.experience.length) {
    children.push(heading('EXPERIENCE'))
    for (const job of doc.experience) {
      if (job.title) children.push(paragraph(job.title, { bold: true, after: 20 }))
      const meta = [job.company, job.location].filter(Boolean).join(' | ')
      if (meta) children.push(paragraph(meta, { after: 20 }))
      if (job.dates) children.push(paragraph(job.dates, { after: 40 }))
      for (const bullet of job.bullets) children.push(paragraph(`- ${bullet}`, { after: 40 }))
    }
  }
  if (doc.education.length) {
    children.push(heading('EDUCATION'))
    for (const school of doc.education) {
      if (school.degree) children.push(paragraph(school.degree, { bold: true, after: 20 }))
      const meta = [school.school, school.location].filter(Boolean).join(' | ')
      if (meta) children.push(paragraph(meta, { after: 20 }))
      if (school.year) children.push(paragraph(school.year, { after: 20 }))
      if (school.details) children.push(paragraph(school.details))
    }
  }
  if (doc.projects.length) {
    children.push(heading('PROJECTS'))
    for (const project of doc.projects) {
      const title = [project.name, project.link].filter(Boolean).join(' | ')
      if (title) children.push(paragraph(title, { bold: true, after: 20 }))
      for (const bullet of project.bullets) children.push(paragraph(`- ${bullet}`, { after: 40 }))
    }
  }
  if (doc.certifications.length) {
    children.push(heading('CERTIFICATIONS'))
    for (const item of doc.certifications) children.push(paragraph(`- ${item}`, { after: 40 }))
  }
  if (!children.length) children.push(paragraph('Add your name and experience before downloading.'))

  const document = new Document({
    creator: 'ATS Friendly Resume',
    title: doc.name || 'Resume',
    sections: [{ children }],
  })
  const blob = await Packer.toBlob(document)
  saveBlob(blob, downloadName(resume.fullName, 'docx'))
}
