import { pool } from "../db";
import {
  Contact,
  ContactInput,
  ContactListQuery,
  ContactSortField,
  ContactStatus,
  PaginatedResult,
} from "../types";

const SORT_COLUMN: Record<ContactSortField, string> = {
  fullName: "full_name",
  company: "company",
  status: "status",
  createdAt: "created_at",
};

const SELECT_COLUMNS = `
  id,
  full_name,
  company,
  email,
  status,
  created_at,
  updated_at
`;

interface ContactRow {
  id: number | string;
  full_name: string;
  company: string;
  email: string | null;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
}

function toIso(value: string | Date): string {
  if (value instanceof Date) return value.toISOString();
  return new Date(value.replace(" ", "T") + "Z").toISOString();
}

function mapRow(row: ContactRow): Contact {
  return {
    id: Number(row.id),
    fullName: row.full_name,
    company: row.company,
    email: row.email,
    status: row.status,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

export async function findAll(
  query: ContactListQuery,
): Promise<PaginatedResult<Contact>> {
  const conditions: string[] = [];
  const params: Record<string, string | number> = {};

  if (query.status) {
    conditions.push("status = :status");
    params.status = query.status;
  }

  const trimmed = query.search.trim();
  if (trimmed.length > 0) {
    conditions.push(
      "(full_name LIKE :search OR company LIKE :search OR email LIKE :search)",
    );
    params.search = `%${escapeLike(trimmed)}%`;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const direction = query.sortDir === "asc" ? "ASC" : "DESC";

  const orderBy =
    query.sortBy === "status"
      ? `FIELD(status, 'lead', 'active', 'inactive') ${direction}, id ${direction}`
      : `${SORT_COLUMN[query.sortBy]} ${direction}, id ${direction}`;

  const countSql = `SELECT COUNT(*) AS total FROM contacts ${where}`;
  const listSql = `
    SELECT ${SELECT_COLUMNS}
    FROM contacts
    ${where}
    ORDER BY ${orderBy}
    LIMIT :limit OFFSET :offset
  `;

  const limit = query.pageSize;
  const offset = (query.page - 1) * query.pageSize;

  const [countRows, listRows] = await Promise.all([
    pool
      .query(countSql, params)
      .then(([rows]) => rows as { total: number | string }[]),
    pool
      .query(listSql, { ...params, limit, offset })
      .then(([rows]) => rows as ContactRow[]),
  ]);

  const total = Number(countRows[0]?.total ?? 0);
  return { items: listRows.map(mapRow), total };
}

export async function findById(id: number): Promise<Contact | null> {
  const [rows] = await pool.query(
    `SELECT ${SELECT_COLUMNS} FROM contacts WHERE id = :id LIMIT 1`,
    { id },
  );
  const list = rows as ContactRow[];
  return list.length === 0 ? null : mapRow(list[0]);
}

export async function create(input: ContactInput): Promise<Contact> {
  const [result] = await pool.query(
    `INSERT INTO contacts (full_name, company, email, status)
     VALUES (:fullName, :company, :email, :status)`,
    { ...input },
  );

  const insertId = (result as { insertId: number }).insertId;
  const created = await findById(insertId);
  if (!created) {
    throw new Error(`Row ${insertId} not found`);
  }
  return created;
}

export async function update(
  id: number,
  input: ContactInput,
): Promise<Contact | null> {
  await pool.query(
    `UPDATE contacts
        SET full_name = :fullName,
            company   = :company,
            email     = :email,
            status    = :status
      WHERE id = :id`,
    { ...input, id },
  );

  return findById(id);
}

export async function remove(id: number): Promise<boolean> {
  const [result] = await pool.query("DELETE FROM contacts WHERE id = :id", {
    id,
  });
  return (result as { affectedRows: number }).affectedRows > 0;
}
