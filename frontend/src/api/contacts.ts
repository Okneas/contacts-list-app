import type {
  Contact,
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

export const deleteContact = (id: number) => instance.delete(`/contacts/${id}`);

export const getContact = (id: number) => instance.get<{ data: Contact }>(`/contacts/${id}`)
