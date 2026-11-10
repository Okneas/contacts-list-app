import type { Contact, ContactSortField, SortDirection } from "@/types";
import type { ComponentProps } from "react";
import dayjs from "dayjs";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Status from "./Status/Status";

interface Props {
  data?: Contact[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  sortBy: ContactSortField;
  sortDir: SortDirection;
  onSort: (field: ContactSortField) => void;
}

const Table = ({
  data,
  isLoading,
  onDelete,
  sortBy,
  sortDir,
  onSort,
  ...props
}: ComponentProps<"table"> & Props) => {
  const nav = useNavigate();
  const ariaSort = (field: ContactSortField) =>
    sortBy === field
      ? sortDir === "asc"
        ? "ascending"
        : "descending"
      : "none";

  const sortButton = (field: ContactSortField, label: string) => (
    <button
      type="button"
      className="table__sort"
      aria-sort={ariaSort(field)}
      onClick={() => onSort(field)}
    >
      {label}
    </button>
  );
  return (
    <table {...props} className="table">
      <thead>
        <tr>
          <th>{sortButton("fullName", "ФИО")}</th>
          <th>{sortButton("company", "Компания")}</th>
          <th>{sortButton("status", "Статус")}</th>
          <th>{sortButton("createdAt", "Дата создания")}</th>
          <th style={{ width: "72px" }} />
        </tr>
      </thead>
      {isLoading || !data ? (
        <tbody>
          {[1, 2, 3, 4, 5].map((_, index) => {
            return (
              <tr key={`skeleton-tr-` + index} style={{ height: "60px" }}>
                <td>
                  <div
                    className="skeleton"
                    style={{ width: "100%", height: "20px" }}
                  ></div>
                </td>
                <td>
                  <div
                    className="skeleton"
                    style={{ width: "100%", height: "20px" }}
                  ></div>
                </td>
                <td>
                  <div
                    className="skeleton"
                    style={{ width: "100%", height: "20px" }}
                  ></div>
                </td>
                <td>
                  <div
                    className="skeleton"
                    style={{ width: "100%", height: "20px" }}
                  ></div>
                </td>
              </tr>
            );
          })}
        </tbody>
      ) : (
        <tbody>
          {data.map((contact) => {
            return (
              <tr
                key={"contact-" + contact.id}
                style={{ cursor: "pointer" }}
                onClick={() => nav(`/contact/${contact.id}`)}
              >
                <td style={{ fontWeight: "600" }}>{contact.fullName}</td>
                <td
                  style={{ color: "var(--color-primary)", fontWeight: "600" }}
                >
                  {contact.company}
                </td>
                <td>
                  <Status status={contact.status} />
                </td>
                <td style={{ fontWeight: "600" }}>
                  {dayjs(contact.createdAt).format("DD.MM.YYYY HH:mm")}
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    className="btn btn--icon btn--danger-ghost"
                    aria-label={`Удалить контакт ${contact.fullName}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(contact.id);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      )}
    </table>
  );
};

export default Table;
