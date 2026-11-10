import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllContacts } from '@/api/contacts'
import type { ContactSortField, ContactStatus, SortDirection } from '@/types'

export function useContacts(
  page = 1,
  pageSize = 20,
  search = '',
  sortBy: ContactSortField = 'createdAt',
  sortDir: SortDirection = 'desc',
  status: ContactStatus | null = null,
) {
  return useQuery({
    queryKey: ['contacts', { page, pageSize, search, sortBy, sortDir, status }],
    queryFn: () =>
      getAllContacts(
        search || undefined,
        sortBy,
        sortDir,
        page,
        pageSize,
        status ?? undefined,
      ).then((r) => r.data),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  })
}