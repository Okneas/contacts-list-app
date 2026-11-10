import type {
  ContactSortField,
  ContactsResponse,
  SortDirection,
} from "@/types";
import { instance } from "./instance";

export const getAllContacts = (
  search?: string,
  sortBy?: ContactSortField,
  sortDir?: SortDirection,
) =>
  instance.get<ContactsResponse>("/contacts", {
    params: { search, sortBy, sortDir },
  });
