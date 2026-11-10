import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Loader2, X } from "lucide-react";
import {
  contactFormSchema,
  EMPTY_FORM,
  type ContactFormValues,
} from "@/lib/contactSchema";
import { useCreateContact } from "@/hooks/useCreateContact";
import { useUpdateContact } from "@/hooks/useUpdateContact";
import StatusPill from "../StatusSelect/StatusPill";
import type { ContactInput } from "@/types";
import styles from "./ContactForm.module.scss";

interface Props {
  mode: "create" | "edit";
  contactId?: number;
  initialValues?: ContactFormValues;
}

const DRAFT_DEBOUNCE_MS = 300;

function getDraftKey(mode: "create" | "edit", id?: number): string {
  return mode === "create"
    ? "contact-form-draft-new"
    : `contact-form-draft-${id}`;
}

function readDraft(
  key: string,
  initial: ContactFormValues,
): { values: ContactFormValues; restored: boolean } {
  const raw = localStorage.getItem(key);
  if (!raw) return { values: initial, restored: false };
  try {
    const parsed = JSON.parse(raw) as Partial<ContactFormValues>;
    const merged: ContactFormValues = { ...initial, ...parsed };
    const sameAsInitial =
      merged.fullName === initial.fullName &&
      merged.company === initial.company &&
      merged.email === initial.email &&
      merged.status === initial.status;
    if (sameAsInitial) {
      localStorage.removeItem(key);
      return { values: initial, restored: false };
    }
    return { values: merged, restored: true };
  } catch {
    localStorage.removeItem(key);
    return { values: initial, restored: false };
  }
}

const ContactForm = ({
  mode,
  contactId,
  initialValues = EMPTY_FORM,
}: Props) => {
  const navigate = useNavigate();
  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();

  const draftKey = useMemo(
    () => getDraftKey(mode, contactId),
    [mode, contactId],
  );

  const initial = useMemo(
    () => readDraft(draftKey, initialValues),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [showBanner, setShowBanner] = useState(initial.restored);

  const form = useForm<ContactFormValues>({
    defaultValues: initial.values,
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const sub = form.watch((values) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          localStorage.setItem(draftKey, JSON.stringify(values));
        } catch (e) {
          console.warn("[contact-form] failed to save draft:", e);
        }
      }, DRAFT_DEBOUNCE_MS);
    });
    return () => {
      if (timer) clearTimeout(timer);
      sub.unsubscribe();
    };
  }, [form, draftKey]);

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const serverError =
    createMutation.error?.message ?? updateMutation.error?.message ?? null;

  const onSubmit = (values: ContactFormValues) => {
    const input: ContactInput = {
      fullName: values.fullName.trim(),
      company: values.company.trim(),
      email: values.email.trim() || null,
      status: values.status,
    };

    if (mode === "edit" && contactId) {
      updateMutation.mutate(
        { id: contactId, input },
        {
          onSuccess: () => {
            localStorage.removeItem(draftKey);
            navigate(`/contact/${contactId}`);
          },
        },
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: (created) => {
          localStorage.removeItem(draftKey);
          navigate(`/contact/${created.id}`);
        },
      });
    }
  };

  const handleCancel = () => {
    navigate(mode === "edit" && contactId ? `/contact/${contactId}` : "/");
  };

  const handleClearDraft = () => {
    localStorage.removeItem(draftKey);
    setShowBanner(false);
    form.reset(initialValues);
  };

  const title = mode === "edit" ? "Редактирование контакта" : "Новый контакт";

  return (
    <div className={styles.page}>
      <div className={`container ${styles.layout}`}>
        {showBanner && (
          <div className="banner">
            <span className="banner__body">
              Восстановлены несохранённые данные
            </span>
            <div className="banner__actions">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={handleClearDraft}
              >
                Очистить
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--icon btn--sm"
                onClick={() => setShowBanner(false)}
                aria-label="Скрыть уведомление"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
        <form
          className={`card ${styles.form}`}
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <header className={`card__header ${styles.header}`}>
            <h1 className="h2">{title}</h1>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <StatusPill
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={isSaving}
                />
              )}
            />
          </header>

          <div className="card__body">
            <div className={styles.fields}>
              <div className="field">
                <label
                  htmlFor="fullName"
                  className="field__label"
                  data-required="true"
                >
                  ФИО
                </label>
                <input
                  id="fullName"
                  className="input"
                  aria-invalid={!!form.formState.errors.fullName}
                  {...form.register("fullName")}
                />
                {form.formState.errors.fullName && (
                  <span className="field__error">
                    {form.formState.errors.fullName.message}
                  </span>
                )}
              </div>

              <div className="field">
                <label
                  htmlFor="company"
                  className="field__label"
                  data-required="true"
                >
                  Компания
                </label>
                <input
                  id="company"
                  className="input"
                  aria-invalid={!!form.formState.errors.company}
                  {...form.register("company")}
                />
                {form.formState.errors.company && (
                  <span className="field__error">
                    {form.formState.errors.company.message}
                  </span>
                )}
              </div>

              <div className="field">
                <label htmlFor="email" className="field__label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="необязательно"
                  aria-invalid={!!form.formState.errors.email}
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <span className="field__error">
                    {form.formState.errors.email.message}
                  </span>
                )}
              </div>
            </div>

            {serverError && (
              <div className={styles.serverError} role="alert">
                {serverError}
              </div>
            )}
          </div>

          <div className="card__footer">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSaving}
            >
              {isSaving && <Loader2 size={16} className="icon-spin" />}
              {mode === "edit" ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
