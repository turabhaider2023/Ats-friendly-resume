import { TEMPLATES, templateId } from '../lib/templates.js'

const SWATCH = {
  classic: 'bg-[linear-gradient(#1a1d2e,#1a1d2e)] bg-[length:70%_2px] bg-[position:12px_14px] bg-no-repeat',
  modern: 'border-l-4 border-l-moss',
  sidebar: 'bg-[linear-gradient(90deg,#1d2d86_32%,#ffffff_32%)]',
  executive: 'bg-[radial-gradient(circle_at_50%_28%,#1a1d2e_0_6px,transparent_7px)]',
  compact: 'bg-[linear-gradient(#1a1d2e,#1a1d2e)] bg-[length:46%_2px] bg-[position:8px_12px] bg-no-repeat',
  band: 'bg-[linear-gradient(#3157f5,#6d4dff)] bg-[length:100%_16px] bg-no-repeat',
  minimal: 'bg-[linear-gradient(#d8deef,#d8deef)] bg-[length:70%_1px] bg-[position:10px_18px] bg-no-repeat',
}

export default function TemplatePicker({ value, onChange }) {
  const selected = templateId(value)

  return (
    <section className="rounded-3xl border border-line bg-card p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl">Template</h2>
        <p className="text-xs text-muted">7 standard layouts</p>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {TEMPLATES.map((item) => {
          const active = selected === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              aria-pressed={active}
              className={`w-[8.4rem] shrink-0 rounded-2xl border p-2 text-left ${
                active ? 'border-moss bg-white ring-2 ring-moss/30' : 'border-line bg-white hover:border-ink'
              }`}
            >
              <span className={`block h-12 rounded-lg bg-sand ${SWATCH[item.id]}`} />
              <span className="mt-2 block text-sm font-semibold">{item.name}</span>
              <span className="block text-[11px] leading-4 text-muted">{item.blurb}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">
        Print PDF uses the layout you pick. Most ATS software skips photos and side columns. Classic stays in one plain column.
      </p>
    </section>
  )
}
