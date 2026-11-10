import { useQuery } from '@tanstack/react-query'
import { getContact } from '@/api/contacts'

export function useContact(id: number) {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => getContact(id).then((r) => r.data.data),
    enabled: Number.isInteger(id) && id > 0,
    staleTime: 60_000,
  })
}