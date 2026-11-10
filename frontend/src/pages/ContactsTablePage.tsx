import { useState } from "react";
import { useDeleteContact } from "@/hooks/useDeleteContact";
import useContacts from "@/hooks/useContacts";
import Table from "@/components/Table/Table";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import type { Contact } from "@/types";
import { Search } from "lucide-react";
import styles from "./ContactsTablePage.module.scss";

const ContactsTablePage = () => {
  const { data: contacts, isLoading } = useContacts();
  const remove = useDeleteContact();

  const [pendingDelete, setPendingDelete] = useState<Contact | null>(null);

  const handleDelete = (id: number) => {
    const contact = contacts?.data.find((c) => c.id === id) ?? null;
    setPendingDelete(contact);
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    remove.mutate(pendingDelete.id, {
      onSuccess: () => setPendingDelete(null),
    });
  };

  return (
    <div className="page">
      <div
        className="paper container"
        style={{ width: "70vw", height: "70vh" }}
      >
        <div className={styles.paper_table_header}>
          <h2>Мои контакты</h2>
          <div className={styles.search_wrapper}>
            <Search size={24} />
            <div className={`field ${styles.search_input_container}`}>
              <input className="input" placeholder="Поиск..." />
            </div>
          </div>
        </div>
        <div className="divider" />
        <Table
          isLoading={isLoading}
          data={contacts?.data}
          onDelete={handleDelete}
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
