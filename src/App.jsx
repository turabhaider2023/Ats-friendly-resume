import { useEffect, useMemo, useState } from 'react'
import GuidePage from './components/GuidePage.jsx'
import HomePage from './components/HomePage.jsx'
import MakeResume from './components/MakeResume.jsx'
import ResumeForm from './components/ResumeForm.jsx'
import ResumePreview from './components/ResumePreview.jsx'
import ScorePanel from './components/ScorePanel.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import TemplatePicker from './components/TemplatePicker.jsx'
import Uploader from './components/Uploader.jsx'
import { scoreDelta, scoreResume } from './lib/atsScore.js'
import { downloadPlainText } from './lib/download.js'
import { clearDraft, draftHasContent, loadDraft, saveDraft } from './lib/draft.js'
import { hasKeywordList, keywordSuggestions } from './lib/keywords.js'
import { parseResumeText } from './lib/parseResume.js'
import { resumeToPlainText } from './lib/plainText.js'
import { emptyResume, exampleResume } from './lib/resumeModel.js'
import { templateId } from './lib/templates.js'

const saved = loadDraft()

export default function App() {
  const [view, setView] = useState(saved?.view || 'home')
  const [showUploader, setShowUploader] = useState(saved?.showUploader || false)
  const [resume, setResume] = useState(saved?.resume || emptyResume())
  const [origin, setOrigin] = useState(saved?.origin || null)
  const [banner, setBanner] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mobilePane, setMobilePane] = useState('edit')

  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft({ view, showUploader, resume, origin })
    }, 250)
    return () => clearTimeout(timer)
  }, [view, showUploader, resume, origin])

  useEffect(() => {
    const title = document.title
    const hideChrome = () => {
      document.title = ' '
    }
    const restoreTitle = () => {
      document.title = title
    }
    window.addEventListener('beforeprint', hideChrome)
    window.addEventListener('afterprint', restoreTitle)
    return () => {
      window.removeEventListener('beforeprint', hideChrome)
      window.removeEventListener('afterprint', restoreTitle)
      document.title = title
    }
  }, [])

  const plain = useMemo(() => resumeToPlainText(resume), [resume])
  const current = useMemo(() => scoreResume(plain, resume.targetRole), [plain, resume.targetRole])
  const original = useMemo(() => (origin?.text ? scoreResume(origin.text, resume.targetRole) : null), [origin, resume.targetRole])
  const gains = useMemo(() => scoreDelta(original, current), [original, current])
  const suggestions = useMemo(
    () => keywordSuggestions(resume.targetRole, plain),
    [resume.targetRole, plain],
  )
  const canExport = plain.trim().length > 0
  const hasDraft = draftHasContent({ resume, origin })

  function openStudio(next) {
    setError('')
    setBanner('')
    setView('studio')
    setShowUploader(next.showUploader)
    setMobilePane(next.pane)
  }

  function goHome() {
    setView('home')
    window.scrollTo(0, 0)
  }

  function goScore() {
    setError('')
    setView('studio')
    setShowUploader(true)
    setMobilePane('edit')
    window.scrollTo(0, 0)
  }

  function goBuild() {
    setError('')
    setView('studio')
    setShowUploader(false)
    setMobilePane('edit')
    window.scrollTo(0, 0)
  }

  function goMake() {
    setError('')
    setView('make')
    window.scrollTo(0, 0)
  }

  function createDraft(nextResume, note) {
    setResume((current) => ({
      ...nextResume,
      photo: current.photo || '',
      template: templateId(current.template),
    }))
    setOrigin(null)
    setError('')
    setBanner(note)
    setShowUploader(false)
    setView('studio')
    setMobilePane('edit')
    window.scrollTo(0, 0)
  }

  function goGuide() {
    setView('guide')
    window.scrollTo(0, 0)
  }

  function startBlank() {
    setResume(emptyResume())
    setOrigin(null)
    openStudio({ showUploader: false, pane: 'edit' })
  }

  function startUpload() {
    openStudio({ showUploader: true, pane: 'edit' })
  }

  function startOver() {
    clearDraft()
    setResume(emptyResume())
    setOrigin(null)
    setBanner('')
    setError('')
    setShowUploader(false)
    setView('home')
  }

  function addKeyword(word) {
    setResume((currentResume) => {
      const items = currentResume.skillsText.split(',').map((item) => item.trim()).filter(Boolean)
      if (items.some((item) => item.toLowerCase() === word.toLowerCase())) return currentResume
      return { ...currentResume, skillsText: [...items, word].join(', ') }
    })
  }

  async function readSource(text, fileName, kind) {
    const trimmed = text.replace(/\r/g, '').trim()
    if (trimmed.length < 20) {
      setError('Almost no text could be read. If the PDF is a scan, paste the text instead.')
      return
    }
    const parsed = parseResumeText(trimmed)
    setResume((current) => ({
      ...parsed.resume,
      photo: current.photo || '',
      template: templateId(current.template),
    }))
    setOrigin({
      fileName,
      kind,
      text: trimmed.slice(0, 50000),
      warnings: parsed.warnings,
    })
    setBanner(parsed.warnings[0] || 'Fields were filled from the file. Correct anything that landed in the wrong place.')
    setError('')
    setView('studio')
    setMobilePane('score')
  }

  async function onFile(file) {
    setBusy(true)
    setError('')
    try {
      const { extractTextFromFile } = await import('./lib/extractText.js')
      const result = await extractTextFromFile(file)
      await readSource(result.text, result.fileName, result.kind)
    } catch (readError) {
      setError(readError.message || 'That file could not be read.')
    } finally {
      setBusy(false)
    }
  }

  async function onDownloadDocx() {
    try {
      const { downloadDocx } = await import('./lib/downloadDocx.js')
      await downloadDocx(resume)
    } catch {
      setError('The DOCX file could not be created in this browser. Download the TXT version instead.')
    }
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(plain)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setError('Copying was blocked by the browser. Download the TXT file instead.')
    }
  }

  const activeNav = view === 'guide' ? 'guide' : view === 'make' ? 'make' : view === 'studio' ? (showUploader ? 'score' : 'build') : 'home'

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader active={activeNav} onHome={goHome} onScore={goScore} onBuild={goBuild} onMake={goMake} onGuide={goGuide} />

      {view === 'home' ? (
        <HomePage
          onScore={startUpload}
          onMake={goMake}
          onBlank={startBlank}
          hasDraft={hasDraft}
          onContinue={() => openStudio({ showUploader, pane: 'edit' })}
        />
      ) : view === 'guide' ? (
        <div className="flex-1">
          <GuidePage onScore={goScore} onBuild={goBuild} onMake={goMake} />
        </div>
      ) : view === 'make' ? (
        <MakeResume
          initialName={resume.fullName}
          photo={resume.photo}
          template={resume.template}
          onCreate={createDraft}
        />
      ) : (
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16">
          <div className="no-print sticky top-16 z-30 -mx-4 mb-4 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-end gap-5">
                {original && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Uploaded file</p>
                    <p className="font-display text-3xl leading-none">{original.score}%</p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">ATS version</p>
                  <p className="font-display text-3xl leading-none">{current.score}%</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={!canExport} onClick={onCopy} className="rounded-full border border-line bg-card px-3 py-2 text-sm font-semibold disabled:opacity-40">
                  {copied ? 'Copied' : 'Copy text'}
                </button>
                <button type="button" disabled={!canExport} onClick={() => downloadPlainText(resume)} className="rounded-full border border-line bg-card px-3 py-2 text-sm font-semibold disabled:opacity-40">
                  Download TXT
                </button>
                <button type="button" disabled={!canExport} onClick={onDownloadDocx} className="rounded-full bg-moss px-3 py-2 text-sm font-semibold text-white disabled:opacity-40">
                  Download DOCX
                </button>
                <button type="button" disabled={!canExport} onClick={() => window.print()} className="rounded-full border border-line bg-card px-3 py-2 text-sm font-semibold disabled:opacity-40">
                  Print PDF
                </button>
                <button type="button" onClick={startOver} className="rounded-full px-3 py-2 text-sm font-semibold text-muted">
                  Start over
                </button>
              </div>
            </div>
          </div>

          {origin && (
            <p className="no-print mb-3 text-sm text-muted">
              Rebuilt from {origin.fileName}. The uploaded score uses the original text. The ATS score uses the clean resume.
            </p>
          )}

          {(error || banner) && (
            <div className="no-print mb-4 flex items-start justify-between gap-3 rounded-2xl bg-sand px-4 py-3 text-sm" role="status">
              <p>{error || banner}</p>
              <button type="button" className="shrink-0 font-semibold" onClick={() => { setError(''); setBanner('') }}>
                Dismiss
              </button>
            </div>
          )}

          <div className="no-print mb-4 flex gap-2 lg:hidden">
            {[
              ['edit', 'Edit'],
              ['score', 'Score'],
              ['preview', 'Preview'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMobilePane(id)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${mobilePane === id ? 'bg-ink text-card' : 'bg-card text-ink'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="studio-layout grid items-start gap-6 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
            <div className={`no-print ${mobilePane === 'edit' ? 'block' : 'hidden'} space-y-4 lg:block`}>
              {showUploader ? (
                <Uploader busy={busy} onFile={onFile} onText={(text) => readSource(text, 'Pasted resume', 'txt')} />
              ) : (
                <button type="button" onClick={() => setShowUploader(true)} className="no-print text-sm font-semibold text-moss-deep underline">
                  Have a file already? Upload it and score the original too.
                </button>
              )}
              <ResumeForm
                resume={resume}
                onChange={setResume}
                onExample={() => {
                  setResume((current) => ({
                    ...exampleResume(),
                    template: templateId(current.template),
                    photo: current.photo || '',
                  }))
                  setOrigin(null)
                  setBanner('This is sample content. Replace it with your own work before you send it.')
                }}
              />
            </div>
            <div className="space-y-6">
              <div className={`no-print ${mobilePane === 'score' ? 'block' : 'hidden'} lg:block`}>
                <ScorePanel
                  current={current}
                  original={original}
                  gains={gains}
                  suggestions={suggestions}
                  hasRole={Boolean(resume.targetRole.trim())}
                  knownRole={hasKeywordList(resume.targetRole)}
                  onAddKeyword={addKeyword}
                />
              </div>
              <div className={`print-area ${mobilePane === 'preview' ? 'block' : 'hidden'} space-y-4 lg:block`}>
                <div className="no-print">
                  <TemplatePicker
                    value={resume.template}
                    onChange={(template) => setResume((current) => ({ ...current, template }))}
                  />
                </div>
                <ResumePreview resume={resume} />
              </div>
            </div>
          </div>
        </main>
      )}

      <SiteFooter onHome={goHome} onScore={goScore} onBuild={goBuild} onMake={goMake} onGuide={goGuide} />
    </div>
  )
}
