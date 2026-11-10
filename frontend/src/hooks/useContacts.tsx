import { getAllContacts } from "@/api/contacts";
import type { ContactSortField, SortDirection } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useContacts = (
  search?: string,
  sortBy?: ContactSortField,
  sortDir?: SortDirection,
) =>
  useQuery({
    queryKey: ["contacts", search, sortBy, sortDir],
    queryFn: async () => {
        const fetchContacts = await getAllContacts(search, sortBy, sortDir);
        return fetchContacts.data;
    },
    staleTime: 5 * 60 * 1000
  });

export default useContacts;
