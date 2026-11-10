import dayjs from 'dayjs'
import { Pencil, Trash2 } from 'lucide-react'
import type { Contact } from '@/types'
import styles from './Card.module.scss'
import Status from '../Table/Status/Status'

interface Props {
  contact: Contact
  onEdit: () => void
  onDelete: () => void
  isDeleting?: boolean
}

const Card = ({ contact, onEdit, onDelete, isDeleting = false }: Props) => {
  return (
    <article className={`card ${styles.card}`}>
      <header className={`card__header ${styles.header}`}>
        <h1 className={styles.name}>{contact.fullName}</h1>
        <Status status={contact.status} />
      </header>

      <div className={`card__body ${styles.details}`}>
        <span className={styles.label}>Компания</span>
        <span className={styles.value}>{contact.company}</span>

        <span className={styles.label}>Email</span>
        <span className={styles.value}>
          {contact.email ? (
            <a href={`mailto:${contact.email}`} className={styles.email}>
              {contact.email}
            </a>
          ) : (
            <span className={styles.muted}>не указан</span>
          )}
        </span>

        <span className={styles.label}>Создан</span>
        <span className={styles.value}>
          {dayjs(contact.createdAt).format('DD.MM.YYYY HH:mm')}
        </span>

        <span className={styles.label}>Обновлён</span>
        <span className={styles.value}>
          {dayjs(contact.updatedAt).format('DD.MM.YYYY HH:mm')}
        </span>
      </div>

      <footer className={`card__footer ${styles.actions}`}>
        <button
          type="button"
          className="btn btn--danger-ghost"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <Trash2 size={16} />
          {isDeleting ? 'Удаление...' : 'Удалить'}
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={onEdit}
        >
          <Pencil size={16} />
          Редактировать
        </button>
      </footer>
    </article>
  )
}

export default Card