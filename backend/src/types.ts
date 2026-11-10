export const CONTACT_STATUSES = ['active', 'inactive', 'lead'] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export interface Contact {
  id: number;
  fullName: string;
  company: string;
  email: string | null;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}


export interface ContactInput {
  fullName: string;
  company: string;
  email: string | null;
  status: ContactStatus;
}

export const CONTACT_SORT_FIELDS = ['fullName', 'company', 'status', 'createdAt'] as const;
export type ContactSortField = (typeof CONTACT_SORT_FIELDS)[number];

export type SortDirection = 'asc' | 'desc';

export interface ContactListQuery {
  search: string;
  sortBy: ContactSortField;
  sortDir: SortDirection;
}