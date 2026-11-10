import { describe, expect, it } from 'vitest'
import { contactFormSchema } from './contactSchema'

const valid = {
  fullName: 'Иван Петров',
  company: 'ACME',
  email: 'ivan@acme.io',
  status: 'active' as const,
}

describe('contactFormSchema', () => {
  it('пропускает валидные данные', () => {
    const result = contactFormSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('требует непустое ФИО', () => {
    const result = contactFormSchema.safeParse({ ...valid, fullName: '   ' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['fullName'])
    }
  })

  it('позволяет пустой email (не указан)', () => {
    const result = contactFormSchema.safeParse({ ...valid, email: '' })
    expect(result.success).toBe(true)
  })

  it('отклоняет невалидный email', () => {
    const result = contactFormSchema.safeParse({ ...valid, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('принимает только известные статусы', () => {
    const result = contactFormSchema.safeParse({ ...valid, status: 'bogus' })
    expect(result.success).toBe(false)
  })
})