import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteContact } from '@/api/contacts'

export function useDeleteContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteContact(id).then(() => undefined),
    onSuccess: (_data, deletedId) => {
      queryClient.removeQueries({ queryKey: ['contact', deletedId] })
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
    onError: (err) => {
      console.error('[deleteContact]', err)
    },
  })
}