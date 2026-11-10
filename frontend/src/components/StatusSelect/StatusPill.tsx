import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { ContactStatus } from "@/types";
import Status from "../Table/Status/Status";
import styles from "./StatusPill.module.scss";

const STATUS_OPTIONS: ContactStatus[] = ["lead", "active", "inactive"];

interface Props {
  value: ContactStatus;
  onChange: (value: ContactStatus) => void;
  onBlur?: () => void;
  disabled?: boolean;
  invalid?: boolean;
}

const StatusPill = ({ value, onChange, onBlur, disabled, invalid }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onBlur]);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        aria-label="Статус"
      >
        <Status status={value} />
        <ChevronDown
          size={16}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
      </button>

      {open && (
        <div className={styles.dropdown} role="listbox">
          {STATUS_OPTIONS.map((opt) => {
            const selected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={selected}
                className={`${styles.option} ${selected ? styles.optionActive : ""}`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                <span className={styles.check}>
                  {selected && <Check size={14} />}
                </span>
                <Status status={opt} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StatusPill;
