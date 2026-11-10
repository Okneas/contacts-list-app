import type {
  Contact,
  ContactInput,
  ContactSortField,
  ContactsResponse,
  ContactStatus,
  SortDirection,
} from '@/types'
import { instance } from './instance'

export const getAllContacts = (
  search?: string,
  sortBy?: ContactSortField,
  sortDir?: SortDirection,
  page = 1,
  pageSize = 20,
  status?: ContactStatus,
) =>
  instance.get<ContactsResponse>('/contacts', {
    params: { search, sortBy, sortDir, page, pageSize, status },
  })

export const getContact = (id: number) =>
  instance.get<{ data: Contact }>(`/contacts/${id}`)

export const createContact = (input: ContactInput) =>
  instance.post<{ data: Contact }>('/contacts', input)

export const updateContact = (id: number, input: ContactInput) =>
  instance.put<{ data: Contact }>(`/contacts/${id}`, input)

export const deleteContact = (id: number) =>
  instance.delete(`/contacts/${id}`)