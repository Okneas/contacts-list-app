import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useContact } from "@/hooks/useContact";
import { useDeleteContact } from "@/hooks/useDeleteContact";
import styles from "./ContactCardPage.module.scss";
import Card from "@/components/Card/Card";
import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";

const ContactCardPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = Number(id);
  const isValidId = Number.isInteger(numericId) && numericId > 0;

  const { data: contact, isLoading, isError } = useContact(numericId);
  const remove = useDeleteContact();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = () => {
    if (!contact) return;
    navigate(`/contacts/${contact.data.id}/edit`);
  };

  const handleConfirmDelete = () => {
    if (!contact) return;
    remove.mutate(contact.data.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        navigate("/", { replace: true });
      },
    });
  };

  if (!isValidId) {
    return (
      <div className="page">
        <div className="container">
          <div className="card">
            <div className="card__body">
              <p>Некорректный идентификатор контакта.</p>
            </div>
            <div className="card__footer">
              <button
                className="btn btn--primary"
                onClick={() => navigate("/")}
              >
                К списку
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page">
        <div className="container">
          <div className={`card ${styles.layout}`}>
            <div className="card__body">
              <div
                className="skeleton"
                style={{ height: 28, width: "55%", marginBottom: 16 }}
              />
              <div
                className="skeleton"
                style={{ height: 18, width: "100%", marginBottom: 8 }}
              />
              <div
                className="skeleton"
                style={{ height: 18, width: "80%", marginBottom: 8 }}
              />
              <div className="skeleton" style={{ height: 18, width: "65%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !contact) {
    return (
      <div className="page">
        <div className="container">
          <div className={`card ${styles.layout}`}>
            <div className="card__body">
              <p>Контакт не найден или не удалось загрузить.</p>
            </div>
            <div className="card__footer">
              <button
                className="btn btn--primary"
                onClick={() => navigate("/")}
              >
                К списку
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className={`stack ${styles.layout}`}>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => navigate("/")}
            style={{ alignSelf: "flex-start" }}
          >
            <ArrowLeft size={16} /> К списку
          </button>

          <Card
            contact={contact.data}
            onEdit={handleEdit}
            onDelete={() => setIsDeleteOpen(true)}
            isDeleting={remove.isPending}
          />

          <ConfirmDialog
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleConfirmDelete}
            isLoading={remove.isPending}
            title="Удалить контакт?"
            message={`Контакт будет удалён без возможности восстановления.`}
            confirmText="Удалить"
            cancelText="Отмена"
            variant="danger"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactCardPage;
