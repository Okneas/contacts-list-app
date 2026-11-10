import { useParams } from "react-router-dom";
import { useContact } from "@/hooks/useContact";
import ContactForm from "@/components/ContactForm/ContactForm";
import { EMPTY_FORM, type ContactFormValues } from "@/lib/contactSchema";
import styles from "./ContactFormPage.module.scss";

const ContactFormPage = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const numericId = id ? Number(id) : undefined;

  const { data: contact, isLoading, isError } = useContact(numericId ?? 0);

  if (!isEdit) {
    return <ContactForm mode="create" initialValues={EMPTY_FORM} />;
  }

  if (!numericId || !Number.isInteger(numericId) || numericId <= 0) {
    return (
      <div className={styles.state}>
        <p>Некорректный идентификатор контакта.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.state}>
        <div className="skeleton" style={{ height: 200, width: "100%" }} />
      </div>
    );
  }

  if (isError || !contact) {
    return (
      <div className={styles.state}>
        <p>Контакт не найден или не удалось загрузить.</p>
      </div>
    );
  }
  const initialValues: ContactFormValues = {
    fullName: contact.fullName,
    company: contact.company,
    email: contact.email ?? "",
    status: contact.status,
  };

  return (
    <ContactForm
      mode="edit"
      contactId={contact.id}
      initialValues={initialValues}
    />
  );
};

export default ContactFormPage;
