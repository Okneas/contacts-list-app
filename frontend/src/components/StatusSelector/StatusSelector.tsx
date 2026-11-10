import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, Check, ChevronDown } from 'lucide-react'
import type { ContactStatus, SortDirection } from '@/types'
import styles from './StatusSelector.module.scss'

const STATUS_OPTIONS: { value: ContactStatus | null; label: string }[] = [
  { value: null, label: 'Все' },
  { value: 'lead', label: 'Лид' },
  { value: 'active', label: 'Активный' },
  { value: 'inactive', label: 'Неактивный' },
]

interface Props {
  value: ContactStatus | null
  onChange: (value: ContactStatus | null) => void
  isSorted?: boolean
  sortDir?: SortDirection
  onToggleSort?: () => void
}

const StatusSelector = ({
  value,
  onChange,
  isSorted = false,
  sortDir = 'asc',
  onToggleSort,
}: Props) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = STATUS_OPTIONS.find((o) => o.value === value) ?? STATUS_OPTIONS[0]

  const showSort = !!onToggleSort

  const sortIcon = !isSorted ? (
    <ArrowUpDown size={14} />
  ) : sortDir === 'asc' ? (
    <ArrowUp size={14} />
  ) : (
    <ArrowDown size={14} />
  )

  return (
    <div className={styles.wrapper} ref={ref}>
      <div className={styles.trigger}>
        <button
          type="button"
          className={styles.triggerMain}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={styles.label}>{current.label}</span>
          <ChevronDown
            size={14}
            className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          />
        </button>

        {showSort && (
          <button
            type="button"
            className={`${styles.triggerSort} ${isSorted ? styles.triggerSortActive : ''}`}
            onClick={onToggleSort}
            aria-label={
              !isSorted
                ? 'Сортировать по возрастанию'
                : sortDir === 'asc'
                  ? 'Сортировать по убыванию'
                  : 'Сортировать по возрастанию'
            }
          >
            {sortIcon}
          </button>
        )}
      </div>

      {open && (
        <div className={styles.dropdown} role="listbox">
          {STATUS_OPTIONS.map((option) => {
            const selected = option.value === value
            return (
              <button
                key={option.value ?? 'all'}
                type="button"
                role="option"
                aria-selected={selected}
                className={`${styles.option} ${selected ? styles.optionActive : ''}`}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
              >
                <span className={styles.optionCheck}>
                  {selected && <Check size={14} />}
                </span>
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StatusSelector