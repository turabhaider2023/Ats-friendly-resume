export function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
      <rect width="36" height="36" rx="10" fill="#1d2d86" />
      <rect x="9.5" y="6.5" width="14" height="18" rx="1.8" fill="#ffffff" />
      <path d="M12.5 11.5h8M12.5 15h8M12.5 18.5h5" stroke="#3157f5" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="24.5" cy="24.5" r="7" fill="#f07820" />
      <path d="M21.4 24.6 23.6 26.8 27.8 22.2" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Logo({ onClick, compact = false, light = false }) {
  const content = (
    <>
      <LogoMark />
      <span className="text-left">
        <span className={`block font-display text-[1.15rem] leading-none tracking-tight ${light ? 'text-card' : 'text-ink'}`}>
          ATS Friendly
        </span>
        {!compact && (
          <span className={`mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] ${light ? 'text-sand/80' : 'text-muted'}`}>
            Resume studio
          </span>
        )}
      </span>
    </>
  )

  if (!onClick) {
    return <span className="flex items-center gap-2.5">{content}</span>
  }

  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2.5 rounded-xl text-left">
      {content}
    </button>
  )
}
