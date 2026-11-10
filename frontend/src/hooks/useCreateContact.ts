import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createContact } from '@/api/contacts'
import type { ContactInput } from '@/types'

export function useCreateContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ContactInput) =>
      createContact(input).then((r) => r.data.data),
    onSuccess: (created) => {
      queryClient.setQueryData(['contact', created.id], created)
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}