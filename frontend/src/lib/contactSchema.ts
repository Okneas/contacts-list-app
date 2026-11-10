import { z } from 'zod'
import { CONTACT_STATUSES } from '@/types'

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'ФИО обязательно')
    .max(255, 'Максимум 255 символов'),
  company: z
    .string()
    .trim()
    .min(1, 'Компания обязательна')
    .max(255, 'Максимум 255 символов'),
  email: z
    .string()
    .trim()
    .max(255, 'Максимум 255 символов')
    .refine(
      (v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      'Некорректный email',
    ),
  status: z.enum([...CONTACT_STATUSES]),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

export const EMPTY_FORM: ContactFormValues = {
  fullName: '',
  company: '',
  email: '',
  status: 'lead',
}