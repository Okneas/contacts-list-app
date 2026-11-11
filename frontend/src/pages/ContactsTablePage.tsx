import { useEffect, useRef, useState } from "react";
import { Search, Plus } from "lucide-react";
import { useDeleteContact } from "@/hooks/useDeleteContact";
import { useDebounce } from "@/hooks/useDebounce";
import Table from "@/components/Table/Table";
import Pagination from "@/components/Pagination/Pagination";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import type {
  Contact,
  ContactSortField,
  ContactStatus,
  SortDirection,
} from "@/types";
import styles from "./ContactsTablePage.module.scss";
import { useContacts } from "@/hooks/useContacts";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

const ContactsTablePage = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<ContactSortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = useState<ContactStatus | null>(null);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const { data: contacts, isLoading } = useContacts(
    page,
    PAGE_SIZE,
    debouncedSearch,
    sortBy,
    sortDir,
    statusFilter,
  );
  const remove = useDeleteContact();
  const navigate = useNavigate();

  const [pendingDelete, setPendingDelete] = useState<Contact | null>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    tableScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, debouncedSearch, sortBy, sortDir, statusFilter]);

  const totalPages = contacts?.meta.totalPages ?? 1;

  const handleSort = (field: ContactSortField) => {
    setPage(1);
    if (field === sortBy) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = (id: number) => {
    const contact = contacts?.data.find((c) => c.id === id) ?? null;
    setPendingDelete(contact);
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    const shouldGoBack = contacts?.data.length === 1 && page > 1;

    remove.mutate(pendingDelete.id, {
      onSuccess: () => {
        setPendingDelete(null);
        if (shouldGoBack) setPage(page - 1);
      },
    });
  };

  const handleStatusFilterChange = (value: ContactStatus | null) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="page">
      <div className={`paper container ${styles.paper}`}>
        <div className={styles.paper_table_header}>
          <h2>Мои контакты</h2>
          <div className={styles.header_actions}>
            <div className={styles.search_wrapper}>
              <Search size={24} />
              <div className={`field ${styles.search_input_container}`}>
                <input
                  className="input"
                  placeholder="Поиск..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => navigate("/contact/new")}
            >
              <Plus size={16} />
              Создать
            </button>
          </div>
        </div>

        <div className="divider" />

        <div
          className={`${styles.table_scroll} scrollbar`}
          ref={tableScrollRef}
        >
          <Table
            isLoading={isLoading}
            data={contacts?.data}
            onDelete={handleDelete}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={handleSort}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
          />
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>

      <ConfirmDialog
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={remove.isPending}
        title="Удалить контакт?"
        message={
          pendingDelete
            ? `Контакт будет удалён без возможности восстановления.`
            : ""
        }
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
      />
    </div>
  );
};

export default ContactsTablePage;
