import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateContact } from '@/api/contacts'
import type { ContactInput } from '@/types'

interface Vars {
  id: number
  input: ContactInput
}

export function useUpdateContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: Vars) =>
      updateContact(id, input).then((r) => r.data.data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['contact', updated.id], updated)
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}