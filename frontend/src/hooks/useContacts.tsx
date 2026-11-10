import { getAllContacts } from "@/api/contacts";
import type { ContactSortField, SortDirection } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const useContacts = (
  page = 1,
  pageSize = 20,
  search = "",
  sortBy: ContactSortField = "createdAt",
  sortDir: SortDirection = "desc",
) =>
  useQuery({
    queryKey: ["contacts", search, sortBy, sortDir, page, pageSize],
    queryFn: async () => {
      const fetchContacts = await getAllContacts(
        search,
        sortBy,
        sortDir,
        page,
        pageSize,
      );
      return fetchContacts.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

export default useContacts;
