import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Pagination.module.scss";

type PageItem = number | "ellipsis";

interface Props {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function getPageWindow(
  current: number,
  total: number,
  siblings = 1,
): PageItem[] {
  const totalSlots = siblings * 2 + 5;

  if (total <= totalSlots) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftMin = Math.max(current - siblings, 1);
  const rightMax = Math.min(current + siblings, total);

  const showLeftDots = leftMin > 2;
  const showRightDots = rightMax < total - 1;

  if (!showLeftDots && showRightDots) {
    const count = 3 + 2 * siblings;
    const left = Array.from({ length: count }, (_, i) => i + 1);
    return [...left, "ellipsis", total];
  }

  if (showLeftDots && !showRightDots) {
    const count = 3 + 2 * siblings;
    const right = Array.from(
      { length: count },
      (_, i) => total - count + 1 + i,
    );
    return [1, "ellipsis", ...right];
  }

  const middle = Array.from(
    { length: rightMax - leftMin + 1 },
    (_, i) => leftMin + i,
  );
  return [1, "ellipsis", ...middle, "ellipsis", total];
}

const Pagination = ({ currentPage, totalPages, onChange }: Props) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollerRef.current;
    if (!container) return;
    const active = container.querySelector<HTMLElement>(
      `[data-page="${currentPage}"]`,
    );
    if (!active) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    const activeOffset =
      activeRect.left - containerRect.left + container.scrollLeft;

    const target =
      activeOffset - container.clientWidth / 2 + activeRect.width / 2;
    container.scrollTo({ left: target, behavior: "smooth" });
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  const items = getPageWindow(currentPage, totalPages, 1);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <nav className={styles.pagination} aria-label="Пагинация">
      <button
        type="button"
        className={`btn btn--icon btn--ghost ${styles.arrow}`}
        onClick={() => onChange(currentPage - 1)}
        disabled={!canPrev}
        aria-label="Предыдущая страница"
      >
        <ChevronLeft size={20} />
      </button>

      <div className={styles.scroller} ref={scrollerRef}>
        {items.map((item, i) =>
          item === "ellipsis" ? (
            <span key={`e-${i}`} className={styles.ellipsis} aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              data-page={item}
              className={`${styles.pageBtn} ${item === currentPage ? styles.active : ""}`}
              onClick={() => item !== currentPage && onChange(item)}
              aria-current={item === currentPage ? "page" : undefined}
              aria-label={`Страница ${item}`}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className={`btn btn--icon btn--ghost ${styles.arrow}`}
        onClick={() => onChange(currentPage + 1)}
        disabled={!canNext}
        aria-label="Следующая страница"
      >
        <ChevronRight size={20} />
      </button>
    </nav>
  );
};

export default Pagination;
