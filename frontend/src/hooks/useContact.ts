import { useQuery } from '@tanstack/react-query'
import { getContact } from '@/api/contacts'

export function useContact(id: number) {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: async () => {
        const contactData = await getContact(id)
        return contactData.data
    },
    enabled: Number.isInteger(id) && id > 0,
    staleTime: 60 * 1000,
  })
}