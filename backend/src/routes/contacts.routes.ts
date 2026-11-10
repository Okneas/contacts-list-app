import { Router } from "express";
import { notFound } from "../error";
import { asyncHandler } from "../middleware/asyncHandler";
import * as repo from "../repository/contacts.repository";
import {
  createContactSchema,
  idParamSchema,
  listQuerySchema,
  updateContactSchema,
} from "../validation/contact";
import { validate, validated } from "../middleware/validate";

export const contactsRouter = Router();

// GET /api/contacts?search=&sortBy=&sortDir=
contactsRouter.get(
  "/",
  validate("query", listQuerySchema),
  asyncHandler(async (req, res) => {
    const query = validated(req, "query", listQuerySchema);
    const list = await repo.findAll(query);
    res.json({ data: list });
  }),
);

// GET /api/contacts/:id
contactsRouter.get(
  "/:id",
  validate("params", idParamSchema),
  asyncHandler(async (req, res) => {
    const { id } = validated(req, "params", idParamSchema);
    const contact = await repo.findById(id);
    if (!contact) throw notFound();
    res.json({ data: contact });
  }),
);

// POST /api/contacts
contactsRouter.post(
  "/",
  validate("body", createContactSchema),
  asyncHandler(async (req, res) => {
    const input = validated(req, "body", createContactSchema);
    const created = await repo.create(input);
    res.status(201).json({ data: created });
  }),
);

// PUT /api/contacts/:id
contactsRouter.put(
  "/:id",
  validate("params", idParamSchema),
  validate("body", updateContactSchema),
  asyncHandler(async (req, res) => {
    const { id } = validated(req, "params", idParamSchema);
    const input = validated(req, "body", updateContactSchema);
    const updated = await repo.update(id, input);
    if (!updated) throw notFound();
    res.json({ data: updated });
  }),
);

// DELETE /api/contacts/:id
contactsRouter.delete(
  "/:id",
  validate("params", idParamSchema),
  asyncHandler(async (req, res) => {
    const { id } = validated(req, "params", idParamSchema);
    const removed = await repo.remove(id);
    if (!removed) throw notFound();
    res.status(204).end();
  }),
);
