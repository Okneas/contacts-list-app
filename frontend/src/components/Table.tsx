import type { Contact } from "@/types";
import type { ComponentProps } from "react";
import dayjs from "dayjs";
import Status from "./Status";

interface Props {
  data?: Contact[];
  isLoading: boolean;
}

const Table = ({
  data,
  isLoading,
  ...props
}: ComponentProps<"table"> & Props) => {
  return (
    <table {...props} className="table">
      <thead>
        <tr>
          <th>
            <button className="table__sort">ФИО</button>
          </th>
          <th>
            <button className="table__sort">Компания</button>
          </th>
          <th>
            <button className="table__sort">Статус</button>
          </th>
          <th>
            <button className="table__sort">Дата создания</button>
          </th>
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
              <tr key={"contact-" + contact.id}>
                <td style={{ fontWeight: "600" }}>{contact.fullName}</td>
                <td
                  style={{ color: "var(--color-primary)", fontWeight: "600" }}
                >
                  {contact.company}
                </td>
                <td>
                  <Status status={contact.status} />
                </td>
                <td style={{ fontWeight: "600" }}>{dayjs(contact.createdAt).format("DD.MM.YYYY HH:mm")}</td>
              </tr>
            );
          })}
        </tbody>
      )}
    </table>
  );
};

export default Table;
