import { Router } from 'express';
import { notFound } from '../error';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate, validated } from '../middleware/validate';
import * as repo from '../repository/contacts.repository';
import {
  createContactSchema,
  idParamSchema,
  listQuerySchema,
  updateContactSchema,
} from '../validation/contact';

export const contactsRouter = Router();

/**
 * @openapi
 * /api/contacts:
 *   get:
 *     tags: [Contacts]
 *     summary: Список контактов с поиском, сортировкой и пагинацией
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           maxLength: 255
 *           default: ''
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [fullName, company, status, createdAt]
 *           default: createdAt
 *       - in: query
 *         name: sortDir
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, lead]
 *           nullable: true
 *     responses:
 *       200:
 *         description: Страница списка контактов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *                 meta:
 *                   $ref: '#/components/schemas/PageMeta'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
contactsRouter.get(
  '/',
  validate('query', listQuerySchema),
  asyncHandler(async (req, res) => {
    const query = validated(req, 'query', listQuerySchema);
    const { items, total } = await repo.findAll(query);

    const totalPages = total === 0 ? 0 : Math.ceil(total / query.pageSize);

    res.json({
      data: items,
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages,
      },
    });
  }),
);

/**
 * @openapi
 * /api/contacts/{id}:
 *   get:
 *     tags: [Contacts]
 *     summary: Получить контакт по id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
contactsRouter.get(
  '/:id',
  validate('params', idParamSchema),
  asyncHandler(async (req, res) => {
    const { id } = validated(req, 'params', idParamSchema);
    const contact = await repo.findById(id);
    if (!contact) throw notFound();
    res.json({ data: contact });
  }),
);

/**
 * @openapi
 * /api/contacts:
 *   post:
 *     tags: [Contacts]
 *     summary: Создать контакт
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       201:
 *         description: Создано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
contactsRouter.post(
  '/',
  validate('body', createContactSchema),
  asyncHandler(async (req, res) => {
    const input = validated(req, 'body', createContactSchema);
    const created = await repo.create(input);
    res.status(201).json({ data: created });
  }),
);

/**
 * @openapi
 * /api/contacts/{id}:
 *   put:
 *     tags: [Contacts]
 *     summary: Полностью обновить контакт
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       200:
 *         description: Обновлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
contactsRouter.put(
  '/:id',
  validate('params', idParamSchema),
  validate('body', updateContactSchema),
  asyncHandler(async (req, res) => {
    const { id } = validated(req, 'params', idParamSchema);
    const input = validated(req, 'body', updateContactSchema);
    const updated = await repo.update(id, input);
    if (!updated) throw notFound();
    res.json({ data: updated });
  }),
);

/**
 * @openapi
 * /api/contacts/{id}:
 *   delete:
 *     tags: [Contacts]
 *     summary: Удалить контакт
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       204:
 *         description: Удалено, тело ответа пустое
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
contactsRouter.delete(
  '/:id',
  validate('params', idParamSchema),
  asyncHandler(async (req, res) => {
    const { id } = validated(req, 'params', idParamSchema);
    const removed = await repo.remove(id);
    if (!removed) throw notFound();
    res.status(204).end();
  }),
);