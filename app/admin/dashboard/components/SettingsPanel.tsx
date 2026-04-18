'use client'

import { useRef, useState, useTransition } from 'react'
import { updateSettings } from '@/app/admin/actions/updateSettings'

type Key = 'cities' | 'services' | 'budgets'

type Props = {
  cities: string[]
  services: string[]
  budgets: string[]
}

const SECTION_META: Record<Key, { label: string; placeholder: string }> = {
  cities:   { label: 'المدن',             placeholder: 'أضف مدينة جديدة'         },
  services: { label: 'الخدمات',           placeholder: 'أضف خدمة جديدة'          },
  budgets:  { label: 'نطاقات الميزانية', placeholder: 'أضف نطاق ميزانية جديد'   },
}

function TagList({
  items,
  onRemove,
}: {
  items: string[]
  onRemove: (i: number) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body"
          style={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-line)',
            fontSize: '0.82rem',
            color: 'var(--color-ink)',
          }}
        >
          {item}
          <button
            type="button"
            onClick={() => onRemove(i)}
            aria-label={`حذف ${item}`}
            className="flex items-center justify-center w-4 h-4 rounded-full transition-colors duration-150"
            style={{ color: 'var(--color-ink-faint)' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </span>
      ))}
    </div>
  )
}

function Section({
  sectionKey,
  label,
  placeholder,
  items,
  onChange,
  onSave,
  isSaving,
  savedKey,
}: {
  sectionKey: Key
  label: string
  placeholder: string
  items: string[]
  onChange: (items: string[]) => void
  onSave: (key: Key, items: string[]) => void
  isSaving: boolean
  savedKey: Key | null
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  function addItem() {
    const val = inputRef.current?.value.trim()
    if (!val || items.includes(val)) { inputRef.current?.focus(); return }
    onChange([...items, val])
    if (inputRef.current) inputRef.current.value = ''
    inputRef.current?.focus()
  }

  function removeItem(i: number) {
    onChange(items.filter((_, idx) => idx !== i))
  }

  const isSaved = savedKey === sectionKey && !isSaving

  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-xl"
      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-line)' }}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p
          className="font-body font-semibold"
          style={{ fontSize: '0.9rem', color: 'var(--color-ink)' }}
        >
          {label}
          <span
            className="me-2 font-normal"
            style={{ fontSize: '0.75rem', color: 'var(--color-ink-faint)' }}
          >
            ({items.length})
          </span>
        </p>

        <button
          type="button"
          onClick={() => onSave(sectionKey, items)}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-body font-medium transition-all duration-150 disabled:opacity-50"
          style={{
            background: isSaved ? 'var(--color-success-bg)' : 'var(--color-accent-muted)',
            color: isSaved ? 'var(--color-success)' : 'var(--color-accent)',
            fontSize: '0.82rem',
            border: 'none',
            cursor: isSaving ? 'not-allowed' : 'pointer',
          }}
        >
          {isSaving && savedKey !== sectionKey ? null :
            isSaving && savedKey === sectionKey ? (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            ) : isSaved ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : null
          }
          {isSaved ? 'تم الحفظ' : 'حفظ'}
        </button>
      </div>

      <TagList items={items} onRemove={removeItem} />

      <div className="flex gap-2 mt-1">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          dir="rtl"
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem() } }}
          className="input-field flex-1 px-3 py-2 rounded-lg font-body"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-line)',
            color: 'var(--color-ink)',
            fontSize: '0.88rem',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-2 rounded-lg font-body font-medium transition-colors duration-150"
          style={{
            background: 'var(--color-accent)',
            color: 'var(--color-bg)',
            fontSize: '0.82rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          إضافة
        </button>
      </div>
    </div>
  )
}

export default function SettingsPanel({ cities: ic, services: is, budgets: ib }: Props) {
  const [open, setOpen] = useState(false)
  const [cities,   setCities]   = useState(ic)
  const [services, setServices] = useState(is)
  const [budgets,  setBudgets]  = useState(ib)
  const [isPending, startTransition] = useTransition()
  const [savedKey, setSavedKey] = useState<Key | null>(null)

  function saveKey(key: Key, values: string[]) {
    startTransition(async () => {
      setSavedKey(key)
      await updateSettings(key, values)
      setTimeout(() => setSavedKey(null), 2200)
    })
  }

  const sectionProps = { isSaving: isPending, savedKey, onSave: saveKey }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)' }}
    >
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-6 py-5 flex items-center justify-between gap-3 transition-colors duration-150"
        style={{ background: 'transparent', cursor: 'pointer' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: open ? 'var(--color-accent-muted)' : 'oklch(20% 0.04 255)',
              color: open ? 'var(--color-accent)' : 'var(--color-ink-dim)',
            }}
            aria-hidden="true"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
            </svg>
          </div>
          <div className="text-start">
            <p className="font-display font-semibold" style={{ fontSize: '1rem', color: 'var(--color-ink)' }}>
              إعدادات النموذج
            </p>
            <p className="font-body" style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)', marginTop: '2px' }}>
              تحكم في المدن والخدمات ونطاقات الميزانية التي تظهر في النماذج
            </p>
          </div>
        </div>

        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
          style={{
            color: 'var(--color-ink-faint)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="px-6 pb-6 flex flex-col gap-4"
          style={{ borderTop: '1px solid var(--color-line)' }}
        >
          <p className="font-body pt-4" style={{ fontSize: '0.8rem', color: 'var(--color-ink-faint)' }}>
            التغييرات تنعكس فوراً على النماذج بعد الحفظ.
          </p>

          <Section
            sectionKey="cities"
            label={SECTION_META.cities.label}
            placeholder={SECTION_META.cities.placeholder}
            items={cities}
            onChange={setCities}
            {...sectionProps}
          />
          <Section
            sectionKey="services"
            label={SECTION_META.services.label}
            placeholder={SECTION_META.services.placeholder}
            items={services}
            onChange={setServices}
            {...sectionProps}
          />
          <Section
            sectionKey="budgets"
            label={SECTION_META.budgets.label}
            placeholder={SECTION_META.budgets.placeholder}
            items={budgets}
            onChange={setBudgets}
            {...sectionProps}
          />
        </div>
      )}
    </div>
  )
}
