import { resumeDocument } from '../lib/plainText.js'
import { templateId } from '../lib/templates.js'

function Photo({ src, className }) {
  if (!src) return null
  return <img src={src} alt="" className={`object-cover ${className}`} />
}

function Heading({ children, look = 'classic' }) {
  const styles = {
    classic: 'mt-4 border-b border-ink pb-1 text-[16px] font-bold tracking-[0.04em]',
    modern: 'mt-5 text-[12px] font-bold uppercase tracking-[0.16em] text-moss',
    minimal: 'mt-5 border-t border-[#e4ddd0] pt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted',
    compact: 'mt-3 text-[11px] font-bold uppercase tracking-[0.12em]',
    light: 'mt-4 border-b border-white/20 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-sand',
  }
  return <h3 className={styles[look] || styles.classic}>{children}</h3>
}

function Jobs({ jobs, dense = false }) {
  return jobs.map((job, index) => (
    <div key={`${index}-${job.title}`} className={`keep-together ${dense ? 'mt-2' : 'mt-3'}`}>
      {job.title && <p className="font-resume text-[14px] font-bold">{job.title}</p>}
      {[job.company, job.location].filter(Boolean).length > 0 && (
        <p className="font-resume text-[13px]">{[job.company, job.location].filter(Boolean).join(' | ')}</p>
      )}
      {job.dates && <p className="font-resume text-[12.5px] text-[#555]">{job.dates}</p>}
      {job.bullets.length > 0 && (
        <ul className="mt-1 space-y-0.5">
          {job.bullets.map((bullet, bulletIndex) => (
            <li key={`${bulletIndex}-${bullet}`} className="font-resume text-[13px] leading-5">
              - {bullet}
            </li>
          ))}
        </ul>
      )}
    </div>
  ))
}

function Schools({ schools }) {
  return schools.map((school, index) => (
    <div key={`${index}-${school.degree}`} className="keep-together mt-3">
      {school.degree && <p className="font-resume text-[14px] font-bold">{school.degree}</p>}
      {[school.school, school.location].filter(Boolean).length > 0 && (
        <p className="font-resume text-[13px]">{[school.school, school.location].filter(Boolean).join(' | ')}</p>
      )}
      {school.year && <p className="font-resume text-[12.5px] text-[#555]">{school.year}</p>}
      {school.details && <p className="font-resume text-[13px] leading-5">{school.details}</p>}
    </div>
  ))
}

function Projects({ projects }) {
  return projects.map((project, index) => (
    <div key={`${index}-${project.name}`} className="keep-together mt-3">
      <p className="font-resume text-[14px] font-bold">{[project.name, project.link].filter(Boolean).join(' | ')}</p>
      {project.bullets.map((bullet, bulletIndex) => (
        <p key={`${bulletIndex}-${bullet}`} className="font-resume text-[13px] leading-5">
          - {bullet}
        </p>
      ))}
    </div>
  ))
}

function MainSections({ doc, look = 'classic', hideSkills = false, skillsAsPills = false }) {
  return (
    <>
      {doc.summary && (
        <section>
          <Heading look={look}>Professional Summary</Heading>
          <p className="mt-2 whitespace-pre-wrap font-resume text-[13.5px] leading-5">{doc.summary}</p>
        </section>
      )}
      {!hideSkills && doc.skills.length > 0 && (
        <section>
          <Heading look={look}>Skills</Heading>
          {skillsAsPills ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {doc.skills.map((skill) => (
                <li key={skill} className="rounded-full bg-sand px-2 py-0.5 font-resume text-[12px]">
                  {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 font-resume text-[13.5px] leading-5">{doc.skills.join(look === 'classic' ? ' | ' : ', ')}</p>
          )}
        </section>
      )}
      {doc.experience.length > 0 && (
        <section>
          <Heading look={look}>Experience</Heading>
          <Jobs jobs={doc.experience} dense={look === 'compact'} />
        </section>
      )}
      {doc.education.length > 0 && (
        <section>
          <Heading look={look}>Education</Heading>
          <Schools schools={doc.education} />
        </section>
      )}
      {doc.projects.length > 0 && (
        <section>
          <Heading look={look}>Projects</Heading>
          <Projects projects={doc.projects} />
        </section>
      )}
      {doc.certifications.length > 0 && (
        <section>
          <Heading look={look}>Certifications</Heading>
          <ul className="mt-2 space-y-1">
            {doc.certifications.map((item) => (
              <li key={item} className="keep-together font-resume text-[13.5px] leading-5">
                - {item}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

function Classic({ doc, photo }) {
  return (
    <div className="px-7 py-8 sm:px-10">
      <div className="flex items-center gap-4">
        <Photo src={photo} className="h-[72px] w-[72px] shrink-0 rounded-full" />
        <div>
          {doc.name && <h2 className="font-resume text-[28px] font-bold leading-none tracking-wide">{doc.name.toUpperCase()}</h2>}
          {doc.role && <p className="mt-2 font-resume text-[15px]">{doc.role}</p>}
          {doc.contact.length > 0 && <p className="mt-2 font-resume text-[13px] leading-5">{doc.contact.join(' | ')}</p>}
        </div>
      </div>
      <MainSections doc={doc} look="classic" />
    </div>
  )
}

function Modern({ doc, photo }) {
  return (
    <div className="border-l-8 border-moss px-7 py-8 sm:px-9">
      <div className="flex items-center gap-4">
        <Photo src={photo} className="h-20 w-20 shrink-0 rounded-2xl" />
        <div>
          {doc.name && <h2 className="font-display text-[34px] leading-none">{doc.name}</h2>}
          {doc.role && <p className="mt-2 font-resume text-[15px] font-semibold text-moss">{doc.role}</p>}
          {doc.contact.length > 0 && <p className="mt-2 font-resume text-[13px] leading-5">{doc.contact.join(' · ')}</p>}
        </div>
      </div>
      <MainSections doc={doc} look="modern" />
    </div>
  )
}

function Sidebar({ doc, photo }) {
  return (
    <div className="flex min-h-[640px] flex-col sm:flex-row">
      <aside className="bg-moss-deep px-5 py-8 text-card sm:w-[34%]">
        <Photo src={photo} className="mx-auto h-24 w-24 rounded-full ring-2 ring-white/30 sm:mx-0" />
        {doc.name && <h2 className="mt-4 font-display text-[26px] leading-tight">{doc.name}</h2>}
        {doc.role && <p className="mt-1 font-resume text-[13px] text-sand">{doc.role}</p>}
        {doc.contact.length > 0 && (
          <ul className="mt-5 space-y-1">
            {doc.contact.map((item) => (
              <li key={item} className="break-words font-resume text-[12px] leading-5 text-sand">
                {item}
              </li>
            ))}
          </ul>
        )}
        {doc.skills.length > 0 && (
          <section>
            <Heading look="light">Skills</Heading>
            <ul className="mt-2 space-y-1">
              {doc.skills.map((skill) => (
                <li key={skill} className="font-resume text-[12.5px] text-card">
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>
      <div className="flex-1 px-6 py-8">
        <MainSections doc={doc} look="classic" hideSkills />
      </div>
    </div>
  )
}

function Executive({ doc, photo }) {
  return (
    <div className="px-7 py-8 sm:px-10">
      <header className="border-y-2 border-double border-ink py-5 text-center">
        <Photo src={photo} className="mx-auto mb-3 h-24 w-24 rounded-full" />
        {doc.name && <h2 className="font-display text-[36px] leading-none">{doc.name}</h2>}
        {doc.role && <p className="mt-2 font-resume text-[14px] tracking-[0.14em] uppercase">{doc.role}</p>}
        {doc.contact.length > 0 && <p className="mt-2 font-resume text-[12.5px] leading-5">{doc.contact.join('  ·  ')}</p>}
      </header>
      <MainSections doc={doc} look="classic" />
    </div>
  )
}

function Compact({ doc, photo }) {
  return (
    <div className="relative px-6 py-6">
      <Photo src={photo} className="float-right ml-3 h-16 w-16 rounded-md" />
      {doc.name && <h2 className="font-resume text-[22px] font-bold leading-none">{doc.name.toUpperCase()}</h2>}
      {doc.role && <p className="mt-1 font-resume text-[13px]">{doc.role}</p>}
      {doc.contact.length > 0 && <p className="mt-1 font-resume text-[12px] leading-5">{doc.contact.join(' | ')}</p>}
      <div className="clear-both">
        <MainSections doc={doc} look="compact" skillsAsPills />
      </div>
    </div>
  )
}

function Band({ doc, photo }) {
  return (
    <div>
      <header className="relative bg-moss-deep px-7 pb-10 pt-7 text-card sm:px-10">
        {doc.name && <h2 className="max-w-[80%] font-display text-[34px] leading-none">{doc.name}</h2>}
        {doc.role && <p className="mt-2 font-resume text-[14px] text-sand">{doc.role}</p>}
        {doc.contact.length > 0 && <p className="mt-2 max-w-[75%] font-resume text-[12.5px] leading-5 text-sand">{doc.contact.join(' · ')}</p>}
        <Photo src={photo} className="absolute bottom-[-28px] right-7 h-[76px] w-[76px] rounded-full ring-4 ring-white" />
      </header>
      <div className="px-7 pb-8 pt-12 sm:px-10">
        <MainSections doc={doc} look="modern" />
      </div>
    </div>
  )
}

function Minimal({ doc, photo }) {
  return (
    <div className="px-8 py-10 sm:px-12">
      <div className="flex items-end justify-between gap-6">
        <div>
          {doc.name && <h2 className="font-display text-[32px] font-normal leading-none">{doc.name}</h2>}
          {doc.role && <p className="mt-2 font-resume text-[14px] text-muted">{doc.role}</p>}
        </div>
        <Photo src={photo} className="h-[68px] w-[68px] shrink-0" />
      </div>
      {doc.contact.length > 0 && <p className="mt-4 font-resume text-[12.5px] tracking-wide text-muted">{doc.contact.join('   /   ')}</p>}
      <MainSections doc={doc} look="minimal" />
    </div>
  )
}

const LAYOUTS = {
  classic: Classic,
  modern: Modern,
  sidebar: Sidebar,
  executive: Executive,
  compact: Compact,
  band: Band,
  minimal: Minimal,
}

export default function ResumePreview({ resume }) {
  const doc = resumeDocument(resume)
  const photo = typeof resume.photo === 'string' && resume.photo.startsWith('data:image') ? resume.photo : ''
  const isEmpty =
    !photo &&
    !doc.name &&
    !doc.role &&
    !doc.contact.length &&
    !doc.summary &&
    !doc.skills.length &&
    !doc.experience.length &&
    !doc.education.length &&
    !doc.projects.length &&
    !doc.certifications.length

  if (isEmpty) {
    return (
      <div id="resume-sheet" className="print-resume rounded-3xl border border-dashed border-line bg-white px-8 py-16 text-center text-muted">
        <p className="font-display text-3xl text-ink">The resume will land here.</p>
        <p className="mx-auto mt-3 max-w-sm text-sm">Add your details or a photo, then pick one of the seven templates.</p>
      </div>
    )
  }

  const Layout = LAYOUTS[templateId(resume.template)]

  return (
    <article id="resume-sheet" className="print-resume overflow-hidden rounded-3xl border border-line bg-white text-ink shadow-[0_18px_50px_rgba(40,30,10,0.06)]">
      <Layout doc={doc} photo={photo} />
    </article>
  )
}
