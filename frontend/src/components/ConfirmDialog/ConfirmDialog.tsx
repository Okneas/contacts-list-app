import { Loader2 } from "lucide-react";
import Dialog from "../Dialog/Dialog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
  isLoading?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  variant = "default",
  isLoading = false,
}: Props) => {
  const confirmClass = variant === "danger" ? "btn--danger" : "btn--primary";

  return (
    <Dialog
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      title={title}
      size="sm"
      closeOnBackdrop={!isLoading}
      closeOnEsc={!isLoading}
      showCloseButton={!isLoading}
      footer={
        <>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onClose}
            disabled={isLoading}
            autoFocus
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${confirmClass}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 size={16} className="icon-spin" />}
            {confirmText}
          </button>
        </>
      }
    >
      <p>{message}</p>
    </Dialog>
  );
};

export default ConfirmDialog;
