import { z } from 'zod';
import { CONTACT_SORT_FIELDS, CONTACT_STATUSES } from '../types';

const trimmedText = (label: string, max: number) =>
  z
    .string({ error: `${label} обязательно` })
    .trim()
    .min(1, `${label} не может быть пустым`)
    .max(max, `${label}: максимум ${max} символов`);


const emailField = z.preprocess(
  (value) => {
    if (value === undefined || value === null) return null;
    if (typeof value === 'string' && value.trim() === '') return null;
    return value;
  },
  z
    .email('Некорректный email')
    .max(255, 'email: максимум 255 символов')
    .nullable(),
);


export const createContactSchema = z.object({
  fullName: trimmedText('ФИО', 255),
  company: trimmedText('Компания', 255),
  email: emailField,
  status: z.enum(CONTACT_STATUSES),
});

export const updateContactSchema = createContactSchema;

export const listQuerySchema = z
  .object({
    search: z.string().trim().max(255).optional().default(''),
    sortBy: z.enum(CONTACT_SORT_FIELDS).optional().default('createdAt'),
    sortDir: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
  })
  .transform((v) => ({
    search: v.search,
    sortBy: v.sortBy,
    sortDir: v.sortDir,
    page: v.page,
    pageSize: v.pageSize,
  }));


export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'id должен быть целым положительным числом')
    .transform((s) => Number(s))
    .refine(
      (n) => Number.isSafeInteger(n) && n > 0,
      'id должен быть положительным целым числом',
    ),
});