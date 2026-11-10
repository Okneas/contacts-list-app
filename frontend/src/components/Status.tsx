import type { ContactStatus } from "@/types";
import styles from "./Status.module.scss";

const STATUS_LABEL: Record<ContactStatus, string> = {
  active: "Активный",
  inactive: "Неактивный",
  lead: "Лид",
};

interface Props {
  status: ContactStatus;
}

const Status = ({ status }: Props) => (
  <span className={`${styles.status} ${styles[status]}`}>
    <span className={styles.dot} aria-hidden="true" />
    <span>{STATUS_LABEL[status]}</span>
  </span>
);

export default Status;