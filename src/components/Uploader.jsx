export default function Uploader({ busy, onFile, onText }) {
  function takeFile(file) {
    if (file) onFile(file)
  }

  function onDrop(event) {
    event.preventDefault()
    takeFile(event.dataTransfer.files?.[0])
  }

  function onPasteSubmit(event) {
    event.preventDefault()
    const text = new FormData(event.currentTarget).get('resumeText')
    onText(String(text || ''))
  }

  return (
    <section className="rounded-3xl border border-line bg-card p-5 shadow-[0_12px_40px_rgba(40,30,10,0.04)]">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl text-ink">Upload a resume</h2>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">PDF, DOCX, TXT</p>
      </div>
      <p className="mt-1 text-sm text-muted">
        The file is read in this browser. A new upload replaces the fields below.
      </p>

      <label
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className="mt-4 flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-moss/40 bg-moss/5 px-4 py-8 text-center hover:bg-moss/10"
      >
        <span className="font-semibold text-moss-deep">Drop a file here, or browse</span>
        <span className="mt-1 text-sm text-muted">8 MB maximum. Older .doc files should be saved as DOCX.</span>
        <input
          className="sr-only"
          type="file"
          accept=".pdf,.docx,.txt,application/pdf,text/plain"
          disabled={busy}
          onChange={(event) => {
            takeFile(event.target.files?.[0])
            event.target.value = ''
          }}
        />
      </label>

      <form onSubmit={onPasteSubmit} className="mt-4">
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="resume-paste">
          Or paste resume text
        </label>
        <textarea
          id="resume-paste"
          name="resumeText"
          rows={5}
          placeholder="Paste the resume text here if the PDF is a scan."
          className="mt-2 w-full rounded-2xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-[#a39888] focus:border-moss focus:ring-2 focus:ring-moss/20"
        />
        <button
          type="submit"
          disabled={busy}
          className="mt-3 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-card disabled:opacity-50"
        >
          {busy ? 'Reading…' : 'Score pasted text'}
        </button>
      </form>
    </section>
  )
}
